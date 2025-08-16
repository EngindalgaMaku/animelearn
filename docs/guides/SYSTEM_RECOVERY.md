# Anime Card Manager - TAM SİSTEM KURTARMA KILAVUZU

## 🚨 ACIL DURUM TÜM SİSTEM KURTARMA

Bu kılavuz, anime card management sisteminin **TÜM BİLEŞENLERİNİ** sıfırdan kurtarmak için gerekli adımları içermektedir. Sadece kartlar değil, kullanıcılar, kategoriler, Python tips, blog yazıları, diamond packages ve tüm sistem verileri dahil.

## 📋 TAM SİSTEM KURTARMA CHECKLİST

### 🔥 **ACİL KURTARMA - TEK KOMUT İLE**

```bash
# TÜM SİSTEMİ SIFIRDAN KURTARMA
npm run dev
node scripts/seed-all-admin-data.js
node scripts/migrate-cards-to-categories.js
node scripts/organize-cards-by-category.js
```

### 📝 **DETAYLI ADIMLAR**

- [ ] **Adım 1**: Veritabanı bağlantısı ve Prisma durumu
- [ ] **Adım 2**: Tüm sistem verileri (Admin, Kategoriler, Rarities, Elements vb.)
- [ ] **Adım 3**: Admin kullanıcı oluşturma
- [ ] **Adım 4**: Python tips ve kategorileri
- [ ] **Adım 5**: Blog yazıları
- [ ] **Adım 6**: Diamond packages
- [ ] **Adım 7**: Dosya dizin yapısı oluşturma
- [ ] **Adım 8**: Kart migration ve organizasyon
- [ ] **Adım 9**: Otomatik toplu analiz
- [ ] **Adım 10**: Sistem doğrulama ve test

---

## 🔧 DETAYLI TÜM SİSTEM KURTARMA ADIMLARI

### 1. **VERİTABANI VE PRISMA KONTROLÜ**

#### Veritabanı Bağlantısı

```bash
# Prisma durumunu kontrol et
npx prisma db push
npx prisma generate
npx prisma studio  # Database'i görsel olarak kontrol et
```

#### Environment Variables

```bash
# .env.local dosyasını kontrol et
cat .env.local

# Gerekli değişkenler:
# DATABASE_URL="postgresql://..."
# NEXTAUTH_SECRET="your-secret-key"
# NEXTAUTH_URL="http://localhost:3000"
```

### 2. **TÜM SİSTEM VERİLERİNİ SEED ETME (ANA KURTARMA)**

#### Tek Komut ile Tam Sistem Kurtarma

```bash
# Ana seed script'i - TÜM sistem verilerini oluşturur
node scripts/seed-all-admin-data.js
```

**Bu script şunları oluşturur:**

- ✅ **8 Rarity Levels**: Common, Uncommon, Rare, Super Rare, Epic, Ultra Rare, Secret Rare, Legendary
- ✅ **9 Elements**: Fire, Water, Earth, Air, Lightning, Ice, Light, Dark, Neutral
- ✅ **Card Styles**: Rarity ve element bazlı görsel stiller
- ✅ **5 Diamond Packages**: Starter ($9.99), Popular ($39.99), Premium ($79.99), Ultimate ($149.99), Mega ($249.99)
- ✅ **3 Categories**: anime-collection, star-collection, car-collection
- ✅ **Admin User**: admin@anime-cards.com / admin / admin123
- ✅ **62 Python Tips**: Temizlenmiş, duplicate-free Python ipuçları
- ✅ **2 Blog Posts**: Essential blog yazıları

#### Admin Paneline Erişim

```bash
# Development server'ı başlat (gerekirse)
npm run dev

# Admin girişi
URL: http://localhost:3000/admin
Email: admin@anime-cards.com
Username: admin
Password: admin123
```

### 3. **OPSIYONEL SEED SCRIPT'LERİ**

