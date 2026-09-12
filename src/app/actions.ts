"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { zonedDateTimeToUtc } from "@/lib/date";
import { db } from "@/lib/db";
import { refreshWhoGrowthAssessment } from "@/features/growth/who-anthro";
import { parseProfileCoverUpdate } from "@/lib/profile-cover";
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
  motherVaccinationSchema,
  parsePrescriptionItems,
  pregnancyCheckupSchema,
  pregnancySchema,
  prescriptionSchema,
  sleepSchema,
  toothSchema,
  vaccinationSchema,
} from "@/lib/validation";

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
  if (!baby) throw new Error("Baby not found");
  return baby;
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

export async function saveMotherAction(formData: FormData) {
  const user = await requireUser();
  const data = motherSchema.parse(values(formData));
  const coverImage = parseProfileCoverUpdate(formData);
  const existing = await db.mother.findUnique({ where: { userId: user.id } });
  let motherId: string;
  if (existing) {
    const mother = await db.mother.update({
      where: { id: existing.id },
      data: { ...data, id: undefined },
      select: { id: true },
    });
    motherId = mother.id;
  } else {
    const mother = await db.mother.create({
      data: { ...data, id: undefined, userId: user.id },
      select: { id: true },
    });
    motherId = mother.id;
  }
  if (coverImage === null) {
    await db.motherProfileCover.deleteMany({ where: { motherId } });
  } else if (coverImage) {
    await db.motherProfileCover.upsert({
      where: { motherId },
      create: { motherId, ...coverImage },
      update: coverImage,
    });
  }
  revalidatePath("/", "layout");
  redirect("/profile");
}

export async function deleteMotherAction() {
  const user = await requireUser();
  await db.mother.deleteMany({ where: { userId: user.id } });
  revalidatePath("/profile");
  redirect("/profile");
}

export async function savePregnancyAction(formData: FormData) {
  const user = await requireUser();
  const data = pregnancySchema.parse(values(formData));
  const mother = await db.mother.findFirst({
    where: { id: data.motherId, userId: user.id },
    select: { id: true },
  });
  if (!mother) throw new Error("Mother profile not found");
  await db.$transaction(async (transaction) => {
    if (data.pregnancyStatus === "PREGNANT") {
      await transaction.pregnancy.updateMany({
        where: { motherId: mother.id, pregnancyStatus: "PREGNANT", ...(data.id ? { id: { not: data.id } } : {}) },
        data: { pregnancyStatus: "ENDED" },
      });
    }
    if (data.id) {
      await transaction.pregnancy.updateMany({
        where: { id: data.id, motherId: mother.id },
        data: { ...data, id: undefined },
      });
    } else {
      await transaction.pregnancy.create({ data: { ...data, id: undefined } });
    }
  });
  revalidatePath("/profile");
  redirect("/profile");
}

export async function deletePregnancyAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.pregnancy.deleteMany({ where: { id, mother: { userId: user.id } } });
  revalidatePath("/profile");
  redirect("/profile");
}

export async function saveMenstrualCycleAction(formData: FormData) {
  const user = await requireUser();
  const data = menstrualCycleSchema.parse(values(formData));
  const mother = await db.mother.findFirst({
    where: { id: data.motherId, userId: user.id },
    select: { id: true },
  });
  if (!mother) throw new Error("Mother profile not found");
  if (data.id)
    await db.menstrualCycle.updateMany({
      where: { id: data.id, motherId: mother.id },
      data: { ...data, id: undefined },
    });
  else await db.menstrualCycle.create({ data: { ...data, id: undefined } });
  revalidatePath("/mother/cycle");
  redirect("/mother/cycle");
}

export async function deleteMenstrualCycleAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.menstrualCycle.deleteMany({
    where: { id, mother: { userId: user.id } },
  });
  revalidatePath("/mother/cycle");
}

