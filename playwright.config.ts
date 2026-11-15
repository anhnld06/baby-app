import { defineConfig, devices } from "@playwright/test";

const liveBaseURL = process.env.E2E_BASE_URL;
const ci = Boolean(process.env.CI);

// Locally the suite drives the installed Google Chrome. CI runners use the
// Chromium bundled with Playwright (`npx playwright install chromium`), so the
// channel is dropped there. E2E_BROWSER_CHANNEL overrides either default
// (set it to an empty string to force the bundled Chromium locally).
const channel =
  process.env.E2E_BROWSER_CHANNEL !== undefined
    ? process.env.E2E_BROWSER_CHANNEL || undefined
    : ci
      ? undefined
      : "chrome";

export default defineConfig({
  testDir: "./e2e",
  timeout: liveBaseURL ? 90_000 : 30_000,
  expect: { timeout: liveBaseURL ? 30_000 : 5_000 },
  fullyParallel: false,
  forbidOnly: ci,
  retries: ci ? 2 : 0,
  // Specs share one family account and create/delete records; run them one at
  // a time in CI so projects and files cannot race on the same rows.
  workers: ci ? 1 : undefined,
  reporter: ci ? [["github"], ["html", { open: "never" }]] : "html",
  use: {
    baseURL: liveBaseURL ?? "http://localhost:3101",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chrome",
      use: { ...devices["Desktop Chrome"], channel },
    },
    {
      // Real mobile emulation (touch, isMobile, DPR) on viewport-agnostic specs.
      // Other specs already pin a phone viewport themselves or are desktop-only.
      name: "mobile-chrome",
      testMatch: ["smoke.spec.ts", "navigation.spec.ts", "a11y.spec.ts"],
      use: { ...devices["Pixel 7"], channel },
    },
  ],
  webServer: liveBaseURL ? undefined : {
    command: "npm run start -- --port 3101",
    url: "http://localhost:3101/login",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