#### Sadece Admin Kullanıcı Oluşturma

```bash
node scripts/create-admin-user.js
```

#### Sadece Kategoriler

```bash
node scripts/seed-categories.js
```

#### Kapsamlı Python Tips (128 adet)

```bash
node scripts/seed-comprehensive-python-tips.js
```

#### Blog Seeding

```bash
node scripts/seed-blog.ts
```

#### Diamond Packages

```bash
node scripts/seed-diamond-packages.ts
```

### 4. **DOSYA DİZİN YAPISI OLUŞTURMA**

#### Kategori Dizinlerini Oluştur

```bash
# Manuel dizin oluşturma
mkdir -p public/uploads/categories/anime-collection/thumbs
mkdir -p public/uploads/categories/star-collection/thumbs
mkdir -p public/uploads/categories/car-collection/thumbs

# Placeholder dosyaları oluştur
touch public/uploads/categories/anime-collection/placeholder.jpg
touch public/uploads/categories/star-collection/placeholder.jpg
touch public/uploads/categories/car-collection/placeholder.jpg
```

#### Beklenen Dizin Yapısı

```
public/
├── uploads/
    ├── categories/
        ├── anime-collection/
        │   ├── [card-images].jpg
        │   └── thumbs/
        │       └── thumb_[card-images].jpg
        ├── star-collection/
        │   ├── [card-images].jpg
        │   └── thumbs/
        │       └── thumb_[card-images].jpg
        └── car-collection/
            ├── [card-images].jpg
            └── thumbs/
                └── thumb_[card-images].jpg
```

### 5. **KART MİGRATION VE ORGANİZASYON**

#### Mevcut Kartları Kategorilere Migration

```bash
# Kartları kategori dizinlerine taşı
node scripts/migrate-cards-to-categories.js
```

#### Kartları Organize Et

```bash
# Dosyaları düzenle ve kategorize et
node scripts/organize-cards-by-category.js
```

#### Thumbnail'ları Migration Et

```bash
# Thumbnail'ları yeni dizin yapısına taşı
node scripts/migrate-thumbnails-to-categories.js
```

### 6. **KART TARAMA VE IMPORT (OTOMATİK KURTARMA)**

#### Admin Paneli Üzerinden (Önerilen)

1. **http://localhost:3000/admin/cards** adresine git
2. **"Scan Uploads Directory"** butonuna tıkla
3. Bulunan kartları gözden geçir
4. **"Import Selected Cards"** ile kartları import et
5. **✨ Otomatik toplu analiz başlayacak!** (YENİ ÖZELLİK)

#### Manuel Test Script'leri

```bash
# Kategori durumunu test et
node scripts/test-categories.ts

# Kart sistemi test et
node scripts/test-complete-system.js

# Thumbnail migration test et
node scripts/test-thumbnail-migration.js
```

### 7. **SİSTEM DOĞRULAMA VE TEST**

#### Admin Panel Kontrolleri

```bash
# Admin paneli erişimleri
curl http://localhost:3000/admin
curl http://localhost:3000/api/dashboard
```

#### Database Kontrolleri

```sql
-- Veritabanı durumunu kontrol et
SELECT 'users' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'cards', COUNT(*) FROM "Card"
UNION ALL
SELECT 'categories', COUNT(*) FROM "Category"
UNION ALL
SELECT 'rarities', COUNT(*) FROM "Rarity"
UNION ALL
SELECT 'elements', COUNT(*) FROM "Element"
UNION ALL
SELECT 'python_tips', COUNT(*) FROM "PythonTip"
UNION ALL
SELECT 'blogs', COUNT(*) FROM "BlogPost"
UNION ALL
SELECT 'diamond_packages', COUNT(*) FROM "DiamondPackage";
```

#### API Endpoint Testleri

```bash
# API'leri test et
curl http://localhost:3000/api/categories
curl http://localhost:3000/api/rarities
curl http://localhost:3000/api/elements
curl http://localhost:3000/api/shop?page=1&limit=10
```

