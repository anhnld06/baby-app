import { z } from "zod";

const optionalNumber = z.preprocess((value) => value === "" || value === null ? undefined : Number(value), z.number().nonnegative().optional());
const optionalInteger = z.preprocess((value) => value === "" || value === null ? undefined : Number(value), z.number().int().nonnegative().optional());
const optionalText = z.preprocess((value) => value === "" || value === null ? undefined : value, z.string().trim().max(1000).optional());
const dateValue = z.preprocess((value) => value instanceof Date ? value : new Date(String(value)), z.date());
const optionalDate = z.preprocess((value) => value === "" || value === null || value === undefined ? undefined : new Date(String(value)), z.date().optional());

export const babySchema = z.object({
  id: optionalText,
  name: z.string().trim().min(1).max(80),
  nickname: optionalText,
  gender: z.enum(["FEMALE", "MALE", "OTHER", "UNDISCLOSED"]),
  dateOfBirth: dateValue,
  birthTime: optionalText,
  gestationalAgeAtBirth: optionalInteger,
  birthWeightKg: optionalNumber,
  birthLengthCm: optionalNumber,
  birthHeadCircumferenceCm: optionalNumber,
  notes: optionalText,
});

export const motherSchema = z.object({
  id: optionalText,
  name: z.string().trim().min(1).max(80),
  dateOfBirth: optionalDate,
  heightCm: optionalNumber,
  prePregnancyWeightKg: optionalNumber,
  bloodType: optionalText,
  notes: optionalText,
});

export const pregnancySchema = z.object({
  id: optionalText,
  motherId: z.string().min(1),
  lastMenstrualPeriod: optionalDate,
  estimatedDueDate: optionalDate,
  actualDeliveryDate: optionalDate,
  pregnancyStatus: z.enum(["PLANNING", "PREGNANT", "DELIVERED", "ENDED"]),
  notes: optionalText,
});

export const menstrualCycleSchema = z.object({
  id: optionalText,
  motherId: z.string().min(1),
  periodStart: dateValue,
  periodEnd: optionalDate,
  flow: z.preprocess(
    (value) => value === "" ? undefined : value,
    z.enum(["SPOTTING", "LIGHT", "MEDIUM", "HEAVY"]).optional(),
  ),
  symptoms: optionalText,
  notes: optionalText,
}).refine((value) => !value.periodEnd || value.periodEnd >= value.periodStart, {
  message: "Ngày kết thúc phải sau ngày bắt đầu",
  path: ["periodEnd"],
});

export const cycleSettingsSchema = z.object({
  motherId: z.string().min(1),
  cycleLengthDays: z.preprocess(Number, z.number().int().min(15).max(60)),
  periodLengthDays: z.preprocess(Number, z.number().int().min(1).max(15)),
  lutealPhaseDays: z.preprocess(Number, z.number().int().min(7).max(20)),
});

export const motherDailyHealthLogSchema = z.object({
  motherId: z.string().min(1),
  loggedAt: dateValue,
  flow: z.preprocess(
    (value) => value === "" ? undefined : value,
    z.enum(["SPOTTING", "LIGHT", "MEDIUM", "HEAVY"]).optional(),
  ),
  symptoms: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
  moods: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
  discharge: optionalText,
  sleepHours: optionalNumber.refine((value) => value === undefined || value <= 24, "Số giờ ngủ không hợp lệ"),
  basalTemperatureC: optionalNumber.refine((value) => value === undefined || (value >= 30 && value <= 45), "Nhiệt độ không hợp lệ"),
  ovulationTest: z.preprocess(
    (value) => value === "" || value === null ? undefined : value,
    z.enum(["NEGATIVE", "POSITIVE", "PEAK"]).optional(),
  ),
  weightKg: optionalNumber,
  waterGlasses: optionalInteger.refine((value) => value === undefined || value <= 100, "Lượng nước không hợp lệ"),
  notes: optionalText,
});

