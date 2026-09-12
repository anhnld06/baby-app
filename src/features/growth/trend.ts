import { ageInDays } from "@/lib/date";

export type GrowthMetric = "weightKg" | "heightCm" | "headCircumferenceCm";

export type GrowthMeasurement = {
  measuredAt: Date;
  weightKg: number | null;
  heightCm: number | null;
  headCircumferenceCm: number | null;
};

export type GrowthPoint = {
  ageDays: number;
  measuredAt: Date;
  value: number;
};

export function correctedAgeInDays(
  dateOfBirth: Date,
  measuredAt: Date,
  gestationalAgeAtBirth?: number | null,
) {
  const chronologicalDays = ageInDays(dateOfBirth, measuredAt);
  if (
    gestationalAgeAtBirth == null ||
    gestationalAgeAtBirth >= 37 ||
    chronologicalDays >= 730
  ) return chronologicalDays;
  const daysEarly = Math.max(0, 40 - gestationalAgeAtBirth) * 7;
  return Math.max(0, chronologicalDays - daysEarly);
}

export function buildGrowthSeries(
  measurements: GrowthMeasurement[],
  dateOfBirth: Date,
  metric: GrowthMetric,
  gestationalAgeAtBirth?: number | null,
) {
  return measurements
    .flatMap<GrowthPoint>((measurement) => {
      const value = measurement[metric];
      if (value == null || !Number.isFinite(value)) return [];
      return [{
        ageDays: correctedAgeInDays(
          dateOfBirth,
          measurement.measuredAt,
          gestationalAgeAtBirth,
        ),
        measuredAt: measurement.measuredAt,
        value,
      }];
    })
    .sort((left, right) => left.measuredAt.getTime() - right.measuredAt.getTime());
}

export function growthChange(series: GrowthPoint[]) {
  if (series.length < 2) return undefined;
  return series.at(-1)!.value - series.at(-2)!.value;
}

export function chartCoordinates(
  series: GrowthPoint[],
  width = 320,
  height = 150,
  padding = 28,
) {
  if (series.length === 0) return [];
  const ages = series.map((point) => point.ageDays);
  const values = series.map((point) => point.value);
  const minAge = Math.min(...ages);
  const maxAge = Math.max(...ages);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const ageSpan = Math.max(1, maxAge - minAge);
  const rawValueSpan = maxValue - minValue;
  const valuePadding = Math.max(rawValueSpan * 0.15, maxValue * 0.025, 0.1);
  const low = Math.max(0, minValue - valuePadding);
  const high = maxValue + valuePadding;
  const valueSpan = Math.max(0.1, high - low);

  return series.map((point) => ({
    ...point,
    x: padding + ((point.ageDays - minAge) / ageSpan) * (width - padding * 2),
    y: height - padding - ((point.value - low) / valueSpan) * (height - padding * 2),
  }));
}
