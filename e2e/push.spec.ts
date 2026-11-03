import { createHmac, randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "reduce" });
const prisma = new PrismaClient();
let fixtureUser: string | undefined;
test.afterEach(async () => {
  if (fixtureUser) await prisma.user.deleteMany({ where: { id: fixtureUser } });
  fixtureUser = undefined;
});
test.afterAll(async () => prisma.$disconnect());

async function login(page: import("@playwright/test").Page) {
  const username = process.env.APP_USERNAME;
  const password = process.env.APP_PASSWORD;
  if (!username || !password) return false;

  await page.goto("/login");
  if (page.url().endsWith("/login")) {
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('form button[type="submit"]').click();
  }
  await expect(page).toHaveURL(/\/(?:profile)?$/);
  return true;
}

test("bật rồi tắt Web Push trên thiết bị", async ({ context, page, baseURL }) => {
  await context.addInitScript(() => {
    let subscribed = sessionStorage.getItem("e2e-push") === "1";
    const subscription = {
      endpoint: "https://push.example.invalid/e2e-ui",
      toJSON: () => ({
        endpoint: "https://push.example.invalid/e2e-ui",
        keys: { p256dh: "e2e-p256dh", auth: "e2e-auth" },
      }),
      unsubscribe: async () => {
        subscribed = false;
        sessionStorage.removeItem("e2e-push");
        return true;
      },
    };
    const pushManager = {
      getSubscription: async () => (subscribed ? subscription : null),
      subscribe: async () => {
        subscribed = true;
        sessionStorage.setItem("e2e-push", "1");
        return subscription;
      },
    };
    Object.defineProperty(ServiceWorkerRegistration.prototype, "pushManager", {
      configurable: true,
      get: () => pushManager,
    });
    Object.defineProperty(Notification, "requestPermission", {
      configurable: true,
      value: async () => "granted",
    });
  });
  await context.grantPermissions(["notifications"], {
    origin: process.env.E2E_BASE_URL ?? "http://localhost:3101",
  });
  if (process.env.E2E_TEST_USERNAME && process.env.APP_PASSWORD) {
    expect(process.env.E2E_TEST_USERNAME).toMatch(/^e2e-pregnancy-/);
    const user = await prisma.user.create({ data: {
      username: process.env.E2E_TEST_USERNAME, name: "Push fixture", timezone: "Asia/Ho_Chi_Minh",
      babies: { create: { name: "Bé thử nghiệm", dateOfBirth: new Date("2026-11-01") } },
      mother: { create: { name: "Mẹ thử nghiệm", pregnancies: { create: { pregnancyStatus: "PREGNANT", estimatedDueDate: new Date(Date.now() + 140 * 86400000) } } } },
    } });
    fixtureUser = user.id;
    const token = randomBytes(32).toString("hex");
    await prisma.session.create({ data: { userId: user.id, tokenHash: createHmac("sha256", process.env.APP_PASSWORD).update(token).digest("hex"), expiresAt: new Date(Date.now() + 3600000) } });
    await context.addCookies([{ name: "mam_session", value: token, url: baseURL!, httpOnly: true, sameSite: "Lax" }]);
  } else {
    test.skip(!(await login(page)), "Cần thông tin đăng nhập để kiểm thử Web Push.");
  }
  await page.route("**/api/push/subscription", route => route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/profile");

  const settings = page.locator("section").filter({
    has: page.getByText("Nhắc lịch trên thiết bị", { exact: true }),
  });
  const button = settings.getByRole("button");
  await expect(button).toBeEnabled();
  await button.click();
  await expect(settings.getByRole("status")).toHaveText(
    "Đã bật nhắc lịch trên thiết bị này.",
  );
  await expect(button).toHaveText("Tắt");

  for (const path of ["/tracking/medication", "/mother/pregnancy"]) {
    await page.goto(path);
    await expect(page.getByRole("button", { name: "Tắt", exact: true })).toBeVisible();
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: test.info().outputPath(`${path.includes("medication") ? "medication" : "pregnancy"}-push-${width}.png`) });
    }
  }
  await page.goto("/profile");
  await button.click();
  await expect(settings.getByRole("status")).toHaveText(
    "Đã tắt nhắc lịch trên thiết bị này.",
  );
  await expect(button).toHaveText("Bật");
  await page.goto("/tracking/medication");
  await expect(page.getByRole("button", { name: "Bật", exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test("API Web Push chặn truy cập chưa đăng nhập", async ({ request }) => {
  const getResponse = await request.get("/api/push/subscription");
  const postResponse = await request.post("/api/push/subscription", {
    data: {
      endpoint: "https://push.example.invalid/e2e",
      keys: { p256dh: "e2e", auth: "e2e" },
    },
  });

  expect(getResponse.status()).toBe(401);
  expect(postResponse.status()).toBe(401);
});
