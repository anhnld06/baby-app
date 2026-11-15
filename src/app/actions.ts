"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { toDateTimeLocal, zonedDateTimeToUtc } from "@/lib/date";
import { db } from "@/lib/db";
import { refreshWhoGrowthAssessment } from "@/features/growth/who-anthro";
import { parseProfileCoverUpdate } from "@/lib/profile-cover";
import { isUniqueConstraintError } from "@/lib/prisma-errors";
import {
  ActionError,
  assertUpdated,
  captureActionError,
  parseInput,
  type ActionResult,
} from "@/lib/action-result";
import {
  babySchema,
  babyInsuranceSchema,
  babyMedicalVisitSchema,
  cycleSettingsSchema,
  diaperSchema,
  feedingSchema,
  growthSchema,
  menstrualCycleSchema,
  motherDailyHealthLogSchema,
  motherSchema,
  motherInsuranceSchema,
  motherMedicalVisitSchema,
  parsePrescriptionItems,
  pregnancyCheckupSchema,
  pregnancySchema,
  prescriptionSchema,
  sleepSchema,
  toothSchema,
} from "@/lib/validation";

// Save actions submitted through FormActionBar return `{ error }` for expected
// failures (invalid input, missing profile, record deleted on the other
// parent's phone) so the form keeps what was typed. redirect() is always
// called after captureActionError() so Next.js navigation is not swallowed.

function values(formData: FormData, timeZone?: string, dateTimeFields: string[] = []) {
  const result = Object.fromEntries(formData.entries());
  if (!timeZone) return result;
  for (const field of dateTimeFields) {
    const value = result[field];
    if (typeof value === "string" && value.includes("T")) {
      result[field] = zonedDateTimeToUtc(value, timeZone) as never;
    }
  }
  return result;
}

async function requireOwnedBaby(babyId: string, userId: string) {
  const baby = await db.baby.findFirst({
    where: { id: babyId, userId },
    select: { id: true },
  });
  if (!baby) throw new ActionError("Không tìm thấy hồ sơ bé.");
  return baby;
}

async function requireOwnedMother(motherId: string, userId: string) {
  const mother = await db.mother.findFirst({
    where: { id: motherId, userId },
    select: { id: true },
  });
  if (!mother) throw new ActionError("Không tìm thấy hồ sơ mẹ.");
  return mother;
}

// Partial unique indexes allow one open sleep (no endTime) and one running
// breastfeeding timer per baby; a manual entry colliding with them is P2002.
const OPEN_SLEEP_ERROR =
  "Bé đang có giấc ngủ chưa kết thúc. Hãy kết thúc giấc đang chạy trước.";
const OPEN_FEEDING_ERROR =
  "Bé đang có cữ bú mẹ đang bấm giờ. Hãy kết thúc cữ bú đó trước hoặc nhập giờ kết thúc cho bản ghi này.";

async function withOpenEntryGuard(message: string, run: () => Promise<void>) {
  try {
    await run();
  } catch (error) {
    if (isUniqueConstraintError(error)) throw new ActionError(message);
    throw error;
  }
}

function profileCover(formData: FormData) {
  try {
    return parseProfileCoverUpdate(formData);
  } catch {
    throw new ActionError("Ảnh bìa cần là JPG, PNG hoặc WebP hợp lệ, tối đa 500 KB.");
  }
}

export async function setSelectedBabyAction(formData: FormData) {
  const user = await requireUser();
  const babyId = String(formData.get("babyId") ?? "");
  const baby = await db.baby.findFirst({
    where: { id: babyId, userId: user.id },
    select: { id: true },
  });
  if (baby)
    (await cookies()).set("selectedBabyId", baby.id, {
      sameSite: "lax",
      path: "/",
      maxAge: 31_536_000,
    });
  revalidatePath("/", "layout");
}

export async function saveMotherAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const failure = await captureActionError(async () => {
    const data = parseInput(motherSchema, values(formData));
    const coverImage = profileCover(formData);
    // One mother profile per account: upsert on the unique userId so both
    // parents saving at once cannot race into a duplicate-key error.
    const { id: motherId } = await db.mother.upsert({
      where: { userId: user.id },
      create: { ...data, id: undefined, userId: user.id },
      update: { ...data, id: undefined },
      select: { id: true },
    });
    if (coverImage === null) {
      await db.motherProfileCover.deleteMany({ where: { motherId } });
    } else if (coverImage) {
      await db.motherProfileCover.upsert({
        where: { motherId },
        create: { motherId, ...coverImage },
        update: coverImage,
      });
    }
  });
  if (failure) return failure;
  revalidatePath("/", "layout");
  const next = formData.get("next");
  redirect(next === "pregnancy" ? "/profile/pregnancy" : "/profile", RedirectType.replace);
}

