import { createHmac, randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

const prisma = new PrismaClient();
let userId: string;
let pregnancyId: string;
let errors: string[];
test.beforeEach(async ({ context, page, baseURL }) => {
  test.skip(!process.env.APP_PASSWORD || !process.env.E2E_TEST_USERNAME, "Chạy trên server thử nghiệm riêng với APP_USERNAME=E2E_TEST_USERNAME.");
  expect(process.env.E2E_TEST_USERNAME).toMatch(/^e2e-pregnancy-/);
  const date = new Date(new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()) + "T00:00:00Z");
  const due = new Date(date.getTime() + 84 * 86400000);
  const user = await prisma.user.create({ data: { name: "Gia đình kiểm thử", username: process.env.E2E_TEST_USERNAME!, timezone: "Asia/Ho_Chi_Minh", mother: { create: { name: "Mẹ An", prePregnancyWeightKg: 54, pregnancies: { create: { pregnancyStatus: "PREGNANT", estimatedDueDate: due, checkups: { create: { visitType: "COMBINED", checkedAt: new Date(), gestationalWeek: 28, weightKg: 60, bloodPressure: "115/75", fetalHeartRate: 145, estimatedFetalWeightG: 1100, findings: "Dữ liệu thử nghiệm riêng." } } } } } } }, include: { mother: { include: { pregnancies: true } } } });
  userId = user.id;
  pregnancyId = user.mother!.pregnancies[0].id;
  const token = randomBytes(32).toString("hex");
  await prisma.session.create({ data: { userId, tokenHash: createHmac("sha256", process.env.APP_PASSWORD!).update(token).digest("hex"), expiresAt: new Date(Date.now() + 3600000) } });
  await context.addCookies([{ name: "mam_session", value: token, url: baseURL!, httpOnly: true, sameSite: "Lax" }]);
  errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
});
test.afterEach(async () => {
  try { expect(errors ?? []).toEqual([]); } finally { if (userId) await prisma.user.deleteMany({ where: { id: userId } }); }
});
test.afterAll(async () => { await prisma.$disconnect(); });

test("tổng quan có tuần thai tương tác, công cụ và bố cục thích ứng", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/mother/pregnancy");
  await expect(page.getByRole("heading", { name: /^Tuần 28/ })).toBeVisible();
  await page.getByRole("button", { name: "Tuần sau", exact: true }).click();
  await expect(page.getByRole("button", { name: "Xem tuần 29", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Tuổi thai hiện tại: 28 tuần 0 ngày", { exact: true })).toBeVisible();
  await expect(page.getByText("Khoảng cỡ quả bí đỏ hồ lô", { exact: true })).toBeVisible();
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: test.info().outputPath(`pregnancy-${width}.png`), fullPage: true });
  }
  await page.getByRole("link", { name: "Cử động thai", exact: true }).click();
  await expect(page.getByRole("navigation", { name: "Các mục thai kỳ" }).getByRole("link", { name: "Em bé", exact: true })).toHaveAttribute("aria-current", "page");
});

