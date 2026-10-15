import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./test/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, args: ["--no-sandbox", "--disable-dev-shm-usage", "--no-zygote"] } : {}, baseURL: "http://localhost:3000", trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    { command: "node test/fixtures/api.mjs", url: "http://127.0.0.1:4010/api/v1/bio-pages", reuseExistingServer: false },
    { command: "npm run start -- --hostname 0.0.0.0", url: "http://localhost:3000/login", timeout: 120000, reuseExistingServer: false,
      env: { API_BASE_URL: "http://127.0.0.1:4010/api/v1", APP_HOSTS: "localhost,127.0.0.1" } },
  ],
});
