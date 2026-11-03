import { z } from "zod";

export const pregnancyJournalSchema = z.object({
  id: z.string().optional(),
  pregnancyId: z.string().min(1),
  kind: z.enum(["HEALTH", "MEMORY"]),
  occurredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Ngày ghi nhận không hợp lệ"),
  title: z.string().trim().min(1, "Vui lòng nhập tiêu đề").max(120, "Tiêu đề tối đa 120 ký tự"),
  content: z.string().trim().min(1, "Vui lòng nhập nội dung").max(10000, "Nội dung tối đa 10.000 ký tự"),
});
