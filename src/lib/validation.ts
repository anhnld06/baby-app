import { z } from "zod";

const optionalNumber = z.preprocess((value) => value === "" || value === null || value === undefined ? undefined : Number(value), z.number().nonnegative().optional());
const optionalInteger = z.preprocess((value) => value === "" || value === null || value === undefined ? undefined : Number(value), z.number().int().nonnegative().optional());
const optionalText = z.preprocess((value) => value === "" || value === null ? undefined : value, z.string().trim().max(1000).optional());
const dateValue = z.preprocess((value) => value instanceof Date ? value : new Date(String(value)), z.date());
const optionalDate = z.preprocess((value) => value === "" || value === null || value === undefined ? undefined : new Date(String(value)), z.date().optional());

export const babySchema = z.object({
  pregnancyId: z.preprocess((value) => value === "" ? null : value, z.string().min(1).nullable().optional()),
  id: optionalText,
  name: z.string().trim().min(1).max(80),
  nickname: optionalText,
  gender: z.enum(["FEMALE", "MALE", "OTHER", "UNDISCLOSED"]),
  dateOfBirth: dateValue,
  birthTime: optionalText,
  gestationalAgeAtBirth: optionalInteger.refine((value) => value === undefined || (value >= 20 && value <= 45), "Tuổi thai khi sinh phải từ 20 đến 45 tuần"),
  birthWeightKg: optionalNumber.refine((value) => value === undefined || value <= 15, "Cân nặng sơ sinh không hợp lệ"),
  birthLengthCm: optionalNumber.refine((value) => value === undefined || value <= 80, "Chiều dài sơ sinh không hợp lệ"),
  birthHeadCircumferenceCm: optionalNumber.refine((value) => value === undefined || value <= 60, "Vòng đầu sơ sinh không hợp lệ"),
  notes: optionalText,
});