export async function deleteMotherAction() {
  const user = await requireUser();
  await db.mother.deleteMany({ where: { userId: user.id } });
  revalidatePath("/profile");
  redirect("/profile", RedirectType.replace);
}

export async function savePregnancyAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const failure = await captureActionError(async () => {
    const data = parseInput(pregnancySchema, values(formData));
    const mother = await requireOwnedMother(data.motherId, user.id);
    await db.$transaction(async (transaction) => {
      // Lock the mother row so two phones saving at once cannot both leave a
      // PREGNANT pregnancy behind (the rule is enforced here, not by the DB).
      await transaction.$queryRaw`SELECT "id" FROM "Mother" WHERE "id" = ${mother.id} FOR UPDATE`;
      if (data.pregnancyStatus === "PREGNANT") {
        await transaction.pregnancy.updateMany({
          where: { motherId: mother.id, pregnancyStatus: "PREGNANT", ...(data.id ? { id: { not: data.id } } : {}) },
          data: { pregnancyStatus: "ENDED" },
        });
      }
      if (data.id) {
        assertUpdated(
          await transaction.pregnancy.updateMany({
            where: { id: data.id, motherId: mother.id },
            data: { ...data, id: undefined },
          }),
        );
      } else {
        await transaction.pregnancy.create({ data: { ...data, id: undefined } });
      }
    });
  });
  if (failure) return failure;
  revalidatePath("/", "layout");
  redirect("/mother/pregnancy", RedirectType.replace);
}

export async function deletePregnancyAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.pregnancy.deleteMany({ where: { id, mother: { userId: user.id } } });
  revalidatePath("/profile");
  redirect("/profile", RedirectType.replace);
}

// The cycle forms post through ActionResultForm, which shows a returned
// `{ error }` and keeps what was typed.
export async function saveMenstrualCycleAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const failure = await captureActionError(async () => {
    const data = parseInput(menstrualCycleSchema, values(formData));
    const mother = await requireOwnedMother(data.motherId, user.id);
    if (data.id)
      assertUpdated(
        await db.menstrualCycle.updateMany({
          where: { id: data.id, motherId: mother.id },
          data: { ...data, id: undefined },
        }),
      );
    else await db.menstrualCycle.create({ data: { ...data, id: undefined } });
  });
  if (failure) return failure;
  revalidatePath("/mother/cycle");
  redirect("/mother/cycle", RedirectType.replace);
}

export async function deleteMenstrualCycleAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.menstrualCycle.deleteMany({
    where: { id, mother: { userId: user.id } },
  });
  revalidatePath("/mother/cycle");
}

export async function saveCycleSettingsAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const failure = await captureActionError(async () => {
    const data = parseInput(cycleSettingsSchema, values(formData));
    const result = await db.mother.updateMany({
      where: { id: data.motherId, userId: user.id },
      data: {
        cycleLengthDays: data.cycleLengthDays,
        periodLengthDays: data.periodLengthDays,
        lutealPhaseDays: data.lutealPhaseDays,
      },
    });
    if (result.count === 0) throw new ActionError("Không tìm thấy hồ sơ mẹ.");
  });
  if (failure) return failure;
  revalidatePath("/mother/cycle");
}

export async function saveMotherDailyHealthLogAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const failure = await captureActionError(async () => {
    const data = parseInput(motherDailyHealthLogSchema, {
      ...values(formData),
      symptoms: formData.getAll("symptoms").map(String),
      moods: formData.getAll("moods").map(String),
    });
    const mother = await requireOwnedMother(data.motherId, user.id);
    await db.motherDailyHealthLog.upsert({
      where: { motherId_loggedAt: { motherId: mother.id, loggedAt: data.loggedAt } },
      create: data,
      update: {
        flow: data.flow,
        symptoms: data.symptoms,
        moods: data.moods,
        discharge: data.discharge,
        sleepHours: data.sleepHours,
        basalTemperatureC: data.basalTemperatureC,
        ovulationTest: data.ovulationTest,
        weightKg: data.weightKg,
        waterGlasses: data.waterGlasses,
        notes: data.notes,
      },
    });
  });
  if (failure) return failure;
  revalidatePath("/mother/cycle");
}

export async function deleteMotherDailyHealthLogAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.motherDailyHealthLog.deleteMany({
    where: { id, mother: { userId: user.id } },
  });
  revalidatePath("/mother/cycle");
}

