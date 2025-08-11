#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔧 CSS Cache Fix Script - Next.js & Tailwind Optimizasyonu");
console.log("===========================================================");

// 1. Next.js cache temizleme
console.log("1. Next.js cache temizleniyor...");
try {
  if (fs.existsSync(".next")) {
    fs.rmSync(".next", { recursive: true, force: true });
    console.log("✅ .next directory temizlendi");
  } else {
    console.log("ℹ️  .next directory zaten yok");
  }
} catch (error) {
  console.log("❌ .next temizlenirken hata:", error.message);
}

// 2. Node modules cache temizleme
console.log("\n2. Node modules cache temizleniyor...");
try {
  if (fs.existsSync("node_modules/.cache")) {
    fs.rmSync("node_modules/.cache", { recursive: true, force: true });
    console.log("✅ node_modules/.cache temizlendi");
  } else {
    console.log("ℹ️  node_modules/.cache zaten yok");
  }
} catch (error) {
  console.log("❌ node_modules/.cache temizlenirken hata:", error.message);
}

// 3. Tailwind cache temizleme
console.log("\n3. Tailwind cache temizleniyor...");
try {
  if (fs.existsSync(".tailwindcss-cache")) {
    fs.rmSync(".tailwindcss-cache", { recursive: true, force: true });
    console.log("✅ Tailwind cache temizlendi");
  } else {
    console.log("ℹ️  Tailwind cache zaten yok");
  }
} catch (error) {
  console.log("❌ Tailwind cache temizlenirken hata:", error.message);
}

console.log("\n🎉 Cache temizleme tamamlandı!");
console.log("\n📋 Sonraki adımlar:");
console.log("1. npm run dev");
console.log("2. Tarayıcıyı hard refresh yapın (Ctrl+Shift+R veya Cmd+Shift+R)");
console.log(
  "3. Sorun devam ederse tarayıcı geliştirici araçlarından cache temizleyin"
);