export const motherSchema = z.object({
  id: optionalText,
  name: z.string().trim().min(1).max(80),
  dateOfBirth: optionalDate,
  heightCm: optionalNumber.refine((value) => value === undefined || (value >= 50 && value <= 250), "Chiều cao không hợp lệ"),
  prePregnancyWeightKg: optionalNumber.refine((value) => value === undefined || value <= 400, "Cân nặng không hợp lệ"),
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
}).transform((value) => ({
  ...value,
  estimatedDueDate: value.pregnancyStatus === "PLANNING" ? null : value.estimatedDueDate ?? null,
  actualDeliveryDate: value.pregnancyStatus === "DELIVERED" ? value.actualDeliveryDate ?? null : null,
}));

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
  checkedAtTimeKnown: z.preprocess((value) => value === undefined ? true : value === true || value === "true", z.boolean()),
  maternalPulse: optionalInteger.refine((v) => v === undefined || v <= 300, "Nhịp không hợp lệ").transform((v) => v ?? null),
  edema: z.preprocess((value) => value === "" || value === null ? undefined : value, z.enum(["PRESENT", "ABSENT"]).optional()).transform((v) => v ?? null),
  urineTestResult: optionalText.transform((v) => v ?? null),
  maternalHealthStatus: optionalText.transform((v) => v ?? null),
  clinicalFetalHeartRate: optionalInteger.refine((v) => v === undefined || v <= 300, "Nhịp không hợp lệ").transform((v) => v ?? null),
  placentaGradeUpper: optionalInteger.refine((v) => v === undefined || v <= 3, "Độ nhau không hợp lệ").transform((v) => v ?? null),
  afiMm: optionalNumber.transform((v) => v ?? null),
  umbilicalArteryPi: optionalNumber.transform((v) => v ?? null),
  middleCerebralArteryPi: optionalNumber.transform((v) => v ?? null),
  middleCerebralArteryPsvCmS: optionalNumber.transform((v) => v ?? null),
  uterineArteryPiRight: optionalNumber.transform((v) => v ?? null),
  uterineArteryPiLeft: optionalNumber.transform((v) => v ?? null),
  ductusVenosusAWave: optionalText.transform((v) => v ?? null),
  nuchalCordLoops: optionalInteger.transform((v) => v ?? null),
  estimatedFetalWeightPercentile: optionalNumber.refine((v) => v === undefined || v <= 100, "Bách phân vị không hợp lệ").transform((v) => v ?? null),
  estimatedFetalWeightErrorG: optionalNumber.transform((v) => v ?? null),
  followupInstruction: optionalText.transform((v) => v ?? null),
  treatment: optionalText.transform((v) => v ?? null),
  careInstructions: optionalText.transform((v) => v ?? null),
  id: optionalText,
  pregnancyId: z.string().min(1),
  visitType: z.enum(["PRENATAL_VISIT", "ULTRASOUND", "COMBINED"]),
  checkedAt: dateValue,
  gestationalWeek: optionalInteger.refine((value) => value === undefined || value <= 45, "Tuổi thai không hợp lệ"),
  gestationalDay: z.preprocess(
    (value) => value === "" || value === null || value === undefined ? 0 : Number(value),
    z.number().int().min(0).max(6, "Số ngày thai phải từ 0 đến 6"),
  ),
  weightKg: optionalNumber,
  bloodPressure: optionalText,
  fetalHeartRate: optionalInteger.refine((value) => value === undefined || value <= 300, "Nhịp tim thai không hợp lệ"),
  fetusCount: optionalInteger.refine((value) => value === undefined || value <= 10, "Số lượng thai không hợp lệ"),
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
  placentaGrade: optionalInteger.refine((value) => value === undefined || value <= 3, "Độ trưởng thành nhau không hợp lệ"),
  amnioticFluid: optionalText,
  cervicalLengthMm: optionalNumber,
  ultrasoundDueDate: optionalDate,
  fetalAnatomy: optionalText,
  otherFindings: optionalText,
  facility: optionalText,
  doctor: optionalText,
  findings: optionalText,
}).refine((value) => value.placentaGradeUpper == null || (value.placentaGrade != null && value.placentaGradeUpper >= value.placentaGrade), {
  path: ["placentaGradeUpper"], message: "Độ nhau cuối khoảng phải lớn hơn hoặc bằng đầu khoảng",
}).transform((value) => ({
  ...value,
  fetusCount: value.fetusCount ?? null,
  fetalPresentation: value.fetalPresentation ?? null,
  fetalMovement: value.fetalMovement ?? null,
  fetalHeartRate: value.fetalHeartRate ?? null,
  otherFindings: value.otherFindings ?? null,
  findings: value.findings ?? null,
  facility: value.facility ?? null,
  doctor: value.doctor ?? null,
  weightKg: value.weightKg ?? null,
  bloodPressure: value.bloodPressure ?? null,
  crlMm: value.crlMm ?? null,
  ntMm: value.ntMm ?? null,
  bpdMm: value.bpdMm ?? null,
  hcMm: value.hcMm ?? null,
  acMm: value.acMm ?? null,
  flMm: value.flMm ?? null,
  estimatedFetalWeightG: value.estimatedFetalWeightG ?? null,
  placentaPosition: value.placentaPosition ?? null,
  placentaGrade: value.placentaGrade ?? null,
  amnioticFluid: value.amnioticFluid ?? null,
  cervicalLengthMm: value.cervicalLengthMm ?? null,
  ultrasoundDueDate: value.ultrasoundDueDate ?? null,
  fetalAnatomy: value.fetalAnatomy ?? null,
}));

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
}).refine((value) => !value.validFrom || !value.validUntil || value.validUntil >= value.validFrom, { message: "Ngày hết hạn phải sau ngày bắt đầu", path: ["validUntil"] }).transform((value) => ({ ...value, registeredCare: value.insuranceType === "BHYT" ? value.registeredCare ?? null : null }));

