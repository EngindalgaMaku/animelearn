#!/usr/bin/env node

const fs = require("fs");
const { execSync } = require("child_process");

console.log("🚀 ULTIMATE Next.js Fix - Tüm Sorunları Çözer");
console.log("================================================");

// 1. Tüm cache ve build dosyalarını sil
console.log("1. Tüm cache dosyaları temizleniyor...");
try {
  const dirsToRemove = [".next", "node_modules/.cache", ".turbo"];

  dirsToRemove.forEach((dir) => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`✅ ${dir} silindi`);
    }
  });
} catch (error) {
  console.log("⚠️ Silme hatası:", error.message);
}

// 2. NPM cache clean
console.log("\n2. NPM cache temizleniyor...");
try {
  execSync("npm cache clean --force", { stdio: "inherit" });
  console.log("✅ NPM cache temizlendi");
} catch (error) {
  console.log("⚠️ NPM cache hatası:", error.message);
}

// 3. Next.js build fix
console.log("\n3. Next.js build sistemi sıfırlanıyor...");
try {
  // Force regenerate package-lock
  if (fs.existsSync("package-lock.json")) {
    fs.unlinkSync("package-lock.json");
    console.log("✅ package-lock.json silindi");
  }

  // Reinstall dependencies
  console.log("Dependencies yeniden kuruluyor...");
  execSync("npm install", { stdio: "inherit" });
  console.log("✅ Dependencies yeniden kuruldu");
} catch (error) {
  console.log("⚠️ Dependency hatası:", error.message);
}

// 4. Create clean .next structure
console.log("\n4. Temiz .next yapısı oluşturuluyor...");
try {
  fs.mkdirSync(".next", { recursive: true });
  fs.mkdirSync(".next/static", { recursive: true });
  fs.mkdirSync(".next/cache", { recursive: true });
  console.log("✅ .next yapısı oluşturuldu");
} catch (error) {
  console.log("⚠️ .next yapısı hatası:", error.message);
}

console.log("\n🎉 Ultimate fix tamamlandı!");
console.log("\n📋 ŞİMDİ TEST ET:");
console.log("1. npm run dev");
console.log("2. localhost:3000 aç");
console.log("3. Console'da hata kontrolü yap");
console.log("4. Eğer hala sorun varsa Ctrl+Shift+R yap");
