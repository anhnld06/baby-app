type PregnancyLike = {
  pregnancyStatus: "PLANNING" | "PREGNANT" | "DELIVERED" | "ENDED";
  createdAt: Date;
};

export function selectRelevantPregnancy<T extends PregnancyLike>(pregnancies: T[]) {
  const newestFirst = [...pregnancies].sort(
    (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
  );
  return (
    newestFirst.find((pregnancy) => pregnancy.pregnancyStatus === "PREGNANT") ??
    newestFirst.find((pregnancy) => pregnancy.pregnancyStatus === "PLANNING") ??
    newestFirst[0] ??
    null
  );
}

/** Use calendar days, preferring the established due date over LMP. */
export function pregnancyAge(pregnancy: {
  pregnancyStatus: string;
  estimatedDueDate?: Date | null;
  lastMenstrualPeriod?: Date | null;
}, on = new Date(), timeZone = "Asia/Ho_Chi_Minh") {
  if (!Number.isFinite(on.getTime())) return undefined;
  if (pregnancy.pregnancyStatus !== "PREGNANT") return undefined;
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(on);
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const today = Date.UTC(part("year"), part("month") - 1, part("day"));
  const baseline = pregnancy.estimatedDueDate
    ? pregnancy.estimatedDueDate.getTime() - 280 * 86400000
    : pregnancy.lastMenstrualPeriod?.getTime();
  if (baseline == null) return undefined;
  const total = Math.floor((today - baseline) / 86400000);
  if (!Number.isFinite(total) || total < 0 || total >= 46 * 7) return undefined;
  return { weeks: Math.floor(total / 7), days: total % 7, totalDays: total,
    source: pregnancy.estimatedDueDate ? "Ngày dự sinh đã lưu" : "Kỳ kinh cuối" };
}