## 🔍 SORUN GİDERME VE ÇÖZÜMLER

### Yaygın Sorunlar ve Çözümleri

#### 1. Unique Constraint Hatası (ÇÖZÜLDÜ ✅)

**Semptom**: `cardTitle` alanında unique constraint hatası
**Çözüm**: ✅ **Otomatik düzeltildi** - Sistem artık conflicts'i otomatik olarak hallediyor

#### 2. Path Resolution Hatası (ÇÖZÜLDÜ ✅)

**Semptom**: Dosya bulunamadı hataları
**Çözüm**: ✅ **Otomatik düzeltildi** - Gelişmiş path resolution sistemi

#### 3. Thumbnail Sayma Hatası (ÇÖZÜLDÜ ✅)

**Semptom**: Scan işlemi thumbnail'ları sayıyor (yanlış toplam)  
**Çözüm**: ✅ **Otomatik düzeltildi** - Thumbnail'lar artık hariç tutuluyor

#### 4. Database Connection Error

**Çözüm**:

```bash
# Prisma client'ı yeniden generate et
npx prisma generate

# Database'i reset et (dikkatli ol!)
npx prisma migrate reset
npx prisma db push
```

#### 5. Admin User Sorunu

**Çözüm**:

```bash
# Admin kullanıcıyı yeniden oluştur
node scripts/create-admin-user.js

# Veya şifreyi güncelle
node scripts/update-admin-password.js
```

#### 6. Python Tips Problemi

**Çözüm**:

```bash
# Python tips'i temizle ve yeniden oluştur
node scripts/clean-duplicate-tips.js
node scripts/seed-comprehensive-python-tips.js
```

## 📊 SİSTEM DURUMU DOĞRULAMA

### Başarılı Kurtarma Kontrolleri

#### 1. Admin Panel Kontrolleri

- [ ] Admin paneli yükleniyor (`http://localhost:3000/admin`)
- [ ] Dashboard istatistikleri görünüyor
- [ ] Card Management erişilebilir
- [ ] Python Tips yönetimi çalışıyor
- [ ] Blog yönetimi aktif

#### 2. Frontend Kontrolleri

- [ ] Ana sayfa yükleniyor (`http://localhost:3000`)
- [ ] Shop sayfası çalışıyor
- [ ] Kategoriler görünüyor
- [ ] Kartlar doğru görsellerle yükleniyor
- [ ] Python tips sayfası aktif

#### 3. Database Kontrolleri

```sql
-- Tüm tabloların durumunu kontrol et
SELECT
  schemaname,
  tablename,
  attname as column_name,
  typname as type_name
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
JOIN pg_attribute a ON a.attrelid = c.oid
JOIN pg_type ty ON ty.oid = a.atttypid
WHERE schemaname = 'public'
ORDER BY tablename, attnum;
```

#### 4. Dosya Sistemi Kontrolleri

```bash
# Kategori dizinlerindeki dosya sayıları
find public/uploads/categories -name "*.jpg" -not -path "*/thumbs/*" | wc -l

# Thumbnail sayısı
find public/uploads/categories -path "*/thumbs/*" -name "*.jpg" | wc -l

# Dizin yapısını kontrol et
tree public/uploads/categories
```

## 🚀 PERFORMANS OPTİMİZASYONU

### Kurtarma Sonrası Öneriler

#### 1. Cache Temizleme

```bash
# Next.js cache'ini temizle
rm -rf .next

# Node modules'u yeniden kur
npm ci

# Development server'ı yeniden başlat
npm run dev
```

#### 2. Database Optimizasyonu

```sql
-- Index'leri kontrol et
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Vacuum ve analyze
VACUUM ANALYZE;
```

#### 3. Image Optimization

```bash
# Thumbnail'ları yeniden oluştur
node scripts/regenerate-thumbnails.ts
```

