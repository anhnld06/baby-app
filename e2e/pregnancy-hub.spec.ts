import { expect, test, type Page } from "@playwright/test";

const browserErrors = new WeakMap<Page, string[]>();

test.afterEach(async ({ page }) => {
  expect(browserErrors.get(page) ?? []).toEqual([]);
});

test.use({ viewport: { width: 390, height: 844 } });
test.beforeEach(async ({ page }) => {
  test.skip(!process.env.APP_USERNAME || !process.env.APP_PASSWORD, "Cần tài khoản kiểm thử.");
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/login");
  await page.getByLabel("Tên đăng nhập").fill(process.env.APP_USERNAME!);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(process.env.APP_PASSWORD!);
  await page.getByRole("button", { name: "Mở ứng dụng" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("thai kỳ có tổng quan và bốn khu vực con trên điện thoại", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/mother/pregnancy");
  test.skip(await page.getByRole("link", { name: "Thêm thai kỳ", exact: true }).count() > 0, "Cần hồ sơ thai kỳ.");
  await expect(page.getByRole("heading", { name: "Thai kỳ", exact: true })).toBeVisible();
  for (const [section, heading] of [["baby", "Em bé trong bụng mẹ"], ["health", "Sức khỏe mẹ"], ["checkups", "Khám & lịch"], ["memories", "Kỷ niệm thai kỳ"]]) {
    const topbar = page.getByRole("navigation", { name: "Các mục thai kỳ" });
    await topbar.locator(`a[href="/mother/pregnancy/${section}"]`).click();
    await expect(topbar.locator(`a[href="/mother/pregnancy/${section}"]`)).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await topbar.getByRole("link", { name: "Tổng quan", exact: true }).click();
    await expect(page).toHaveURL(/\/mother\/pregnancy$/);
    await expect(topbar.getByRole("link", { name: "Tổng quan", exact: true })).toHaveAttribute("aria-current", "page");
  }
  await page.screenshot({ path: test.info().outputPath("pregnancy-overview-mobile.png"), fullPage: true });
  expect(errors).toEqual([]);
});

for (const section of ["health", "memories"]) {
  test(`${section}: lưu, sửa và xóa ghi chép riêng của thai kỳ`, async ({ page }) => {
    const prefix = `E2E-${section}-${Date.now()}`;
    const path = section === "health" ? "health/journal" : section;
    await page.goto(`/mother/pregnancy/${path}?new=1`);
    test.skip(await page.getByRole("link", { name: "Thêm thai kỳ", exact: true }).count() > 0, "Cần hồ sơ thai kỳ.");
    const title = page.locator('input[name="title"]');
    const content = page.locator('textarea[name="journalBody"]');
    try {
      await title.fill(prefix);
      await content.fill("Ghi chép kiểm thử, sẽ được xóa sau khi kiểm tra.");
      await page.getByRole("button", { name: section === "health" ? "Lưu nhật ký" : "Lưu kỷ niệm", exact: true }).click();
      let article = page.getByRole("article").filter({ has: page.getByRole("heading", { name: prefix, exact: true }) });
      await expect(article).toBeVisible();
      await page.reload();
      await expect(article).toBeVisible();
      await article.getByRole("link", { name: "Sửa ghi chép", exact: true }).click();
      await expect(title).toHaveValue(prefix);
      await title.fill(`${prefix}-updated`);
      await page.getByRole("button", { name: "Cập nhật", exact: true }).click();
      article = page.getByRole("article").filter({ has: page.getByRole("heading", { name: `${prefix}-updated`, exact: true }) });
      await expect(article).toBeVisible();
    } finally {
      await page.goto(`/mother/pregnancy/${path}`);
      const record = page.getByRole("article").filter({ hasText: prefix });
      if (await record.count()) {
        page.once("dialog", (dialog) => dialog.accept());
        await record.getByRole("button", { name: "Xóa ghi chép", exact: true }).click();
        await expect(record).toHaveCount(0);
      }
    }
  });
}
