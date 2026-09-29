# 📱 Vizyoner Finans Mobil - Dikey Mobil Format & Masaüstü Canlı Senkronizasyon Rehberi

Bu rehber, **VizyonerFinansMobile** uygulamasının dikey mobil format özelliklerini ve masaüstü `VizyonerFinans/data/` klasöründeki tüm kullanıcı datalarıyla nasıl çift yönlü canlı senkron çalıştığını açıklar.

---

## 🌟 1. Dikey Mobil Format Çerçeveleme Özellikleri

- **📱 %100 Dikey Ekran Uyumu (Portrait-First):**
  - Telefon dik tutulduğunda sağa/sola taşma (yatay kaydırma) sıfıra indirilmiştir (`max-width: 100vw; overflow-x: hidden`).
  - Her sekmenin başında şık bir **Mobil Sekme Başlık Çerçevesi (Banner)** yer alır (Sekme Adı, Açıklaması, İkonu ve Hızlı İşlem Butonu).
  - Tüm KPI kartları mobilde dikey formata uygun 2 sütunlu veya tek sütunlu cam efektli çerçeveler halindedir.
  - Tablolar (İşlemler, Portföy Hisseleri, Borç Taksitleri) dikey ekranda bozulmadan parmakla sağa-sola kaydırılabilir esnek çerçeveye (`.table-responsive`) alınmıştır.
- **🧭 Sabit Alt Navigasyon Dock (Bottom Dock):**
  - Ekranın altında sabit duran dock: **Özet**, **İşlemler**, **Ortada Hızlı Ekle (+)**, **Portföy** ve **Menü**.
  - Dokunduğunuz sekme anında dikey çerçevesiyle ekrana gelir ve sayfanın en tepesine yumuşakça kayar.
- **⚡ Ortada "+" FAB Hızlı İşlem Paneli:**
  - Tek dokunuşla ekranın altından yukarı kayan **Bottom Sheet** menüsü ile Gelir, Gider, Yatırım veya Borç kaydetme.

---

## 🔄 2. Masaüstü `data/` Kullanıcı Verileri ile Canlı Senkronizasyon

Mobil uygulama, masaüstü `VizyonerFinans` klasöründeki kullanıcı veritabanı ile **2 farklı yöntemle tam senkron** çalışır:

### Yöntem A: Aynı Wi-Fi / Yerel Ağ Üzerinden (Sıfır Kurulum - En Kolay)
1. Bilgisayarınızda `VizyonerFinans.exe` veya `baslat.bat` açık olsun.
2. Bilgisayarınızın yerel IP adresini öğrenin (Komut satırına `ipconfig` yazarak, örn: `192.168.1.35`).
3. Telefonunuzun tarayıcısından (veya Safari/Chrome PWA'dan) şu adresi açın:  
   👉 `http://192.168.1.35:5173/VizyonerFinansMobile/`
4. **Sonuç:** Üst barda **"🟢 Masaüstü Senkron"** rozeti yanar.
   - Mobilde eklediğiniz bir gelir/gider, **ANINDA** bilgisayarınızdaki `data/admin_data.json` dosyasına yazılır!
   - Masaüstünde yaptığınız değişiklikler doğrudan telefonda görünür!

### Yöntem B: GitHub Pages Üzerinden (Dışarıdayken Çevrimdışı / Hibrit)
1. GitHub Pages üzerinden telefonunuza yüklediğinizde veriler telefonunuzun yerel hafızasında saklanır.
2. Eve veya ofise geldiğinizde, mobil uygulamanın üst barındaki **"⚡ Çevrimdışı (Masaüstü Senkron)"** butonuna veya Ayarlar sekmesindeki **"Masaüstü ile Şimdi Eşitle"** butonuna dokunun.
3. Bilgisayarınızın IP adresini girin (örn: `192.168.1.35`).
4. Telefonunuzdaki tüm yeni işlemler masaüstü sunucusuna aktarılır ve eşitlenir!

---

## 👥 3. Masaüstü Kullanıcıları Arasında Geçiş (Multi-User)

Mobil uygulamanın sağ üst köşesindeki **kullanıcı avatarına** (veya Ayarlar sekmesine) dokunduğunuzda, masaüstü `data/users.json` dosyasında kayıtlı tüm kullanıcılar listelenir:
- **Sezer Akyol** (`admin`)
- **Demo Yatırımcı** (`demo`)
- **Pro Kullanıcı** (`pro`)
- **Test User** (`test`)
- **User 1** (`user1`)

İstediğiniz kullanıcının üzerine dokunduğunuzda o kullanıcının tüm bütçe, portföy ve işlem verileri mobilde anında yüklenir!

---

## 💻 4. Bilgisayardan Test Etme:
Masaüstü klasörünüzdeki **`baslat_mobil.bat`** dosyasına çift tıkladığınızda, sunucu durumunu otomatik algılar ve mobil sürümü dikey formatta tarayıcınızda açar.
