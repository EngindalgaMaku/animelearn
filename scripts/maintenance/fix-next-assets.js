#!/usr/bin/env node

const fs = require("fs");
const { execSync } = require("child_process");

console.log("🔧 Next.js Asset Loading Fix Script");
console.log("=====================================");

// 1. Skip process killing for safety
console.log("1. Processes kontrol ediliyor...");
console.log("ℹ️  Manual olarak Ctrl+C ile durdurun");

// 2. Clean Next.js cache
console.log("\n2. Next.js cache temizleniyor...");
try {
  if (fs.existsSync(".next")) {
    fs.rmSync(".next", { recursive: true, force: true });
    console.log("✅ .next directory removed");
  }
} catch (error) {
  console.log("❌ .next removal error:", error.message);
}

// 3. Clean node modules cache
console.log("\n3. Node modules cache temizleniyor...");
try {
  if (fs.existsSync("node_modules/.cache")) {
    fs.rmSync("node_modules/.cache", { recursive: true, force: true });
    console.log("✅ node_modules/.cache removed");
  }
} catch (error) {
  console.log("❌ node_modules cache error:", error.message);
}

// 4. Clean package-lock and reinstall if needed
console.log("\n4. Package integrity kontrol ediliyor...");
try {
  // Force npm cache clean
  execSync("npm cache clean --force", { stdio: "inherit" });
  console.log("✅ NPM cache cleaned");
} catch (error) {
  console.log("⚠️  NPM cache clean warning:", error.message);
}

// 5. Create .next directory structure
console.log("\n5. Next.js directory yapısı oluşturuluyor...");
try {
  if (!fs.existsSync(".next")) {
    fs.mkdirSync(".next");
    fs.mkdirSync(".next/static", { recursive: true });
    fs.mkdirSync(".next/cache", { recursive: true });
    console.log("✅ .next directory structure created");
  }
} catch (error) {
  console.log("❌ Directory creation error:", error.message);
}

// 6. Check port availability
console.log("\n6. Port 3000 kontrol ediliyor...");
try {
  if (process.platform === "win32") {
    execSync("netstat -ano | findstr :3000", { stdio: "ignore" });
    console.log("⚠️  Port 3000 is in use, clearing...");
    execSync(
      "for /f \"tokens=5\" %a in ('netstat -ano ^| findstr :3000') do taskkill /f /pid %a",
      { stdio: "ignore" }
    );
  } else {
    execSync("lsof -ti:3000 | xargs kill -9", { stdio: "ignore" });
  }
  console.log("✅ Port 3000 cleared");
} catch (error) {
  console.log("ℹ️  Port 3000 is free");
}

console.log("\n🎉 Asset loading fix tamamlandı!");
console.log("\n📋 Sonraki adımlar:");
console.log("1. npm run dev");
console.log("2. http://localhost:3000 adresini açın");
console.log("3. Hard refresh yapın (Ctrl+Shift+R)");
console.log("4. Assets düzgün yüklenmelidir");
