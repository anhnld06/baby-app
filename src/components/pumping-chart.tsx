"use client";

import { MetricBarChart } from "@/components/metric-bar-chart";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StatisticsIcon as BarChart3 } from "@/components/app-icons";
import type { ChartBucket, PumpingChartMode } from "@/features/pumping/chart";
import { formatNumber } from "@/lib/format";

export function PumpingChart({
  rows,
  mode,
  anchor,
  previous,
  next,
  today,
}: {
  rows: ChartBucket[];
  mode: PumpingChartMode;
  anchor: string;
  previous: string;
  next: string;
  today: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [selected, setSelected] = useState<string>();
  const chosen =
    rows.find((row) => row.key === selected) ??
    rows.findLast((row) => row.totalMl != null) ??
    rows[0];
  const volume = (n: number | null) => (n == null ? "—" : `${formatNumber(n, 1)} ml`);
  const total = rows.reduce((sum, row) => sum + (row.totalMl ?? 0), 0);
  const measured = rows.reduce((sum, row) => sum + row.measured, 0);
  const pending = rows.reduce((sum, row) => sum + row.pending, 0);
  const days =
    mode === "day"
      ? measured
        ? 1
        : 0
      : rows.reduce((sum, row) => sum + row.recordedDays, 0);
  function navigate(newMode: PumpingChartMode, date: string) {
    const query = new URLSearchParams(params.toString());
    query.set("chart", newMode);
    query.set("date", date);
    router.replace(`${pathname}?${query}`, { scroll: false });
  }
  const periodLabel =
    mode === "day"
      ? `${anchor.slice(8)}/${anchor.slice(5, 7)}/${anchor.slice(0, 4)}`
      : mode === "month"
        ? `${anchor.slice(5, 7)}/${anchor.slice(0, 4)}`
        : anchor.slice(0, 4);
  const bucketLabel = (row: ChartBucket) =>
    mode === "day"
      ? row.label
      : mode === "month"
        ? `${row.label}/${anchor.slice(5, 7)}`
        : `Tháng ${row.label}`;
  const chosenLabel = chosen ? bucketLabel(chosen) : "";
  return (
    <section
      className="mt-7 overflow-hidden rounded-3xl border border-primary/10 bg-card shadow-sm"
      aria-labelledby="pumping-chart-title"
    >
      <div className="bg-linear-to-br from-secondary/30 to-card p-4 sm:p-5">
        <h2
          id="pumping-chart-title"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <BarChart3 className="size-5 text-primary" />
          Lượng sữa theo thời gian
        </h2>
        <div
          className="mt-4 grid grid-cols-3 gap-1 rounded-2xl bg-secondary/60 p-1"
          role="group"
          aria-label="Chế độ biểu đồ"
        >
          {(["day", "month", "year"] as const).map((value, index) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => navigate(value, anchor)}
              className={`min-h-11 rounded-xl text-sm font-medium transition-colors ${mode === value ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {
                ["Ngày", "Tháng", "Năm"][
                  index
                ]
              }
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate(mode, previous)}
            aria-label="Kỳ trước"
            className="grid size-11 shrink-0 place-items-center rounded-xl hover:bg-secondary"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold">{periodLabel}</p>
            <button
              type="button"
              onClick={() => navigate(mode, today)}
              className="min-h-8 text-xs text-primary underline underline-offset-4"
            >
              Về hiện tại
            </button>
          </div>
          <button
            type="button"
            onClick={() => navigate(mode, next)}
            aria-label="Kỳ sau"
            className="grid size-11 shrink-0 place-items-center rounded-xl hover:bg-secondary"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <label className="mt-1 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          Chọn mốc thời gian
          <input
            type="date"
            min="1900-01-01"
            max="2100-12-31"
            value={anchor}
            onChange={(event) => {
              if (event.target.value) navigate(mode, event.target.value);
            }}
            className="min-h-11 min-w-0 rounded-xl border bg-card px-2 text-foreground"
          />
        </label>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/50 pt-4">
          <div>
            <p className="text-xs text-muted-foreground">
              Tổng đã ghi
            </p>
            <p className="mt-1 text-base font-semibold tabular-nums sm:text-xl">
              {measured ? volume(total) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Trung bình / cữ
            </p>
            <p className="mt-1 text-base font-semibold tabular-nums sm:text-xl">
              {measured ? volume(total / measured) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Ngày có lượng
            </p>
            <p className="mt-1 text-base font-semibold tabular-nums sm:text-xl">
              {days}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>
            <span className="mr-1 inline-block size-2 rounded-full bg-primary" />
            Trái
          </span>
          <span>
            <span className="mr-1 inline-block size-2 rounded-full bg-violet-400" />
            Phải
          </span>
          <span>
            Đơn vị: ml · nhấn cột để xem
          </span>
        </div>
        {rows.length ? (
          <MetricBarChart
            label="Biểu đồ cột lượng sữa"
            rows={rows.map((row) => ({
              key: row.key,
              label: row.label,
              value: row.totalMl,
              secondary: row.rightMl,
              current: row.partial,
            }))}
            unit="ml"
            selectedKey={chosen?.key}
            onSelect={setSelected}
            showSelection={false}
          />
        ) : (
          <p className="rounded-2xl bg-muted/50 p-6 text-center text-sm text-muted-foreground">
            Chưa có cữ hút trong ngày này.
          </p>
        )}
        {chosen && (
          <div
            aria-live="polite"
            className="mt-4 rounded-2xl bg-secondary/35 p-4 text-sm"
          >
            <p className="flex flex-wrap items-center justify-between gap-2 font-semibold">
              <span>{chosenLabel}</span>
              <span>{volume(chosen.totalMl)}</span>
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {chosen.count} {"cữ"} ·{" "}
              {"Trung bình"}{" "}
              {chosen.measured
                ? volume((chosen.totalMl ?? 0) / chosen.measured)
                : "—"}
              {mode === "year"
                ? ` · ${chosen.recordedDays} ngày có lượng`
                : ""}
            </p>
            {chosen.totalMl != null && (
              <p className="mt-1 text-xs text-muted-foreground">
                {"Trái"}: {volume(chosen.leftMl)} ·{" "}
                {"Phải"}: {volume(chosen.rightMl)}
              </p>
            )}
            {chosen.partial && (
              <p className="mt-2 text-xs text-primary">
                Khoảng hiện tại chưa kết thúc.
              </p>
            )}
            {chosen.pending > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                {chosen.pending}{" "}
                cữ chờ nhập ml, chưa cộng vào lượng.
              </p>
            )}
          </div>
        )}
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          — là chưa có lượng được ghi, khác với 0 ml. Biểu đồ chỉ tính cữ đã kết thúc; tổng tháng/năm phụ thuộc số ngày đã ghi. Cuộn ngang để xem thêm cột.
        </p>
        {rows.length > 0 && (
          <details className="mt-3">
            <summary className="flex min-h-11 cursor-pointer items-center text-sm text-primary">
              Xem bảng số liệu
            </summary>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  Lượng sữa theo từng khoảng thời gian, đơn vị ml
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className="py-2 font-medium">Thời gian</th>
                    <th scope="col" className="text-right font-medium">Tổng</th>
                    <th scope="col" className="text-right font-medium">Trái</th>
                    <th scope="col" className="text-right font-medium">Phải</th>
                    <th scope="col" className="text-right font-medium">Số cữ</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.key} className="border-t">
                      <td className="py-2">{bucketLabel(row)}</td>
                      <td className="text-right tabular-nums">{volume(row.totalMl)}</td>
                      <td className="text-right tabular-nums">{row.totalMl == null ? "—" : volume(row.leftMl)}</td>
                      <td className="text-right tabular-nums">{row.totalMl == null ? "—" : volume(row.rightMl)}</td>
                      <td className="text-right tabular-nums">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )}
        {pending > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {pending}{" "}
            cữ trong kỳ chưa nhập lượng sữa.
          </p>
        )}
      </div>
    </section>
  );
}
