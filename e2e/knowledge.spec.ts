import { expect, test } from "@playwright/test";
test.use({ viewport: { width: 390, height: 844 } });
test("knowledge filters update immediately and paginated results survive article Back", async ({
  page,
}) => {
  test.skip(
    !process.env.APP_USERNAME || !process.env.APP_PASSWORD,
    "Cần tài khoản kiểm thử.",
  );
  await page.goto("/login");
  await page.getByLabel("Tên đăng nhập").fill(process.env.APP_USERNAME!);
  await page
    .getByLabel("Mật khẩu", { exact: true })
    .fill(process.env.APP_PASSWORD!);
  await page.getByRole("button", { name: "Mở ứng dụng" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/knowledge");
  await page.getByRole("button", { name: "Tất cả", exact: true }).click();
  await expect(page).toHaveURL(/stage=ALL/);
  await expect(page.locator("[data-knowledge-article]")).toHaveCount(24);
  await page.getByRole("button", { name: "Trang sau", exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(
    page.getByRole("navigation", { name: "Trang cẩm nang" }),
  ).toContainText("2/");
  const article = page.locator("[data-knowledge-article]").first();
  await article.click();
  await page.getByRole("link", { name: "Quay lại", exact: true }).click();
  await expect(page).toHaveURL(/stage=ALL.*page=2/);
  await expect(
    page.getByRole("navigation", { name: "Trang cẩm nang" }),
  ).toContainText("2/");
  const searchResponse = page.waitForResponse(response => { const url=new URL(response.url()); return url.pathname === "/api/knowledge" && url.searchParams.get("q") === "du sua" && response.status() === 200; });
  await page.getByLabel("Tìm trong sổ tay").fill("du sua");
  await searchResponse;
  await expect(page).not.toHaveURL(/page=2/);
  await expect(page.locator("[data-knowledge-article]").first()).toBeVisible();
  await expect(page.getByText("Đang tải bài viết…")).toHaveCount(0);
});
