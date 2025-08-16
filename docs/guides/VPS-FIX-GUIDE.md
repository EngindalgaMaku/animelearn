# VPS API 404 HATASI ÇÖZÜMÜ

## PROBLEM TEŞHİSİ

- Tüm API route'ları 404 veriyor (debug endpoint dahil)
- Bu NextJS API route'larının serve edilmediği anlamına geliyor

## ZORUNLU ADIMLAR (SIRALI)

### 1. VPS'te Güncel Kodu Çek

```bash
cd /path/to/your/nextjs/project
git pull origin main
git log --oneline -3  # Son 3 commit'i gör, aa94f7b olmalı
```

### 2. Dependencies Güncelle

```bash
npm install
# veya
yarn install
```

### 3. NextJS Build Al

```bash
npm run build
# Hata varsa göster, yoksa devam et
```

### 4. PM2/Server Restart

```bash
# PM2 kullanıyorsanız:
pm2 restart all
pm2 logs

# Systemctl kullanıyorsanız:
sudo systemctl restart your-app-name

# Direct node kullanıyorsanız:
npm start
```

### 5. Nginx Konfigürasyonu (MUHTEMEL PROBLEM)

API route'ları Nginx tarafından bloklanıyor olabilir.

Nginx config dosyasını kontrol edin (`/etc/nginx/sites-available/your-site`):

```nginx
server {
    listen 80;
    server_name zumenzu.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API route'ları için özel konfigürasyon EKLENMELI
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. Nginx Restart

```bash
sudo nginx -t  # Config test
sudo systemctl restart nginx
```

### 7. Test

```bash
curl http://localhost:3000/api/debug
# Yerel olarak çalışıyor mu?

curl https://zumenzu.com/api/debug
# Domain üzerinden çalışıyor mu?
```

## EN OLASI PROBLEMLER

1. **VPS'te git pull yapılmamış** (en muhtemel)
2. **NextJS build alınmamış**
3. **Nginx API route'larını blokluyor**
4. **PM2/Server restart yapılmamış**

## HIZLI TEST

VPS'te şu komutu çalıştırın:

```bash
curl http://localhost:3000/api/debug
```

Eğer bu çalışıyorsa problem Nginx'te, çalışmıyorsa NextJS'te.
