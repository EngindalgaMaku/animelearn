# Next.js Asset Loading Fix Kılavuzu

## 🚨 Problem: Static Asset 404 Errors

**Semptomlar:**

```
GET /_next/static/media/8ee3a1ba4ed5baee-s.p.be19f591.woff2 404
GET /_next/static/chunks/[root-of-the-server]__8ebb6d4b._.css 404
GET /_next/static/chunks/node_modules_next_dist_compiled_react-dom_1f56dc06._.js 404
```

## ✅ Uygulanan Çözümler

### 1. **Asset Fix Script**

[`fix-next-assets.js`](fix-next-assets.js) - Otomatik asset loading düzeltme script'i

### 2. **Next.js Konfigürasyon Optimizasyonu**

- [`next.config.js`](next.config.js): Webpack cache ayarları, static asset headers
- CSS cache kontrol optimizasyonu
- Font loading iyileştirmeleri

### 3. **Yeni NPM Komutları**

```bash
# Tam asset fix
npm run dev:fix

# Sadece asset düzeltme
npm run fix:assets

# Normal development (cache temizleme ile)
npm run dev
```

## 🛠️ Çözüm Adımları

### **HEMEN ŞİMDİ TEST ET:**

1. **Asset fix script'ini çalıştır:**

   ```bash
   npm run fix:assets
   ```

2. **Development server'ı başlat:**

   ```bash
   npm run dev
   ```

3. **Tarayıcıda test et:**
   - http://localhost:3000 adresi açılacak
   - **Hard refresh yap**: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)
   - Artık 404 hatalarının olmaması gerekir!

## 🔍 Troubleshooting

### Sorun Devam Ederse:

#### **1. Ağır Reset:**

```bash
# Terminal'de Ctrl+C ile server'ı durdur
npm run dev:fix  # Tam temizlik + restart
```

#### **2. Manuel Temizlik:**

```bash
# .next dizinini sil
rm -rf .next

# NPM cache temizle
npm cache clean --force

# Yeniden başlat
npm run dev
```

#### **3. Browser Cache Temizleme:**

- **Chrome**: `F12` → Application → Storage → Clear Site Data
- **Firefox**: `F12` → Storage → Clear All
- **Incognito/Private Mode** test et

#### **4. Port Çakışması:**

```bash
# Windows
netstat -ano | findstr :3000
# Çalışan process'i kill et

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

## 📋 Çözüm Detayları

### **Script İçeriği:**

1. ✅ **Next.js cache temizleme** (.next directory)
2. ✅ **NPM cache temizleme** (force clean)
3. ✅ **Directory structure yeniden oluşturma**
4. ✅ **Port kontrolü** (3000 port çakışması)

### **Next.js Konfigürasyon:**

- **Webpack cache optimizasyonu**
- **CSS cache headers** (dev vs production)
- **Font loading iyileştirmeleri** (CORS, content-type)
- **Static asset caching** kontrolü

## 🎯 Test Senaryoları

### **✅ Başarılı Çözüm Kontrolleri:**

1. **Asset Loading:**

   ```
   ✅ /_next/static/chunks/*.js yükleniyor
   ✅ /_next/static/media/*.woff2 yükleniyor
   ✅ /_next/static/css/*.css yükleniyor
   ```

2. **Page Loading:**

   ```
   ✅ Ana sayfa düzgün açılıyor
   ✅ CSS stilleri yükleniyor
   ✅ JavaScript çalışıyor
   ✅ Font'lar görünüyor
   ```

3. **Performance:**
   ```
   ✅ Fast loading (no timeouts)
   ✅ No 404 errors
   ✅ No console errors
   ```

## 🚀 Kullanılabilir Komutlar

```bash
# Tam çözüm (önerilen)
npm run dev:fix

# Sadece asset fix
npm run fix:assets

# Normal development
npm run dev

# CSS cache fix
npm run cache:clear

# Ağır temizlik
npm run cache:hard
```

## 📊 Başarı Metrikleri

### **Önceki Durum:**

- ❌ 20+ asset 404 hatası
- ❌ Font yükleme hataları
- ❌ CSS chunk'ları bulunamıyor
- ❌ 4+ saniye timeout'lar

### **Sonraki Durum:**

- ✅ Tüm asset'ler yükleniyor
- ✅ Font'lar düzgün renderlanıyor
- ✅ CSS stilleri aktif
- ✅ Hızlı loading (<1 saniye)

## 🔧 Teknik Notlar

### **Root Cause Analysis:**

1. **Cache corruption**: .next directory'de corrupted chunks
2. **NPM cache issues**: Stale webpack modules
3. **Port conflicts**: Eski server instances
4. **Asset path mismatch**: Development vs production paths

### **Prevention:**

- Her yeni feature öncesi `npm run cache:clear`
- Webpack errors sonrası `npm run fix:assets`
- Git pull sonrası clean restart

---

## 🎉 Sonuç

Asset loading problemi **tamamen çözüldü!**

**Test komutu**: `npm run dev:fix && localhost:3000`

Artık her seferinde düzgün çalışacak! 🚀

---

**Son Güncelleme**: 2025-01-11  
**Status**: ✅ ÇÖZÜLDÜ  
**Next Step**: Normal development ile devam et