export async function saveCycleSettingsAction(formData: FormData) {
  const user = await requireUser();
  const data = cycleSettingsSchema.parse(values(formData));
  await db.mother.updateMany({
    where: { id: data.motherId, userId: user.id },
    data: {
      cycleLengthDays: data.cycleLengthDays,
      periodLengthDays: data.periodLengthDays,
      lutealPhaseDays: data.lutealPhaseDays,
    },
  });
  revalidatePath("/mother/cycle");
}

export async function saveMotherDailyHealthLogAction(formData: FormData) {
  const user = await requireUser();
  const data = motherDailyHealthLogSchema.parse({
    ...values(formData),
    symptoms: formData.getAll("symptoms").map(String),
    moods: formData.getAll("moods").map(String),
  });
  const mother = await db.mother.findFirst({
    where: { id: data.motherId, userId: user.id },
    select: { id: true },
  });
  if (!mother) throw new Error("Mother profile not found");
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

export async function savePregnancyCheckupAction(formData: FormData) {
  const user = await requireUser();
  const data = pregnancyCheckupSchema.parse(values(formData, user.timezone, ["checkedAt"]));
  const pregnancy = await db.pregnancy.findFirst({
    where: { id: data.pregnancyId, mother: { userId: user.id } },
    select: { id: true },
  });
  if (!pregnancy) throw new Error("Pregnancy not found");
  const source = recordSource(formData);
  if (data.id)
    await db.pregnancyCheckup.updateMany({
      where: { id: data.id, pregnancyId: pregnancy.id },
      data: { ...data, id: undefined, source },
    });
  else await db.pregnancyCheckup.create({ data: { ...data, id: undefined, source } });
  revalidatePath("/mother/pregnancy");
  redirect("/mother/pregnancy");
}

export async function deletePregnancyCheckupAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.pregnancyCheckup.deleteMany({
    where: { id, pregnancy: { mother: { userId: user.id } } },
  });
  revalidatePath("/mother/pregnancy");
}

export async function saveMotherVaccinationAction(formData: FormData) {
  const user = await requireUser();
  const data = motherVaccinationSchema.parse(values(formData));
  const mother = await db.mother.findFirst({
    where: { id: data.motherId, userId: user.id },
    select: { id: true },
  });
  if (!mother) throw new Error("Mother profile not found");
  if (data.id)
    await db.motherVaccinationRecord.updateMany({
      where: { id: data.id, motherId: mother.id },
      data: { ...data, id: undefined },
    });
  else await db.motherVaccinationRecord.create({ data: { ...data, id: undefined } });
  revalidatePath("/mother/vaccination");
  redirect("/mother/vaccination");
}

export async function deleteMotherVaccinationAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.motherVaccinationRecord.deleteMany({ where: { id, mother: { userId: user.id } } });
  revalidatePath("/mother/vaccination");
}

export async function saveMotherMedicalVisitAction(formData: FormData) {
  const user = await requireUser();
  const data = motherMedicalVisitSchema.parse(values(formData, user.timezone, ["visitedAt"]));
  const mother = await db.mother.findFirst({ where: { id: data.motherId, userId: user.id }, select: { id: true } });
  if (!mother) throw new Error("Mother profile not found");
  if (data.id)
    await db.motherMedicalVisit.updateMany({ where: { id: data.id, motherId: mother.id }, data: { ...data, id: undefined } });
  else await db.motherMedicalVisit.create({ data: { ...data, id: undefined } });
  revalidatePath("/mother/medical");
  redirect("/mother/medical");
}

export async function deleteMotherMedicalVisitAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.motherMedicalVisit.deleteMany({ where: { id, mother: { userId: user.id } } });
  revalidatePath("/mother/medical");
}

export async function saveBabyMedicalVisitAction(formData: FormData) {
  const user = await requireUser();
  const data = babyMedicalVisitSchema.parse(values(formData, user.timezone, ["visitedAt"]));
  await requireOwnedBaby(data.babyId, user.id);
  if (data.id)
    await db.babyMedicalVisit.updateMany({ where: { id: data.id, babyId: data.babyId }, data: { ...data, id: undefined } });
  else await db.babyMedicalVisit.create({ data: { ...data, id: undefined } });
  revalidatePath("/baby/medical");
  redirect("/baby/medical");
}

export async function deleteBabyMedicalVisitAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.babyMedicalVisit.deleteMany({ where: { id, baby: { userId: user.id } } });
  revalidatePath("/baby/medical");
}

export async function saveMotherInsuranceAction(formData: FormData) {
  const user = await requireUser();
  const data = motherInsuranceSchema.parse(values(formData));
  const mother = await db.mother.findFirst({ where: { id: data.motherId, userId: user.id }, select: { id: true } });
  if (!mother) throw new Error("Mother profile not found");
  if (data.id)
    await db.motherInsurancePolicy.updateMany({ where: { id: data.id, motherId: mother.id }, data: { ...data, id: undefined } });
  else await db.motherInsurancePolicy.create({ data: { ...data, id: undefined } });
  revalidatePath("/mother/insurance");
  redirect("/mother/insurance");
}

export async function deleteMotherInsuranceAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.motherInsurancePolicy.deleteMany({ where: { id, mother: { userId: user.id } } });
  revalidatePath("/mother/insurance");
}

export async function saveBabyInsuranceAction(formData: FormData) {
  const user = await requireUser();
  const data = babyInsuranceSchema.parse(values(formData));
  await requireOwnedBaby(data.babyId, user.id);
  if (data.id)
    await db.babyInsurancePolicy.updateMany({ where: { id: data.id, babyId: data.babyId }, data: { ...data, id: undefined } });
  else await db.babyInsurancePolicy.create({ data: { ...data, id: undefined } });
  revalidatePath("/baby/insurance");
  redirect("/baby/insurance");
}

export async function deleteBabyInsuranceAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.babyInsurancePolicy.deleteMany({ where: { id, baby: { userId: user.id } } });
  revalidatePath("/baby/insurance");
}

export async function saveBabyAction(formData: FormData) {
  const user = await requireUser();
  const data = babySchema.parse(values(formData));
  const coverImage = parseProfileCoverUpdate(formData);
  let babyId: string;
  if (data.id) {
    const result = await db.baby.updateMany({
      where: { id: data.id, userId: user.id },
      data: { ...data, id: undefined },
    });
    if (result.count === 0) throw new Error("Baby not found");
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
  revalidatePath("/", "layout");
  redirect("/profile");
}

export async function deleteBabyAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.baby.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/", "layout");
  redirect("/profile");
}

export async function saveFeedingAction(formData: FormData) {
  const user = await requireUser();
  const data = feedingSchema.parse(values(formData, user.timezone, ["startTime", "endTime"]));
  await requireOwnedBaby(data.babyId, user.id);
  if (data.id) {
    await db.feeding.updateMany({
      where: { id: data.id, babyId: data.babyId },
      data: { ...data, id: undefined },
    });
  } else {
    await db.feeding.create({ data: { ...data, id: undefined } });
  }
  revalidatePath("/", "layout");
  redirect("/tracking/feeding");
}

export async function deleteFeedingAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.feeding.deleteMany({ where: { id, baby: { userId: user.id } } });
  revalidatePath("/", "layout");
}

export async function saveSleepAction(formData: FormData) {
  const user = await requireUser();
  const data = sleepSchema.parse(values(formData, user.timezone, ["startTime", "endTime"]));
  await requireOwnedBaby(data.babyId, user.id);
  if (data.id)
    await db.sleepEntry.updateMany({
      where: { id: data.id, babyId: data.babyId },
      data: { ...data, id: undefined },
    });
  else await db.sleepEntry.create({ data: { ...data, id: undefined } });
  revalidatePath("/", "layout");
  redirect("/tracking/sleep");
}

export async function deleteSleepAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.sleepEntry.deleteMany({ where: { id, baby: { userId: user.id } } });
  revalidatePath("/", "layout");
}

