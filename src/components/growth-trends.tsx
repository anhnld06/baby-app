import { GrowthLineChart } from "@/components/growth-line-chart";
import { GrowthMetricTabs } from "@/components/growth-metric-tabs";
import { ExternalLink, TrendingUp } from "lucide-react";
import {
  buildGrowthSeries,
  type GrowthMeasurement,
  type GrowthMetric,
} from "@/features/growth/trend";
import { numberFormatter } from "@/lib/format";

const WHO_URLS: Record<GrowthMetric, string> = {
  weightKg:
    "https://www.who.int/tools/child-growth-standards/standards/weight-for-age",
  heightCm:
    "https://www.who.int/tools/child-growth-standards/standards/length-height-for-age",
  headCircumferenceCm:
    "https://www.who.int/tools/child-growth-standards/standards/head-circumference-for-age",
};

const metrics: Array<{
  key: GrowthMetric;
  label: string;
  unit: string;
  digits: number;
}> = [
  { key: "weightKg", label: "Cân nặng", unit: "kg", digits: 2 },
  {
    key: "heightCm",
    label: "Chiều dài / chiều cao",
    unit: "cm",
    digits: 1,
  },
  {
    key: "headCircumferenceCm",
    label: "Vòng đầu",
    unit: "cm",
    digits: 1,
  },
];

function ageLabel(days: number) {
  if (days < 31) return `${days} ngày`;
  const months = Math.round(days / 30.4375);
  return `${months} tháng`;
}

function MetricChart({
  metric,
  measurements,
  dateOfBirth,
  gestationalAgeAtBirth,
  timeZone,
}: {
  metric: (typeof metrics)[number];
  measurements: GrowthMeasurement[];
  dateOfBirth: Date;
  gestationalAgeAtBirth?: number | null;
  timeZone: string;
}) {
  const series = buildGrowthSeries(
    measurements,
    dateOfBirth,
    metric.key,
    gestationalAgeAtBirth,
    timeZone,
  );
  if (series.length === 0)
    return (
      <p className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
        Chưa có số đo cho chỉ số này.
      </p>
    );
  const latest = series.at(-1)!;
  const title = metric.label;
  const number = numberFormatter(metric.digits);
  const chartDescription =
    `${title}: ${series.length} lần đo từ ${ageLabel(series[0].ageDays)} đến ${ageLabel(latest.ageDays)}`;

  return (
    <article className="surface-panel rounded-3xl p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-3 text-4xl font-semibold tracking-tight tabular-nums">
            {number.format(latest.value)}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              {metric.unit}
            </span>
          </p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {"Lần đo gần nhất: "}
            {new Intl.DateTimeFormat("vi-VN", { timeZone, day: "2-digit", month: "2-digit", year: "numeric" }).format(latest.measuredAt)}
          </p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          <TrendingUp className="size-5" />
        </span>
      </div>
      <GrowthLineChart
        label={chartDescription}
        unit={metric.unit}
        points={series.map((point, index) => ({
          key: `${point.measuredAt.toISOString()}-${index}`,
          value: point.value,
          age: point.ageDays,
          label: new Intl.DateTimeFormat("vi-VN", {
            timeZone,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(point.measuredAt),
          ageLabel: ageLabel(point.ageDays),
        }))}
      />
      <a
        href={WHO_URLS[metric.key]}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-xs font-medium text-primary underline-offset-4 hover:underline"
      >
        Mở bảng tham chiếu WHO
        <ExternalLink className="size-3.5" />
      </a>
    </article>
  );
}

export function GrowthTrends({
  measurements,
  dateOfBirth,
  gestationalAgeAtBirth,
  timeZone,
}: {
  measurements: GrowthMeasurement[];
  dateOfBirth: Date;
  gestationalAgeAtBirth?: number | null;
  timeZone: string;
}) {
  if (
    !measurements.some(
      (item) =>
        item.weightKg != null ||
        item.heightCm != null ||
        item.headCircumferenceCm != null,
    )
  )
    return null;
  const premature = gestationalAgeAtBirth != null && gestationalAgeAtBirth < 37;

  return (
    <section className="mt-7" aria-labelledby="growth-trend-title">
      <div className="mb-3">
        <h2 id="growth-trend-title" className="text-xl font-semibold">
          Xu hướng tăng trưởng
        </h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Biểu đồ nối các số đo đã ghi. Bảng WHO mở ở liên kết riêng và không thay thế đánh giá của bác sĩ.
        </p>
      </div>
      {premature && (
        <p className="mb-3 rounded-2xl bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:bg-amber-950 dark:text-amber-100">
          Bé sinh trước 37 tuần: trục tuổi dùng tuổi hiệu chỉnh trong 2 năm đầu. Đây vẫn chỉ là thông tin tham khảo; bác sĩ có thể điều chỉnh cách đánh giá theo tình trạng riêng của bé.
        </p>
      )}
      <GrowthMetricTabs
        panels={metrics.map((metric) => ({
          id: metric.key,
          title: metric.label,
          content: (
            <MetricChart
              metric={metric}
              measurements={measurements}
              dateOfBirth={dateOfBirth}
              gestationalAgeAtBirth={gestationalAgeAtBirth}
              timeZone={timeZone}
            />
          ),
        }))}
      />
    </section>
  );
}
