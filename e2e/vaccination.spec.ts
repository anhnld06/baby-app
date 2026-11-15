import { expect, test, type Page } from "@playwright/test";
/** Wait until React has revealed every streamed segment (hidden div#S:n copies briefly duplicate content). */
const streamed = (p: Page) => p.waitForFunction(() => !document.querySelector('div[hidden][id^="S:"]'));

test.use({ viewport: { width: 390, height: 844 } });
const future = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
const actual = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
const displayDate = (iso: string) => iso.split("-").reverse().join("/");
/** Scope to the visible checklist: React streaming briefly keeps a hidden copy (div#S:n[hidden]) of the page. */
const doseRow = (p: Page, key: string) => p.getByRole("region", { name: /^Danh sách mũi tiêm của/ }).locator(`[data-schedule-key="${key}"]`);
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
  await streamed(page);
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

const doseDateText = /Dự kiến\s*\d{2}\/\d{2}\/\d{4}/;
async function openAgeView(page: Page) {
  await page.goto("/vaccination-schedule?owner=baby&view=age");
  await streamed(page);
  await expect(page.getByRole("region", { name: /^Danh sách mũi tiêm của/ })).toBeVisible();
}
/** Ticking asks for the real date in a small dialog (defaults to today). */
async function tickDose(page: Page, label: string, date?: string) {
  const dialog = page.getByRole("dialog", { name: `Đã tiêm ${label}` });
  await expect(dialog).toBeVisible();
  const field = dialog.getByLabel("Ngày tiêm", { exact: true });
  if (date) await field.fill(displayDate(date));
  await dialog.getByRole("button", { name: "Lưu đã tiêm", exact: true }).click();
  await expect(dialog).not.toBeVisible();
}

test("hiện đủ các mũi tiếp theo, tích kèm ngày tiêm và sửa ngày sau khi ghi", async ({ page }) => {
  await login(page);
  const checklist = page.getByRole("region", { name: /^Danh sách mũi tiêm của/ });
  await expect(checklist.getByRole("heading", { name: /Lịch tiêm chủng/ })).toBeVisible();
  // "Theo vắc-xin": each series shows the standard ages and its next concrete date.
  await expect(checklist.locator("[data-vaccine-group]").first()).toContainText("Lịch chuẩn:");
  await expect(checklist.locator("[data-series-next]").first()).toContainText(/Tiếp theo:|Đã ghi nhận đủ/);
  await openAgeView(page);
  await expect(doseRow(page, "5in1-2")).toContainText("mũi 2");
  await expect(doseRow(page, "5in1-3")).toContainText("mũi 3");
  await expect(doseRow(page, "td-7-years")).toBeVisible();
  const row = doseRow(page, "bcg");
  const check = row.getByRole("checkbox");
  test.skip(await check.isChecked(), "BCG đã được ghi nhận trong dữ liệu thử nghiệm.");
  await check.click();
  await tickDose(page, "BCG (lao)", actual);
  await expect(check).toBeChecked();
  await expect(row).toContainText(`Đã tiêm ${displayDate(actual)}`);
  await page.reload();
  await expect(check).toBeChecked();
  expect((await responseText(page, "/api/export/baby-journal")).split("BCG (lao)").length - 1).toBe(1);
  const earlier = new Date(Date.now() - 3 * 86_400_000).toISOString().slice(0, 10);
  await row.getByRole("link", { name: "Sửa ngày / ghi chú" }).click();
  const edit = page.locator("form").filter({ has: page.getByRole("button", { name: "Lưu thay đổi", exact: true }) });
  await edit.getByLabel("Ngày tiêm thực tế", { exact: true }).fill(displayDate(earlier));
  await edit.getByRole("button", { name: "Lưu thay đổi", exact: true }).click();
  // Wait for the save to finish (the edit form closes) before navigating, or the server action is aborted.
  await expect(edit).not.toBeVisible();
  await openAgeView(page);
  await expect(row).toContainText(`Đã tiêm ${displayDate(earlier)}`);
  await row.screenshot({ path: test.info().outputPath("vaccination-checklist-completed.png") });
  await check.click();
  await expect(check).not.toBeChecked();
  expect(await responseText(page, "/api/export/baby-journal")).not.toContain("BCG (lao)");
});

