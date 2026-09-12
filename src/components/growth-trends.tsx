import { ExternalLink, TrendingUp } from "lucide-react";
import {
  buildGrowthSeries,
  chartCoordinates,
  growthChange,
  type GrowthMeasurement,
  type GrowthMetric,
} from "@/features/growth/trend";

const WHO_URLS: Record<GrowthMetric, string> = {
  weightKg: "https://www.who.int/tools/child-growth-standards/standards/weight-for-age",
  heightCm: "https://www.who.int/tools/child-growth-standards/standards/length-height-for-age",
  headCircumferenceCm: "https://www.who.int/tools/child-growth-standards/standards/head-circumference-for-age",
};

const metrics: Array<{ key: GrowthMetric; vi: string; en: string; unit: string; digits: number }> = [
  { key: "weightKg", vi: "Cân nặng", en: "Weight", unit: "kg", digits: 2 },
  { key: "heightCm", vi: "Chiều dài / chiều cao", en: "Length / height", unit: "cm", digits: 1 },
  { key: "headCircumferenceCm", vi: "Vòng đầu", en: "Head circumference", unit: "cm", digits: 1 },
];

function ageLabel(days: number, locale: "vi" | "en") {
  if (days < 31) return locale === "vi" ? `${days} ngày` : `${days} days`;
  const months = Math.round(days / 30.4375);
  return locale === "vi" ? `${months} tháng` : `${months} months`;
}

function MetricChart({
  metric,
  measurements,
  dateOfBirth,
  gestationalAgeAtBirth,
  locale,
}: {
  metric: (typeof metrics)[number];
  measurements: GrowthMeasurement[];
  dateOfBirth: Date;
  gestationalAgeAtBirth?: number | null;
  locale: "vi" | "en";
}) {
  const series = buildGrowthSeries(
    measurements,
    dateOfBirth,
    metric.key,
    gestationalAgeAtBirth,
  );
  if (series.length === 0) return null;
  const points = chartCoordinates(series);
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const latest = series.at(-1)!;
  const change = growthChange(series);
  const title = locale === "vi" ? metric.vi : metric.en;
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: metric.digits });
  const chartDescription = locale === "vi"
    ? `${title}: ${series.length} lần đo từ ${ageLabel(series[0].ageDays, locale)} đến ${ageLabel(latest.ageDays, locale)}`
    : `${title}: ${series.length} measurements from ${ageLabel(series[0].ageDays, locale)} to ${ageLabel(latest.ageDays, locale)}`;

  return (
    <article className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {locale === "vi" ? "Mới nhất" : "Latest"}: {number.format(latest.value)} {metric.unit}
            {change !== undefined && (
              <span className={change < 0 ? "ml-2 text-amber-700 dark:text-amber-300" : "ml-2 text-emerald-700 dark:text-emerald-300"}>
                {change >= 0 ? "+" : ""}{number.format(change)} {metric.unit}
              </span>
            )}
          </p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          <TrendingUp className="size-5" />
        </span>
      </div>
      {series.length > 1 ? (
        <svg viewBox="0 0 320 150" className="mt-3 h-auto w-full overflow-visible" role="img" aria-label={chartDescription}>
          <line x1="28" y1="122" x2="292" y2="122" className="stroke-border" />
          <line x1="28" y1="28" x2="28" y2="122" className="stroke-border" />
          <path d={path} fill="none" className="stroke-primary" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((point, index) => (
            <circle key={`${point.measuredAt.toISOString()}-${point.value}-${index}`} cx={point.x} cy={point.y} r="4" className="fill-card stroke-primary" strokeWidth="3" />
          ))}
          <text x="28" y="143" className="fill-muted-foreground text-[10px]">{ageLabel(series[0].ageDays, locale)}</text>
          <text x="292" y="143" textAnchor="end" className="fill-muted-foreground text-[10px]">{ageLabel(latest.ageDays, locale)}</text>
        </svg>
      ) : (
        <p className="mt-4 rounded-xl bg-muted/50 p-3 text-xs leading-5 text-muted-foreground">
          {locale === "vi" ? "Cần thêm một lần đo để vẽ xu hướng." : "Add one more measurement to draw a trend."}
        </p>
      )}
      <a href={WHO_URLS[metric.key]} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-xs font-medium text-primary underline-offset-4 hover:underline">
        {locale === "vi" ? "Mở bảng tham chiếu WHO" : "Open WHO reference tables"}
        <ExternalLink className="size-3.5" />
      </a>
    </article>
  );
}

export function GrowthTrends({
  measurements,
  dateOfBirth,
  gestationalAgeAtBirth,
  locale,
}: {
  measurements: GrowthMeasurement[];
  dateOfBirth: Date;
  gestationalAgeAtBirth?: number | null;
  locale: "vi" | "en";
}) {
  if (!measurements.some((item) => item.weightKg != null || item.heightCm != null || item.headCircumferenceCm != null)) return null;
  const premature = gestationalAgeAtBirth != null && gestationalAgeAtBirth < 37;

  return (
    <section className="mt-7" aria-labelledby="growth-trend-title">
      <div className="mb-3">
        <h2 id="growth-trend-title" className="text-lg font-semibold">
          {locale === "vi" ? "Xu hướng tăng trưởng" : "Growth trends"}
        </h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {locale === "vi"
            ? "Biểu đồ nối các số đo đã ghi. Bảng WHO mở ở liên kết riêng và không thay thế đánh giá của bác sĩ."
            : "The chart connects recorded measurements. WHO tables open separately and do not replace clinical assessment."}
        </p>
      </div>
      {premature && (
        <p className="mb-3 rounded-2xl bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:bg-amber-950 dark:text-amber-100">
          {locale === "vi"
            ? "Bé sinh trước 37 tuần: trục tuổi dùng tuổi hiệu chỉnh trong 2 năm đầu. Đây vẫn chỉ là thông tin tham khảo; bác sĩ có thể điều chỉnh cách đánh giá theo tình trạng riêng của bé."
            : "Born before 37 weeks: the age axis uses corrected age during the first two years. This remains a reference; clinical assessment may differ."}
        </p>
      )}
      <div className="grid gap-3 lg:grid-cols-3">
        {metrics.map((metric) => (
          <MetricChart key={metric.key} metric={metric} measurements={measurements} dateOfBirth={dateOfBirth} gestationalAgeAtBirth={gestationalAgeAtBirth} locale={locale} />
        ))}
      </div>
    </section>
  );
}