test("cử động: hoàn tác, phục hồi bản nháp, lưu và xuất lịch sử", async ({ page }) => {
  await page.goto("/mother/pregnancy/baby/kicks");
  await page.getByRole("button", { name: "Bắt đầu phiên", exact: true }).click();
  await page.getByRole("button", { name: "Ghi một cử động", exact: true }).click({ clickCount: 2, delay: 100 });
  await page.getByRole("button", { name: "Hoàn tác", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Ghi một cử động", exact: true })).toBeVisible();
  await page.getByRole("navigation", { name: "Các mục thai kỳ" }).getByRole("link", { name: "Tổng quan", exact: true }).click();
  await page.getByRole("link", { name: "Cử động thai", exact: true }).click();
  await page.getByRole("button", { name: "Lưu phiên", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Đã lưu phiên theo dõi.");
  await expect(page.getByText(/^1 cử động ·/)).toBeVisible();
  await expect.poll(() => prisma.pregnancyTrackingSession.count({ where: { pregnancyId, kind: "KICKS" } })).toBe(1);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Xuất lịch sử đã tải (CSV)", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("cu-dong-thai.csv");
});

test("cơn co: không lưu cơn chưa kết thúc và giữ đúng thời lượng", async ({ page }) => {
  await page.goto("/mother/pregnancy/health/contractions");
  await page.getByRole("button", { name: "Bắt đầu phiên", exact: true }).click();
  await page.getByRole("button", { name: "Bắt đầu cơn co", exact: true }).click();
  await expect(page.getByRole("button", { name: "Lưu phiên", exact: true })).toBeDisabled();
  await page.reload();
  await page.getByRole("button", { name: "Kết thúc cơn co", exact: true }).click();
  await page.getByRole("button", { name: "Lưu phiên", exact: true }).click();
  await expect(page.getByText(/^1 cơn co ·/)).toBeVisible();
  const record = await prisma.pregnancyTrackingSession.findFirstOrThrow({ where: { pregnancyId, kind: "CONTRACTIONS" } });
  const events = record.events as { start: number; end: number }[];
  expect(events).toHaveLength(1);
  expect(events[0].end).toBeGreaterThanOrEqual(events[0].start);
});

test("số đo: lưu, cập nhật cùng ngày, biểu đồ và xóa", async ({ page }) => {
  await page.goto("/mother/pregnancy/health/measurements");
  await page.getByText("Bổ sung số đo ở nhà (tùy chọn)", { exact: true }).click();
  await page.locator('input[name="weightKg"]').fill("61.5");
  await page.locator('input[name="bellyCm"]').fill("90");
  await page.getByRole("button", { name: "Lưu số đo", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Đã lưu số đo của mẹ.");
  await page.reload();
  await page.getByText("Bổ sung số đo ở nhà (tùy chọn)", { exact: true }).click();
  await expect(page.locator('input[name="bellyCm"]')).toHaveValue("90");
  await page.locator('input[name="weightKg"]').fill("62");
  await page.getByRole("button", { name: "Lưu số đo", exact: true }).click();
  await expect.poll(async () => (await prisma.pregnancyMeasurement.findFirst({ where: { pregnancyId } }))?.weightKg).toBe(62);
  expect(await prisma.pregnancyMeasurement.count({ where: { pregnancyId } })).toBe(1);
  await page.goto("/mother/pregnancy/health");
  await expect(page.getByRole("group", { name: "Diễn biến vòng bụng mẹ" })).toBeVisible();
  await page.goto("/mother/pregnancy/health/measurements");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Xóa bản ghi", exact: true }).click();
  await expect.poll(() => prisma.pregnancyMeasurement.count({ where: { pregnancyId } })).toBe(0);
});

test("ghi nhanh cảm nhận và chặn sửa số đo của thai kỳ khác", async ({ page }) => {
  await page.goto("/mother/pregnancy/health?new=1");
  await page.getByRole("button", { name: "Dễ chịu", exact: true }).click();
  await page.getByRole("button", { name: "Lưu nhật ký", exact: true }).click();
  await expect(page.getByRole("article").getByRole("heading", { name: "Hôm nay mẹ thấy dễ chịu", exact: true })).toBeVisible();
  await page.goto("/mother/pregnancy/health/measurements");
  await page.getByText("Bổ sung số đo ở nhà (tùy chọn)", { exact: true }).click();
  await page.route("**/mother/pregnancy/health/measurements", async (route) => {
    const request = route.request();
    if (request.method() === "POST") await route.continue({ postData: request.postData()!.replaceAll(pregnancyId, "not-owned-pregnancy") });
    else await route.continue();
  });
  await page.locator('input[name="weightKg"]').fill("60");
  await page.getByRole("button", { name: "Lưu số đo", exact: true }).click();
  await expect(page.locator("#measurement-form").getByRole("alert")).toHaveText("Không tìm thấy thai kỳ của bạn.");
  expect(await prisma.pregnancyMeasurement.count({ where: { pregnancyId } })).toBe(0);
});

test("thai kỳ đã sinh giữ lịch sử và không mở phiên theo dõi mới", async ({ page }) => {
  await prisma.pregnancy.update({ where: { id: pregnancyId }, data: { pregnancyStatus: "DELIVERED", actualDeliveryDate: new Date() } });
  await page.goto("/mother/pregnancy/baby/kicks");
  await expect(page.getByRole("button", { name: "Bắt đầu phiên", exact: true })).toHaveCount(0);
  await expect(page.getByText(/Phiên mới chỉ dành|phiên mới chỉ dành/)).toBeVisible();
});

test("Em bé đối chiếu toàn bộ phiếu siêu âm, chọn chỉ số và mở phiếu gốc", async ({ page }) => {
  const first = await prisma.pregnancyCheckup.create({ data: { pregnancyId, visitType: "ULTRASOUND", checkedAt: new Date("2026-05-01T00:00:00Z"), checkedAtTimeKnown: false, gestationalWeek: 20, estimatedFetalWeightG: 330, bpdMm: 48, hcMm: 180, acMm: 160, flMm: 35, findings: "Phiếu thử nghiệm tuần 20." } });
  const second = await prisma.pregnancyCheckup.create({ data: { pregnancyId, visitType: "ULTRASOUND", checkedAt: new Date("2026-06-01T00:00:00Z"), checkedAtTimeKnown: false, gestationalWeek: 24, bpdMm: 60, hcMm: 220, acMm: 190, flMm: 42, findings: "Phiếu thử nghiệm tuần 24, không ghi cân nặng thai." } });
  await prisma.pregnancyCheckup.create({ data: { pregnancyId, visitType: "PRENATAL_VISIT", checkedAt: new Date(), estimatedFetalWeightG: 99999, findings: "Phiếu khám không phải siêu âm." } });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/mother/pregnancy/baby");
  await expect(page.getByRole("region", { name: "Hành trình theo tuần", exact: true })).toHaveCount(0);
  await expect(page.locator("article[data-visit-type]")).toHaveCount(0);
  await expect(page.getByRole("group", { name: /Biểu đồ .* của bé/ })).toHaveCount(6);
  const weightChart = page.getByRole("region", { name: "Thống kê cân nặng thai ước tính", exact: true });
  await expect(weightChart).toContainText("+770 g");
  await expect(page.getByRole("region", { name: "Thống kê chu vi đầu · hc", exact: true })).toContainText("+40 mm");
  await page.getByText("Bảng đối chiếu số đo", { exact: true }).click();
  const table = page.getByRole("region", { name: "Bảng chỉ số có thể cuộn ngang", exact: true });
  await expect(table.locator("tbody tr")).toHaveCount(3);
  await expect(table.getByText("99999", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Thống kê lưỡng đỉnh · bpd", exact: true })).toContainText("+12 mm");
  await weightChart.getByRole("group").getByRole("button").first().click();
  await expect(weightChart.getByRole("link")).toHaveAttribute("href", `/mother/pregnancy/checkups?edit=${first.id}`);
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await expect(page.getByRole("heading", { name: "Em bé trong bụng mẹ", exact: true })).toHaveCount(1);
    await page.screenshot({ path: test.info().outputPath(`ultrasound-${width}.png`), fullPage: width < 600, animations: "disabled" });
  }
  await page.goto("/mother/pregnancy/checkups");
  const timeline = page.getByRole("list", { name: "Timeline khám thai và siêu âm", exact: true });
  await expect(timeline.locator("article[data-visit-type]")).toHaveCount(4);
  await expect(timeline.locator('[data-visit-type="PRENATAL_VISIT"]')).toHaveCount(1);
  await expect(page.locator(`#prenatal-${second.id}`)).toContainText("+40 mm");
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await timeline.screenshot({ path: test.info().outputPath(`prenatal-timeline-${width}.png`), animations: "disabled" });
  }
});

test("Em bé hiển thị đúng khi chỉ có một phiếu và khi chưa có siêu âm", async ({ page }) => {
  await page.goto("/mother/pregnancy/baby");
  await expect(page.getByRole("region", { name: "Thống kê cân nặng thai ước tính", exact: true })).toContainText("Chưa đủ hai ngày đo để so sánh");
  await prisma.pregnancyCheckup.deleteMany({ where: { pregnancyId } });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Bắt đầu từ phiếu siêu âm đầu tiên", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Thêm phiếu siêu âm", exact: true })).toBeVisible();
  await expect(page.getByRole("group", { name: /Diễn biến/ })).toHaveCount(0);
});

test("Em bé không ghép đường phát triển khi số đo chưa tách từng thai", async ({ page }) => {
  await prisma.pregnancyCheckup.updateMany({ where: { pregnancyId }, data: { fetusCount: 2 } });
  await page.goto("/mother/pregnancy/baby");
  await expect(page.getByText(/chưa có số đo riêng từng bé/)).toBeVisible();
  await page.getByText("Bảng đối chiếu số đo", { exact: true }).click();
  await expect(page.getByRole("group", { name: /Diễn biến/ })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Bảng chỉ số có thể cuộn ngang", exact: true }).locator("tbody tr")).toHaveCount(1);
});

test("Mẹ tự dùng dữ liệu khám, giữ các lần cũ và cập nhật khi sửa phiếu gốc", async ({ page }) => {
  const current = await prisma.pregnancyCheckup.findFirstOrThrow({ where: { pregnancyId } });
  await prisma.pregnancyCheckup.create({ data: { pregnancyId, visitType: "PRENATAL_VISIT", checkedAt: new Date("2026-10-01T00:00:00Z"), checkedAtTimeKnown: false, gestationalWeek: 24, weightKg: 58, bloodPressure: "110/70", maternalPulse: 90, clinicalFetalHeartRate: 150, edema: "ABSENT", urineTestResult: "Âm tính theo phiếu", careInstructions: "Lời dặn thử nghiệm của bác sĩ" } });
  await prisma.pregnancyCheckup.create({ data: { pregnancyId, visitType: "ULTRASOUND", checkedAt: new Date(Date.now() + 1000), gestationalWeek: 28, fetalHeartRate: 145 } });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/mother/pregnancy/health");
  const health = page.getByRole("region", { name: "Thống kê sức khỏe mẹ từ kết quả khám", exact: true });
  await expect(health.getByRole("button", { name: /Cân nặng mẹ/ })).toContainText("60");
  await expect(health.getByRole("button", { name: /Huyết áp/ })).toContainText("115/75");
  await expect(health.getByRole("button", { name: /Mạch mẹ/ })).toContainText("90");
  await expect(page.getByRole("group", { name: "So sánh huyết áp tâm thu và tâm trương", exact: true })).toBeVisible();
  await expect(page.getByRole("group", { name: "Diễn biến cân nặng mẹ", exact: true })).toBeVisible();
  await expect(page.getByRole("group", { name: "Diễn biến mạch mẹ", exact: true })).toBeVisible();
  await expect(page.getByRole("list", { name: /Timeline|Hành trình những lần/ })).toHaveCount(0);
  await page.getByText("Ghi nhận & dặn dò của bác sĩ", { exact: true }).click();
  await expect(page.getByText("Không phù (-)", { exact: true })).toBeVisible();
  await expect(page.getByText("Âm tính theo phiếu", { exact: true })).toBeVisible();
  await expect(page.getByText("Lời dặn thử nghiệm của bác sĩ", { exact: true })).toBeVisible();
  expect(await prisma.pregnancyMeasurement.count({ where: { pregnancyId } })).toBe(0);
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: test.info().outputPath(`maternal-${width}.png`), fullPage: width < 600, animations: "disabled" });
  }
  await page.goto("/mother/pregnancy/health/measurements");
  await expect(page.locator('input[name="weightKg"]')).toBeHidden();
  await expect(page.getByRole("region", { name: "Bảng nguồn số đo mẹ", exact: true }).getByRole("cell", { name: "58", exact: true })).toBeVisible();
  await page.goto("/mother/pregnancy/baby");
  await expect(page.getByRole("region", { name: "Tim thai từ khám lâm sàng", exact: true })).toContainText("150 lần/phút");
  await page.goto(`/mother/pregnancy/checkups?edit=${current.id}`);
  await page.locator('input[name="weightKg"]').fill("62");
  await page.getByRole("button", { name: "Cập nhật", exact: true }).click();
  await expect(page).toHaveURL(/\/mother\/pregnancy\/checkups$/);
  await page.goto("/mother/pregnancy/health");
  await expect(page.getByRole("button", { name: /Cân nặng mẹ/ })).toContainText("62");
  await page.goto("/mother/pregnancy");
  await expect(page.getByText("62 kg", { exact: true })).toBeVisible();
  expect(await prisma.pregnancyMeasurement.count({ where: { pregnancyId } })).toBe(0);
  await prisma.pregnancyCheckup.delete({ where: { id: current.id } });
  await page.goto("/mother/pregnancy/health");
  await expect(page.getByRole("button", { name: /Cân nặng mẹ/ })).toContainText("58");
});

test("thanh tab ổn định khi chuyển liên tục trên màn hình hẹp", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/mother/pregnancy");
  const nav = page.getByRole("navigation", { name: "Các mục thai kỳ", exact: true });
  for (let round = 0; round < 2; round++) {
    for (const path of ["baby", "health", "memories", "checkups", ""]) {
      const href = `/mother/pregnancy${path ? `/${path}` : ""}`;
      const tab = nav.locator(`a[href="${href}"]`);
      await tab.click();
      await expect(tab).toHaveAttribute("aria-current", "page");
      await expect(page).toHaveURL(new RegExp(`${href}$`));
    }
  }
});

