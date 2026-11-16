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
  await dialog.getByRole("button", { name: "Cất vào hộp thư của con" }).click();
  await expect(dialog).toBeHidden({ timeout: 30_000 });
  const item = await expectInGallery(page, title);
  const image = item.locator('img[src^="/api/memories/"]');
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete ? img.naturalWidth : 0)).toBe(1920);
  // Stored (in Postgres or object storage) as the shrunk photo, not the 4000×3000 original.
  const stored = await page.request.get((await image.getAttribute("src"))!, { headers: { range: "bytes=0-0" } });
  expect(stored.status()).toBe(206);
  expect(Number(stored.headers()["content-range"]?.split("/")[1])).toBeLessThan(2_000_000);
});

/** A file that passes the MP4 signature check (bytes 4–8 are "ftyp"); browsers cannot play it. */
function fakeMp4(size: number) {
  const buffer = Buffer.alloc(size);
  buffer.write("\0\0\0\x18ftypisom", 0, "latin1");
  return buffer;
}

async function directUploadEnabled(page: Page) {
  return (await page.getByText(/Video MP4, MOV, WebM tối đa 50 MB/).count()) > 0;
}

test("tải video 6 MB thẳng lên kho lưu trữ và xem lại được", async ({ page }) => {
  test.setTimeout(90_000);
  const dialog = await openComposer(page);
  test.skip(!await directUploadEnabled(page), "Chỉ chạy khi đã cấu hình kho lưu trữ (Neon Object Storage).");
  const title = `E2E video lớn ${Date.now()}`;
  const video = fakeMp4(6_000_000);
  await page.getByLabel("Chọn ảnh hoặc video kỷ niệm").setInputFiles({ name: "clip-10s.mp4", mimeType: "video/mp4", buffer: video });
  await expect(dialog.locator('video[src^="blob:"]')).toHaveCount(1);
  await expect(dialog.getByRole("alert")).toHaveCount(0);
  await dialog.getByLabel("Tên khoảnh khắc").fill(title);
  created.push(title);
  const put = page.waitForRequest(request => request.method() === "PUT");
  const actionBodies: number[] = [];
  page.on("request", request => { if (request.method() === "POST" && request.headers()["next-action"]) actionBodies.push(request.postDataBuffer()?.length ?? 0); });
  await dialog.getByRole("button", { name: "Cất vào hộp thư của con" }).click();
  const upload = await put;
  // (Playwright does not expose File request bodies; the stored size is checked below.)
  expect(new URL(upload.url()).searchParams.get("X-Amz-SignedHeaders")).toBe("content-length;content-type;host");
  expect((await upload.response())?.status()).toBe(200);
  await expect(dialog).toBeHidden({ timeout: 30_000 });
  // The video never goes through the Server Action (Vercel caps those at 4.5 MB).
  expect(Math.max(...actionBodies)).toBeLessThan(100_000);

  const item = await expectInGallery(page, title);
  const src = await item.locator('video[src^="/api/memories/"]').getAttribute("src");
  const redirect = await page.request.get(src!, { maxRedirects: 0 });
  expect(redirect.status()).toBe(302);
  expect(redirect.headers()["cache-control"]).toBe("private, no-store");
  const stored = await page.request.get(src!, { headers: { range: "bytes=0-11" } });
  expect(stored.status()).toBe(206);
  expect((await stored.body()).toString("latin1")).toBe("\0\0\0\x18ftypisom");
  expect(stored.headers()["content-range"]).toBe(`bytes 0-11/${video.length}`);
});

test("từ chối video trên 50 MB ngay khi chọn", async ({ page }) => {
  const dialog = await openComposer(page);
  test.skip(!await directUploadEnabled(page), "Chỉ chạy khi đã cấu hình kho lưu trữ (Neon Object Storage).");
  let uploads = 0;
  page.on("request", request => { if (request.method() === "PUT") uploads++; });
  await page.getByLabel("Chọn ảnh hoặc video kỷ niệm").setInputFiles({ name: "clip-1min.mp4", mimeType: "video/mp4", buffer: fakeMp4(50_000_001) });
  await expect(dialog.getByRole("alert")).toHaveText("Video tối đa 50 MB (khoảng 20–30 giây). Hãy cắt ngắn video rồi chọn lại nhé.");
  await expect(dialog.locator('video[src^="blob:"]')).toHaveCount(0);
  expect(uploads).toBe(0);
});
