/**
 * Vizyoner Finans Mobil - Navigation, Section Framing & Multi-User Switcher
 */

window.currentMobileTab = 'dashboard';

const TAB_CONFIG = {
  dashboard: { title: 'Genel Bakış', sub: 'Finansal durum ve portföy özeti', icon: 'layout-dashboard', color: '#8b5cf6' },
  transactions: { title: 'İşlem Defteri', sub: 'Tüm gelir, gider ve harcama kayıtları', icon: 'arrow-left-right', color: '#06b6d4' },
  investments: { title: 'Portföy & Varlıklar', sub: 'Canlı BIST, Altın, Döviz ve Fon takibi', icon: 'trending-up', color: '#10b981' },
  debts: { title: 'Borçlar & Krediler', sub: 'Kredi ve kart taksitleri, kapatma planı', icon: 'credit-card', color: '#f43f5e' },
  simulation: { title: 'Gelecek & FIRE', sub: 'Bileşik getiri ve emeklilik projeksiyonu', icon: 'sparkles', color: '#a855f7' },
  inflation: { title: 'Kişisel Enflasyon', sub: 'Harcama sepetinize özel enflasyon oranı', icon: 'percent', color: '#f59e0b' },
  projection: { title: 'Gider Projeksiyonu', sub: 'Önümüzdeki 12 aylık bütçe simülasyonu', icon: 'line-chart', color: '#10b981' },
  advisor: { title: 'Akıllı Danışman AI', sub: 'Yapay zeka finans koçu ve bütçe analizi', icon: 'bot', color: '#06b6d4' },
  goals: { title: 'Bütçe & Hedefler', sub: 'Limitler ve hedef birikim kumbaraları', icon: 'target', color: '#ec4899' },
  profile: { title: 'Profilim & Lisans', sub: 'Hesap bilgileri ve Pro lisans yönetimi', icon: 'user-cog', color: '#6366f1' },
  settings: { title: 'Ayarlar & Senkron', sub: 'Masaüstü veri senkronizasyonu ve yedek', icon: 'settings', color: '#64748b' },
  more: { title: 'Tüm Özellikler', sub: 'Uygulama menüsü ve ek araçlar', icon: 'grid', color: '#3b82f6' }
};

// Mobil Sekme Değiştirici
window.switchMobileTab = function(tabName) {
  window.currentMobileTab = tabName;

  // 1. Bottom Nav aktiflik durumunu güncelle
  document.querySelectorAll('.bottom-nav-item').forEach(item => item.classList.remove('active'));
  const bnavBtn = document.getElementById('bnav-' + tabName);
  if (bnavBtn) {
    bnavBtn.classList.add('active');
  } else {
    const moreBtn = document.getElementById('bnav-more');
    if (moreBtn && ['debts', 'simulation', 'inflation', 'projection', 'advisor', 'goals', 'profile', 'settings'].includes(tabName)) {
      moreBtn.classList.add('active');
    }
  }

  // 2. Görünümleri Aç / Kapat
  const moreView = document.getElementById('view-more');

  // Önce tüm inline display stillerini temizle
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active-view');
    sec.style.removeProperty('display');
  });

  if (tabName === 'more') {
    if (moreView) {
      moreView.style.display = 'block';
      moreView.classList.add('active-view');
    }
  } else {
    if (moreView) {
      moreView.style.display = 'none';
      moreView.classList.remove('active-view');
    }

    if (typeof window.navigateTo === 'function') {
      window.navigateTo(tabName);
    }

    const targetSec = document.getElementById('view-' + tabName);
    if (targetSec) {
      targetSec.classList.add('active-view');
      targetSec.style.display = 'flex';
    }
  }

  // 3. Üst Bar Başlığını Güncelle
  const titleEl = document.getElementById('mobile-current-title');
  if (titleEl) {
    titleEl.innerText = TAB_CONFIG[tabName]?.title || 'Vizyoner Finans';
  }

  // 4. İlgili sekmenin başına şık mobil başlık çerçevesi yerleştir
  ensureSectionBanner(tabName);

  // 5. Sayfayı en tepeye kaydır
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // 6. İkonları ve Grafikleri Yenile
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 100);
};

// Sekme Başına Şık Dikey Mobil Çerçeve Başlığı Enjekte Et
function ensureSectionBanner(tabName) {
  if (tabName === 'more') return;
  const sec = document.getElementById('view-' + tabName);
  if (!sec) return;

  const cfg = TAB_CONFIG[tabName] || { title: tabName, sub: '', icon: 'folder', color: '#8b5cf6' };
  let banner = sec.querySelector('.mobile-section-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.className = 'mobile-section-banner';
    banner.innerHTML = `
      <div class="mobile-banner-left">
        <div class="mobile-banner-icon" style="background: rgba(${hexToRgb(cfg.color)}, 0.2); color: ${cfg.color};">
          <i data-lucide="${cfg.icon}"></i>
        </div>
        <div>
          <div class="mobile-banner-title">${cfg.title}</div>
          <div class="mobile-banner-sub">${cfg.sub}</div>
        </div>
      </div>
      <button class="btn btn-sm btn-secondary" style="width:auto; padding:6px 12px; font-size:0.75rem; border-radius:10px;" onclick="toggleQuickAddSheet()">
        <i data-lucide="plus" style="width:14px;"></i> Ekle
      </button>
    `;
    sec.insertBefore(banner, sec.firstChild);
  }
}

