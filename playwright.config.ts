import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;
const TEST_DB = "data/test.db";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  globalSetup: "./tests/global-setup.ts",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run start",
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: false,
    env: {
      DB_PATH: TEST_DB,
      PORT: String(PORT),
      NEXT_PUBLIC_SITE_URL: BASE_URL,
      STRIPE_SECRET_KEY: "",
      APP_SECRET: "test-secret-0123456789abcdef",
      ADMIN_EMAIL: "admin@dreamshappenltd.com",
      ADMIN_PASSWORD: "changeme",
    },
  },
});
