# 📱 Vizyoner Finans Mobil - GitHub Pages Yayınlama & Kurulum Rehberi

Bu rehber, **VizyonerFinansMobile** uygulamasını GitHub üzerinde tamamen ücretsiz barındırıp (GitHub Pages), hem **iOS (iPhone/iPad)** hem de **Android** cihazlarınıza nasıl gerçek bir yerel uygulama gibi yükleyeceğinizi adım adım açıklar.

---

## 🚀 1. Adım: GitHub Üzerinde Sunucu Oluşturma (GitHub Pages)

GitHub Pages tamamen ücretsizdir, SSL (https://) sertifikası içerir ve PWA (Progressive Web App) özelliklerinin telefonda çalışması için gereken güvenli bağlantıyı sağlar.

### A. Yeni GitHub Deposu (Repository) Oluşturun
1. [GitHub](https://github.com/) hesabınıza giriş yapın.
2. Sağ üstteki **`+`** ikonuna tıklayıp **"New repository"** seçeneğini seçin.
3. Repository name alanına örneğin: `vizyoner-mobil` veya `VizyonerFinansMobile` yazın.
4. Görünürlüğü **Public** (Herkese Açık) olarak belirleyin (Ücretsiz GitHub Pages için gereklidir).
5. **"Create repository"** butonuna tıklayın.

### B. Mobil Dosyaları GitHub'a Yükleyin
Klasörünüzdeki tüm dosyaları GitHub'a 2 yöntemden biriyle yükleyebilirsiniz:

#### 1. Yöntem: Doğrudan Web Arayüzünden (Kolay)
1. Açılan repo sayfasında **"uploading an existing file"** linkine tıklayın.
2. `c:\Users\PC\Desktop\VizyonerFinans\VizyonerFinansMobile` klasöründeki **tüm dosya ve alt klasörleri** (`index.html`, `manifest.json`, `sw.js`, `mobile-adapter.js`, `mobile-ui.js`, `mobile.css`, `app.js`, `styles.css`, `synced_data.js`, `vendor/`, `icons/`) sürükleyip bırakın.
3. Alttaki **"Commit changes"** butonuna tıklayın.

#### 2. Yöntem: Git Komut Satırı ile (Hızlı)
`VizyonerFinansMobile` klasörü içerisinde bir terminal açıp şu komutları çalıştırın:
```bash
git init
git add .
git commit -m "Vizyoner Finans Mobil v1.0.0"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/vizyoner-mobil.git
git push -u origin main
```

### C. GitHub Pages'i Aktif Edin
1. GitHub reponuzun üst menüsündeki **"Settings"** (Ayarlar) sekmesine gidin.
2. Sol menüden **"Pages"** sekmesine tıklayın.
3. **Build and deployment** başlığı altında:
   - **Source:** `Deploy from a branch` seçin.
   - **Branch:** `main` (veya `master`) ve `/ (root)` seçin.
4. **"Save"** butonuna tıklayın.
5. Yaklaşık 1-2 dakika içinde sayfanın üstünde yayın bağlantınız belirecektir:  
   👉 `https://kullaniciadiniz.github.io/vizyoner-mobil/`

---

## 📲 2. Adım: Telefona Gerçek Uygulama Olarak Yükleme

### 🍎 iOS (iPhone & iPad) Kurulumu:
1. iPhone'unuzda **Safari** tarayıcısını açın (Not: iOS'ta PWA kurulumu için Safari şarttır).
2. GitHub Pages adresinize gidin: `https://kullaniciadiniz.github.io/vizyoner-mobil/`
3. Safari'nin alt ortasındaki **Paylaş (Share)** simgesine (kare içinden yukarı çıkan ok) dokunun.
4. Açılan menüyü aşağı kaydırıp **"Ana Ekrana Ekle" (Add to Home Screen)** seçeneğini seçin.
5. Sağ üstteki **"Ekle"** butonuna dokunun.
6. Artık ana ekranınızda **Vizyoner Finans** uygulama ikonu belirecektir. Tıkladığınızda tarayıcı sekmeleri ve adres çubuğu olmadan tam ekran yerel bir iOS uygulaması gibi açılacaktır.

### 🤖 Android (Samsung, Xiaomi vb.) Kurulumu:
1. Telefonunuzda **Google Chrome** tarayıcısını açın.
2. GitHub Pages adresinize gidin: `https://kullaniciadiniz.github.io/vizyoner-mobil/`
3. Ekranın altında otomatik olarak beliren **"Ana Ekrana Ekle"** veya **"Vizyoner Finans Uygulamasını Yükle"** bildirimine dokunun.
4. Eğer bildirim çıkmazsa, sağ üstteki **üç nokta (⋮)** simgesine dokunun ve **"Uygulamayı Yükle"** veya **"Ana Ekrana Ekle"** seçeneğini seçin.
5. Uygulama telefonunuzun uygulama çekmecesine ve ana ekranına yerleşecektir.

---

## ⚡ 3. Adım: Çevrimdışı (Offline) Özellikler & Veri Güvenliği

1. **İnternetsiz Çalışma:**
   - Uygulama `sw.js` (Service Worker) teknolojisiyle tüm arayüzü ve verileri cihazınıza önbellekler.
   - Uçak modunda veya çekmeyen ortamlarda bile anında açılır; işlemlerinizi girebilir, grafiklerinizi inceleyebilirsiniz.
2. **Kişisel Veri Gizliliği (Local-First):**
   - Verileriniz telefonunuzun yerel güvenli depolama alanında (`localStorage`) saklanır. Hiçbir harici bulut sunucusuna gönderilmez.
3. **Masaüstü ile Veri Eşitleme:**
   - **Yedek İndir (JSON):** Menü sekmesinden "Yedek İndir" butonuna basarak verinizi JSON dosyası olarak alabilirsiniz.
   - **Yedek Yükle (JSON):** Masaüstündeki veya başka bir cihazdaki yedeğinizi Ayarlar sekmesinden tek tıkla yükleyebilirsiniz.
   - **Masaüstü Yerel IP Senkronizasyonu:** Eğer telefonunuz ve bilgisayarınız aynı ev/ofis Wi-Fi ağına bağlıysa, Ayarlar sekmesinde bilgisayarınızın yerel IP adresini (örn: `http://192.168.1.35:5173`) girerek canlı masaüstü sunucusuna bağlanabilirsiniz.

---

## 💻 4. Adım: Masaüstünden Mobil Uygulamayı Test Etme

Masaüstü bilgisayarınızdan mobil versiyonu istediğiniz zaman test etmek için:
- `c:\Users\PC\Desktop\VizyonerFinans\` klasöründeki **`baslat_mobil.bat`** dosyasına çift tıklayın.
- Veya doğrudan `VizyonerFinansMobile/index.html` dosyasını tarayıcınızda açıp F12 (Geliştirici Araçları) -> Cihaz Modu (Ctrl+Shift+M) ile istediğiniz telefon ekranında (iPhone 14/15, Samsung Galaxy) test edin.
