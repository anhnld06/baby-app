import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Read-only accessibility audit: these tests only log in, open pages and run
// axe. They must never click save/tick/delete or otherwise change data.

test.use({ reducedMotion: "reduce" });

const WCAG_TAGS = ["wcag2a", "wcag2aa"];
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

const APP_PAGES = [
  "/",
  "/baby",
  "/mother",
  "/knowledge",
  "/profile",
  "/tracking/feeding",
];

async function login(page: Page) {
  test.skip(
    !process.env.APP_USERNAME || !process.env.APP_PASSWORD,
    "Cần APP_USERNAME và APP_PASSWORD để kiểm tra trợ năng sau đăng nhập.",
  );
  await page.goto("/login");
  if (page.url().endsWith("/login")) {
    await page.getByLabel("Tên đăng nhập").fill(process.env.APP_USERNAME!);
    await page
      .getByLabel("Mật khẩu", { exact: true })
      .fill(process.env.APP_PASSWORD!);
    await page.getByRole("button", { name: "Mở ứng dụng" }).click();
  }
  await expect(page).toHaveURL(/\/(?:profile)?$/);
}

async function expectNoBlockingViolations(page: Page, name: string) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  await test.info().attach(`axe-${name}.json`, {
    body: JSON.stringify(results.violations, null, 2),
    contentType: "application/json",
  });
  const blocking = results.violations
    .filter((violation) => BLOCKING_IMPACTS.has(violation.impact ?? ""))
    .map((violation) => ({
      rule: violation.id,
      impact: violation.impact,
      help: violation.help,
      targets: violation.nodes.slice(0, 5).map((node) => node.target.join(" ")),
      count: violation.nodes.length,
    }));
  expect(blocking, `Vi phạm trợ năng nghiêm trọng trên ${name}`).toEqual([]);
}

test("trang đăng nhập không có vi phạm trợ năng nghiêm trọng", async ({
  page,
}) => {
  await page.goto("/login");
  test.skip(!page.url().endsWith("/login"), "Phiên đã đăng nhập sẵn.");
  await expect(page.getByRole("heading", { name: "Vani Family" })).toBeVisible();
  await expectNoBlockingViolations(page, "/login");
});

for (const route of APP_PAGES) {
  test(`${route} không có vi phạm trợ năng nghiêm trọng`, async ({ page }) => {
    await login(page);
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    await page.waitForLoadState("load");
    await expectNoBlockingViolations(page, route);
  });
}
