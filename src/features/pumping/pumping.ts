import { z } from "zod";

const blankToUndefined = (value: unknown) => value === "" || value == null ? undefined : value;
const amount = z.preprocess(blankToUndefined, z.coerce.number().finite().min(0).max(3000).optional());

export const pumpingSchema = z.object({
  id: z.preprocess(blankToUndefined, z.string().min(1).optional()),
  startTime: z.date().refine((date) => date <= new Date(), "Giờ hút sữa không thể ở tương lai"),
  durationMinutes: z.preprocess(blankToUndefined, z.coerce.number().int().min(1).max(1440).optional()),
  leftAmountMl: amount,
  rightAmountMl: amount,
  notes: z.preprocess(blankToUndefined, z.string().trim().max(1000).optional()),
}).refine((entry) => entry.leftAmountMl !== undefined || entry.rightAmountMl !== undefined, {
  message: "Nhập lượng sữa ít nhất một bên (có thể là 0 ml)", path: ["leftAmountMl"],
});

export function pumpingAmount(entry: { leftAmountMl?: number | null; rightAmountMl?: number | null }) {
  return (entry.leftAmountMl ?? 0) + (entry.rightAmountMl ?? 0);
}

export function pumpingSummary(entries: Parameters<typeof pumpingAmount>[0][]) {
  const measured = entries.filter((entry) => entry.leftAmountMl != null || entry.rightAmountMl != null);
  const totalMl = measured.reduce((sum, entry) => sum + pumpingAmount(entry), 0);
  return { count: entries.length, totalMl, averageMl: measured.length ? totalMl / measured.length : 0 };
}
