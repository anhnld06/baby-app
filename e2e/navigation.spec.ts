import { expect, test, type Page } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

async function login(page: Page) {
  test.skip(!process.env.APP_USERNAME || !process.env.APP_PASSWORD, "Cần tài khoản của môi trường kiểm thử.");
  await page.goto("/login");
  await page.getByLabel("Tên đăng nhập").fill(process.env.APP_USERNAME!);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(process.env.APP_PASSWORD!);
  await page.getByRole("button", { name: "Mở ứng dụng" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("main h1")).toBeVisible();
}

test("truy cập trực tiếp có đường quay về cố định", async ({ page }) => {
  await login(page);
  await page.goto("/tracking/feeding");
  await page.getByRole("link", { name: "Quay lại", exact: true }).click();
  await expect(page).toHaveURL(/\/baby$/);
});

test("quay về đúng nơi mở và hỗ trợ Back/Forward của trình duyệt", async ({ page }) => {
  await login(page);
  await page.goto("/baby");
  await expect(page.locator("main h1")).toBeVisible();
  const feeding = page.getByRole("link", { name: /^Bú và ăn/ });
  test.skip(await feeding.count() === 0, "Cần hồ sơ bé trong dữ liệu thử nghiệm.");
  await feeding.click();
  await expect(page).toHaveURL(/\/tracking\/feeding$/);
  await page.getByRole("link", { name: "Quay lại", exact: true }).click();
  await expect(page).toHaveURL(/\/baby$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/tracking\/feeding$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/baby$/);
});

test("ghi nhanh từ trang chủ mở sẵn biểu mẫu và quay về trang chủ", async ({ page }) => {
  await login(page);
  const quickAdd = page.getByRole("link", { name: "Ghi cữ bú", exact: true });
  test.skip(await quickAdd.count() === 0, "Cần hồ sơ bé trong dữ liệu thử nghiệm.");
  await quickAdd.click();
  await expect(page).toHaveURL(/\/tracking\/feeding\?new=1$/);
  await expect(page.locator("#feeding-form")).toBeVisible();
  await page.getByRole("link", { name: "Quay lại", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("thoát chỉnh sửa không tạo vòng lặp trong lịch sử", async ({ page }) => {
  await login(page);
  await page.goto("/baby");
  await expect(page.locator("main h1")).toBeVisible();
  const feeding = page.getByRole("link", { name: /^Bú và ăn/ });
  test.skip(await feeding.count() === 0, "Cần hồ sơ bé trong dữ liệu thử nghiệm.");
  await feeding.click();
  const edit = page.getByRole("link", { name: "Sửa", exact: true }).first();
  await expect(page.getByRole("heading", { name: "Ghi cữ bú", exact: true })).toBeVisible();
  test.skip(await edit.count() === 0, "Cần có bản ghi bú để kiểm thử chỉnh sửa.");
  await edit.click();
  await expect(page).toHaveURL(/\?edit=/);
  await page.getByRole("link", { name: "Quay lại", exact: true }).click();
  await expect(page).toHaveURL(/\/tracking\/feeding$/);
  await page.getByRole("link", { name: "Quay lại", exact: true }).click();
  await expect(page).toHaveURL(/\/baby$/);
});

test("giữ tìm kiếm và giai đoạn khi quay lại từ bài viết", async ({ page }) => {
  await login(page);
  await page.goto("/knowledge");
  await page.getByRole("button", { name: "Mang thai", exact: true }).click();
  await page.getByRole("textbox", { name: "Tìm trong sổ tay" }).fill("thai");
  await expect(page).toHaveURL(/stage=PREGNANCY.*q=thai/);
  const article = page.locator('a[href^="/knowledge/"]').first();
  test.skip(await article.count() === 0, "Cần nạp cẩm nang trong dữ liệu thử nghiệm.");
  await article.click();
  await page.getByRole("link", { name: "Quay lại", exact: true }).click();
  await expect(page).toHaveURL(/stage=PREGNANCY.*q=thai/);
  await expect(page.getByRole("textbox", { name: "Tìm trong sổ tay" })).toHaveValue("thai");
});

test("lưu cữ bú, đóng biểu mẫu và quay về đúng nơi mở", async ({ page }) => {
  await login(page);
  await page.goto("/baby");
  await expect(page.locator("main h1")).toBeVisible();
  const feeding = page.getByRole("link", { name: /^Bú và ăn/ });
  test.skip(await feeding.count() === 0, "Cần hồ sơ bé trong dữ liệu thử nghiệm.");
  await feeding.click();
  await page.getByRole("button", { name: "Ghi cữ bú", exact: true }).click();
  await page.locator('#feeding-form select[name="type"]').selectOption("FORMULA");
  await page.locator('#feeding-form input[name="amountMl"]').fill("95");
  await page.getByRole("button", { name: "Lưu", exact: true }).click();
  await expect(page.locator("#feeding-form")).not.toBeVisible();
  await expect(page.getByRole("alert")).not.toContainText("Chưa thể lưu");
  const record = page.locator("div.rounded-2xl").filter({ has: page.getByText("Sữa công thức", { exact: true }) }).filter({ has: page.getByRole("button", { name: "Xóa", exact: true }) }).first();
  await expect(record).toContainText("95 ml");
  page.once("dialog", (dialog) => dialog.accept());
  await record.getByRole("button", { name: "Xóa", exact: true }).click();
  await expect(record).not.toBeVisible();
  await page.getByRole("link", { name: "Quay lại", exact: true }).click();
  await expect(page).toHaveURL(/\/baby$/);
});

test("màn hình nhỏ không tràn ngang và tôn trọng giảm chuyển động", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await login(page);
  for (const route of ["/", "/baby", "/mother", "/profile", "/knowledge", "/tracking/feeding"]) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("main h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(await page.locator(".page-enter").evaluate((node) => getComputedStyle(node).animationName)).toBe("none");
    if (route === "/") await page.screenshot({ path: test.info().outputPath("home-mobile.png"), fullPage: true });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator("main h1")).toBeVisible();
  await page.screenshot({ path: test.info().outputPath("home-desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Đổi giao diện sáng hoặc tối" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.screenshot({ path: test.info().outputPath("home-dark.png"), fullPage: true });
});

test("hai thiết bị dùng chung tài khoản cùng xem được nhật ký", async ({ page, browser }) => {
  await login(page);
  test.skip(await page.getByRole("link", { name: "Ghi cữ bú", exact: true }).count() === 0, "Cần hồ sơ bé trong môi trường thử nghiệm.");
  const secondContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  try {
    const secondPage = await secondContext.newPage();
    await login(secondPage);
    await page.getByRole("link", { name: "Ghi cữ bú", exact: true }).click();
    await page.locator('#feeding-form select[name="type"]').selectOption("FORMULA");
    await page.locator('#feeding-form input[name="amountMl"]').fill("96");
    await page.getByRole("button", { name: "Lưu", exact: true }).click();
    await expect(page.locator("#feeding-form")).not.toBeVisible();
    await secondPage.reload();
    await expect(secondPage.getByText("96 ml", { exact: true })).toBeVisible();
    const record = page.locator("div.rounded-2xl").filter({ has: page.getByText("Sữa công thức", { exact: true }) }).filter({ hasText: "96 ml" }).filter({ has: page.getByRole("button", { name: "Xóa", exact: true }) }).first();
    page.once("dialog", (dialog) => dialog.accept());
    await record.getByRole("button", { name: "Xóa", exact: true }).click();
    await expect(record).not.toBeVisible();
  } finally {
    await secondContext.close();
  }
});
