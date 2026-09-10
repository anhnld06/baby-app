export type MotherScheduleEntry = {
  key: string;
  label: string;
  matchName: string;
  doseNumber: number;
  dueByWeek: number;
};

export type BabyScheduleEntry = {
  key: string;
  label: string;
  matchName: string;
  doseNumber: number;
  dueAgeDays: number;
};

// Reference schedule only — general public-health guidance (Vietnam's Expanded
// Programme on Immunization core vaccines), not a personalized medical order.
// Always defer to the attending doctor's actual schedule.
export const MOTHER_PRENATAL_SCHEDULE: MotherScheduleEntry[] = [
  { key: "tetanus-1", label: "Uốn ván (VAT) - mũi 1", matchName: "uốn ván", doseNumber: 1, dueByWeek: 20 },
  { key: "tetanus-2", label: "Uốn ván (VAT) - mũi 2", matchName: "uốn ván", doseNumber: 2, dueByWeek: 24 },
];

export const BABY_SCHEDULE: BabyScheduleEntry[] = [
  { key: "hepb-birth", label: "Viêm gan B (sơ sinh)", matchName: "viêm gan b", doseNumber: 1, dueAgeDays: 0 },
  { key: "bcg", label: "BCG (lao)", matchName: "bcg", doseNumber: 1, dueAgeDays: 0 },
  { key: "5in1-1", label: "5 trong 1 / 6 trong 1 - mũi 1", matchName: "5 trong 1", doseNumber: 1, dueAgeDays: 60 },
  { key: "polio-1", label: "Bại liệt - mũi 1", matchName: "bại liệt", doseNumber: 1, dueAgeDays: 60 },
  { key: "5in1-2", label: "5 trong 1 / 6 trong 1 - mũi 2", matchName: "5 trong 1", doseNumber: 2, dueAgeDays: 90 },
  { key: "polio-2", label: "Bại liệt - mũi 2", matchName: "bại liệt", doseNumber: 2, dueAgeDays: 90 },
  { key: "5in1-3", label: "5 trong 1 / 6 trong 1 - mũi 3", matchName: "5 trong 1", doseNumber: 3, dueAgeDays: 120 },
  { key: "polio-3", label: "Bại liệt - mũi 3", matchName: "bại liệt", doseNumber: 3, dueAgeDays: 120 },
  { key: "measles-1", label: "Sởi - mũi 1", matchName: "sởi", doseNumber: 1, dueAgeDays: 270 },
  { key: "5in1-booster", label: "5 trong 1 / 6 trong 1 - nhắc lại", matchName: "5 trong 1", doseNumber: 4, dueAgeDays: 540 },
  { key: "mmr-1", label: "Sởi - Quai bị - Rubella (MMR) - mũi 1", matchName: "quai bị", doseNumber: 1, dueAgeDays: 540 },
];
