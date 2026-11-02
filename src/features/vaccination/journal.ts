import { z } from "zod";

export const vaccinationDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Hãy chọn ngày hợp lệ.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return (
      Number.isFinite(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }, "Ngày không hợp lệ.");
const optionalDate = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  vaccinationDate.optional(),
);
const optionalText = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.string().trim().max(1000).optional(),
);
export const appointmentSchema = z.object({
  owner: z.string().min(1),
  vaccineName: z.string().trim().min(1, "Hãy nhập tên vắc-xin.").max(200),
  doseNumber: z.preprocess(
    (value) => (value === "" || value == null ? undefined : Number(value)),
    z.number().int().min(1).max(100).optional(),
  ),
  scheduledAt: vaccinationDate,
  administeredAt: optionalDate,
  facility: optionalText,
  notes: optionalText,
});
export const completionSchema = z
  .object({
    administeredAt: vaccinationDate,
    nextScheduledAt: optionalDate,
    facility: optionalText,
    notes: optionalText,
  })
  .refine(
    (value) =>
      !value.nextScheduledAt || value.nextScheduledAt > value.administeredAt,
    {
      message: "Ngày hẹn tiếp theo phải sau ngày đã tiêm.",
      path: ["nextScheduledAt"],
    },
  );
export const historySchema = appointmentSchema
  .omit({ scheduledAt: true })
  .extend({ administeredAt: vaccinationDate });
export type VaccinationFormState = { error?: string };
export function dateFromInput(value: string) {
  return new Date(`${value}T00:00:00Z`);
}
export function appointmentStatus(date: Date, today: string) {
  const day = date.toISOString().slice(0, 10);
  return day < today
    ? "Đã qua ngày hẹn"
    : day === today
      ? "Hôm nay"
      : "Sắp tới";
}
