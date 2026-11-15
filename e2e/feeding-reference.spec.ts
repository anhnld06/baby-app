import { expect, test } from "@playwright/test";

for (const width of [390, 1280]) {
  test(`feeding reference and daily statistics at ${width}px`, async ({ page }) => {
    test.skip(!process.env.APP_USERNAME || !process.env.APP_PASSWORD, "Requires local test credentials.");
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto("/login");
    await page.getByLabel("Tên đăng nhập").fill(process.env.APP_USERNAME!);
    await page.getByLabel("Mật khẩu", { exact: true }).fill(process.env.APP_PASSWORD!);
    await page.getByRole("button", { name: "Mở ứng dụng" }).click();
    await expect(page).toHaveURL(/\/$/);
    await page.goto("/tracking/feeding");
    const card = page.locator("[data-feeding-reference]:visible");
    await expect(card.getByRole("heading", { name: "Bú hôm nay" })).toBeVisible();
    await expect(card).toContainText("ml");
    await expect(card).toContainText("Ngày đang diễn ra");
    await page.screenshot({ path: `test-results/feeding-summary-${width}.png`, fullPage: true, caret: "initial" });
    await card.getByRole("link", { name: "Chi tiết →" }).click();
    await expect(page).toHaveURL(/\/statistics\?owner=baby&date=.*#feeding-reference/);
    const detail = page.locator("#feeding-reference:visible");
    await expect(detail).toContainText("Hôm nay đang ghi nhận");
    await detail.getByText("Cách tính & nguồn tham khảo", { exact: true }).click();
    await expect(detail.getByRole("link", { name: "NHS · ml/kg" })).toBeVisible();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit" }).format(yesterday);
    await page.goto(`/statistics?owner=baby&date=${day}#feeding-reference`);
    await expect(detail).toBeVisible();
    await expect(detail).not.toContainText("Hôm nay đang ghi nhận");
    const confirm = detail.getByRole("checkbox");
    if (await confirm.count()) {
      await confirm.check();
      await expect(detail.getByRole("status")).toBeVisible();
      await confirm.uncheck();
      await expect(detail.getByRole("status")).toHaveCount(0);
    }
    await page.screenshot({ path: `test-results/feeding-detail-${width}.png`, fullPage: true, caret: "initial" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goto("/");
    await page.getByText("Nhịp sinh hoạt 24 giờ", { exact: true }).filter({ visible: true }).click();
    await expect(page.locator("[data-feeding-reference]:visible")).toBeVisible();
    expect(errors).toEqual([]);
  });
}
