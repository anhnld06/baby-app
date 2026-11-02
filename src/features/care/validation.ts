import { z } from "zod";
export const careSchema = z.object({
  title: z.string().trim().min(1, "Nhập tên hoạt động").max(160),
  details: z.string().trim().max(4000).default(""),
  amount: z.string().trim().max(160).default(""),
  mood: z
    .enum(["", "Vui vẻ", "Bình thường", "Khó chịu", "Quấy khóc", "Buồn ngủ"])
    .default(""),
  symptoms: z.string().trim().max(1000).default(""),
  durationMinutes: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().int().min(1).max(1440).optional(),
  ),
});
