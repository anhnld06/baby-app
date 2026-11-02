import { expect, test, type Page } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });
async function login(page: Page) {
  test.skip(
    !process.env.APP_USERNAME || !process.env.APP_PASSWORD,
    "Cần tài khoản thử nghiệm.",
  );
  await page.goto("/login");
  await page.getByLabel("Tên đăng nhập").fill(process.env.APP_USERNAME!);
  await page
    .getByLabel("Mật khẩu", { exact: true })
    .fill(process.env.APP_PASSWORD!);
  await page.getByRole("button", { name: "Mở ứng dụng" }).click();
  await expect(page).toHaveURL(/\/$/);
}

test("mở từ Của bé, gợi ý theo tuổi và chỉ tải trình phát khi chọn nghe", async ({
  page,
}) => {
  await login(page);
  await page.goto("/baby");
  await page.getByRole("link", { name: /^Nhạc hát ru/ }).click();
  await expect(page).toHaveURL(/\/baby\/lullabies$/);
  await expect(
    page.getByRole("heading", { name: "Nhạc hát ru", exact: true }),
  ).toBeVisible();
  await expect(page.locator("audio")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /Gợi ý cho bé/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Từ 3 tuổi", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Twinkle Twinkle Little Star", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Tất cả bài", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Edo Lullaby", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: test.info().outputPath("lullabies-mobile.png"),
    fullPage: true,
  });
  await page.getByRole("link", { name: "Quay lại", exact: true }).click();
  await expect(page).toHaveURL(/\/baby$/);
});

test("đổi bài chỉ có một trình phát, dừng và hẹn dừng gỡ trình phát", async ({
  page,
}) => {
  await login(page);
  await page.goto("/baby/lullabies");
  await page.getByRole("button", { name: "Tất cả bài", exact: true }).click();
  await page
    .getByRole("button", { name: "Nghe Edo Lullaby", exact: true })
    .click();
  await expect(page.locator("audio")).toHaveCount(1);
  await expect.poll(() => page.locator("audio").evaluate((el: HTMLAudioElement) => el.readyState)).toBeGreaterThanOrEqual(2);
  await expect.poll(() => page.locator("audio").evaluate((el: HTMLAudioElement) => el.currentTime)).toBeGreaterThan(0);
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator("audio")).toHaveAttribute(
    "aria-label",
    "Nghe Edo Lullaby",
  );
  await page
    .getByRole("button", { name: "Nghe Twinkle Twinkle Little Star", exact: true })
    .click();
  await expect(page.locator("audio")).toHaveCount(1);
  await expect(page.locator("audio")).toHaveAttribute(
    "aria-label",
    "Nghe Twinkle Twinkle Little Star",
  );
  await page.getByRole("button", { name: "Dừng phát", exact: true }).click();
  await expect(page.locator("audio")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Nghe Edo Lullaby", exact: true })
    .click();
  await expect(page.locator("audio")).toHaveAttribute("src", /^\/audio\/lullabies\//);
  await expect(page.locator("audio")).toHaveAttribute("loop", "");
  await page.getByLabel("Lặp lại bài đang nghe").uncheck();
  await expect(page.locator("audio")).not.toHaveAttribute("loop");
  const download = page.getByRole("link", { name: "Tải MP3 Edo Lullaby", exact: true });
  const response = await page.request.get((await download.getAttribute("href"))!);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("audio/mpeg");
  expect((await response.body()).length).toBeGreaterThan(10000);
  await page.clock.install();
  await page
    .getByRole("combobox", { name: "Hẹn dừng nhạc", exact: true })
    .selectOption("10");
  await page.clock.fastForward(10 * 60_000 + 1_000);
  await expect(page.locator("audio")).toHaveCount(0);
  await expect(
    page.getByRole("status").filter({ hasText: "Đã dừng nhạc theo giờ hẹn." }),
  ).toBeVisible();
});

test("rời trang dừng trình phát và giữ mục Của bé được chọn", async ({
  page,
}) => {
  await login(page);
  await page.goto("/baby/lullabies");
  await page
    .getByRole("button", { name: "Nghe Edo Lullaby", exact: true })
    .click();
  await expect(page.locator("audio")).toHaveCount(1);
  await expect(
    page
      .getByRole("navigation")
      .getByRole("link", { name: "Của bé", exact: true })
      .last(),
  ).toHaveAttribute("aria-current", "page");
  await page.getByRole("link", { name: "Quay lại", exact: true }).click();
  await expect(page).toHaveURL(/\/baby$/);
  await expect(page.locator("audio")).toHaveCount(0);
});
