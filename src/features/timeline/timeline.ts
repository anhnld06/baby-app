import type { DiaperEntry, Feeding, GrowthEntry, Prescription, PrescriptionItem, SleepEntry, ToothRecord, VaccinationRecord } from "@prisma/client";
import { toothTypeLabelKey } from "@/features/teeth/teeth";

export type TimelineItem = {
  id: string;
  kind: "temperature" | "medication" | "care" | "feeding" | "sleep" | "diaper" | "growth" | "vaccination" | "prescription" | "tooth";
  at: Date;
  active?: boolean;
  href?: string;
  careKind?: string;
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
  temperatures?: {id:string;measuredAt:Date;celsius:number;method:string}[];
  medicationDoses?: {id:string;takenAt:Date;time:string;schedule:{name:string;dosage:string}}[];
  careEntries?: { id: string; kind: string; occurredAt: Date; title: string; details: string | null }[];
  feedings: Feeding[];
  sleeps: SleepEntry[];
  diapers: DiaperEntry[];
  growthEntries: GrowthEntry[];
  vaccinations?: VaccinationRecord[];
  prescriptions?: (Prescription & { items: PrescriptionItem[] })[];
  toothRecords?: ToothRecord[];
};

export function buildTimeline(input: TimelineInput, labels: TimelineLabels, locale = "vi"): TimelineItem[] {
  const vi = locale.startsWith("vi");
  const feedingTypes = vi
    ? { BREASTFEEDING: "Bú mẹ", BOTTLE_BREAST_MILK: "Sữa mẹ bình", FORMULA: "Sữa công thức", MIXED: "Kết hợp" }
    : { BREASTFEEDING: "Breastfeeding", BOTTLE_BREAST_MILK: "Bottle breast milk", FORMULA: "Formula", MIXED: "Mixed" };
  const diaperTypes = vi ? { WET: "Tã ướt", STOOL: "Tã phân", BOTH: "Tã ướt và phân" } : { WET: "Wet", STOOL: "Stool", BOTH: "Wet and stool" };
  return [
    ...(input.temperatures ?? []).map(item => ({id:item.id,kind:"temperature" as const,at:item.measuredAt,title:vi ? "Đo nhiệt độ" : "Temperature",detail:`${item.celsius.toFixed(1)} °C`})),
    ...(input.medicationDoses ?? []).map(item => ({id:item.id,kind:"medication" as const,at:item.takenAt,title:vi ? "Đã dùng thuốc" : "Medication taken",detail:`${item.schedule.name} · ${item.schedule.dosage} · ${item.time}`})),
    ...(input.careEntries ?? []).filter(item => item.kind !== "ROUTINE").map(item => ({ id: item.id, kind: "care" as const, careKind: item.kind, href: item.kind === "WAKE" ? "/baby/routine" : `/baby/${item.kind === "MEAL" ? "meals" : item.kind === "MILESTONE" ? "milestones" : "wellbeing"}?edit=${item.id}`, at: item.occurredAt, title: item.title, detail: item.details ?? (vi ? "Nhật ký của bé" : "Baby journal") })),
    ...input.feedings.map((item) => ({ id: item.id, kind: "feeding" as const, at: item.startTime, active: item.type === "BREASTFEEDING" && !item.endTime && item.amountMl == null && item.leftBreastDuration == null && item.rightBreastDuration == null, title: labels.feeding, detail: item.amountMl != null ? `${item.amountMl} ml` : feedingTypes[item.type] })),
    ...input.sleeps.map((item) => ({ id: item.id, kind: "sleep" as const, at: item.startTime, active: item.endTime === null, title: labels.sleep, detail: item.endTime ? new Intl.NumberFormat(locale, { style: "unit", unit: "minute", unitDisplay: "long" }).format(Math.round((item.endTime.getTime() - item.startTime.getTime()) / 60_000)) : labels.sleeping })),
    ...input.diapers.map((item) => ({ id: item.id, kind: "diaper" as const, at: item.changedAt, title: labels.diaper, detail: diaperTypes[item.type] })),
    ...input.growthEntries.map((item) => ({ id: item.id, kind: "growth" as const, at: item.measuredAt, title: labels.growth, detail: [item.weightKg && `${item.weightKg} kg`, item.heightCm && `${item.heightCm} cm`].filter(Boolean).join(" · ") })),
    ...(input.vaccinations ?? []).map((item) => ({ id: item.id, kind: "vaccination" as const, at: item.administeredAt, title: labels.vaccination, detail: item.vaccineName })),
    ...(input.prescriptions ?? []).map((item) => ({ id: item.id, kind: "prescription" as const, at: item.issuedAt, title: labels.prescription, detail: item.items.map((line) => line.medicineName).join(", ") })),
    ...(input.toothRecords ?? []).map((item) => ({ id: item.id, kind: "tooth" as const, href: `/tracking/teeth?position=${item.position}`, at: item.eruptedAt, title: labels.teeth, detail: labels[toothTypeLabelKey(item.position)] })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());
}
