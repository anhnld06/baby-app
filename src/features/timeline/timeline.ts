import type { DiaperEntry, Feeding, GrowthEntry, Prescription, PrescriptionItem, SleepEntry, ToothRecord, VaccinationRecord } from "@prisma/client";
import { toothTypeLabelKey } from "@/features/teeth/teeth";

export type TimelineItem = {
  id: string;
  kind: "feeding" | "sleep" | "diaper" | "growth" | "vaccination" | "prescription" | "tooth";
  at: Date;
  title: string;
  detail: string;
};

type TimelineLabels = {
  feeding: string;
  sleep: string;
  diaper: string;
  growth: string;
  sleeping: string;
  vaccination: string;
  prescription: string;
  teeth: string;
  centralIncisor: string;
  lateralIncisor: string;
  canine: string;
  firstMolar: string;
  secondMolar: string;
};

type TimelineInput = {
  feedings: Feeding[];
  sleeps: SleepEntry[];
  diapers: DiaperEntry[];
  growthEntries: GrowthEntry[];
  vaccinations?: VaccinationRecord[];
  prescriptions?: (Prescription & { items: PrescriptionItem[] })[];
  toothRecords?: ToothRecord[];
};

export function buildTimeline(input: TimelineInput, labels: TimelineLabels, locale = "vi"): TimelineItem[] {
  return [
    ...input.feedings.map((item) => ({ id: item.id, kind: "feeding" as const, at: item.startTime, title: labels.feeding, detail: item.amountMl ? `${item.amountMl} ml` : item.type.replaceAll("_", " ").toLowerCase() })),
    ...input.sleeps.map((item) => ({ id: item.id, kind: "sleep" as const, at: item.startTime, title: labels.sleep, detail: item.endTime ? new Intl.NumberFormat(locale, { style: "unit", unit: "minute", unitDisplay: "long" }).format(Math.round((item.endTime.getTime() - item.startTime.getTime()) / 60_000)) : labels.sleeping })),
    ...input.diapers.map((item) => ({ id: item.id, kind: "diaper" as const, at: item.changedAt, title: labels.diaper, detail: item.type.replaceAll("_", " ").toLowerCase() })),
    ...input.growthEntries.map((item) => ({ id: item.id, kind: "growth" as const, at: item.measuredAt, title: labels.growth, detail: [item.weightKg && `${item.weightKg} kg`, item.heightCm && `${item.heightCm} cm`].filter(Boolean).join(" · ") })),
    ...(input.vaccinations ?? []).map((item) => ({ id: item.id, kind: "vaccination" as const, at: item.administeredAt, title: labels.vaccination, detail: item.vaccineName })),
    ...(input.prescriptions ?? []).map((item) => ({ id: item.id, kind: "prescription" as const, at: item.issuedAt, title: labels.prescription, detail: item.items.map((line) => line.medicineName).join(", ") })),
    ...(input.toothRecords ?? []).map((item) => ({ id: item.id, kind: "tooth" as const, at: item.eruptedAt, title: labels.teeth, detail: labels[toothTypeLabelKey(item.position)] })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());
}
