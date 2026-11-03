import { defineConfig, devices } from "@playwright/test";

const liveBaseURL = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  timeout: liveBaseURL ? 90_000 : 30_000,
  expect: { timeout: liveBaseURL ? 30_000 : 5_000 },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: liveBaseURL ?? "http://localhost:3101",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chrome",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],
  webServer: liveBaseURL ? undefined : {
    command: "npm run start -- --port 3101",
    url: "http://localhost:3101/login",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
