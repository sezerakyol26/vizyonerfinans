/**
 * Vizyoner Finans Mobil - Navigation & Touch UI Controller
 * Masaüstü navigateTo ile %100 Senkronize Mobil Sekme Yönetimi
 */

window.currentMobileTab = 'dashboard';

const TAB_TITLES = {
  dashboard: 'Genel Bakış',
  transactions: 'İşlem Defteri',
  investments: 'Portföy & Varlıklar',
  debts: 'Borçlar & Krediler',
  simulation: 'Gelecek Simülasyonu',
  inflation: 'Kişisel Enflasyon',
  projection: 'Gider Projeksiyonu',
  advisor: 'Akıllı Danışman (AI)',
  goals: 'Bütçe & Hedefler',
  profile: 'Profilim & Lisans',
  settings: 'Ayarlar & Senkron',
  more: 'Tüm Özellikler'
};

// Mobil Sekme Değiştirici
window.switchMobileTab = function(tabName) {
  window.currentMobileTab = tabName;

  // 1. Bottom Nav aktiflik durumunu güncelle
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    item.classList.remove('active');
  });
  const bnavBtn = document.getElementById('bnav-' + tabName);
  if (bnavBtn) {
    bnavBtn.classList.add('active');
  } else {
    // Eğer alt barda doğrudan olmayan bir alt sekme ise (örn: debts, simulation), 'more' butonunu aktif yap
    const moreBtn = document.getElementById('bnav-more');
    if (moreBtn && ['debts', 'simulation', 'inflation', 'projection', 'advisor', 'goals', 'profile', 'settings'].includes(tabName)) {
      moreBtn.classList.add('active');
    }
  }

  // 2. Görünümleri Aç / Kapat
  const moreView = document.getElementById('view-more');

  if (tabName === 'more') {
    // Tüm standart view-section'ları gizle
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active-view');
      sec.style.display = 'none';
    });
    // Menü ekranını göster
    if (moreView) {
      moreView.style.display = 'block';
      moreView.classList.add('active-view');
    }
  } else {
    // Menü ekranını gizle
    if (moreView) {
      moreView.style.display = 'none';
      moreView.classList.remove('active-view');
    }

    // Masaüstü navigateTo'yu tetikle
    if (typeof window.navigateTo === 'function') {
      window.navigateTo(tabName);
    } else {
      // Fallback: doğrudan DOM üzerinde aç
      document.querySelectorAll('.view-section').forEach(sec => {
        sec.classList.remove('active-view');
        sec.style.display = 'none';
      });
      const targetSec = document.getElementById('view-' + tabName);
      if (targetSec) {
        targetSec.classList.add('active-view');
        targetSec.style.display = 'flex';
      }
    }
  }

  // 3. Üst Bar Başlığını Güncelle
  const titleEl = document.getElementById('mobile-current-title');
  if (titleEl) {
    titleEl.innerText = TAB_TITLES[tabName] || 'Vizyoner Finans';
  }

  // 4. Sayfayı en tepeye kaydır
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // 5. İkonları ve Grafikleri Yenile
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 100);
};

// Menüden (Daha Fazla) bir sayfaya gitme
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

// Sayfa Yüklendiğinde Mobil Başlatma
document.addEventListener('DOMContentLoaded', function() {
  console.log('[Vizyoner Mobile UI] Başlatılıyor...');

  // 1. Otomatik Giriş Koruması (Mobilde login ekranında takılı kalmayı önler)
  ensureMobileSession();

  // 2. İlk sekmeyi aktif et (Dashboard)
  setTimeout(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedView = urlParams.get('view') || 'dashboard';
    switchMobileTab(requestedView);

    if (urlParams.get('action') === 'quick-add') {
      toggleQuickAddSheet();
    }
  }, 250);

  // 3. Lucide ikonları başlat
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
});

// Mobilde otomatik oturum sağlama (Kullanıcı doğrudan uygulamaya girer)
function ensureMobileSession() {
  try {
    let saved = null;
    const raw = sessionStorage.getItem("vizyoner_auth_session") || localStorage.getItem("vizyoner_mobile_auth_session");
    if (raw) saved = JSON.parse(raw);

    if (!saved || !saved.username) {
      // Varsayılan Admin oturumunu oluştur ve kaydet
      const defaultUser = {
        username: "admin",
        name: "Sezer Akyol",
        role: "admin",
        avatar: "SA",
        avatarColor: "#8b5cf6",
        subscription: {
          tier: "pro",
          planName: "Ömür Boyu Pro Lisansı",
          validUntil: "2099-12-31",
          isLifetime: true
        }
      };
      sessionStorage.setItem("vizyoner_auth_session", JSON.stringify(defaultUser));
      localStorage.setItem("vizyoner_mobile_auth_session", JSON.stringify(defaultUser));
      localStorage.setItem("vf_active_username", "admin");
    }

    // Lock screen'i gizle, app-root'u görünür yap
    const lockScreen = document.getElementById("auth-lock-screen");
    const appRoot = document.getElementById("app-root");
    if (lockScreen) lockScreen.style.display = "none";
    if (appRoot) {
      appRoot.style.display = "block";
      appRoot.style.width = "100%";
    }
  } catch(e) {
    console.warn("Session helper error:", e);
  }
}