export const pregnancyCheckupSchema = z.object({
  id: optionalText,
  pregnancyId: z.string().min(1),
  visitType: z.enum(["PRENATAL_VISIT", "ULTRASOUND", "COMBINED"]),
  checkedAt: dateValue,
  gestationalWeek: optionalInteger.refine((value) => value === undefined || value <= 45, "Tuá»•i thai khÃ´ng há»£p lá»‡"),
  gestationalDay: z.preprocess(
    (value) => value === "" || value === null || value === undefined ? 0 : Number(value),
    z.number().int().min(0).max(6, "Số ngày thai phải từ 0 đến 6"),
  ),
  weightKg: optionalNumber,
  bloodPressure: optionalText,
  fetalHeartRate: optionalInteger.refine((value) => value === undefined || value <= 300, "Nhá»‹p tim thai khÃ´ng há»£p lá»‡"),
  fundalHeightCm: optionalNumber,
  fetusCount: optionalInteger.refine((value) => value === undefined || value <= 10, "Sá»‘ lÆ°á»£ng thai khÃ´ng há»£p lá»‡"),
  fetalPresentation: optionalText,
  fetalMovement: z.preprocess(
    (value) => value === "" || value === null ? undefined : value,
    z.enum(["PRESENT", "ABSENT"]).optional(),
  ),
  crlMm: optionalNumber,
  ntMm: optionalNumber,
  bpdMm: optionalNumber,
  hcMm: optionalNumber,
  acMm: optionalNumber,
  flMm: optionalNumber,
  estimatedFetalWeightG: optionalNumber,
  placentaPosition: optionalText,
  placentaGrade: optionalInteger.refine((value) => value === undefined || value <= 3, "Äá»™ trÆ°á»Ÿng thÃ nh nhau khÃ´ng há»£p lá»‡"),
  amnioticFluid: optionalText,
  cervicalLengthMm: optionalNumber,
  ultrasoundDueDate: optionalDate,
  fetalAnatomy: optionalText,
  otherFindings: optionalText,
  facility: optionalText,
  doctor: optionalText,
  findings: optionalText,
  nextCheckupAt: optionalDate,
  notes: optionalText,
});

const medicalVisitFields = {
  id: optionalText,
  visitedAt: dateValue,
  facility: optionalText,
  doctor: optionalText,
  specialty: optionalText,
  reason: optionalText,
  diagnosis: optionalText,
  treatment: optionalText,
  nextVisitAt: optionalDate,
  notes: optionalText,
};

export const motherMedicalVisitSchema = z.object({
  ...medicalVisitFields,
  motherId: z.string().min(1),
});

export const babyMedicalVisitSchema = z.object({
  ...medicalVisitFields,
  babyId: z.string().min(1),
});

const insuranceFields = {
  id: optionalText,
  insuranceType: z.string().trim().min(1).max(100),
  provider: optionalText,
  policyNumber: z.string().trim().min(1).max(200),
  registeredCare: optionalText,
  validFrom: optionalDate,
  validUntil: optionalDate,
  contact: optionalText,
  benefits: optionalText,
  notes: optionalText,
};

export const motherInsuranceSchema = z.object({
  ...insuranceFields,
  motherId: z.string().min(1),
});

export const babyInsuranceSchema = z.object({
  ...insuranceFields,
  babyId: z.string().min(1),
});

export const feedingSchema = z.object({
  id: optionalText,
  babyId: z.string().min(1),
  type: z.enum(["BREASTFEEDING", "BOTTLE_BREAST_MILK", "FORMULA", "MIXED"]),
  startTime: dateValue,
  endTime: optionalDate,
  leftBreastDuration: optionalInteger,
  rightBreastDuration: optionalInteger,
  firstSide: z.preprocess((value) => value === "" ? undefined : value, z.enum(["LEFT", "RIGHT"]).optional()),
  amountMl: optionalNumber,
  milkType: optionalText,
  notes: optionalText,
}).refine((value) => !value.endTime || value.endTime >= value.startTime, { message: "End time must be after start time", path: ["endTime"] });

export const sleepSchema = z.object({
  id: optionalText,
  babyId: z.string().min(1),
  startTime: dateValue,
  endTime: optionalDate,
  type: z.enum(["NAP", "NIGHT"]),
  location: optionalText,
  notes: optionalText,
}).refine((value) => !value.endTime || value.endTime >= value.startTime, { message: "End time must be after start time", path: ["endTime"] });

