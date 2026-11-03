import { z } from "zod";

export const temperatureMethods = {
  AXILLARY: "Nách", RECTAL: "Hậu môn", EAR: "Tai", FOREHEAD: "Trán", ORAL: "Miệng", OTHER: "Khác",
} as const;
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, "Ngày không hợp lệ");
const optionalText = (max: number) => z.string().trim().max(max).optional().default("");
export const temperatureSchema = z.object({
  celsius: z.string().trim().transform(value => Number(value.replace(",", "."))).pipe(z.number().min(25).max(45)),
  method: z.enum(["AXILLARY", "RECTAL", "EAR", "FOREHEAD", "ORAL", "OTHER"]),
  measuredAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/),
  notes: optionalText(2000),
});
export const medicationSchema = z.object({
  name: z.string().trim().min(1).max(200),
  dosage: z.string().trim().min(1).max(200),
  instructions: optionalText(2000),
  startDate: day,
  endDate: z.union([day, z.literal("")]).optional().default(""),
  times: z.string().trim().transform(value => [...new Set(value.split(/[,;\s]+/).filter(Boolean))].sort()).pipe(z.array(z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/)).min(1).max(12)),
}).refine(value => !value.endDate || value.endDate >= value.startDate, "Ngày kết thúc phải sau ngày bắt đầu");
export const doseSchema = z.object({ day, time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/), taken: z.enum(["true", "false"]) });
export function scheduledOn(schedule: { startDate: Date; endDate: Date | null; active: boolean }, day: string) {
  return schedule.active && schedule.startDate.toISOString().slice(0, 10) <= day && (!schedule.endDate || schedule.endDate.toISOString().slice(0, 10) >= day);
}
