/**
 * Vizyoner Finans Mobil - Universal Live Sync & Offline Storage Engine
 * Masaüstü Sunucusu (server.py / data/*) ile Çift Yönlü Canlı Senkronizasyon
 * & GitHub Pages / PWA %100 Çevrimdışı Çalışma Desteği
 */

(function() {
  'use strict';

  console.log('[Vizyoner Mobile Sync Engine] Başlatılıyor...');

  const LOCAL_STORAGE_KEY_PREFIX = 'vf_user_';
  const ACTIVE_USER_KEY = 'vf_active_username';
  const BACKUP_HISTORY_KEY = 'vf_backups';
  const SERVER_URL_KEY = 'vf_server_url';
  const LAST_SYNC_KEY = 'vf_last_sync_time';

  // 1. Olası masaüstü sunucu adreslerini tespit et
  function getCandidateServerUrls() {
    const list = [];
    const custom = localStorage.getItem(SERVER_URL_KEY);
    if (custom) list.push(custom.replace(/\/+$/, ''));
    
    // Aynı origin (eğer localhost veya yerel IP üzerinden açıldıysa)
    if (window.location.port === '5173' || window.location.port === '5174') {
      list.push(window.location.origin);
    }
    list.push('http://127.0.0.1:5173');
    list.push('http://localhost:5173');
    return Array.from(new Set(list));
  }

  let activeServerUrl = null;
  let isLiveSynced = false;

  // 2. Masaüstü Sunucusunu Kontrol Et (Ping)
  async function detectLiveServer() {
    const candidates = getCandidateServerUrls();
    for (const base of candidates) {
      try {
        const resp = await originalFetch(`${base}/api/ping`, {
          method: 'GET',
          signal: AbortSignal.timeout(1200)
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.app === 'VizyonerFinans') {
            activeServerUrl = base;
            isLiveSynced = true;
            console.log(`[Vizyoner Mobile Sync] 🟢 Masaüstü Sunucusuna Canlı Bağlandı: ${activeServerUrl}`);
            updateSyncStatusBadge(true);
            return true;
          }
        }
      } catch (e) {
        // Devam et
      }
    }
    isLiveSynced = false;
    console.log('[Vizyoner Mobile Sync] ⚡ Masaüstü sunucusu çevrimdışı, Yerel Depolama (Offline Mode) aktif.');
    updateSyncStatusBadge(false);
    return false;
  }

  // 3. Üst Barda Senkron Durumu Rozeti
  function updateSyncStatusBadge(isLive) {
    const badge = document.getElementById('mobile-sync-badge');
    if (!badge) return;
    if (isLive) {
      badge.innerHTML = `<span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#10b981; margin-right:4px; box-shadow:0 0 6px #10b981;"></span>Canlı Masaüstü Senkron`;
      badge.style.color = '#10b981';
      badge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
    } else {
      badge.innerHTML = `<span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#06b6d4; margin-right:4px;"></span>Çevrimdışı (Yerel Depo)`;
      badge.style.color = '#06b6d4';
      badge.style.borderColor = 'rgba(6, 182, 212, 0.3)';
    }
  }

  // 4. Varsayılan Kullanıcı Verilerini Garanti Et
  function ensureDefaultDataLoaded() {
    try {
      const activeUser = localStorage.getItem(ACTIVE_USER_KEY) || 'admin';
      const existingData = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + activeUser);

      if (!existingData && typeof window.__SYNCED_DATA__ !== 'undefined' && window.__SYNCED_DATA__) {
        console.log('[Vizyoner Mobile] Masaüstü verileri (synced_data.js) yerel belleğe yüklendi.');
        localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + activeUser, JSON.stringify(window.__SYNCED_DATA__));
        localStorage.setItem(ACTIVE_USER_KEY, activeUser);
      }

      // Varsayılan Kullanıcı Kaydı (users.json'dan zenginleştirilmiş)
      const usersRegistry = JSON.parse(localStorage.getItem('vf_users_registry') || '{}');
      if (!usersRegistry['admin']) {
        usersRegistry['admin'] = {
          username: "admin",
          name: "Sezer Akyol",
          role: "admin",
          avatar: "SA",
          avatarColor: "#8b5cf6",
          currency: "TRY",
          targetIncome: 105000,
          subscription: {
            tier: "pro",
            planName: "Ömür Boyu Kurumsal Pro Lisansı",
            validUntil: "2099-12-31",
            licenseKey: "VF-PRO-LIFETIME-ADMIN",
            isLifetime: true
          }
        };
      }
      localStorage.setItem('vf_users_registry', JSON.stringify(usersRegistry));

      // Otomatik Giriş Oturumu (sessionStorage)
      if (!sessionStorage.getItem("vizyoner_auth_session")) {
        sessionStorage.setItem("vizyoner_auth_session", JSON.stringify(usersRegistry[activeUser] || usersRegistry['admin']));
      }
    } catch(e) {
      console.warn('[Vizyoner Mobile] Seed error:', e);
    }
  }

  ensureDefaultDataLoaded();

  // 5. Fallback Fiyat Veritabanı
  const FALLBACK_PRICES = {
    "THYAO": {"price": 302.25, "prevClose": 307.50, "change": -1.71},
    "DOAS": {"price": 163.80, "prevClose": 166.40, "change": -1.56},
    "MAVI": {"price": 36.88, "prevClose": 38.26, "change": -3.61},
    "ASTOR": {"price": 325.75, "prevClose": 349.25, "change": -6.73},
    "TUPRS": {"price": 400.25, "prevClose": 396.00, "change": 1.07},
    "TCELL": {"price": 95.05, "prevClose": 103.50, "change": -8.16},
    "TTRAK": {"price": 427.50, "prevClose": 430.50, "change": -0.70},
    "ANSGR": {"price": 27.20, "prevClose": 27.50, "change": -1.09},
    "EKGYO": {"price": 20.00, "prevClose": 20.62, "change": -3.01},
    "AAPL": {"price": 315.35, "prevClose": 319.70, "change": -1.36},
    "GOOGL": {"price": 338.31, "prevClose": 346.59, "change": -2.39},
    "USDTRY": {"price": 48.25, "prevClose": 48.23, "change": 0.05},
    "EURTRY": {"price": 56.08, "prevClose": 55.87, "change": 0.39},
    "GBPTRY": {"price": 65.38, "prevClose": 65.29, "change": 0.14},
    "GOLD_OUNCE": {"price": 4479.70, "prevClose": 4529.90, "change": -1.11},
    "BIST100": {"price": 14334.06, "prevClose": 14641.56, "change": -2.10},
    "BTC": {"price": 79025.00, "prevClose": 77695.00, "change": 1.71},
    "GRAM": {"price": 6949.50, "prevClose": 6949.50, "change": 0.35},
    "ALTINS1": {"price": 69.50, "prevClose": 69.20, "change": 0.43},
    "HKH": {"price": 9.0024, "prevClose": 8.9523, "change": 0.56},
    "MJG": {"price": 11.7432, "prevClose": 11.4756, "change": 2.33},
    "CPU": {"price": 3.9540, "prevClose": 3.9497, "change": 0.11},
    "KPC": {"price": 22.2167, "prevClose": 21.9895, "change": 1.03}
  };

  // 6. Native fetch'i Intercept ederek Çift Yönlü Senkron Çalıştırma
  const originalFetch = window.fetch;

  window.fetch = async function(resource, init = {}) {
    let url = typeof resource === 'string' ? resource : resource?.url || '';

    // Canlı Masaüstü Sunucusu Varsa Öncelikli Kullan
    if (url.startsWith('/api/')) {
      if (activeServerUrl) {
        try {
          const remoteUrl = activeServerUrl + url;
          const remoteRes = await originalFetch(remoteUrl, { ...init, signal: AbortSignal.timeout(3500) });
          if (remoteRes.ok) {
            // Eğer veri kaydetme ise, yerel kopyayı da güncelle
            if (url.includes('/api/user/save') && init.body) {
              try {
                const b = JSON.parse(init.body);
                if (b.username && b.data) {
                  localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + b.username, JSON.stringify(b.data));
                  localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
                }
              } catch(e){}
            }
            return remoteRes;
          }
        } catch (err) {
          console.warn('[Vizyoner Mobile Sync] Masaüstü isteği zaman aşımına uğradı, yerel depoya dönülüyor.');
        }
      }

      // Yerel sunucu yoksa doğrudan dahili offline motoru çalıştır:
      return handleOfflineApi(url, init);
    }

    return originalFetch(resource, init);
  };

  // 7. Dahili Yerel Depolama Motoru (Offline & GitHub Pages)
  function handleOfflineApi(url, init) {
    const method = (init.method || 'GET').toUpperCase();
    let body = {};
    if (init.body && typeof init.body === 'string') {
      try { body = JSON.parse(init.body); } catch(e){}
    }

    const jsonResponse = (data, status = 200) => {
      return new Response(JSON.stringify(data), {
        status: status,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    };

    const activeUser = localStorage.getItem(ACTIVE_USER_KEY) || 'admin';

    // 7.1 Ping
    if (url.includes('/api/ping')) {
      return jsonResponse({ status: "ok", app: "VizyonerFinansMobile", isLiveSynced: false, version: "2026.1" });
    }

    // 7.2 Prices
    if (url.includes('/api/prices')) {
      return jsonResponse({
        status: "success",
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        prices: FALLBACK_PRICES,
        source: "mobile_cache"
      });
    }

    // 7.3 Get User Data
    if (url.includes('/api/user/data')) {
      let uKey = activeUser;
      try {
        const uParam = new URL(url, window.location.origin).searchParams.get('username');
        if (uParam) uKey = uParam;
      } catch(e){}

      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + uKey);
      let data = null;
      if (raw) {
        try { data = JSON.parse(raw); } catch(e){}
      }
      if (!data && typeof window.__SYNCED_DATA__ !== 'undefined') {
        data = window.__SYNCED_DATA__;
      }
      const users = JSON.parse(localStorage.getItem('vf_users_registry') || '{}');
      return jsonResponse({
        status: "success",
        user: users[uKey] || data?.user || { username: uKey, name: "Kullanıcı", role: "admin" },
        data: data
      });
    }

    // 7.4 Save User Data
    if (url.includes('/api/user/save')) {
      const username = body.username || activeUser;
      const data = body.data;
      if (username && data) {
        localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + username, JSON.stringify(data));
        localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());

        // Arka planda masaüstü sunucusuna da ulaştır (varsa)
        if (activeServerUrl) {
          originalFetch(`${activeServerUrl}/api/user/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          }).catch(()=>{});
        }

        return jsonResponse({ status: "success", message: "Mobil veriler başarıyla kaydedildi." });
      }
      return jsonResponse({ status: "error", message: "Veri eksik" }, 400);
    }

    // 7.5 Login
    if (url.includes('/api/auth/login')) {
      const { username, password } = body;
      const users = JSON.parse(localStorage.getItem('vf_users_registry') || '{}');
      const u = users[username] || (username === 'admin' ? {
        username: 'admin',
        name: 'Sezer Akyol',
        role: 'admin',
        password: 'admin123',
        avatar: 'SA',
        avatarColor: '#8b5cf6'
      } : null);

      if (u) {
        localStorage.setItem(ACTIVE_USER_KEY, username);
        sessionStorage.setItem("vizyoner_auth_session", JSON.stringify(u));
        return jsonResponse({
          status: "success",
          user: u,
          data: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + username) || 'null') || window.__SYNCED_DATA__
        });
      }
      return jsonResponse({ status: "error", message: "Kullanıcı bulunamadı." }, 401);
    }

    // 7.6 Users List
    if (url.includes('/api/users')) {
      const users = JSON.parse(localStorage.getItem('vf_users_registry') || '{}');
      return jsonResponse({ status: "success", users: Object.values(users) });
    }

    // Fallback default
    return jsonResponse({ status: "success" });
  }

  // 8. Global Mobil Senkron & Kullanıcı Değiştirici API'si
  window.VizyonerSync = {
    detectServer: detectLiveServer,

    // Masaüstündeki Tüm Kullanıcıları Mobilde Listele & Değiştir
    switchUser: function(newUsername) {
      if (!newUsername) return;
      localStorage.setItem(ACTIVE_USER_KEY, newUsername);
      const users = JSON.parse(localStorage.getItem('vf_users_registry') || '{}');
      const u = users[newUsername] || { username: newUsername, name: newUsername, role: 'user' };
      sessionStorage.setItem("vizyoner_auth_session", JSON.stringify(u));
      alert(`✅ Kullanıcı değiştirildi: ${u.name || newUsername}. Sayfa yenileniyor...`);
      window.location.reload();
    },

    // Masaüstü ile Şimdi Canlı Eşitle
    syncNow: async function() {
      const isOnline = await detectLiveServer();
      if (!isOnline) {
        const ip = prompt("Masaüstü bilgisayarınızın yerel IP adresini girin (Örn: 192.168.1.35):", localStorage.getItem(SERVER_URL_KEY) || "");
        if (ip) {
          const clean = ip.startsWith("http") ? ip : `http://${ip}:5173`;
          localStorage.setItem(SERVER_URL_KEY, clean);
          const ok = await detectLiveServer();
          if (ok) {
            alert(`✅ Masaüstü bilgisayara bağlanıldı (${clean})! Veriler senkronize ediliyor...`);
            window.location.reload();
            return;
          } else {
            alert(`❌ ${clean} adresindeki masaüstü sunucusuna ulaşılamadı. Lütfen masaüstünde VizyonerFinans'ın açık olduğundan emin olun.`);
            return;
          }
        }
      } else {
        alert("✅ Masaüstü ile bağlantı zaten canlı ve senkronize!");
        window.location.reload();
      }
    },

    // Masaüstü için Güncel JSON Dışa Aktar (Yedek)
    exportDesktopSyncedJson: function() {
      const activeUser = localStorage.getItem(ACTIVE_USER_KEY) || 'admin';
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + activeUser);
      if (!raw) {
        alert("Dışa aktarılacak veri bulunamadı.");
        return;
      }
      const blob = new Blob([raw], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `synced_data.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Sayfa açıldığında sunucu tespitini başlat
  window.addEventListener('DOMContentLoaded', () => {
    detectLiveServer();
  });

})();