export async function savePregnancyCheckupAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const failure = await captureActionError(async () => {
    const data = parseInput(pregnancyCheckupSchema, values(formData, user.timezone, ["checkedAt"]));
    const pregnancy = await db.pregnancy.findFirst({
      where: { id: data.pregnancyId, mother: { userId: user.id } },
      select: { id: true },
    });
    if (!pregnancy) throw new ActionError("Không tìm thấy thai kỳ.");
    const source = recordSource(formData);
    if (data.id)
      assertUpdated(
        await db.pregnancyCheckup.updateMany({
          where: { id: data.id, pregnancyId: pregnancy.id },
          data: { ...data, id: undefined, source },
        }),
      );
    else await db.pregnancyCheckup.create({ data: { ...data, id: undefined, source } });
  });
  if (failure) return failure;
  revalidatePath("/mother/pregnancy", "layout");
  redirect("/mother/pregnancy/checkups", RedirectType.replace);
}

export async function deletePregnancyCheckupAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.pregnancyCheckup.deleteMany({
    where: { id, pregnancy: { mother: { userId: user.id } } },
  });
  revalidatePath("/mother/pregnancy", "layout");
}

export async function deleteMotherVaccinationAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.motherVaccinationRecord.deleteMany({ where: { id, mother: { userId: user.id } } });
  revalidatePath("/", "layout");
}

export async function saveMotherMedicalVisitAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const failure = await captureActionError(async () => {
    const data = parseInput(motherMedicalVisitSchema, values(formData, user.timezone, ["visitedAt"]));
    const mother = await requireOwnedMother(data.motherId, user.id);
    if (data.id)
      assertUpdated(
        await db.motherMedicalVisit.updateMany({ where: { id: data.id, motherId: mother.id }, data: { ...data, id: undefined } }),
      );
    else await db.motherMedicalVisit.create({ data: { ...data, id: undefined } });
  });
  if (failure) return failure;
  revalidatePath("/mother/medical");
  redirect("/mother/medical", RedirectType.replace);
}

export async function deleteMotherMedicalVisitAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.motherMedicalVisit.deleteMany({ where: { id, mother: { userId: user.id } } });
  revalidatePath("/mother/medical");
}

export async function saveBabyMedicalVisitAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const failure = await captureActionError(async () => {
    const data = parseInput(babyMedicalVisitSchema, values(formData, user.timezone, ["visitedAt"]));
    await requireOwnedBaby(data.babyId, user.id);
    if (data.id)
      assertUpdated(
        await db.babyMedicalVisit.updateMany({ where: { id: data.id, babyId: data.babyId }, data: { ...data, id: undefined } }),
      );
    else await db.babyMedicalVisit.create({ data: { ...data, id: undefined } });
  });
  if (failure) return failure;
  revalidatePath("/baby/medical");
  redirect("/baby/medical", RedirectType.replace);
}

export async function deleteBabyMedicalVisitAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.babyMedicalVisit.deleteMany({ where: { id, baby: { userId: user.id } } });
  revalidatePath("/baby/medical");
}

export async function saveMotherInsuranceAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const failure = await captureActionError(async () => {
    const data = parseInput(motherInsuranceSchema, values(formData));
    const mother = await requireOwnedMother(data.motherId, user.id);
    if (data.id)
      assertUpdated(
        await db.motherInsurancePolicy.updateMany({ where: { id: data.id, motherId: mother.id }, data: { ...data, id: undefined } }),
      );
    else await db.motherInsurancePolicy.create({ data: { ...data, id: undefined } });
  });
  if (failure) return failure;
  revalidatePath("/mother/insurance");
  redirect("/mother/insurance", RedirectType.replace);
}

export async function deleteMotherInsuranceAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.motherInsurancePolicy.deleteMany({ where: { id, mother: { userId: user.id } } });
  revalidatePath("/mother/insurance");
}

export async function saveBabyInsuranceAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const failure = await captureActionError(async () => {
    const data = parseInput(babyInsuranceSchema, values(formData));
    await requireOwnedBaby(data.babyId, user.id);
    if (data.id)
      assertUpdated(
        await db.babyInsurancePolicy.updateMany({ where: { id: data.id, babyId: data.babyId }, data: { ...data, id: undefined } }),
      );
    else await db.babyInsurancePolicy.create({ data: { ...data, id: undefined } });
  });
  if (failure) return failure;
  revalidatePath("/baby/insurance");
  redirect("/baby/insurance", RedirectType.replace);
}

export async function deleteBabyInsuranceAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.babyInsurancePolicy.deleteMany({ where: { id, baby: { userId: user.id } } });
  revalidatePath("/baby/insurance");
}