function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

// Menüden Alt Sayfa Açma
window.openSubViewFromMenu = function(viewName) {
  switchMobileTab(viewName);
};

// Hızlı İşlem Ekleme Bottom Sheet
window.toggleQuickAddSheet = function(forceClose = false) {
  const sheet = document.getElementById('quick-add-sheet');
  if (!sheet) return;
  if (forceClose || sheet.classList.contains('active')) {
    sheet.classList.remove('active');
  } else {
    sheet.classList.add('active');
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }
};

// Masaüstü Kullanıcı Değiştirici Sheet (Tüm Kullanıcı Dataları Arasında Geçiş)
window.openMobileUserSwitcher = function() {
  let modal = document.getElementById('mobile-user-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'mobile-user-modal';
    modal.className = 'bottom-sheet-overlay';
    modal.onclick = function(e) { if(e.target === this) this.classList.remove('active'); };
    document.body.appendChild(modal);
  }

  // Masaüstü kullanıcı listesini çek
  const users = JSON.parse(localStorage.getItem('vf_users_registry') || '{}');
  const activeUser = localStorage.getItem('vf_active_username') || 'admin';

  let userItemsHtml = '';
  const knownUsers = Object.keys(users).length > 0 ? users : {
    admin: { name: 'Sezer Akyol', role: 'admin', avatarColor: '#8b5cf6' },
    demo: { name: 'Demo Yatırımcı', role: 'user', avatarColor: '#06b6d4' },
    pro: { name: 'Pro Kullanıcı', role: 'user', avatarColor: '#f59e0b' },
    test: { name: 'Test User', role: 'user', avatarColor: '#ec4899' },
    user1: { name: 'Kullanıcı 1', role: 'user', avatarColor: '#10b981' }
  };

  for (const [uname, u] of Object.entries(knownUsers)) {
    const isCur = uname === activeUser;
    userItemsHtml += `
      <div onclick="VizyonerSync.switchUser('${uname}')" style="display:flex; align-items:center; justify-content:space-between; padding:12px; border-radius:14px; background:${isCur ? 'rgba(139,92,246,0.18)' : 'rgba(255,255,255,0.04)'}; border:1px solid ${isCur ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}; margin-bottom:8px; cursor:pointer;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:38px; height:38px; border-radius:50%; background:${u.avatarColor || '#8b5cf6'}; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:0.85rem;">
            ${(u.name || uname).substring(0,2).toUpperCase()}
          </div>
          <div>
            <div style="font-weight:700; color:#fff; font-size:0.9rem;">${u.name || uname}</div>
            <div style="font-size:0.72rem; color:var(--text-muted);">${uname} • ${u.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}</div>
          </div>
        </div>
        ${isCur ? '<span style="font-size:0.75rem; color:#10b981; font-weight:800;">● Aktif</span>' : '<span style="font-size:0.75rem; color:rgba(255,255,255,0.4);">Geçiş Yap →</span>'}
      </div>
    `;
  }

  modal.innerHTML = `
    <div class="bottom-sheet-content">
      <div class="bottom-sheet-handle"></div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <h3 style="margin:0; font-size:1.1rem; font-weight:800;">Masaüstü Kullanıcı Hesapları</h3>
        <button class="btn btn-sm btn-secondary btn-icon" style="width:auto;" onclick="document.getElementById('mobile-user-modal').classList.remove('active')"><i data-lucide="x"></i></button>
      </div>
      <p style="font-size:0.75rem; color:var(--text-secondary); margin:0 0 14px 0;">VizyonerFinans klasörünüzdeki kayıtlı kullanıcı hesapları arasında anında geçiş yapın:</p>
      <div style="max-height:55vh; overflow-y:auto; margin-bottom:14px;">
        ${userItemsHtml}
      </div>
      <button class="btn btn-primary" onclick="VizyonerSync.syncNow(); document.getElementById('mobile-user-modal').classList.remove('active');">
        <i data-lucide="refresh-cw"></i> Masaüstü ile Şimdi Eşitle
      </button>
    </div>
  `;

  modal.classList.add('active');
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
};

// Sayfa Yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
  console.log('[Vizyoner Mobile UI] Başlatılıyor...');

  // 1. Masaüstü Oturumunu Garanti Et
  ensureMobileSession();

  // 2. Tabloları yatay kaydırma çerçevesine al
  document.querySelectorAll('table').forEach(tbl => {
    if (!tbl.parentElement.classList.contains('table-responsive')) {
      const wrap = document.createElement('div');
      wrap.className = 'table-responsive';
      tbl.parentNode.insertBefore(wrap, tbl);
      wrap.appendChild(tbl);
    }
  });

  // 3. İlk Sekmeyi Aç
  setTimeout(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedView = urlParams.get('view') || 'dashboard';
    switchMobileTab(requestedView);
  }, 200);

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
});

function ensureMobileSession() {
  try {
    const lockScreen = document.getElementById("auth-lock-screen");
    const appRoot = document.getElementById("app-root");
    if (lockScreen) lockScreen.style.display = "none";
    if (appRoot) {
      appRoot.style.display = "block";
      appRoot.style.width = "100%";
    }
  } catch(e){}
}
