import { expect, test } from "@playwright/test";

async function login(page: import("@playwright/test").Page) {
  const username = process.env.APP_USERNAME;
  const password = process.env.APP_PASSWORD;
  if (!username || !password) return false;
  await page.goto("/login");
  if (page.url().endsWith("/login")) {
    await page.getByLabel("Tên đăng nhập").fill(username);
    await page.getByLabel("Mật khẩu", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Mở ứng dụng" }).click();
  }
  await expect(page).toHaveURL(/\/(?:profile)?$/);
  return true;
}

test("hiển thị màn hình đăng nhập dễ hiểu", async ({ page }) => {
  await page.goto("/login");

  if (page.url().endsWith("/login")) {
    await expect(page.getByRole("heading", { name: "Vani Family" })).toBeVisible();
    await expect(page.getByLabel("Tên đăng nhập")).toBeVisible();
    await expect(page.getByLabel("Mật khẩu", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Mở ứng dụng" })).toBeVisible();
  } else {
    await expect(page.getByRole("navigation", { name: "Điều hướng chính" }).first()).toBeVisible();
  }
});

test("đăng nhập và mở hồ sơ", async ({ page }) => {
  const username = process.env.APP_USERNAME;
  const password = process.env.APP_PASSWORD;
  test.skip(!username || !password, "Cần APP_USERNAME và APP_PASSWORD để kiểm thử đăng nhập.");

  await page.goto("/login");
  if (page.url().endsWith("/login")) {
    await page.getByLabel("Tên đăng nhập").fill(username!);
    await page.getByLabel("Mật khẩu", { exact: true }).fill(password!);
    await page.getByRole("button", { name: "Mở ứng dụng" }).click();
  }

  await expect(page).toHaveURL(/\/(?:profile)?$/);
  await page
    .getByRole("navigation", { name: "Điều hướng chính" })
    .first()
    .getByRole("link", { name: "Hồ sơ" })
    .click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByRole("main")).toBeVisible();
});

test("báo rõ khi thiết bị mất mạng", async ({ context, page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Hiện mật khẩu" }).click();
  await expect(page.getByRole("button", { name: "Ẩn mật khẩu" })).toBeVisible();
  await context.setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event("offline")));

  await expect(
    page.getByRole("status").filter({ hasText: "Đang ngoại tuyến" }),
  ).toBeVisible();

  await context.setOffline(false);
});

test("mở trang dự phòng khi tải lại trong lúc mất mạng", async ({ context, page }) => {
  await page.goto("/login");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await context.setOffline(true);
  await page.goto("/activity");

  await expect(
    page.getByRole("heading", { name: "Thiết bị đang mất mạng" }),
  ).toBeVisible();
  await context.setOffline(false);
});

test("lưu tạm cữ bú khi mất mạng", async ({ context, page }) => {
  test.skip(!(await login(page)), "Cần thông tin đăng nhập để kiểm thử offline.");
  await page.goto("/profile");
  const setting = page.locator("section").filter({ hasText: "Ghi nhanh khi mất mạng" });
  await setting.getByRole("button", { name: "Bật" }).click();

  await page.goto("/tracking/feeding");
  test.skip(
    (await page.getByRole("button", { name: "Ghi cữ bú" }).count()) === 0,
    "Cần có hồ sơ bé để kiểm thử ghi cữ bú.",
  );
  await page.getByRole("button", { name: "Ghi cữ bú" }).click();
  await context.setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event("offline")));
  await page.getByRole("button", { name: "Lưu" }).click();

  await expect(page.getByText("Đã lưu tạm trên thiết bị")).toBeVisible();
  await expect(page.getByText("1 bản ghi đang chờ đồng bộ")).toBeVisible();
});
