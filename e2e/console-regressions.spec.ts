import { expect, test } from "@playwright/test";

test("điều hướng và hộp thư không phát sinh lỗi React trong console", async ({ page }) => {
  test.skip(!process.env.APP_USERNAME || !process.env.APP_PASSWORD, "Cần tài khoản của môi trường kiểm thử.");
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/login");
  await page.getByLabel("Tên đăng nhập").fill(process.env.APP_USERNAME!);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(process.env.APP_PASSWORD!);
  await page.getByRole("button", { name: "Mở ứng dụng" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/baby");
  const mailbox = page.locator('main a[href="/baby/mailbox"]');
  test.skip(await mailbox.count() === 0, "Cần hồ sơ bé trong dữ liệu thử nghiệm.");
  await mailbox.click();
  await expect(page).toHaveURL(/\/baby\/mailbox$/);
  await expect(page.getByRole("heading", { name: "Hộp thư cho bé", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Quay lại", exact: true }).click();
  await expect(page).toHaveURL(/\/baby$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/baby\/mailbox$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/baby$/);
  await page.locator('main a[href="/tracking/medication"]').click();
  await expect(page.getByRole("heading", { name: "Thuốc & bổ sung", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Quay lại", exact: true }).click();
  await expect(page).toHaveURL(/\/baby$/);
  expect(errors).toEqual([]);
});
