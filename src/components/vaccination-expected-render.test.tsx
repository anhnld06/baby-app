import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/vaccination-actions", () => ({ toggleScheduledDose: vi.fn() }));
vi.mock("next/navigation", () => ({
  usePathname: () => "/vaccination-schedule",
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

import { NextAppointmentField } from "@/components/next-appointment-field";
import { UpcomingVaccination } from "@/components/upcoming-vaccination";
import { VaccinationChecklist } from "@/components/vaccination-checklist";
import { planDoses, type DatedRecord } from "@/features/vaccination/expected";

const day = (iso: string) => new Date(`${iso}T00:00:00Z`);
const record = (scheduleKey: string, administeredAt: string): DatedRecord & { appointment: null } => ({
  id: scheduleKey,
  scheduleKey,
  vaccineName: scheduleKey,
  doseNumber: null,
  administeredAt: day(administeredAt),
  appointment: null,
});
// The user's screenshot: 5-in-1 dose 1 given 30/10/2026, baby born 01/08/2026 (dose 1 late).
const plans = planDoses("baby", { birth: day("2026-08-01"), records: [record("5in1-1", "2026-10-30")], appointments: [], today: "2026-11-09" });
const text = (html: string) => html.replace(/<br\/>/g, " ").replace(/<[^>]+>/g, "").replace(/&#x27;/g, "'");

describe("expected vaccination dates in the UI", () => {
  it("shows concrete dates, basis and the next dose in the vaccine view", () => {
    const html = renderToStaticMarkup(<VaccinationChecklist kind="baby" ownerId="b" name="Vani" plans={plans} today="2026-11-09" />);
    const visible = text(html);
    expect(visible).toContain("Lịch chuẩn: 2 → 3 → 4 tháng tuổi · 3 mũi");
    expect(visible).toContain("Tiếp theo: Mũi 2 · dự kiến 30/11/2026");
    expect(visible).toContain("Dự kiến 30/11/2026");
    expect(visible).toContain("1 tháng sau mũi 1 (tiêm 30/10)");
    expect(visible).toContain("Dự kiến 30/12/2026");
    expect(visible).toContain("ước tính · 1 tháng sau mũi 2");
    expect(visible).toContain("Mũi 2: sớm nhất 27/11/2026");
    expect(visible).toContain("Mũi trước tiêm muộn nên các mũi sau lùi theo khoảng cách giữa các mũi");
    expect(visible).toContain("Đặt hẹn ngày này (mũi 2 · 30/11/2026)");
    expect(html).toContain('href="/vaccination-schedule?owner=baby&amp;book=5in1-2#dat-hen"');
  });

  it("replaces the stale reference date in the age view with an expected date and status", () => {
    const html = renderToStaticMarkup(<VaccinationChecklist kind="baby" ownerId="b" name="Vani" plans={plans} today="2026-11-09" view="age" />);
    const visible = text(html);
    expect(visible).not.toContain("Mốc tham khảo");
    expect(visible).toContain("Dự kiến 30/11/2026");
    expect(visible).toContain("1 tháng sau mũi 1 (tiêm 30/10) · sớm nhất 27/11/2026");
    expect(html).toMatch(/data-schedule-key="5in1-2"[^>]*data-dose-status="upcoming"/);
    // The tick dialog defaults to today and never allows a future date.
    expect(html).toContain('aria-haspopup="dialog"');
  });

  it("shows the computed next dose on the home card when no appointment covers it", () => {
    const html = renderToStaticMarkup(<UpcomingVaccination appointment={null} expected={plans.find((plan) => plan.entry.key === "5in1-2")} />);
    expect(text(html)).toContain("5 trong 1 / 6 trong 1 - mũi 2 · 30/11/2026 (chưa đặt hẹn)");
    expect(text(html)).toContain("Đặt hẹn ngày này");
    const booked = renderToStaticMarkup(<UpcomingVaccination appointment={{ vaccineName: "Hexaxim mũi 2", scheduledAt: day("2026-11-25") }} expected={plans.find((plan) => plan.entry.key === "5in1-2")} />);
    expect(text(booked)).toContain("Hexaxim mũi 2 · 25/11/2026");
    expect(text(booked)).not.toContain("chưa đặt hẹn");
    expect(renderToStaticMarkup(<UpcomingVaccination appointment={null} expected={null} />)).toBe("");
  });

  it("starts the next-appointment date empty and only offers the computed date as a one-tap suggestion", () => {
    const html = renderToStaticMarkup(<NextAppointmentField id="next" suggestion={{ date: "2026-11-30", text: "Gợi ý: mũi 2 dự kiến 30/11/2026 (sớm nhất 27/11) nếu tiêm hôm nay." }} />);
    expect(html).toMatch(/<input type="hidden" name="nextScheduledAt" value=""\/>/);
    expect(text(html)).toContain("Gợi ý: mũi 2 dự kiến 30/11/2026 (sớm nhất 27/11) nếu tiêm hôm nay.");
    expect(text(html)).toContain("Dùng ngày dự kiến");
    expect(html).not.toContain("2026-11-30");
  });
});
