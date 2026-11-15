import { expect, test, type Page } from "@playwright/test";

// Creates and deletes real letters: run only against a throwaway test database.
test.skip(process.env.E2E_ALLOW_WRITES !== "1", "Ghi dữ liệu thật: chỉ chạy với E2E_ALLOW_WRITES=1 trên cơ sở dữ liệu thử nghiệm.");
test.skip(!process.env.APP_USERNAME || !process.env.APP_PASSWORD, "Cần APP_USERNAME và APP_PASSWORD của môi trường kiểm thử.");

// The family uses the mailbox on phones.
test.use({ viewport: { width: 390, height: 844 } });

const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

const created: string[] = [];

async function login(page: Page) {
  await page.goto("/login");
  if (page.url().endsWith("/login")) {
    await page.getByLabel("Tên đăng nhập").fill(process.env.APP_USERNAME!);
    await page.getByLabel("Mật khẩu", { exact: true }).fill(process.env.APP_PASSWORD!);
    await page.getByRole("button", { name: "Mở ứng dụng" }).click();
  }
  await expect(page).toHaveURL(/\/(?:profile)?$/);
}

async function openMailbox(page: Page) {
  await page.goto("/baby/mailbox");
  // Let React reveal every streamed segment before counting (otherwise the button may not be in place yet).
  await page.locator("main h1").waitFor();
  await page.waitForFunction(() => !document.querySelector('div[hidden][id^="S:"]'));
  const create = page.getByRole("button", { name: /Tạo thư mới/ });
  test.skip(await create.count() === 0, "Cần hồ sơ bé trong dữ liệu thử nghiệm.");
  return create;
}

async function openComposer(page: Page) {
  const create = await openMailbox(page);
  await create.click();
  const dialog = page.getByRole("dialog", { name: "Một lá thư mới" });
  await expect(dialog).toBeVisible();
  return dialog;
}

async function expectInGallery(page: Page, title: string) {
  const envelope = page.locator("button.memory-envelope", { hasText: title });
  await expect(envelope).toBeVisible();
  await envelope.click();
  const item = page.locator("article.memory-journey-item", { hasText: title });
  await expect(item).toBeVisible();
  return item;
}

async function deleteMemory(page: Page, title: string) {
  await page.goto("/baby/mailbox");
  const envelope = page.locator("button.memory-envelope", { hasText: title });
  if (await envelope.count() === 0) return;
  await envelope.first().click();
  const item = page.locator("article.memory-journey-item", { hasText: title });
  await item.getByText("Quản lý kỷ niệm").click();
  await item.getByRole("button", { name: "Xác nhận xóa kỷ niệm" }).click();
  await expect(page.locator("article.memory-journey-item", { hasText: title })).toHaveCount(0);
}

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.afterEach(async ({ page }) => {
  while (created.length) {
    const title = created.pop()!;
    await deleteMemory(page, title).catch(error => console.warn(`Không xóa được thư thử "${title}":`, error));
  }
});

test("báo lỗi ngay trong hộp thoại khi thiếu tên khoảnh khắc", async ({ page }) => {
  const dialog = await openComposer(page);
  await dialog.getByLabel("Thư tay gửi con").fill("Con yêu");
  await dialog.getByRole("button", { name: "Cất vào hộp thư của con" }).click();
  await expect(dialog.getByRole("alert")).toHaveText("Hãy đặt tên cho khoảnh khắc này nhé.");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("Thư tay gửi con")).toHaveValue("Con yêu");
});

test("tạo thư chỉ có lời nhắn rồi xóa", async ({ page }) => {
  const title = `E2E thư ${Date.now()}`;
  const dialog = await openComposer(page);
  await dialog.getByLabel("Tên khoảnh khắc").fill(title);
  await dialog.getByLabel("Thư tay gửi con").fill("Con yêu, đây là lá thư thử nghiệm.");
  created.push(title);
  await dialog.getByRole("button", { name: "Cất vào hộp thư của con" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Đã cất kỷ niệm vào phong bì của con." })).toBeVisible();
  await expect(dialog).toBeHidden();
  const item = await expectInGallery(page, title);
  await item.getByText("Đọc thư gửi con ♡").click();
  await expect(item.getByText("Con yêu, đây là lá thư thử nghiệm.")).toBeVisible();
});

test("tạo thư có ảnh PNG nhỏ", async ({ page }) => {
  const title = `E2E ảnh nhỏ ${Date.now()}`;
  const dialog = await openComposer(page);
  await page.getByLabel("Chọn ảnh hoặc video kỷ niệm").setInputFiles({ name: "tiny.png", mimeType: "image/png", buffer: TINY_PNG });
  await expect(dialog.locator('img[src^="blob:"]')).toBeVisible();
  await dialog.getByLabel("Tên khoảnh khắc").fill(title);
  created.push(title);
  await dialog.getByRole("button", { name: "Cất vào hộp thư của con" }).click();
  await expect(dialog).toBeHidden();
  const item = await expectInGallery(page, title);
  const image = item.locator('img[src^="/api/memories/"]');
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth)).toBeGreaterThan(0);
});

test("thu nhỏ ảnh điện thoại lớn trước khi gửi", async ({ page }) => {
  test.setTimeout(120_000);
  const title = `E2E ảnh lớn ${Date.now()}`;
  const dialog = await openComposer(page);
  // A 4000×3000 photo-like PNG, far above the 4 MB upload limit.
  const sourceBytes = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 4000; canvas.height = 3000;
    const context = canvas.getContext("2d")!;
    const gradient = context.createLinearGradient(0, 0, 4000, 3000);
    gradient.addColorStop(0, "#f4bbb6"); gradient.addColorStop(1, "#a4dae9");
    context.fillStyle = gradient; context.fillRect(0, 0, 4000, 3000);
    const pixels = context.getImageData(0, 0, 4000, 3000);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const noise = (Math.random() * 30) | 0;
      pixels.data[i] += noise; pixels.data[i + 1] += noise; pixels.data[i + 2] += noise;
    }
    context.putImageData(pixels, 0, 0);
    const blob = await new Promise<Blob>(resolve => canvas.toBlob(result => resolve(result!), "image/png"));
    const input = document.querySelector<HTMLInputElement>('input[aria-label="Chọn ảnh hoặc video kỷ niệm"]')!;
    const transfer = new DataTransfer();
    transfer.items.add(new File([blob], "IMG_4000x3000.png", { type: "image/png" }));
    input.files = transfer.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return blob.size;
  });
  expect(sourceBytes).toBeGreaterThan(4_000_000);
  await expect(dialog.locator('img[src^="blob:"]')).toBeVisible({ timeout: 30_000 });
  await expect(dialog.getByRole("alert")).toHaveCount(0);
  await dialog.getByLabel("Tên khoảnh khắc").fill(title);
  created.push(title);
  const upload = page.waitForRequest(request => request.method() === "POST" && Boolean(request.headers()["next-action"]));
  await dialog.getByRole("button", { name: "Cất vào hộp thư của con" }).click();
  const body = (await upload).postDataBuffer();
  expect(body?.length ?? 0).toBeLessThan(2_000_000);
  await expect(dialog).toBeHidden({ timeout: 30_000 });
  const item = await expectInGallery(page, title);
  const image = item.locator('img[src^="/api/memories/"]');
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete ? img.naturalWidth : 0)).toBe(1920);
});
