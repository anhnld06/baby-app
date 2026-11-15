import { CareIllustration } from "@/components/care-illustration";
import { buildGrowthSeries, type GrowthMeasurement } from "@/features/growth/trend";
import { numberFormatter } from "@/lib/format";

export function GrowthSummary({ measurements, dateOfBirth, timeZone }: {
  measurements: GrowthMeasurement[];
  dateOfBirth: Date;
  timeZone: string;
}) {
  const series = buildGrowthSeries(measurements, dateOfBirth, "weightKg", undefined, timeZone);
  const latest = series.at(-1);
  const previous = series.at(-2);
  const number = numberFormatter();
  const date = new Intl.DateTimeFormat("vi-VN", { timeZone, day: "2-digit", month: "2-digit", year: "numeric" });
  const difference = latest && previous ? Math.round((latest.value - previous.value) * 1000) : undefined;
  const title = difference !== undefined
    ? `Thay đổi cân nặng: ${difference > 0 ? "+" : ""}${number.format(difference)} g`
    : latest
      ? `Cân nặng gần nhất: ${number.format(latest.value)} kg`
      : "Bắt đầu theo dõi tăng trưởng";
  const detail = latest && previous
    ? `${number.format(previous.value)} kg → ${number.format(latest.value)} kg · ${date.format(previous.measuredAt)} – ${date.format(latest.measuredAt)}`
    : latest
      ? `Ghi nhận ngày ${date.format(latest.measuredAt)}`
      : "Thêm số đo đầu tiên để xem thay đổi theo thời gian.";

  return (
    <section aria-label="Tóm tắt tăng trưởng" className="mb-4 flex items-center gap-3 rounded-3xl border border-cyan-200/70 bg-cyan-50/60 p-4 dark:border-cyan-900/70 dark:bg-cyan-950/30 sm:gap-4 sm:p-5">
      <span className="shrink-0 [&>.care-illustration]:size-14 sm:[&>.care-illustration]:size-16"><CareIllustration kind="growth" small /></span>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-6 sm:text-base">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">{detail}</p>
      </div>
    </section>
  );
}