export async function saveBabyAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  let babyId = "";
  let editing = false;
  const failure = await captureActionError(async () => {
    const data = parseInput(babySchema, values(formData));
    editing = Boolean(data.id);
    if (data.dateOfBirth.toISOString().slice(0, 10) > toDateTimeLocal(new Date(), user.timezone).slice(0, 10))
      throw new ActionError("Ngày sinh không thể ở tương lai.");
    if (data.pregnancyId) {
      const pregnancy = await db.pregnancy.findFirst({ where: { id: data.pregnancyId, mother: { userId: user.id }, pregnancyStatus: "DELIVERED" } });
      if (!pregnancy) throw new ActionError("Không tìm thấy thai kỳ đã sinh của bạn.");
    }
    const coverImage = profileCover(formData);
    if (data.id) {
      assertUpdated(
        await db.baby.updateMany({
          where: { id: data.id, userId: user.id },
          data: { ...data, id: undefined },
        }),
      );
      babyId = data.id;
    } else {
      const baby = await db.baby.create({
        data: { ...data, id: undefined, userId: user.id },
        select: { id: true },
      });
      babyId = baby.id;
    }
    if (coverImage === null) {
      await db.babyProfileCover.deleteMany({ where: { babyId } });
    } else if (coverImage) {
      await db.babyProfileCover.upsert({
        where: { babyId },
        create: { babyId, ...coverImage },
        update: coverImage,
      });
    }
  });
  if (failure) return failure;
  (await cookies()).set("selectedBabyId", babyId, { sameSite: "lax", path: "/", maxAge: 31_536_000 });
  revalidatePath("/", "layout");
  redirect(editing ? "/profile" : "/", RedirectType.replace);
}

export async function deleteBabyAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.baby.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/", "layout");
  redirect("/profile", RedirectType.replace);
}

export async function saveFeedingAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const failure = await captureActionError(async () => {
    const data = parseInput(feedingSchema, values(formData, user.timezone, ["startTime", "endTime"]));
    await requireOwnedBaby(data.babyId, user.id);
    await withOpenEntryGuard(OPEN_FEEDING_ERROR, async () => {
      if (data.id) {
        assertUpdated(
          await db.feeding.updateMany({
            where: { id: data.id, babyId: data.babyId },
            data: { ...data, id: undefined },
          }),
        );
      } else {
        await db.feeding.create({ data: { ...data, id: undefined } });
      }
    });
  });
  if (failure) return failure;
  revalidatePath("/", "layout");
  redirect("/tracking/feeding", RedirectType.replace);
}

export async function deleteFeedingAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.feeding.deleteMany({ where: { id, baby: { userId: user.id } } });
  revalidatePath("/", "layout");
}

export async function saveSleepAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const failure = await captureActionError(async () => {
    const data = parseInput(sleepSchema, values(formData, user.timezone, ["startTime", "endTime"]));
    await requireOwnedBaby(data.babyId, user.id);
    await withOpenEntryGuard(OPEN_SLEEP_ERROR, async () => {
      if (data.id)
        assertUpdated(
          await db.sleepEntry.updateMany({
            where: { id: data.id, babyId: data.babyId },
            data: { ...data, id: undefined },
          }),
        );
      else await db.sleepEntry.create({ data: { ...data, id: undefined } });
    });
  });
  if (failure) return failure;
  revalidatePath("/", "layout");
  redirect("/tracking/sleep", RedirectType.replace);
}

export async function deleteSleepAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.sleepEntry.deleteMany({ where: { id, baby: { userId: user.id } } });
  revalidatePath("/", "layout");
}

export async function saveDiaperAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const failure = await captureActionError(async () => {
    const data = parseInput(diaperSchema, values(formData, user.timezone, ["changedAt"]));
    await requireOwnedBaby(data.babyId, user.id);
    if (data.id)
      assertUpdated(
        await db.diaperEntry.updateMany({
          where: { id: data.id, babyId: data.babyId },
          data: { ...data, id: undefined },
        }),
      );
    else await db.diaperEntry.create({ data: { ...data, id: undefined } });
  });
  if (failure) return failure;
  revalidatePath("/", "layout");
  redirect("/tracking/diaper", RedirectType.replace);
}

export async function deleteDiaperAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.diaperEntry.deleteMany({ where: { id, baby: { userId: user.id } } });
  revalidatePath("/", "layout");
}

