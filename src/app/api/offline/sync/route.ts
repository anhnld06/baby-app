import { z } from "zod";
import { OFFLINE_MUTATION_TYPES } from "@/features/offline/types";
import { getCurrentUser } from "@/lib/auth";
import { zonedDateTimeToUtc } from "@/lib/date";
import { db } from "@/lib/db";
import { diaperSchema, feedingSchema, sleepSchema } from "@/lib/validation";

const mutationSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(OFFLINE_MUTATION_TYPES),
  payload: z.record(z.string().max(100), z.string().max(2000)),
  createdAt: z.string().datetime(),
  attempts: z.number().int().nonnegative().max(100),
}).refine((value) => Object.keys(value.payload).length <= 30, "Quá nhiều trường dữ liệu");

function withUtcDates(
  payload: Record<string, string>,
  timezone: string,
  fields: string[],
) {
  const result: Record<string, string | Date> = { ...payload };
  for (const field of fields) {
    const value = result[field];
    if (typeof value === "string" && value.includes("T")) {
      result[field] = zonedDateTimeToUtc(value, timezone);
    }
  }
  return result;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Phiên đăng nhập đã hết hạn" }, { status: 401 });
  const parsed = mutationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Dữ liệu đồng bộ không hợp lệ" }, { status: 400 });
  }
  const mutation = parsed.data;
  try {
    const result = await db.$transaction(async (transaction) => {
      const receipt = await transaction.offlineMutationReceipt.findUnique({
        where: { id: mutation.id },
      });
      if (receipt) {
        if (receipt.userId !== user.id) throw new Error("mutation-owner-mismatch");
        return { resultId: receipt.resultId, duplicate: true };
      }
      const babyId = mutation.payload.babyId;
      const baby = await transaction.baby.findFirst({
        where: { id: babyId, userId: user.id },
        select: { id: true },
      });
      if (!baby) throw new Error("baby-not-found");

      let resultId: string;
      if (mutation.type === "CREATE_FEEDING") {
        const data = feedingSchema.parse(
          withUtcDates(mutation.payload, user.timezone, ["startTime", "endTime"]),
        );
        const created = await transaction.feeding.create({
          data: { ...data, id: undefined, babyId: baby.id },
          select: { id: true },
        });
        resultId = created.id;
      } else if (mutation.type === "CREATE_SLEEP") {
        const data = sleepSchema.parse(
          withUtcDates(mutation.payload, user.timezone, ["startTime", "endTime"]),
        );
        const created = await transaction.sleepEntry.create({
          data: { ...data, id: undefined, babyId: baby.id },
          select: { id: true },
        });
        resultId = created.id;
      } else {
        const data = diaperSchema.parse(
          withUtcDates(mutation.payload, user.timezone, ["changedAt"]),
        );
        const created = await transaction.diaperEntry.create({
          data: { ...data, id: undefined, babyId: baby.id },
          select: { id: true },
        });
        resultId = created.id;
      }
      await transaction.offlineMutationReceipt.create({
        data: { id: mutation.id, userId: user.id, resultId },
      });
      return { resultId, duplicate: false };
    });
    return Response.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "sync-failed";
    if (message === "baby-not-found" || message === "mutation-owner-mismatch") {
      return Response.json({ error: "Không có quyền ghi dữ liệu này" }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Nội dung biểu mẫu không hợp lệ" }, { status: 400 });
    }
    return Response.json({ error: "Máy chủ chưa thể đồng bộ dữ liệu" }, { status: 500 });
  }
}