export async function saveDiaperAction(formData: FormData) {
  const user = await requireUser();
  const data = diaperSchema.parse(values(formData, user.timezone, ["changedAt"]));
  await requireOwnedBaby(data.babyId, user.id);
  if (data.id)
    await db.diaperEntry.updateMany({
      where: { id: data.id, babyId: data.babyId },
      data: { ...data, id: undefined },
    });
  else await db.diaperEntry.create({ data: { ...data, id: undefined } });
  revalidatePath("/", "layout");
  redirect("/tracking/diaper");
}

export async function deleteDiaperAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.diaperEntry.deleteMany({ where: { id, baby: { userId: user.id } } });
  revalidatePath("/", "layout");
}

export async function saveGrowthAction(formData: FormData) {
  const user = await requireUser();
  const data = growthSchema.parse(values(formData, user.timezone, ["measuredAt"]));
  await requireOwnedBaby(data.babyId, user.id);
  let growthEntryId: string;
  if (data.id) {
    await db.growthEntry.updateMany({
      where: { id: data.id, babyId: data.babyId },
      data: { ...data, id: undefined },
    });
    growthEntryId = data.id;
  } else {
    const created = await db.growthEntry.create({
      data: { ...data, id: undefined },
      select: { id: true },
    });
    growthEntryId = created.id;
  }
  await db.growthAssessment.deleteMany({ where: { growthEntryId } });
  await refreshWhoGrowthAssessment(growthEntryId).catch(() => undefined);
  revalidatePath("/", "layout");
  redirect("/tracking/growth");
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

export async function saveVaccinationAction(formData: FormData) {
  const user = await requireUser();
  const data = vaccinationSchema.parse(values(formData));
  await requireOwnedBaby(data.babyId, user.id);
  const source = recordSource(formData);
  if (data.id)
    await db.vaccinationRecord.updateMany({
      where: { id: data.id, babyId: data.babyId },
      data: { ...data, id: undefined, source },
    });
  else await db.vaccinationRecord.create({ data: { ...data, id: undefined, source } });
  revalidatePath("/", "layout");
  redirect("/tracking/vaccination");
}

export async function deleteVaccinationAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.vaccinationRecord.deleteMany({ where: { id, baby: { userId: user.id } } });
  revalidatePath("/", "layout");
}

export async function savePrescriptionAction(formData: FormData) {
  const user = await requireUser();
  const data = prescriptionSchema.parse(values(formData));
  await requireOwnedBaby(data.babyId, user.id);
  const items = parsePrescriptionItems(formData);
  const source = recordSource(formData);
  let prescriptionId = data.id;
  if (prescriptionId) {
    await db.prescription.updateMany({
      where: { id: prescriptionId, babyId: data.babyId },
      data: { ...data, id: undefined, source },
    });
  } else {
    const created = await db.prescription.create({
      data: { ...data, id: undefined, source },
    });
    prescriptionId = created.id;
  }
  await db.$transaction([
    db.prescriptionItem.deleteMany({ where: { prescriptionId } }),
    db.prescriptionItem.createMany({
      data: items.map((item) => ({ ...item, prescriptionId })),
    }),
  ]);
  revalidatePath("/", "layout");
  redirect("/tracking/prescription");
}

export async function deletePrescriptionAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.prescription.deleteMany({ where: { id, baby: { userId: user.id } } });
  revalidatePath("/", "layout");
}

export async function saveToothAction(formData: FormData) {
  const user = await requireUser();
  const data = toothSchema.parse(values(formData));
  await requireOwnedBaby(data.babyId, user.id);
  await db.toothRecord.upsert({
    where: { babyId_position: { babyId: data.babyId, position: data.position } },
    create: data,
    update: { eruptedAt: data.eruptedAt, notes: data.notes },
  });
  revalidatePath("/", "layout");
  revalidatePath("/tracking/teeth");
  redirect(`/tracking/teeth?position=${data.position}`);
}

export async function deleteToothAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.toothRecord.deleteMany({ where: { id, baby: { userId: user.id } } });
  revalidatePath("/", "layout");
  revalidatePath("/tracking/teeth");
  redirect("/tracking/teeth");
}
