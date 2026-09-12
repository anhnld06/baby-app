import { expect, test } from "@playwright/test";

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

test("bật rồi tắt Web Push trên thiết bị", async ({ context, page }) => {
  await context.addInitScript(() => {
    let subscribed = false;
    const subscription = {
      endpoint: "https://push.example.invalid/e2e-ui",
      toJSON: () => ({
        endpoint: "https://push.example.invalid/e2e-ui",
        keys: { p256dh: "e2e-p256dh", auth: "e2e-auth" },
      }),
      unsubscribe: async () => {
        subscribed = false;
        return true;
      },
    };
    const pushManager = {
      getSubscription: async () => (subscribed ? subscription : null),
      subscribe: async () => {
        subscribed = true;
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
    origin: "http://localhost:3101",
  });
  test.skip(!(await login(page)), "Cần thông tin đăng nhập để kiểm thử Web Push.");
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

  await button.click();
  await expect(settings.getByRole("status")).toHaveText(
    "Đã tắt nhắc lịch trên thiết bị này.",
  );
  await expect(button).toHaveText("Bật");
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