export async function saveGrowthAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  let growthEntryId = "";
  const failure = await captureActionError(async () => {
    const data = parseInput(growthSchema, values(formData, user.timezone, ["measuredAt"]));
    await requireOwnedBaby(data.babyId, user.id);
    if (data.id) {
      const id = data.id;
      // Only drop the stale WHO assessment of an entry this edit really updated.
      await db.$transaction(async (transaction) => {
        assertUpdated(
          await transaction.growthEntry.updateMany({
            where: { id, babyId: data.babyId },
            data: { ...data, id: undefined },
          }),
        );
        await transaction.growthAssessment.deleteMany({ where: { growthEntryId: id } });
      });
      growthEntryId = id;
    } else {
      const created = await db.growthEntry.create({
        data: { ...data, id: undefined },
        select: { id: true },
      });
      growthEntryId = created.id;
    }
  });
  if (failure) return failure;
  await refreshWhoGrowthAssessment(growthEntryId).catch(() => undefined);
  revalidatePath("/", "layout");
  redirect("/tracking/growth", RedirectType.replace);
}

export async function deleteGrowthAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.growthEntry.deleteMany({ where: { id, baby: { userId: user.id } } });
  revalidatePath("/", "layout");
}

export async function recalculateLatestGrowthAction(formData: FormData) {
  const user = await requireUser();
  const babyId = String(formData.get("babyId") ?? "");
  await requireOwnedBaby(babyId, user.id);
  const entry = await db.growthEntry.findFirst({
    where: { babyId },
    orderBy: { measuredAt: "desc" },
    select: { id: true },
  });
  if (entry) await refreshWhoGrowthAssessment(entry.id).catch(() => undefined);
  revalidatePath("/tracking/growth");
}

function recordSource(formData: FormData) {
  return formData.get("source") === "OCR" ? "OCR" : "MANUAL";
}

export async function deleteVaccinationAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.vaccinationRecord.deleteMany({ where: { id, baby: { userId: user.id } } });
  revalidatePath("/", "layout");
}

export async function savePrescriptionAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const failure = await captureActionError(async () => {
    const data = parseInput(prescriptionSchema, values(formData));
    await requireOwnedBaby(data.babyId, user.id);
    let items: ReturnType<typeof parsePrescriptionItems>;
    try {
      items = parsePrescriptionItems(formData);
    } catch {
      throw new ActionError("Thông tin thuốc chưa hợp lệ. Hãy kiểm tra tên thuốc và số ngày dùng.");
    }
    const source = recordSource(formData);
    // Header and items change together, and items are only replaced after the
    // update proved the prescription still exists and belongs to this baby.
    await db.$transaction(async (transaction) => {
      let prescriptionId = data.id;
      if (prescriptionId) {
        assertUpdated(
          await transaction.prescription.updateMany({
            where: { id: prescriptionId, babyId: data.babyId },
            data: { ...data, id: undefined, source },
          }),
        );
        await transaction.prescriptionItem.deleteMany({ where: { prescriptionId } });
      } else {
        const created = await transaction.prescription.create({
          data: { ...data, id: undefined, source },
          select: { id: true },
        });
        prescriptionId = created.id;
      }
      if (items.length)
        await transaction.prescriptionItem.createMany({
          data: items.map((item) => ({ ...item, prescriptionId: prescriptionId! })),
        });
    });
  });
  if (failure) return failure;
  revalidatePath("/", "layout");
  redirect("/tracking/prescription?view=archive", RedirectType.replace);
}

export async function deletePrescriptionAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.prescription.deleteMany({ where: { id, baby: { userId: user.id } } });
  revalidatePath("/", "layout");
}

export async function saveToothAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  let position = "";
  const failure = await captureActionError(async () => {
    const data = parseInput(toothSchema, values(formData));
    await requireOwnedBaby(data.babyId, user.id);
    if (data.eruptedAt.toISOString().slice(0, 10) > toDateTimeLocal(new Date(), user.timezone).slice(0, 10))
      throw new ActionError("Ngày mọc răng không thể ở tương lai.");
    await db.toothRecord.upsert({
      where: { babyId_position: { babyId: data.babyId, position: data.position } },
      create: data,
      update: { eruptedAt: data.eruptedAt, notes: data.notes },
    });
    position = data.position;
  });
  if (failure) return failure;
  revalidatePath("/", "layout");
  revalidatePath("/tracking/teeth");
  redirect(`/tracking/teeth?position=${position}`, RedirectType.replace);
}

export async function deleteToothAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.toothRecord.deleteMany({ where: { id, baby: { userId: user.id } } });
  revalidatePath("/", "layout");
  revalidatePath("/tracking/teeth");
  redirect("/tracking/teeth", RedirectType.replace);
}