test("hành trình lưu việc, nhắc lại, ghi chú theo thai kỳ và liên kết phiếu gốc", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/mother/pregnancy");
  const care = page.getByRole("region", { name: "Việc cần làm trong hành trình", exact: true });
  const task = care.getByRole("article", { name: "Hỏi về đường huyết và kiểm tra thiếu máu", exact: true });
  await expect(task).toBeVisible();
  await expect(task.getByRole("link", { name: /tuần 28/ })).toHaveAttribute("href", /checkups\?edit=/);
  await task.getByText("Ghi chú, đánh dấu & nhắc lại", { exact: true }).click();
  await task.getByLabel("Ghi chú của mẹ").fill("Hỏi bác sĩ cách chuẩn bị xét nghiệm");
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  await task.getByLabel("Ngày nhắc lại (tùy chọn)").fill(tomorrow);
  await task.getByRole("button", { name: "Lưu việc cần làm" }).click();
  await expect(task.getByRole("status")).toBeVisible();
  await expect.poll(async () => prisma.pregnancyJourneyTask.count({ where: { pregnancyId, taskKey: "glucose", done: false } })).toBe(1);
  expect(await (await page.request.get("/api/calendar")).text()).toContain(`journey-task-${pregnancyId}-glucose`);
  await page.reload();
  await task.getByText("Xem / sửa ghi chú & trạng thái", { exact: true }).click();
  await expect(task.getByLabel("Ghi chú của mẹ")).toHaveValue("Hỏi bác sĩ cách chuẩn bị xét nghiệm");
  await expect(task.getByLabel("Ngày nhắc lại (tùy chọn)")).toHaveValue(tomorrow);
  await task.getByLabel("Mẹ xác nhận đã làm").check();
  await task.getByRole("button", { name: "Lưu việc cần làm" }).click();
  await expect(task.getByText("Đã làm", { exact: true })).toBeVisible();
  expect(await (await page.request.get("/api/calendar")).text()).not.toContain(`journey-task-${pregnancyId}-glucose`);
  expect(await prisma.pregnancyJourneyTask.count({ where: { pregnancyId, taskKey: "glucose" } })).toBe(1);
  await page.getByRole("button", { name: "Tuần sau", exact: true }).click();
  await expect(care.getByRole("heading", { name: "Mẹ cần gì ở tuần 29?" })).toBeVisible();
  await expect(care.getByRole("article", { name: "Chuẩn bị kế hoạch đón con" })).toBeVisible();
  await page.getByRole("button", { name: "Tuần trước", exact: true }).click();
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    await care.scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: test.info().outputPath(`journey-care-${width}.png`), fullPage: width < 600 });
  }
});

test("hành trình chặn ghi vào thai kỳ không thuộc tài khoản", async ({ page }) => {
  await page.goto("/mother/pregnancy");
  const task = page.getByRole("article", { name: "Hỏi về đường huyết và kiểm tra thiếu máu", exact: true });
  await task.getByText("Ghi chú, đánh dấu & nhắc lại", { exact: true }).click();
  await page.route("**/mother/pregnancy", async (route) => {
    const request = route.request();
    if (request.method() === "POST") await route.continue({ postData: request.postData()!.replaceAll(pregnancyId, "not-owned-pregnancy") });
    else await route.continue();
  });
  await task.getByLabel("Ghi chú của mẹ").fill("Không được lưu");
  await task.getByRole("button", { name: "Lưu việc cần làm" }).click();
  await expect(task.getByRole("alert")).toHaveText("Không tìm thấy thai kỳ của bạn.");
  expect(await prisma.pregnancyJourneyTask.count({ where: { pregnancyId } })).toBe(0);
});
