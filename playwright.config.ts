import { defineConfig, devices } from "@playwright/test";

const port = 3000;

export default defineConfig({
  testDir: "tests",
  retries: process.env.CI ? 1 : 0,
  timeout: 30_000,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: process.env.CI ? "on-first-retry" : "retain-on-failure",
  },
  webServer: {
    command: process.env.CI ? `npx next start -p ${port}` : `npx next dev -p ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});

