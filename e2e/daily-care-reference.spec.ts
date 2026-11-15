import { expect, test } from "@playwright/test";

for (const width of [390, 1280]) {
  test(`sleep and diaper logs remain without comparisons at ${width}px`, async ({ page }) => {
    test.skip(!process.env.APP_USERNAME || !process.env.APP_PASSWORD, "Requires local account.");
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto("/login");
    await page.getByLabel("Tên đăng nhập").fill(process.env.APP_USERNAME!);
    await page.getByLabel("Mật khẩu", { exact: true }).fill(process.env.APP_PASSWORD!);
    await page.getByRole("button", { name: "Mở ứng dụng" }).click();
    await expect(page).toHaveURL(/\/$/);
    for (const path of ["/", "/tracking/sleep", "/tracking/diaper", "/statistics?owner=baby"]) {
      await page.goto(path);
      await expect(page.locator("#main-content:visible")).not.toBeEmpty();
      await expect(page.locator("[data-care-reference]")).toHaveCount(0);
      await expect(page.getByText("Đối chiếu ngủ và tã", { exact: true })).toHaveCount(0);
      if (path.includes("/tracking/")) {
        await expect(page.getByRole("heading", { name: "Lịch sử", exact: true })).toBeVisible();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.goto("/");
    await page.getByText("Nhịp sinh hoạt 24 giờ", { exact: true }).filter({ visible: true }).click();
    await expect(page.locator("#daily-summary-title:visible")).toBeVisible();
    await expect(page.getByText("Tham khảo theo tuổi:", { exact: false })).toHaveCount(0);
    await page.screenshot({ path: `test-results/no-care-comparison-${width}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}
