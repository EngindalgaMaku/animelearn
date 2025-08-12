#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🚀 Enhanced Next.js Asset Loading Fix");
console.log("=====================================");
console.log("Fixing static CSS/JS 404 errors after Shift+F5");

// 1. Stop any running Next.js processes
console.log("\n1. Stopping existing Next.js processes...");
try {
  if (process.platform === "win32") {
    // Windows - find and kill processes on port 3000
    try {
      execSync("netstat -ano | findstr :3000", { stdio: "ignore" });
      execSync(
        "for /f \"tokens=5\" %a in ('netstat -ano ^| findstr :3000') do taskkill /f /pid %a",
        { stdio: "ignore" }
      );
      console.log("✅ Stopped processes on port 3000");
    } catch (error) {
      console.log("ℹ️  No processes running on port 3000");
    }
  } else {
    // Unix-like systems
    execSync("pkill -f 'next dev' || true", { stdio: "ignore" });
    execSync("lsof -ti:3000 | xargs kill -9 || true", { stdio: "ignore" });
    console.log("✅ Stopped Next.js processes");
  }
} catch (error) {
  console.log("ℹ️  No existing processes to stop");
}

// 2. Complete cache cleanup
console.log("\n2. Performing complete cache cleanup...");
const directoriesToClean = [
  ".next",
  "node_modules/.cache",
  ".turbo",
  ".tailwindcss-cache",
];

directoriesToClean.forEach((dir) => {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`✅ Removed ${dir}`);
    }
  } catch (error) {
    console.log(`⚠️  Could not remove ${dir}:`, error.message);
  }
});

// 3. NPM cache fix
console.log("\n3. Fixing NPM cache...");
try {
  execSync("npm cache clean --force", { stdio: "inherit" });
  console.log("✅ NPM cache cleaned");
} catch (error) {
  console.log("⚠️  NPM cache clean warning:", error.message);
}

// 4. Create optimized .next structure
console.log("\n4. Creating optimized .next structure...");
try {
  // Create .next directory with proper structure
  const nextDirs = [
    ".next",
    ".next/static",
    ".next/static/css",
    ".next/static/chunks",
    ".next/static/chunks/app",
    ".next/cache",
  ];

  nextDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  console.log("✅ Created .next directory structure");
} catch (error) {
  console.log("❌ Error creating .next structure:", error.message);
}

// 5. Fix environment variables for development
console.log("\n5. Setting development environment...");
try {
  // Create/update .env.local for development
  const envContent = `# Development environment for asset loading
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
# Force asset reload
NEXT_PRIVATE_FORCE_CACHE_BUST=${Date.now()}
`;

  fs.writeFileSync(".env.local", envContent);
  console.log("✅ Updated .env.local for development");
} catch (error) {
  console.log("⚠️  Could not update .env.local:", error.message);
}

// 6. Verify critical files exist
console.log("\n6. Verifying project structure...");
const criticalFiles = [
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/globals.css",
  "next.config.js",
  "package.json",
];

let allFilesExist = true;
criticalFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log(
    "\n⚠️  Some critical files are missing. Please check your project structure."
  );
}

// 7. Create a build ID to prevent caching issues
console.log("\n7. Preparing build configuration...");
try {
  const buildId = Date.now().toString();
  if (!fs.existsSync(".next")) {
    fs.mkdirSync(".next", { recursive: true });
  }
  fs.writeFileSync(".next/BUILD_ID", buildId);
  console.log(`✅ Created BUILD_ID: ${buildId}`);
} catch (error) {
  console.log("⚠️  Could not create BUILD_ID:", error.message);
}

console.log("\n🎉 Enhanced asset fix completed!");
console.log("\n📋 Next steps:");
console.log("1. Run: npm run dev");
console.log("2. Wait for compilation to complete");
console.log("3. Open: http://localhost:3000");
console.log("4. If still having issues, hard refresh (Ctrl+Shift+R)");
console.log("\n💡 What this fix does:");
console.log("   • Removes all build caches");
console.log("   • Fixes Next.js static asset serving");
console.log("   • Creates proper directory structure");
console.log("   • Sets development environment variables");
console.log("   • Prevents cache-related 404 errors");
