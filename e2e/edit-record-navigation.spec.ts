import { expect, test, type Page } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
test.beforeEach(async ({ page }) => {
  test.skip(!process.env.APP_USERNAME || !process.env.APP_PASSWORD, "Cần tài khoản kiểm thử.");
  await page.goto("/login");
  await page.getByLabel("Tên đăng nhập").fill(process.env.APP_USERNAME!);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(process.env.APP_PASSWORD!);
  await page.getByRole("button", { name: "Mở ứng dụng" }).click();
  await expect(page).toHaveURL(/\/$/);
});

async function expectEditTarget(page: Page, href: string) {
  const url = new URL(href, "https://example.test");
  const id = url.searchParams.get("edit") ?? url.searchParams.get("record") ?? url.searchParams.get("position");
  const target = page.locator("#record-edit-form");
  await expect(target).toHaveAttribute("data-edit-record", id!);
  await expect(target).toBeFocused();
  await expect.poll(async () => target.evaluate((element) => {
    const top = element.getBoundingClientRect().top;
    return top >= 0 && top < innerHeight / 2;
  })).toBe(true);
}

const routes = [
  "/tracking/feeding", "/tracking/sleep", "/tracking/diaper", "/tracking/growth", "/tracking/prescription",
  "/mother/pumping", "/mother/pregnancy/checkups", "/mother/cycle",
  "/baby/medical", "/mother/medical", "/baby/insurance", "/mother/insurance",
  "/vaccination-schedule?owner=baby", "/vaccination-schedule?owner=mother",
];
for (const route of routes) {
  test(`Sửa mở đúng bản ghi và cuộn đến form: ${route}`, async ({ page }) => {
    await page.goto(route);
    const selector = route.startsWith("/vaccination-schedule")
      ? 'article[data-vaccination] a[href*="record="],article[data-vaccination] a[href*="edit="],article[data-appointment] a[href*="edit="]'
      : 'a[href*="?edit="]';
    const links = page.locator(selector);
    test.skip(await links.count() === 0, "Chưa có bản ghi ở mục này để kiểm tra sửa; không tạo dữ liệu sức khỏe thử.");
    const hrefs = [...new Set(await links.evaluateAll((elements) => elements.map((element) => element.getAttribute("href")!)))].slice(0, 2);
    await links.first().click();
    await expectEditTarget(page, hrefs[0]);
    const notes = page.locator('#record-edit-form input[name="vaccineName"]:visible, #record-edit-form textarea[name="notes"]:visible').first();
    if (hrefs.length > 1) {
      // Switching records must discard the unsaved draft from the previous one.
      if (await notes.count()) await notes.fill("Unsaved navigation test draft");
      await page.locator(`a[href="${hrefs[1]}"]`).first().click();
      await expectEditTarget(page, hrefs[1]);
      if (await notes.count()) await expect(notes).not.toHaveValue("Unsaved navigation test draft");
    }
    // Clicking the current record again should scroll even without a URL change.
    const current = hrefs[hrefs.length - 1];
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await page.locator(`a[href="${current}"]`).first().click();
    await expectEditTarget(page, current);
  });
}

test("chọn răng đưa đến đúng form và đặt lại bản nháp", async ({ page }) => {
  await page.goto("/tracking/teeth");
  const links = page.locator('a[href*="?position="]');
  test.skip(await links.count() < 2, "Cần hồ sơ bé để hiện sơ đồ răng.");
  const first = (await links.nth(0).getAttribute("href"))!;
  const second = (await links.nth(1).getAttribute("href"))!;
  await links.nth(0).click();
  await expectEditTarget(page, first);
  await page.locator('#tooth-form [name="notes"]').fill("Unsaved tooth draft");
  await page.locator(`a[href="${second}"]`).click();
  await expectEditTarget(page, second);
  await expect(page.locator('#tooth-form [name="notes"]')).not.toHaveValue("Unsaved tooth draft");
});
