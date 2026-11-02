import { expect, test, type Page } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });
const future = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
const actual = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
const displayDate = (iso: string) => iso.split("-").reverse().join("/");
async function responseText(page: Page, url: string) {
  return page.evaluate(async (path) => {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  }, url);
}
async function login(page: Page) {
  test.skip(
    !process.env.APP_USERNAME || !process.env.APP_PASSWORD,
    "Cần tài khoản môi trường thử nghiệm.",
  );
  await page.goto("/login");
  await page.getByLabel("Tên đăng nhập").fill(process.env.APP_USERNAME!);
  await page
    .getByLabel("Mật khẩu", { exact: true })
    .fill(process.env.APP_PASSWORD!);
  await page.getByRole("button", { name: "Mở ứng dụng" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/vaccination-schedule");
  await expect(
    page.getByRole("heading", { name: "Tiêm chủng", exact: true }),
  ).toBeVisible();
}
async function addAppointment(page: Page, name: string, mother = false) {
  await page.getByText("+ Thêm lịch hẹn tiêm", { exact: true }).click();
  const form = page
    .locator("form")
    .filter({
      has: page.getByRole("button", { name: "Lưu lịch hẹn", exact: true }),
    });
  if (mother)
    await form
      .getByLabel("Cho ai?", { exact: true })
      .selectOption({ index: 1 });
  await form.getByLabel("Tên vắc-xin / mũi tiêm", { exact: true }).fill(name);
  await form.getByLabel("Ngày hẹn", { exact: true }).fill(displayDate(future));
  await form.getByRole("button", { name: "Lưu lịch hẹn", exact: true }).click();
  const card = page
    .locator("article[data-appointment]")
    .filter({ hasText: name });
  await expect(card).toBeVisible();
  return card;
}

test("lịch hẹn thành lịch sử, ngừng nhắc và có thể bỏ đánh dấu", async ({
  page,
}) => {
  await login(page);
  const name = `Kiểm thử lịch tiêm ${Date.now()}`;
  const card = await addAppointment(page, name);
  const id = (await card.getAttribute("data-appointment"))!;
  await card.evaluate((node) => window.scrollBy(0, node.getBoundingClientRect().top - 100));
  await card.screenshot({ path: test.info().outputPath("vaccination-appointment.png") });
  expect(await responseText(page, "/api/calendar")).toContain(
    `vaccination-appointment-${id}`,
  );
  await card.getByText("Đã tiêm", { exact: true }).click();
  expect(await card.getByLabel("Ngày tiêm thực tế", { exact: true }).evaluate((node) => node.getBoundingClientRect().width)).toBeGreaterThan(200);
  await card
    .getByLabel("Ngày tiêm thực tế", { exact: true })
    .fill(displayDate(actual));
  await card
    .getByRole("button", { name: "Xác nhận đã tiêm", exact: true })
    .click();
  const done = page.locator(`article[data-vaccination="${id}"]`);
  await expect(done).toContainText(`Đã tiêm ${displayDate(actual)}`);
  await expect(done).toContainText(`Ngày hẹn ban đầu: ${displayDate(future)}`);
  await done.evaluate((node) => window.scrollBy(0, node.getBoundingClientRect().top - 100));
  await done.screenshot({ path: test.info().outputPath("vaccination-completed.png") });
  expect(await responseText(page, "/api/calendar")).not.toContain(
    `vaccination-appointment-${id}`,
  );
  const csv = await responseText(page, "/api/export/baby-journal");
  expect(csv.split(name).length - 1).toBe(1);
  page.once("dialog", (dialog) => dialog.accept());
  await done
    .getByRole("button", { name: "Bỏ đánh dấu đã tiêm", exact: true })
    .click();
  await expect(card).toBeVisible();
  expect(await responseText(page, "/api/calendar")).toContain(
    `vaccination-appointment-${id}`,
  );
  expect(await responseText(page, "/api/export/baby-journal")).not.toContain(
    name,
  );
  page.once("dialog", (dialog) => dialog.accept());
  await card.getByRole("button", { name: "Xóa hẹn", exact: true }).click();
  await expect(card).not.toBeVisible();
});

test("mẹ cũng xác nhận được trên cùng lịch và ghi được mũi cũ", async ({
  page,
}) => {
  await login(page);
  const name = `Mũi của mẹ ${Date.now()}`;
  const card = await addAppointment(page, name, true);
  const id = (await card.getAttribute("data-appointment"))!;
  await card.getByText("Đã tiêm", { exact: true }).click();
  await card
    .getByRole("button", { name: "Xác nhận đã tiêm", exact: true })
    .click();
  const done = page.locator(`article[data-vaccination="${id}"]`);
  await expect(done).toContainText("Mẹ ·");
  await done.getByRole("link", { name: "Sửa lần tiêm" }).click();
  const edit = page
    .locator("form")
    .filter({
      has: page.getByRole("button", { name: "Lưu thay đổi", exact: true }),
    });
  await edit
    .getByLabel("Ngày tiêm thực tế", { exact: true })
    .fill(displayDate(actual));
  await page.getByRole("button", { name: "Lưu thay đổi", exact: true }).click();
  await expect(done).toContainText(`Đã tiêm ${displayDate(actual)}`);
  page.once("dialog", (dialog) => dialog.accept());
  await done
    .getByRole("button", { name: "Bỏ đánh dấu đã tiêm", exact: true })
    .click();
  page.once("dialog", (dialog) => dialog.accept());
  await card.getByRole("button", { name: "Xóa hẹn", exact: true }).click();
  await expect(card).not.toBeVisible();
  await page.getByText("Ghi lần tiêm trước đây", { exact: true }).click();
  const form = page
    .locator("form")
    .filter({
      has: page.getByRole("button", { name: "Lưu lần tiêm", exact: true }),
    });
  await form.getByLabel("Tên vắc-xin / mũi tiêm", { exact: true }).fill(name);
  await form
    .getByLabel("Ngày tiêm thực tế", { exact: true })
    .fill(displayDate(actual));
  await form.getByRole("button", { name: "Lưu lần tiêm", exact: true }).click();
  const past = page
    .locator("article[data-vaccination]")
    .filter({ hasText: name });
  await expect(past).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await past.getByRole("button", { name: "Xóa", exact: true }).click();
  await expect(past).not.toBeVisible();
});

test("hai thiết bị xác nhận cùng lịch không tạo trùng bản ghi", async ({
  page,
  browser,
}) => {
  await login(page);
  const name = `Xác nhận đồng thời ${Date.now()}`;
  const card = await addAppointment(page, name);
  const id = (await card.getAttribute("data-appointment"))!;
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  try {
    const second = await context.newPage();
    await login(second);
    const secondCard = second.locator(`article[data-appointment="${id}"]`);
    await card.getByText("Đã tiêm", { exact: true }).click();
    await secondCard.getByText("Đã tiêm", { exact: true }).click();
    await Promise.all([
      card
        .getByRole("button", { name: "Xác nhận đã tiêm", exact: true })
        .click(),
      secondCard
        .getByRole("button", { name: "Xác nhận đã tiêm", exact: true })
        .click(),
    ]);
    const done = page.locator(`article[data-vaccination="${id}"]`);
    await expect(done).toBeVisible();
    await expect(
      second.locator(`article[data-vaccination="${id}"]`),
    ).toBeVisible();
    expect(
      (await responseText(page, "/api/export/baby-journal")).split(name)
        .length - 1,
    ).toBe(1);
    page.once("dialog", (dialog) => dialog.accept());
    await done
      .getByRole("button", { name: "Bỏ đánh dấu đã tiêm", exact: true })
      .click();
    page.once("dialog", (dialog) => dialog.accept());
    await card.getByRole("button", { name: "Xóa hẹn", exact: true }).click();
    await expect(card).not.toBeVisible();
  } finally {
    await context.close();
  }
});

test("đường dẫn cũ chuyển về một màn hình tiêm chủng", async ({ page }) => {
  await login(page);
  await page.goto("/tracking/vaccination");
  await expect(page).toHaveURL(/\/vaccination-schedule\?owner=baby$/);
  await page.goto("/mother/vaccination");
  await expect(page).toHaveURL(/\/vaccination-schedule\?owner=mother$/);
});

test("đổi ngày hẹn và lưu hẹn tiếp theo ngay khi xác nhận", async ({
  page,
}) => {
  await login(page);
  const name = `Hẹn tiếp theo ${Date.now()}`;
  const card = await addAppointment(page, name);
  const id = (await card.getAttribute("data-appointment"))!;
  const rescheduled = new Date(Date.now() + 10 * 86_400_000)
    .toISOString()
    .slice(0, 10);
  const next = new Date(Date.now() + 40 * 86_400_000)
    .toISOString()
    .slice(0, 10);
  await card.getByRole("link", { name: "Sửa hẹn", exact: true }).click();
  const edit = page
    .locator("form")
    .filter({
      has: page.getByRole("button", { name: "Lưu thay đổi", exact: true }),
    });
  await edit
    .getByLabel("Ngày hẹn", { exact: true })
    .fill(displayDate(rescheduled));
  await page.getByRole("button", { name: "Lưu thay đổi", exact: true }).click();
  const original = page.locator(`article[data-appointment="${id}"]`);
  await expect(original).toContainText(displayDate(rescheduled));
  await original.getByText("Đã tiêm", { exact: true }).click();
  await original
    .getByText("Thêm hẹn tiếp theo / ghi chú", { exact: true })
    .click();
  await original
    .getByLabel("Ngày hẹn tiếp theo (nếu có)", { exact: true })
    .fill(displayDate(next));
  await original
    .getByRole("button", { name: "Xác nhận đã tiêm", exact: true })
    .click();
  const done = page.locator(`article[data-vaccination="${id}"]`);
  await expect(done).toBeVisible();
  const followup = page
    .locator("article[data-appointment]")
    .filter({ hasText: name });
  await expect(followup).toHaveCount(1);
  await expect(followup).toContainText(displayDate(next));
  await expect(followup).not.toContainText("mũi 2");
  page.once("dialog", (dialog) => dialog.accept());
  await followup.getByRole("button", { name: "Xóa hẹn", exact: true }).click();
  await expect(followup).not.toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await done
    .getByRole("button", { name: "Bỏ đánh dấu đã tiêm", exact: true })
    .click();
  page.once("dialog", (dialog) => dialog.accept());
  await original.getByRole("button", { name: "Xóa hẹn", exact: true }).click();
  await expect(original).not.toBeVisible();
});