test("hủy hộp chọn ngày thì không ghi mũi tiêm", async ({ page }) => {
  await login(page);
  await openAgeView(page);
  const row = doseRow(page, "bcg");
  const check = row.getByRole("checkbox");
  test.skip(await check.isChecked(), "BCG đã được ghi nhận trong dữ liệu thử nghiệm.");
  await check.click();
  const dialog = page.getByRole("dialog", { name: "Đã tiêm BCG (lao)" });
  await expect(dialog.getByLabel("Ngày tiêm", { exact: true })).toHaveValue(/\d{2}\/\d{2}\/\d{4}/);
  await dialog.screenshot({ path: test.info().outputPath("vaccination-tick-dialog.png") });
  await dialog.getByRole("button", { name: "Hủy", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(check).not.toBeChecked();
});

test("mũi sau có ngày dự kiến tính từ ngày tiêm mũi trước và đặt hẹn được", async ({ page }) => {
  await login(page);
  await openAgeView(page);
  const first = doseRow(page, "5in1-1");
  const second = doseRow(page, "5in1-2");
  test.skip(await first.getByRole("checkbox").isChecked(), "Mũi 1 đã được ghi nhận trong dữ liệu thử nghiệm.");
  test.skip(["done", "booked"].includes((await second.getAttribute("data-dose-status")) ?? ""), "Mũi 2 đã có trong dữ liệu thử nghiệm.");
  const today = new Date().toISOString().slice(0, 10);
  await first.getByRole("checkbox").click();
  await tickDose(page, "5 trong 1 / 6 trong 1 - mũi 1", today);
  await expect(first.getByRole("checkbox")).toBeChecked();
  await expect(second).toContainText(doseDateText);
  await expect(second).toContainText(/1 tháng sau mũi 1 \(tiêm \d{2}\/\d{2}\)|theo tuổi 3 tháng/);
  await second.screenshot({ path: test.info().outputPath("vaccination-expected-dose.png") });
  await second.getByRole("link", { name: "Đặt hẹn ngày này" }).click();
  const booking = page.locator("#dat-hen");
  await expect(booking).toHaveAttribute("open", "");
  await expect(booking.getByLabel("Tên vắc-xin / mũi tiêm", { exact: true })).toHaveValue("5 trong 1 / 6 trong 1 - mũi 2");
  await expect(booking.getByLabel("Ngày hẹn", { exact: true })).toHaveValue(/\d{2}\/\d{2}\/\d{4}/);
  await openAgeView(page);
  await first.getByRole("checkbox").click();
  await expect(first.getByRole("checkbox")).not.toBeChecked();
});

test("xác nhận đã tiêm: ngày hẹn tiếp theo để trống, chỉ điền khi bấm dùng ngày dự kiến", async ({ page }) => {
  await login(page);
  await openAgeView(page);
  test.skip(["done", "booked"].includes((await doseRow(page, "5in1-2").getAttribute("data-dose-status")) ?? ""), "Mũi 2 đã có trong dữ liệu thử nghiệm.");
  await page.goto("/vaccination-schedule");
  await streamed(page);
  const card = await addAppointment(page, "5 trong 1 / 6 trong 1 - mũi 1");
  try {
    await card.getByText("Đã tiêm", { exact: true }).click();
    const next = card.getByLabel("Ngày hẹn tiếp theo (nếu có)", { exact: true });
    await expect(next).toBeVisible();
    await expect(next).toHaveValue("");
    await expect(card).toContainText(/Gợi ý: mũi 2 dự kiến \d{2}\/\d{2}\/\d{4}/);
    await card.getByRole("button", { name: "Dùng ngày dự kiến", exact: true }).click();
    await expect(next).toHaveValue(/\d{2}\/\d{2}\/\d{4}/);
    await card.screenshot({ path: test.info().outputPath("vaccination-next-suggestion.png") });
  } finally {
    page.once("dialog", (dialog) => dialog.accept());
    await card.getByRole("button", { name: "Xóa hẹn", exact: true }).click();
    await expect(card).not.toBeVisible();
  }
});

test("vợ chồng tích cùng mũi trong danh sách không tạo hai lần tiêm", async ({ page, browser }) => {
  await login(page);
  await openAgeView(page);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  try {
    const second = await context.newPage();
    await login(second);
    await openAgeView(second);
    await doseRow(page, "bcg").getByRole("checkbox").click();
    await doseRow(second, "bcg").getByRole("checkbox").click();
    await Promise.all([tickDose(page, "BCG (lao)"), tickDose(second, "BCG (lao)")]);
    await expect(doseRow(page, "bcg").getByRole("checkbox")).toBeChecked();
    await second.reload();
    await expect(doseRow(second, "bcg").getByRole("checkbox")).toBeChecked();
    expect((await responseText(page, "/api/export/baby-journal")).split("BCG (lao)").length - 1).toBe(1);
    await doseRow(page, "bcg").getByRole("checkbox").click();
    await expect(doseRow(page, "bcg").getByRole("checkbox")).not.toBeChecked();
  } finally { await context.close(); }
});


test("tích mũi có sẵn cũng hoàn tất lịch hẹn tương ứng và ngừng nhắc", async ({ page }) => {
  await login(page);
  const card = await addAppointment(page, "BCG (lao)");
  const id = (await card.getAttribute("data-appointment"))!;
  await openAgeView(page);
  const row = doseRow(page, "bcg");
  await expect(row).toContainText("Đã có hẹn");
  await row.getByRole("checkbox").click();
  await tickDose(page, "BCG (lao)");
  await expect(row.getByRole("checkbox")).toBeChecked();
  await expect(card).not.toBeVisible();
  expect(await responseText(page, "/api/calendar")).not.toContain(`vaccination-appointment-${id}`);
  expect((await responseText(page, "/api/export/baby-journal")).split("BCG (lao)").length - 1).toBe(1);
  await row.getByRole("checkbox").click();
  await expect(row.getByRole("checkbox")).not.toBeChecked();
  await expect(card).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await card.getByRole("button", { name: "Xóa hẹn", exact: true }).click();
  await expect(card).not.toBeVisible();
});
