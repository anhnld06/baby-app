import { expect, test } from "@playwright/test";

// Run against a separate empty test family; this creates profiles.
test("gia đình mới đi từ thai kỳ đến nhật ký của bé", async ({ page }) => {
  test.skip(process.env.E2E_EMPTY_FAMILY !== "1", "Cần gia đình thử nghiệm riêng, chưa có hồ sơ.");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await page.getByLabel("Tên đăng nhập").fill(process.env.APP_USERNAME!);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(process.env.APP_PASSWORD!);
  await page.getByRole("button", { name: "Mở ứng dụng" }).click();
  await expect(page.getByRole("heading", { name: "Chào mừng gia đình mình" })).toBeVisible();
  await page.getByRole("link", { name: /^Mình đang mang thai/ }).click();
  await page.locator('#mother-form input[name="name"]').fill("Mẹ thử nghiệm");
  await page.getByRole("button", { name: "Lưu", exact: true }).click();
  await expect(page).toHaveURL(/\/profile\/pregnancy$/);
  await expect(page.locator('select[name="pregnancyStatus"]')).toHaveValue("PREGNANT");
  await page.getByRole("button", { name: "Lưu", exact: true }).click();
  await expect(page).toHaveURL(/\/mother\/pregnancy$/);
  await page.getByRole("navigation").getByRole("link", { name: "Hôm nay", exact: true }).last().click();
  await expect(page.getByRole("heading", { name: "Một ngày mới, cùng mẹ" })).toBeVisible();
  await page.getByRole("link", { name: /^Bé đã chào đời/ }).click();
  await page.locator('#baby-form input[name="name"]').fill("Bé thử nghiệm");
  await page.getByLabel("Ngày sinh", { exact: true }).fill("01/10/2026");
  await page.getByRole("button", { name: "Lưu", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Bé thử nghiệm", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ghi cữ bú", exact: true })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath("new-family-mobile.png"), fullPage: true });
});