## 📝 SİSTEM SEED SCRIPT'LERİ REFERANSı

### Temel Sistem Script'leri

| Script                           | Açıklama                  | Oluşturduğu Veriler                                                              |
| -------------------------------- | ------------------------- | -------------------------------------------------------------------------------- |
| `seed-all-admin-data.js`         | **ANA KURTARMA SCRIPT'İ** | Rarities, Elements, Categories, Admin User, Python Tips, Blogs, Diamond Packages |
| `create-admin-user.js`           | Admin kullanıcı oluşturma | Admin user (admin/admin123)                                                      |
| `seed-categories.js`             | Kategori oluşturma        | 3 kategori (anime, star, car)                                                    |
| `migrate-cards-to-categories.js` | Kart migration            | Kartları kategori dizinlerine taşır                                              |
| `organize-cards-by-category.js`  | Kart organizasyonu        | Kartları düzenler ve kategorize eder                                             |

### İçerik Script'leri

| Script                              | Açıklama               | Veriler                   |
| ----------------------------------- | ---------------------- | ------------------------- |
| `seed-comprehensive-python-tips.js` | Python tips (128 adet) | Kapsamlı Python ipuçları  |
| `seed-blog.ts`                      | Blog yazıları          | Blog posts ve kategoriler |
| `seed-diamond-packages.ts`          | Diamond paketleri      | 5 diamond paketi          |

### Maintenance Script'leri

| Script                     | Açıklama               | İşlev                              |
| -------------------------- | ---------------------- | ---------------------------------- |
| `clean-duplicate-tips.js`  | Duplicate temizleme    | Python tips'lerdeki duplikasyon    |
| `update-admin-password.js` | Admin şifre güncelleme | Admin şifresini değiştir           |
| `regenerate-thumbnails.ts` | Thumbnail yenileme     | Tüm thumbnail'ları yeniden oluştur |
| `test-complete-system.js`  | Sistem testi           | Tüm sistemi test eder              |

## 📞 ACİL DURUM KOMUTLARI

### Tek Satırda Sistem Kurtarma

```bash
# TÜM SİSTEMİ SIFIRDAN KURTARMA
npm run dev && node scripts/seed-all-admin-data.js && node scripts/migrate-cards-to-categories.js && node scripts/organize-cards-by-category.js
```

### Hızlı Test Komutları

```bash
# Admin erişimi test et
curl -s http://localhost:3000/admin | grep -o "<title>[^<]*" | cut -d'>' -f2

# API'leri test et
curl -s http://localhost:3000/api/categories | jq '.data | length'

# Database bağlantısını test et
npx prisma db execute --stdin <<< "SELECT 1"
```

### Acil Log Kontrolü

```bash
# Terminal loglarını takip et
tail -f .next/development.log

# PM2 ile çalışıyorsa
pm2 logs anime-card-manager
```

---

## 🎯 SONUÇ

Bu kılavuz ile anime card management sisteminin tüm bileşenlerini sıfırdan kurtarabilirsiniz:

✅ **Veritabanı**: Tüm tablolar ve veriler  
✅ **Admin Sistemi**: Admin kullanıcı ve panel  
✅ **Kart Sistemi**: Kategoriler, rarities, elements  
✅ **İçerik**: Python tips, blog yazıları  
✅ **E-ticaret**: Diamond packages  
✅ **Dosya Sistemi**: Kategori dizinleri ve migration  
✅ **API'ler**: Tüm backend servisler  
✅ **Frontend**: Tüm sayfa ve bileşenler

**Ana Komut**: `node scripts/seed-all-admin-data.js` - Tüm sistemi kurtarır!

---

**Son Güncelleme**: {{ current_date }}  
**Versiyon**: 3.0.0 (Tam Sistem Kurtarma)  
**Otomatik Kurtarma**: ✅ Aktif  
**Toplam Script Sayısı**: 25+ seed ve maintenance script'i