export const babyInsuranceSchema = z.object({
  ...insuranceFields,
  babyId: z.string().min(1),
}).refine((value) => !value.validFrom || !value.validUntil || value.validUntil >= value.validFrom, { message: "Ngày hết hạn phải sau ngày bắt đầu", path: ["validUntil"] }).transform((value) => ({ ...value, registeredCare: value.insuranceType === "BHYT" ? value.registeredCare ?? null : null }));

export const feedingSchema = z.object({
  id: optionalText,
  babyId: z.string().min(1),
  type: z.enum(["BREASTFEEDING", "BOTTLE_BREAST_MILK", "FORMULA", "MIXED"]),
  startTime: dateValue,
  endTime: optionalDate,
  leftBreastDuration: optionalInteger.refine((value) => value === undefined || value <= 1440, "Thời lượng bú không hợp lệ"),
  rightBreastDuration: optionalInteger.refine((value) => value === undefined || value <= 1440, "Thời lượng bú không hợp lệ"),
  firstSide: z.preprocess((value) => value === "" ? undefined : value, z.enum(["LEFT", "RIGHT"]).optional()),
  amountMl: optionalNumber.refine((value) => value === undefined || value <= 3000, "Lượng sữa không hợp lệ"),
  milkType: optionalText,
  notes: optionalText,
}).refine((value) => !value.endTime || value.endTime >= value.startTime, { message: "Giờ kết thúc phải sau giờ bắt đầu", path: ["endTime"] })
  .transform((value) => {
    const breast = value.type === "BREASTFEEDING" || value.type === "MIXED";
    return {
      ...value,
      // Explicit nulls clear fields from the previous type when editing a record.
      leftBreastDuration: breast ? value.leftBreastDuration ?? null : null,
      rightBreastDuration: breast ? value.rightBreastDuration ?? null : null,
      firstSide: breast ? value.firstSide ?? null : null,
      amountMl: value.type === "BREASTFEEDING" ? null : value.amountMl ?? null,
      milkType: value.type === "FORMULA" || value.type === "MIXED" ? value.milkType ?? null : null,
    };
  });

export const sleepSchema = z.object({
  id: optionalText,
  babyId: z.string().min(1),
  startTime: dateValue,
  endTime: optionalDate,
  type: z.enum(["NAP", "NIGHT"]),
  location: optionalText,
  notes: optionalText,
}).refine((value) => !value.endTime || value.endTime >= value.startTime, { message: "Giờ kết thúc phải sau giờ bắt đầu", path: ["endTime"] });

export const diaperSchema = z.object({
  id: optionalText,
  babyId: z.string().min(1),
  changedAt: dateValue,
  type: z.enum(["WET", "STOOL", "BOTH"]),
  stoolColor: optionalText,
  consistency: optionalText,
  amount: optionalText,
  notes: optionalText,
}).transform((value) => ({
  ...value,
  stoolColor: value.type === "WET" ? null : value.stoolColor ?? null,
  consistency: value.type === "WET" ? null : value.consistency ?? null,
  amount: value.type === "WET" ? null : value.amount ?? null,
}));

export const growthSchema = z.object({
  id: optionalText,
  babyId: z.string().min(1),
  measuredAt: dateValue,
  weightKg: optionalNumber.refine((value) => value === undefined || value <= 300, "Cân nặng không hợp lệ"),
  heightCm: optionalNumber.refine((value) => value === undefined || value <= 250, "Chiều cao không hợp lệ"),
  headCircumferenceCm: optionalNumber.refine((value) => value === undefined || value <= 100, "Vòng đầu không hợp lệ"),
  measurementPosition: z.preprocess(
    (value) => value === "" || value === null ? undefined : value,
    z.enum(["RECUMBENT", "STANDING"]).optional(),
  ),
  notes: optionalText,
}).refine((value) => value.weightKg !== undefined || value.heightCm !== undefined || value.headCircumferenceCm !== undefined, { message: "Hãy nhập ít nhất một số đo" }).transform((value) => ({
  ...value,
  heightCm: value.heightCm ?? null,
  measurementPosition: value.heightCm === undefined ? null : value.measurementPosition ?? null,
}));

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
