"use client";
import { useEffect, useId, useRef, useState } from "react";
import { chartScale } from "@/features/charts/scale";
export type MetricBar = {
  key: string;
  label: string;
  value: number | null;
  secondary?: number;
  note?: string;
  current?: boolean;
};
export const chartColors = {
  teal: { main: "#2ba9ac", light: "#a5e4de", soft: "#e8f7f5" },
  violet: { main: "#9981d4", light: "#ded3f6", soft: "#f2eefb" },
  sky: { main: "#4b9ad5", light: "#bbdef5", soft: "#ecf5fc" },
  amber: { main: "#e7a05d", light: "#f8dcc0", soft: "#fff4e9" },
};
export function MetricBarChart({
  rows,
  unit,
  tone = "teal",
  locale = "vi",
  selectedKey,
  onSelect,
  showSelection = true,
  label,
}: {
  rows: MetricBar[];
  unit: string;
  tone?: keyof typeof chartColors;
  locale?: string;
  selectedKey?: string;
  onSelect?: (key: string) => void;
  showSelection?: boolean;
  label: string;
}) {
  const id = useId().replace(/:/g, "");
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(360);
  const [selection, setSelection] = useState<string>();
  useEffect(() => {
    const node = container.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) =>
      setWidth(entries[0].contentRect.width),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const chosen =
    rows.find((row) => row.key === (selectedKey ?? selection)) ??
    rows.findLast((row) => row.value != null) ??
    rows[0];
  const hasData = rows.some((row) => row.value != null);
  const chartWidth = Math.max(
    width,
    rows.length > 14 && hasData ? rows.length * 22 + 48 : 240,
  );
  const left = 38,
    right = chartWidth - 12,
    top = 28,
    bottom = 204;
  const slot = (right - left) / Math.max(1, rows.length);
  const barWidth = Math.min(32, slot * 0.56);
  const { upper, ticks } = chartScale(
    rows.map((row) => row.value),
    !["giờ", "hours"].includes(unit),
  );
  const color = chartColors[tone];
  const number = (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
  const pick = (key: string) => {
    setSelection(key);
    onSelect?.(key);
  };
  return (
    <div ref={container} className="min-w-0" data-metric-chart>
      <div
        className="overflow-x-auto overscroll-x-contain pb-1"
        role="group"
        aria-label={label}
      >
        <svg
          width={chartWidth}
          height="242"
          viewBox={`0 0 ${chartWidth} 242`}
          className="block max-w-none"
          style={{ width: chartWidth }}
        >
          <defs>
            <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor={color.main} />
              <stop offset="1" stopColor={color.light} />
            </linearGradient>
            <linearGradient id={`${id}-secondary`} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#9a80d2" />
              <stop offset="1" stopColor="#c8b4ee" />
            </linearGradient>
          </defs>
          <text x="0" y="12" className="fill-muted-foreground" fontSize="10">
            {unit}
          </text>
          {ticks.map((tick) => {
            const y = bottom - (tick / upper) * (bottom - top);
            return (
              <g key={tick}>
                <line
                  x1={left}
                  x2={right}
                  y1={y}
                  y2={y}
                  className="stroke-border"
                  strokeDasharray={tick === 0 ? undefined : "3 5"}
                  strokeOpacity=".8"
                />
                {hasData && (
                  <text
                    x={left - 9}
                    y={y + 3}
                    textAnchor="end"
                    className="fill-muted-foreground"
                    fontSize="10"
                  >
                    {number(tick)}
                  </text>
                )}
              </g>
            );
          })}
          {!hasData && (
            <text
              x={(left + right) / 2}
              y="108"
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize="12"
            >
              {locale === "vi"
                ? "Chưa có số liệu được ghi"
                : "No records for this period"}
            </text>
          )}
          {rows.map((row, index) => {
            const x = left + slot * (index + 0.5);
            const height =
              row.value == null
                ? 0
                : Math.max(
                    2,
                    (Math.max(0, row.value) / upper) * (bottom - top),
                  );
            const y = bottom - height;
            const selected = row.key === chosen?.key;
            const secondaryHeight =
              row.value && row.secondary
                ? Math.min(height, (row.secondary / row.value) * height)
                : 0;
            const tick =
              index % Math.max(1, Math.ceil(rows.length / 7)) === 0 ||
              index === rows.length - 1;
            return (
              <g
                key={row.key}
                role="button"
                aria-label={`${row.label}: ${row.value == null ? (locale === "vi" ? "chưa ghi" : "not logged") : `${number(row.value)} ${unit}`}${row.current ? (locale === "vi" ? ", chưa kết thúc" : ", ongoing") : ""}`}
                aria-pressed={selected}
                tabIndex={0}
                className="chart-bar-focus cursor-pointer outline-none"
                onClick={() => pick(row.key)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    pick(row.key);
                  }
                }}
              >
                <rect
                  x={x - slot / 2}
                  y={top - 6}
                  width={slot}
                  height={bottom - top + 35}
                  rx="10"
                  fill={selected ? "var(--secondary)" : "transparent"}
                  fillOpacity={selected ? ".65" : "0"}
                  className="chart-bar-hit"
                />
                {row.value == null ? (
                  <line
                    x1={x - 5}
                    x2={x + 5}
                    y1={bottom - 2}
                    y2={bottom - 2}
                    className="stroke-muted-foreground"
                    strokeOpacity=".45"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <>
                    <defs>
                      <clipPath id={`${id}-${index}`}>
                        <rect
                          x={x - barWidth / 2}
                          y={y}
                          width={barWidth}
                          height={height}
                          rx="5"
                        />
                      </clipPath>
                    </defs>
                    <g clipPath={`url(#${id}-${index})`}>
                      <rect
                        x={x - barWidth / 2}
                        y={y}
                        width={barWidth}
                        height={height}
                        fill={`url(#${id}-bar)`}
                        opacity={selected ? 1 : 0.8}
                      />
                      {secondaryHeight > 0 && (
                        <rect
                          x={x - barWidth / 2}
                          y={y}
                          width={barWidth}
                          height={secondaryHeight}
                          fill={`url(#${id}-secondary)`}
                        />
                      )}
                    </g>
                  </>
                )}
                {selected && row.value != null && (
                  <text
                    x={x}
                    y={Math.max(14, y - 8)}
                    textAnchor="middle"
                    fill={color.main}
                    fontSize="11"
                    fontWeight="700"
                  >
                    {number(row.value)}
                  </text>
                )}
                {tick && (
                  <text
                    x={x}
                    y={bottom + 22}
                    textAnchor="middle"
                    className={
                      selected || row.current
                        ? "fill-primary"
                        : "fill-muted-foreground"
                    }
                    fontSize="10"
                    fontWeight={selected || row.current ? "650" : "400"}
                  >
                    {row.label}
                  </text>
                )}
                {row.current && (
                  <circle cx={x} cy={bottom + 31} r="2" fill={color.main} />
                )}
              </g>
            );
          })}
        </svg>
      </div>
      {showSelection && chosen && (
        <div
          aria-live="polite"
          className="mt-3 flex items-start justify-between gap-3 rounded-2xl bg-muted/60 px-4 py-3"
        >
          <div>
            <p className="text-xs font-semibold">{chosen.label}</p>
            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
              {chosen.note ||
                (chosen.current
                  ? locale === "vi"
                    ? "Hôm nay chưa kết thúc"
                    : "Today is ongoing"
                  : locale === "vi"
                    ? "Theo nhật ký đã ghi"
                    : "Based on logged records")}
            </p>
          </div>
          <p className="shrink-0 text-base font-semibold tabular-nums">
            {chosen.value == null ? "—" : number(chosen.value)}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              {unit}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
