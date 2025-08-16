# COOLIFY NEXTJS API 404 TROUBLESHOOTING

## ✅ DURUM TESPITI

- Coolify deployment başarılı (aa94f7b commit deployed)
- Nixpacks build pack kullanılıyor
- Kod güncel, ama API'lar hala 404 veriyor

## COOLIFY-SPECIFIC DEBUGGING

### 1. Container Logs Kontrol Edin

Coolify dashboard'da **Logs** tab'ına gidin ve şunları arayın:

```
- "Ready - started server on" (NextJS başladı mı?)
- "compiled successfully" (Build başarılı mı?)
- Error mesajları
```

### 2. Environment Variables

**Configuration > Environment Variables** bölümünde şunlar var mı:

```
NODE_ENV=production
NEXTAUTH_URL=https://zumenzu.com
NEXTAUTH_SECRET=(bir değer)
DATABASE_URL=(database bağlantınız)
```

### 3. Coolify Terminal'e Girin

**Terminal** tab'ında container'a bağlanın:

```bash
# API route'lar var mı kontrol edin
ls -la .next/server/app/api/
ls -la .next/server/app/api/debug/

# NextJS server çalışıyor mu?
ps aux | grep node

# Port 3000 dinleniyor mu?
netstat -tulpn | grep 3000

# Manuel API test
curl http://localhost:3000/api/debug
```

### 4. Start Command Kontrol

**Configuration > General > Start Command** boş mu?
Eğer boşsa otomatik Nixpacks command kullanılıyor (doğru).

Eğer custom command varsa şöyle olmalı:

```bash
npm start
```

### 5. Coolify Proxy Ayarları

**Configuration > General > Domains** kısmında:

- Domain: `https://zumenzu.com` ✅
- Direction: `Redirect to non-www` ✅

### 6. Nixpacks Configuration

Projenizde bir `nixpacks.toml` dosyası var mı? Varsa içeriğini kontrol edin.

Yoksa şu dosyayı oluşturun:

```toml
[phases.setup]
nixPkgs = ['nodejs_18', 'npm']

[phases.install]
cmd = 'npm ci'

[phases.build]
cmd = 'npm run build'

[start]
cmd = 'npm start'
```

### 7. Next.js Output Modu

`next.config.js` dosyasında output mode kontrol edin:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Bu satır OLMAMALI Coolify'da
  // ... diğer config
};
```

Eğer `output: 'standalone'` varsa kaldırın.

### 8. Package.json Scripts

`package.json`'da scripts kontrol edin:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start", // Bu OLMALI
    "lint": "next lint"
  }
}
```

## HIZLI TESTLər

### Test 1: Container İçinde API Test

Coolify Terminal'de:

```bash
curl -i http://localhost:3000/api/debug
```

**Eğer bu çalışıyorsa:** Proxy/domain problemi
**Eğer 404 veriyor:** NextJS API routing problemi

### Test 2: NextJS Process Kontrol

```bash
ps aux | grep next
# "next start" process'i çalışıyor olmalı
```

### Test 3: File System Kontrol

```bash
find . -name "route.ts" -path "*api*"
# API route dosyaları build edilmiş mi?
```

## MUHTEMEL ÇÖZÜMLER

### Çözüm 1: Force Redeploy

Coolify'da **Redeploy** butonuna basın (cache clear ile)

### Çözüm 2: Environment Variables

Eksik env var'lar ekleyin, sonra redeploy

### Çözüm 3: Start Command Fix

Manuel start command ekleyin: `npm start`

### Çözüm 4: Nixpacks Config

`nixpacks.toml` dosyası ekleyin

### Çözüm 5: Next.js Config Fix

`output: 'standalone'` kaldırın (eğer varsa)

## ACİL TEST

Coolify Terminal'de şu komutu çalıştırın:

```bash
curl -v http://localhost:3000/api/debug
```

Bu sonucu bana gönderin, problemi kesin tespit ederim.
