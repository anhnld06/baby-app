import { CareIllustration } from "@/components/care-illustration";
import { buildGrowthSeries, type GrowthMeasurement } from "@/features/growth/trend";

export function GrowthSummary({ measurements, dateOfBirth, locale, timeZone }: {
  measurements: GrowthMeasurement[];
  dateOfBirth: Date;
  locale: "vi" | "en";
  timeZone: string;
}) {
  const series = buildGrowthSeries(measurements, dateOfBirth, "weightKg");
  const latest = series.at(-1);
  const previous = series.at(-2);
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const date = new Intl.DateTimeFormat(locale, { timeZone, day: "2-digit", month: "2-digit", year: "numeric" });
  const difference = latest && previous ? Math.round((latest.value - previous.value) * 1000) : undefined;
  const title = difference !== undefined
    ? `${locale === "vi" ? "Thay đổi cân nặng" : "Weight change"}: ${difference > 0 ? "+" : ""}${number.format(difference)} g`
    : latest
      ? `${locale === "vi" ? "Cân nặng gần nhất" : "Latest weight"}: ${number.format(latest.value)} kg`
      : locale === "vi" ? "Bắt đầu theo dõi tăng trưởng" : "Start tracking growth";
  const detail = latest && previous
    ? `${number.format(previous.value)} kg → ${number.format(latest.value)} kg · ${date.format(previous.measuredAt)} – ${date.format(latest.measuredAt)}`
    : latest
      ? `${locale === "vi" ? "Ghi nhận ngày" : "Recorded on"} ${date.format(latest.measuredAt)}`
      : locale === "vi" ? "Thêm số đo đầu tiên để xem thay đổi theo thời gian." : "Add a first measurement to see changes over time.";

  return (
    <section aria-label={locale === "vi" ? "Tóm tắt tăng trưởng" : "Growth summary"} className="mb-4 flex items-center gap-3 rounded-3xl border border-cyan-200/70 bg-cyan-50/60 p-4 dark:border-cyan-900/70 dark:bg-cyan-950/30 sm:gap-4 sm:p-5">
      <span className="shrink-0 [&>.care-illustration]:size-14 sm:[&>.care-illustration]:size-16"><CareIllustration kind="growth" small /></span>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-6 sm:text-base">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">{detail}</p>
      </div>
    </section>
  );
}
