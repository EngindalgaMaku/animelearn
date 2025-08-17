import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  use: {
    baseURL:
      process.env.BASE_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000",
    trace: "on-first-retry",
  },
  reporter: [["list"], ["html", { open: "never" }]],
  globalSetup: "tests/global-setup.ts",
  projects: [
    { name: "unauth" },
    {
      name: "auth",
      use: {
        storageState: "tests/.auth/user.json",
      },
    },
  ],
  webServer: {
    command: process.env.PLAYWRIGHT_WEB_SERVER_CMD || "npm run dev",
    port: Number(process.env.PORT || 3000),
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
