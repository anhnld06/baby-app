import { z } from "zod";

export const trackingEventSchema = z.object({ start: z.number().int().positive(), end: z.number().int().positive().optional() });
export type TrackingEvent = z.infer<typeof trackingEventSchema>;
export const trackingSessionSchema = z.object({
  pregnancyId: z.string().min(1),
  clientId: z.string().uuid(),
  kind: z.enum(["KICKS", "CONTRACTIONS"]),
  startedAt: z.number().int().positive(),
  endedAt: z.number().int().positive(),
  events: z.array(trackingEventSchema).min(1, "Ghi ít nhất một lần trước khi lưu.").max(500),
  notes: z.string().trim().max(1000).optional(),
}).superRefine((session, ctx) => {
  if (session.endedAt < session.startedAt || session.endedAt - session.startedAt > 48 * 3600000 || session.endedAt > Date.now() + 300000) {
    ctx.addIssue({ code: "custom", message: "Khoảng thời gian của phiên không hợp lệ." });
  }
  let previousEnd = session.startedAt;
  for (const event of session.events) {
    if (event.start < previousEnd || event.start < session.startedAt || event.start > session.endedAt ||
      (session.kind === "CONTRACTIONS" && (event.end == null || event.end < event.start || event.end > session.endedAt)) ||
      (session.kind === "KICKS" && event.end != null)) {
      ctx.addIssue({ code: "custom", message: "Thời điểm ghi nhận không hợp lệ hoặc chồng lấn." });
      break;
    }
    previousEnd = event.end ?? event.start;
  }
});

const optionalMetric = (max: number) => z.preprocess((value) => value === "" || value == null ? undefined : Number(value), z.number().positive().max(max).optional());
export const pregnancyMeasurementSchema = z.object({
  pregnancyId: z.string().min(1),
  measuredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Ngày đo không hợp lệ."),
  weightKg: optionalMetric(400),
  bellyCm: optionalMetric(250),
  notes: z.string().trim().max(1000).optional(),
}).refine((value) => value.weightKg != null || value.bellyCm != null, "Nhập cân nặng hoặc vòng bụng để lưu.");

export function sessionSummary(events: TrackingEvent[], kind: "KICKS" | "CONTRACTIONS") {
  const durations = kind === "CONTRACTIONS" ? events.filter((e) => e.end != null).map((e) => e.end! - e.start) : [];
  const intervals = events.slice(1).map((event, index) => event.start - events[index].start);
  return { count: events.length, averageDurationMs: durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : null,
    averageIntervalMs: intervals.length ? intervals.reduce((a, b) => a + b, 0) / intervals.length : null };
}

export const trackingDraftSchema = z.object({
  clientId: z.string().uuid(), startedAt: z.number().int().positive(),
  activeStart: z.number().int().positive().optional(),
  events: z.array(trackingEventSchema).max(500),
});
export type TrackingDraft = z.infer<typeof trackingDraftSchema>;

export function durationLabel(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

