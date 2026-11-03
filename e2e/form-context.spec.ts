import { expect, test, type Page } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });
test.beforeEach(async ({ page }) => {
  test.skip(!process.env.APP_USERNAME || !process.env.APP_PASSWORD, "Cần tài khoản kiểm thử.");
  await page.goto("/login");
  await page.getByLabel("Tên đăng nhập").fill(process.env.APP_USERNAME!);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(process.env.APP_PASSWORD!);
  await page.getByRole("button", { name: "Mở ứng dụng" }).click();
  await expect(page).toHaveURL(/\/$/);
});
const keys = (page: Page, form: string) => page.locator(form).evaluate((element) => [...new FormData(element as HTMLFormElement).keys()]);

// These tests only inspect drafts and FormData; they never submit health records.
test("tã ướt không gửi chi tiết phân, đổi lại giữ bản nháp", async ({ page }) => {
  await page.goto("/tracking/diaper?new=1");
  const type = page.locator('#diaper-form [name="type"]');
  const color = page.locator('[name="stoolColor"]');
  await expect(color).toBeHidden();
  expect(await keys(page, "#diaper-form")).not.toContain("stoolColor");
  await type.selectOption("STOOL");
  await color.fill("Vàng");
  await expect(page.locator('[name="consistency"]')).toBeVisible();
  await type.selectOption("WET");
  for (const field of ["stoolColor", "consistency", "amount"]) expect(await keys(page, "#diaper-form")).not.toContain(field);
  for (const value of ["BOTH", "STOOL"]) {
    await type.selectOption(value);
    await expect(color).toBeVisible();
    await expect(color).toHaveValue("Vàng");
  }
});

test("nơi đăng ký khám chỉ thuộc BHYT của cả mẹ và bé", async ({ page }) => {
  for (const route of ["/mother/insurance", "/baby/insurance"]) {
    await page.goto(route);
    await page.getByRole("button", { name: "Thêm bảo hiểm", exact: true }).click();
    const type = page.locator('[name="insuranceType"]');
    const care = page.locator('[name="registeredCare"]');
    await care.fill("Phòng khám");
    for (const value of ["PRIVATE", "OTHER"]) {
      await type.selectOption(value);
      await expect(care).toBeHidden();
      expect(await keys(page, "#insurance-form")).not.toContain("registeredCare");
    }
    await type.selectOption("BHYT");
    await expect(care).toHaveValue("Phòng khám");
  }
});

test("tư thế đo chỉ hiện khi có chiều dài/chiều cao", async ({ page }) => {
  await page.goto("/tracking/growth?new=1");
  // Some journal pages open the new-record form using their add button.
  if (!(await page.locator('[name="heightCm"]').isVisible())) {
    await page.getByRole("button", { name: /Ghi.*(tăng trưởng|số đo)|Thêm.*(số đo|tăng trưởng)/i }).click();
  }
  const height = page.locator('[name="heightCm"]');
  const position = page.locator('[name="measurementPosition"]');
  await expect(position).toBeHidden();
  await height.fill("55");
  await position.selectOption("RECUMBENT");
  await height.fill("");
  await expect(position).toBeHidden();
  expect(await keys(page, "#growth-form")).not.toContain("measurementPosition");
  await height.fill("56");
  await expect(position).toHaveValue("RECUMBENT");
});

test("hồ sơ và phiếu thai kỳ hiện đúng nhóm trường", async ({ page }) => {
  await page.goto("/profile/pregnancy");
  const status = page.locator('[name="pregnancyStatus"]');
  await status.selectOption("PLANNING");
  await expect(page.locator('#estimatedDueDate')).toBeHidden();
  await expect(page.locator('#actualDeliveryDate')).toBeHidden();
  await status.selectOption("DELIVERED");
  await expect(page.locator('#actualDeliveryDate')).toBeVisible();
  await status.selectOption("PREGNANT");
  expect(await keys(page, "#pregnancy-form")).not.toContain("actualDeliveryDate");
  await page.goto("/mother/pregnancy/checkups");
  await expect(page.getByRole("heading", { name: "Khám & lịch", exact: true })).toBeVisible();
  if (!(await page.locator('[name="visitType"]').isVisible())) {
    const add = page.getByRole("button", { name: "Thêm lần khám mới", exact: true });
    test.skip(await add.count() === 0, "Hồ sơ chưa có thai kỳ để kiểm tra phiếu khám.");
    await add.click();
  }
  const visit = page.locator('[name="visitType"]');
  await visit.selectOption("PRENATAL_VISIT");
  await expect(page.locator('[name="weightKg"]')).toBeVisible();
  await expect(page.locator('[name="crlMm"]')).toBeHidden();
  expect(await keys(page, "#checkup-form")).toContain("crlMm");
  await visit.selectOption("ULTRASOUND");
  await expect(page.locator('[name="weightKg"]')).toBeHidden();
  await expect(page.locator('[name="crlMm"]')).toBeVisible();
  expect(await keys(page, "#checkup-form")).toContain("weightKg");
  await visit.selectOption("COMBINED");
  await expect(page.locator('[name="weightKg"]')).toBeVisible();
  await expect(page.locator('[name="crlMm"]')).toBeVisible();
});
