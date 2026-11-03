import type { PregnancyCheckup, Prisma } from "@prisma/client";
import { toDateTimeLocal } from "@/lib/date";
import { ULTRASOUND_METRICS, type UltrasoundMetric, type UltrasoundVisit } from "./ultrasound-progress";

export const ULTRASOUND_PROGRESS_SELECT = {
  id: true, checkedAt: true, checkedAtTimeKnown: true, gestationalWeek: true, gestationalDay: true,
  facility: true, fetusCount: true, estimatedFetalWeightG: true, bpdMm: true, hcMm: true, acMm: true,
  flMm: true, crlMm: true, fetalHeartRate: true, ntMm: true, afiMm: true, estimatedFetalWeightPercentile: true,
} satisfies Prisma.PregnancyCheckupSelect;

type Source = Pick<PregnancyCheckup, UltrasoundMetric | "id" | "checkedAt" | "checkedAtTimeKnown" | "gestationalWeek" | "gestationalDay" | "facility" | "fetusCount">;
export function ultrasoundVisitFromRecord(item: Source, timeZone: string): UltrasoundVisit {
  return {
    id: item.id,
    day: item.checkedAtTimeKnown ? toDateTimeLocal(item.checkedAt, timeZone).slice(0, 10) : item.checkedAt.toISOString().slice(0, 10),
    recordedAt: item.checkedAt.toISOString(),
    dateLabel: new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: item.checkedAtTimeKnown ? timeZone : "UTC" }).format(item.checkedAt),
    ageLabel: item.gestationalWeek != null ? `${item.gestationalWeek} tuần ${item.gestationalDay} ngày` : "Chưa ghi tuổi thai",
    facility: item.facility, fetusCount: item.fetusCount,
    values: Object.fromEntries(ULTRASOUND_METRICS.map(({ key }) => [key, item[key]])) as UltrasoundVisit["values"],
  };
}
