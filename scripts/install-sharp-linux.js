#!/usr/bin/env node

const { execSync } = require("child_process");
const os = require("os");

console.log("🔧 Checking Sharp installation for deployment...");
console.log(`Platform: ${os.platform()}, Arch: ${os.arch()}`);

try {
  if (os.platform() === "linux") {
    console.log("🐧 Linux detected - Installing Sharp for Linux...");

    // Force install sharp with correct platform
    execSync("npm install --platform=linux --arch=x64 sharp", {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    console.log("✅ Sharp Linux binaries installed successfully");
  } else {
    console.log("🪟 Non-Linux platform - using existing Sharp installation");
  }
} catch (error) {
  console.warn("⚠️ Sharp installation warning:", error.message);
  console.log("📋 Continuing with existing installation...");
}