export const diaperSchema = z.object({
  id: optionalText,
  babyId: z.string().min(1),
  changedAt: dateValue,
  type: z.enum(["WET", "STOOL", "BOTH"]),
  stoolColor: optionalText,
  consistency: optionalText,
  amount: optionalText,
  notes: optionalText,
});

export const growthSchema = z.object({
  id: optionalText,
  babyId: z.string().min(1),
  measuredAt: dateValue,
  weightKg: optionalNumber,
  heightCm: optionalNumber,
  headCircumferenceCm: optionalNumber,
  notes: optionalText,
}).refine((value) => value.weightKg !== undefined || value.heightCm !== undefined || value.headCircumferenceCm !== undefined, { message: "Enter at least one measurement" });

export const TOOTH_POSITIONS = [
  "UPPER_RIGHT_CENTRAL_INCISOR",
  "UPPER_RIGHT_LATERAL_INCISOR",
  "UPPER_RIGHT_CANINE",
  "UPPER_RIGHT_FIRST_MOLAR",
  "UPPER_RIGHT_SECOND_MOLAR",
  "UPPER_LEFT_CENTRAL_INCISOR",
  "UPPER_LEFT_LATERAL_INCISOR",
  "UPPER_LEFT_CANINE",
  "UPPER_LEFT_FIRST_MOLAR",
  "UPPER_LEFT_SECOND_MOLAR",
  "LOWER_LEFT_CENTRAL_INCISOR",
  "LOWER_LEFT_LATERAL_INCISOR",
  "LOWER_LEFT_CANINE",
  "LOWER_LEFT_FIRST_MOLAR",
  "LOWER_LEFT_SECOND_MOLAR",
  "LOWER_RIGHT_CENTRAL_INCISOR",
  "LOWER_RIGHT_LATERAL_INCISOR",
  "LOWER_RIGHT_CANINE",
  "LOWER_RIGHT_FIRST_MOLAR",
  "LOWER_RIGHT_SECOND_MOLAR",
] as const;

export const toothSchema = z.object({
  babyId: z.string().min(1),
  position: z.enum(TOOTH_POSITIONS),
  eruptedAt: dateValue,
  notes: optionalText,
});

export const vaccinationSchema = z.object({
  id: optionalText,
  babyId: z.string().min(1),
  vaccineName: z.string().trim().min(1).max(200),
  doseNumber: optionalInteger,
  administeredAt: dateValue,
  facility: optionalText,
  batchNumber: optionalText,
  nextDueAt: optionalDate,
  notes: optionalText,
});

export const motherVaccinationSchema = z.object({
  id: optionalText,
  motherId: z.string().min(1),
  vaccineName: z.string().trim().min(1).max(200),
  doseNumber: optionalInteger,
  administeredAt: dateValue,
  facility: optionalText,
  notes: optionalText,
});

export const prescriptionSchema = z.object({
  id: optionalText,
  babyId: z.string().min(1),
  prescribedBy: optionalText,
  diagnosis: optionalText,
  issuedAt: dateValue,
  notes: optionalText,
});

export const prescriptionItemSchema = z.object({
  medicineName: z.string().trim().min(1).max(200),
  dosage: optionalText,
  frequency: optionalText,
  durationDays: optionalInteger,
  instructions: optionalText,
});

const prescriptionItemInputSchema = prescriptionItemSchema.extend({
  medicineName: optionalText,
});

export type PrescriptionItemInput = z.infer<typeof prescriptionItemSchema>;

export function parsePrescriptionItems(formData: FormData): PrescriptionItemInput[] {
  const rows = new Map<number, Record<string, string>>();
  for (const [key, value] of formData.entries()) {
    const match = /^items\.(\d+)\.(\w+)$/.exec(key);
    if (!match) continue;
    const index = Number(match[1]);
    const row = rows.get(index) ?? {};
    row[match[2]] = String(value);
    rows.set(index, row);
  }
  return [...rows.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, row]) => prescriptionItemInputSchema.parse(row))
    .filter((item): item is PrescriptionItemInput => Boolean(item.medicineName));
}
