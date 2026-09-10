"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export type VoiceLogActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const optionalDate = z.preprocess(
  (value) =>
    value === "" || value === null || value === undefined
      ? undefined
      : new Date(String(value)),
  z.date().optional(),
);
const requiredDate = z.preprocess((value) => new Date(String(value)), z.date());
const optionalNumber = z.preprocess(
  (value) =>
    value === "" || value === null || value === undefined ? undefined : Number(value),
  z.number().nonnegative().optional(),
);
const optionalInteger = z.preprocess(
  (value) =>
    value === "" || value === null || value === undefined ? undefined : Number(value),
  z.number().int().nonnegative().optional(),
);

const feedingInput = z
  .object({
    babyId: z.string().min(1),
    kind: z.literal("feeding"),
    operation: z.enum(["start", "finish", "complete"]),
    type: z.enum(["BREASTFEEDING", "BOTTLE_BREAST_MILK", "FORMULA", "MIXED"]),
    startTime: optionalDate,
    endTime: optionalDate,
    leftBreastDuration: optionalInteger,
    rightBreastDuration: optionalInteger,
    firstSide: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.enum(["LEFT", "RIGHT"]).optional(),
    ),
    amountMl: optionalNumber,
    milkType: z.string().trim().max(100).optional(),
  })
  .superRefine((value, context) => {
    if (value.operation !== "finish" && !value.startTime) {
      context.addIssue({ code: "custom", message: "Thiếu thời gian bắt đầu." });
    }
    if ((value.operation === "finish" || value.operation === "complete") && !value.endTime) {
      context.addIssue({ code: "custom", message: "Thiếu thời gian kết thúc." });
    }
    if (value.startTime && value.endTime && value.endTime < value.startTime) {
      context.addIssue({ code: "custom", message: "Thời gian kết thúc phải sau thời gian bắt đầu." });
    }
  });

const sleepInput = z
  .object({
    babyId: z.string().min(1),
    kind: z.literal("sleep"),
    operation: z.enum(["start", "finish", "complete"]),
    startTime: optionalDate,
    endTime: optionalDate,
    type: z.enum(["NAP", "NIGHT"]),
  })
  .superRefine((value, context) => {
    if (value.operation !== "finish" && !value.startTime) {
      context.addIssue({ code: "custom", message: "Thiếu thời gian bắt đầu." });
    }
    if (value.operation === "finish" && !value.endTime) {
      context.addIssue({ code: "custom", message: "Thiếu thời gian thức dậy." });
    }
    if (value.operation === "complete" && !value.endTime) {
      context.addIssue({ code: "custom", message: "Thiếu thời gian kết thúc." });
    }
    if (value.startTime && value.endTime && value.endTime < value.startTime) {
      context.addIssue({ code: "custom", message: "Thời gian kết thúc phải sau thời gian bắt đầu." });
    }
  });

const diaperInput = z.object({
  babyId: z.string().min(1),
  kind: z.literal("diaper"),
  type: z.enum(["WET", "STOOL", "BOTH"]),
  changedAt: requiredDate,
});

async function ownsBaby(babyId: string, userId: string) {
  return db.baby.findFirst({
    where: { id: babyId, userId },
    select: { id: true },
  });
}

export async function saveVoiceLogAction(
  _previousState: VoiceLogActionState,
  formData: FormData,
): Promise<VoiceLogActionState> {
  const user = await requireUser();
  const raw = Object.fromEntries(formData.entries());

  try {
    const babyId = String(raw.babyId ?? "");
    if (!(await ownsBaby(babyId, user.id))) {
      return { status: "error", message: "Không tìm thấy hồ sơ bé." };
    }

    if (raw.kind === "feeding") {
      const data = feedingInput.parse(raw);
      if (data.operation === "finish") {
        const openFeeding = await db.feeding.findFirst({
          where: { babyId: data.babyId, endTime: null },
          orderBy: { startTime: "desc" },
          select: { id: true, startTime: true },
        });
        if (!openFeeding) {
          return { status: "error", message: "Không có cữ bú nào đang mở để kết thúc." };
        }
        if (data.endTime && data.endTime < openFeeding.startTime) {
          return { status: "error", message: "Giờ kết thúc phải sau lúc bắt đầu bú." };
        }
        await db.feeding.update({
          where: { id: openFeeding.id },
          data: { endTime: data.endTime },
        });
      } else {
        await db.feeding.create({
          data: {
            babyId: data.babyId,
            type: data.type,
            startTime: data.startTime!,
            endTime: data.operation === "complete" ? data.endTime : undefined,
            leftBreastDuration: data.leftBreastDuration,
            rightBreastDuration: data.rightBreastDuration,
            firstSide: data.firstSide,
            amountMl: data.amountMl,
            milkType: data.milkType || undefined,
          },
        });
      }
    } else if (raw.kind === "sleep") {
      const data = sleepInput.parse(raw);
      if (data.operation === "finish") {
        const openSleep = await db.sleepEntry.findFirst({
          where: { babyId: data.babyId, endTime: null },
          orderBy: { startTime: "desc" },
          select: { id: true, startTime: true },
        });
        if (!openSleep) {
          return {
            status: "error",
            message: "Không có giấc ngủ nào đang mở để kết thúc.",
          };
        }
        if (data.endTime && data.endTime < openSleep.startTime) {
          return {
            status: "error",
            message: "Giờ thức dậy phải sau lúc bé bắt đầu ngủ.",
          };
        }
        await db.sleepEntry.update({
          where: { id: openSleep.id },
          data: { endTime: data.endTime },
        });
      } else {
        await db.sleepEntry.create({
          data: {
            babyId: data.babyId,
            startTime: data.startTime!,
            endTime: data.operation === "complete" ? data.endTime : undefined,
            type: data.type,
          },
        });
      }
    } else if (raw.kind === "diaper") {
      const data = diaperInput.parse(raw);
      await db.diaperEntry.create({
        data: {
          babyId: data.babyId,
          type: data.type,
          changedAt: data.changedAt,
        },
      });
    } else {
      return { status: "error", message: "Loại hoạt động không hợp lệ." };
    }

    revalidatePath("/");
    revalidatePath("/activity");
    return { status: "success", message: "Đã lưu vào nhật ký của bé." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: "error",
        message: error.issues[0]?.message ?? "Thông tin chưa hợp lệ.",
      };
    }
    console.error("Voice log save failed", error);
    return { status: "error", message: "Chưa thể lưu. Vui lòng thử lại." };
  }
}
