/**
 * Vizyoner Finans Mobil - Navigation & Touch UI Controller
 */

window.currentMobileTab = 'dashboard';

// Mobil Sekme Değiştirici
window.switchMobileTab = function(tabName) {
  window.currentMobileTab = tabName;

  // Bottom nav aktiflik durumu
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    item.classList.remove('active');
  });
  const activeBtn = document.getElementById('bnav-' + tabName);
  if (activeBtn) activeBtn.classList.add('active');

  // Masaüstü app.js'in navigateTo fonksiyonunu çağır (varsa)
  if (typeof window.navigateTo === 'function' && tabName !== 'more') {
    window.navigateTo(tabName);
  }

  // Mobil görünüm konteynerlerini aç/kapat
  document.querySelectorAll('.mobile-view-container').forEach(view => {
    view.classList.remove('active-view');
  });

  const targetView = document.getElementById('view-' + tabName);
  if (targetView) {
    targetView.classList.add('active-view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Lucide ikonlarını yeniden render et
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
};

// Menüden (Daha Fazla) bir sayfaya gitme
window.openSubViewFromMenu = function(viewName) {
  // Alt bar'da 'more' seçili kalsın veya uygun sekme
  switchMobileTab(viewName);
  
  // Üst bar başlığını güncelle
  const titleEl = document.getElementById('mobile-current-title');
  if (titleEl) {
    const titles = {
      'debts': 'Borçlar & Krediler',
      'simulation': 'Gelecek Simülasyonu',
      'inflation': 'Kişisel Enflasyon',
      'projection': 'Gider Projeksiyonu',
      'advisor': 'Akıllı Danışman AI',
      'goals': 'Bütçe & Hedefler',
      'profile': 'Profilim & Lisans',
      'settings': 'Ayarlar & Senkron'
    };
    titleEl.innerText = titles[viewName] || 'Vizyoner Finans';
  }
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

// Sayfa yüklendiğinde mobil hazırlıkları yap
document.addEventListener('DOMContentLoaded', function() {
  console.log('[Vizyoner Mobile UI] Hazırlanıyor...');

  // URL hash veya parametre kontrolü
  const urlParams = new URLSearchParams(window.location.search);
  const requestedView = urlParams.get('view');
  if (requestedView) {
    setTimeout(() => switchMobileTab(requestedView), 200);
  }

  if (urlParams.get('action') === 'quick-add') {
    setTimeout(() => toggleQuickAddSheet(), 400);
  }

  // Lucide başlat
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }

  // Ticker otomatik kaydırma efekti
  const ticker = document.getElementById('mobile-ticker');
  if (ticker) {
    let scrollPos = 0;
    setInterval(() => {
      scrollPos += 1;
      if (scrollPos >= ticker.scrollWidth - ticker.clientWidth) {
        scrollPos = 0;
      }
      ticker.scrollLeft = scrollPos;
    }, 50);
  }
});
