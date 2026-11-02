"use client";
import { useId, useState } from "react";
export function GrowthLineChart({
  points,
  unit,
  locale,
  label,
}: {
  points: {
    key: string;
    value: number;
    age: number;
    label: string;
    ageLabel: string;
  }[];
  unit: string;
  locale: "vi" | "en";
  label: string;
}) {
  const id = useId().replace(/:/g, "");
  const [selected, setSelected] = useState<string>();
  const chosen = points.find((p) => p.key === selected) ?? points.at(-1)!;
  const values = points.map((p) => p.value);
  const min = Math.min(...values),
    max = Math.max(...values);
  const padding = Math.max((max - min) * 0.2, max * 0.025, 0.1);
  const low = Math.max(0, min - padding),
    high = max + padding;
  const firstAge = points[0].age,
    lastAge = points.at(-1)!.age;
  const coordinates = points.map((p) => ({
    ...p,
    x:
      points.length === 1
        ? 185
        : 42 + ((p.age - firstAge) / Math.max(1, lastAge - firstAge)) * 282,
    y: 188 - ((p.value - low) / (high - low)) * 142,
  }));
  const path = coordinates
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");
  const area = `${path} L${coordinates.at(-1)!.x},188 L${coordinates[0].x},188 Z`;
  const number = (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
  return (
    <div className="mt-5" data-growth-chart>
      <svg
        viewBox="0 0 360 230"
        className="h-auto w-full"
        role="group"
        aria-label={label}
      >
        <defs>
          <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#39b6b5" stopOpacity=".2" />
            <stop offset="1" stopColor="#39b6b5" stopOpacity=".015" />
          </linearGradient>
        </defs>
        <text x="0" y="18" className="fill-muted-foreground" fontSize="12">
          {unit}
        </text>
        {Array.from({ length: 4 }, (_, i) => {
          const value = low + ((high - low) * i) / 3;
          const y = 188 - (i / 3) * 142;
          return (
            <g key={i}>
              <line
                x1="42"
                x2="324"
                y1={y}
                y2={y}
                className="stroke-border"
                strokeDasharray="3 5"
              />
              <text
                x="32"
                y={y + 3}
                textAnchor="end"
                fontSize="12"
                className="fill-muted-foreground"
              >
                {number(value)}
              </text>
            </g>
          );
        })}
        {points.length > 1 && (
          <>
            <path d={area} fill={`url(#${id}-area)`} />
            <path
              d={path}
              fill="none"
              stroke="#2aa7aa"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </>
        )}
        {coordinates.map((point) => (
          <g
            key={point.key}
            role="button"
            tabIndex={0}
            aria-label={`${point.label}: ${number(point.value)} ${unit}`}
            aria-pressed={chosen.key === point.key}
            className="chart-growth-point cursor-pointer outline-none"
            onClick={() => setSelected(point.key)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelected(point.key);
              }
            }}
          >
            <circle
              cx={point.x}
              cy={point.y}
              r="18"
              fill="transparent"
              className="chart-point-hit"
            />
            {chosen.key === point.key && (
              <circle
                cx={point.x}
                cy={point.y}
                r="10"
                fill="#2aa7aa"
                fillOpacity=".13"
              />
            )}
            <circle
              cx={point.x}
              cy={point.y}
              r={chosen.key === point.key ? 4.5 : 3.5}
              className="fill-card"
              stroke="#2aa7aa"
              strokeWidth="2.5"
            />
          </g>
        ))}
        <text x="42" y="215" className="fill-muted-foreground" fontSize="12">
          {points[0].ageLabel}
        </text>
        {points.length > 1 && (
          <text
            x="324"
            y="215"
            textAnchor="end"
            className="fill-muted-foreground"
            fontSize="12"
          >
            {points.at(-1)!.ageLabel}
          </text>
        )}
      </svg>
      <div
        aria-live="polite"
        className="flex items-center justify-between gap-3 rounded-2xl bg-muted/60 px-4 py-3"
      >
        <div>
          <p className="text-xs font-semibold">{chosen.label}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {chosen.ageLabel}
          </p>
        </div>
        <p className="text-lg font-semibold tabular-nums">
          {number(chosen.value)}{" "}
          <span className="text-xs font-normal text-muted-foreground">
            {unit}
          </span>
        </p>
      </div>
      {points.length === 1 && (
        <p className="mt-3 text-xs text-muted-foreground">
          {locale === "vi"
            ? "Cần thêm một lần đo để xem xu hướng."
            : "Add another measurement to see a trend."}
        </p>
      )}
    </div>
  );
}
