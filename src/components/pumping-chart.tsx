"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import type { ChartBucket, PumpingChartMode } from "@/features/pumping/chart";

export function PumpingChart({ rows, mode, anchor, previous, next, today, locale }: {
  rows: ChartBucket[]; mode: PumpingChartMode; anchor: string; previous: string; next: string; today: string; locale: "vi" | "en";
}) {
  const vi = locale === "vi";
  const router = useRouter();
  const params = useSearchParams();
  const [selected, setSelected] = useState<string>();
  const chosen = rows.find((row) => row.key === selected) ?? rows.findLast((row) => row.totalMl != null) ?? rows[0];
  const number = (n: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(n);
  const volume = (n: number | null) => n == null ? "—" : `${number(n)} ml`;
  const total = rows.reduce((sum, row) => sum + (row.totalMl ?? 0), 0);
  const measured = rows.reduce((sum, row) => sum + row.measured, 0);
  const pending = rows.reduce((sum, row) => sum + row.pending, 0);
  const days = mode === "day" ? (measured ? 1 : 0) : rows.reduce((sum, row) => sum + row.recordedDays, 0);
  const max = Math.max(1, ...rows.map((row) => row.totalMl ?? 0));
  function navigate(newMode: PumpingChartMode, date: string) {
    const query = new URLSearchParams(params.toString());
    query.set("chart", newMode);
    query.set("date", date);
    router.replace(`/mother/pumping?${query}`, { scroll: false });
  }
  const periodLabel = mode === "day" ? `${anchor.slice(8)}/${anchor.slice(5, 7)}/${anchor.slice(0, 4)}` : mode === "month" ? `${anchor.slice(5, 7)}/${anchor.slice(0, 4)}` : anchor.slice(0, 4);
  const chosenLabel = chosen ? (mode === "day" ? chosen.label : mode === "month" ? `${chosen.label}/${anchor.slice(5, 7)}` : `${vi ? "Tháng" : "Month"} ${chosen.label}`) : "";
  return <section className="mt-7 overflow-hidden rounded-3xl border border-primary/10 bg-card shadow-sm" aria-labelledby="pumping-chart-title">
    <div className="bg-gradient-to-br from-secondary/65 to-card p-4 sm:p-5">
      <h2 id="pumping-chart-title" className="flex items-center gap-2 text-lg font-semibold"><BarChart3 className="size-5 text-primary" />{vi ? "Lượng sữa theo thời gian" : "Milk over time"}</h2>
      <div className="mt-4 grid grid-cols-3 gap-1 rounded-2xl bg-secondary/60 p-1" role="group" aria-label={vi ? "Chế độ biểu đồ" : "Chart view"}>
        {(["day", "month", "year"] as const).map((value, index) => <button key={value} type="button" aria-pressed={mode === value} onClick={() => navigate(value, anchor)} className={`min-h-11 rounded-xl text-sm font-medium transition-colors ${mode === value ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{(vi ? ["Ngày", "Tháng", "Năm"] : ["Day", "Month", "Year"])[index]}</button>)}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <button type="button" onClick={() => navigate(mode, previous)} aria-label={vi ? "Kỳ trước" : "Previous period"} className="grid size-11 shrink-0 place-items-center rounded-xl hover:bg-secondary"><ChevronLeft className="size-4" /></button>
        <div className="text-center"><p className="text-sm font-semibold">{periodLabel}</p><button type="button" onClick={() => navigate(mode, today)} className="min-h-8 text-xs text-primary underline underline-offset-4">{vi ? "Về hiện tại" : "Current period"}</button></div>
        <button type="button" onClick={() => navigate(mode, next)} aria-label={vi ? "Kỳ sau" : "Next period"} className="grid size-11 shrink-0 place-items-center rounded-xl hover:bg-secondary"><ChevronRight className="size-4" /></button>
      </div>
      <label className="mt-1 flex items-center justify-center gap-2 text-xs text-muted-foreground">{vi ? "Chọn mốc thời gian" : "Choose date"}<input type="date" min="1900-01-01" max="2100-12-31" value={anchor} onChange={(event) => { if (event.target.value) navigate(mode, event.target.value); }} className="min-h-11 min-w-0 rounded-xl border bg-card px-2 text-foreground" /></label>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/50 pt-4">
        <div><p className="text-[11px] text-muted-foreground">{vi ? "Tổng đã ghi" : "Logged volume"}</p><p className="mt-1 text-base font-semibold tabular-nums sm:text-xl">{measured ? volume(total) : "—"}</p></div>
        <div><p className="text-[11px] text-muted-foreground">{vi ? "Trung bình / cữ" : "Average / session"}</p><p className="mt-1 text-base font-semibold tabular-nums sm:text-xl">{measured ? volume(total / measured) : "—"}</p></div>
        <div><p className="text-[11px] text-muted-foreground">{vi ? "Ngày có lượng" : "Days with volume"}</p><p className="mt-1 text-base font-semibold tabular-nums sm:text-xl">{days}</p></div>
      </div>
    </div>
    <div className="p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap gap-3 text-xs text-muted-foreground"><span><span className="mr-1 inline-block size-2 rounded-full bg-primary" />{vi ? "Trái" : "Left"}</span><span><span className="mr-1 inline-block size-2 rounded-full bg-violet-400" />{vi ? "Phải" : "Right"}</span><span>{vi ? "Đơn vị: ml · nhấn cột để xem" : "Unit: ml · select a bar"}</span></div>
      {rows.length ? <div className="overflow-x-auto pb-2" role="group" aria-label={vi ? "Biểu đồ cột lượng sữa" : "Milk volume bar chart"}>
        <div className="flex h-52 items-end gap-1 border-b border-border" style={{ minWidth: `${Math.max(260, rows.length * 44)}px` }}>
          {rows.map((row) => <button key={row.key} type="button" aria-pressed={row.key === chosen?.key} aria-label={`${row.label}: ${row.totalMl == null ? (vi ? "chưa có lượng" : "no volume") : volume(row.totalMl)}${row.partial ? (vi ? ", đang ghi" : ", ongoing") : ""}`} onClick={() => setSelected(row.key)} className={`flex h-full min-w-11 flex-1 flex-col items-center justify-end rounded-t-xl px-1 pt-2 transition-colors ${row.key === chosen?.key ? "bg-secondary/70" : "hover:bg-secondary/35"}`}>
            <span className="mb-1 text-[10px] text-muted-foreground">{row.totalMl === 0 ? "0" : row.totalMl == null ? "—" : row.partial ? "•" : ""}</span>
            <span className="flex w-full max-w-7 flex-col justify-end overflow-hidden rounded-t-lg" style={{ height: row.totalMl == null ? 3 : row.totalMl === 0 ? 3 : `${Math.max(5, row.totalMl / max * 150)}px`, background: row.totalMl == null ? "var(--border)" : undefined }}>
              {row.totalMl != null && <><span className="bg-violet-400" style={{ flex: row.totalMl ? row.rightMl / row.totalMl : 0 }} /><span className="bg-primary" style={{ flex: row.totalMl ? row.leftMl / row.totalMl : 1 }} /></>}
            </span>
            <span className={`py-2 text-[10px] tabular-nums ${row.partial ? "font-bold text-primary" : "text-muted-foreground"}`}>{row.label}</span>
          </button>)}
        </div>
      </div> : <p className="rounded-2xl bg-muted/50 p-6 text-center text-sm text-muted-foreground">{vi ? "Chưa có cữ hút trong ngày này." : "No pumping sessions on this day."}</p>}
      {chosen && <div aria-live="polite" className="mt-4 rounded-2xl bg-secondary/35 p-4 text-sm">
        <p className="flex flex-wrap items-center justify-between gap-2 font-semibold"><span>{chosenLabel}</span><span>{volume(chosen.totalMl)}</span></p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{chosen.count} {vi ? "cữ" : "sessions"} · {vi ? "Trung bình" : "Average"} {chosen.measured ? volume((chosen.totalMl ?? 0) / chosen.measured) : "—"}{mode === "year" ? ` · ${chosen.recordedDays} ${vi ? "ngày có lượng" : "days with volumes"}` : ""}</p>
        {chosen.totalMl != null && <p className="mt-1 text-xs text-muted-foreground">{vi ? "Trái" : "Left"}: {volume(chosen.leftMl)} · {vi ? "Phải" : "Right"}: {volume(chosen.rightMl)}</p>}
        {chosen.partial && <p className="mt-2 text-xs text-primary">{vi ? "Khoảng hiện tại chưa kết thúc." : "This period is still ongoing."}</p>}
        {chosen.pending > 0 && <p className="mt-2 text-xs text-muted-foreground">{chosen.pending} {vi ? "cữ chờ nhập ml, chưa cộng vào lượng." : "sessions await volumes and are excluded from volume totals."}</p>}
      </div>}
      <p className="mt-3 text-xs leading-5 text-muted-foreground">{vi ? "— là chưa có lượng được ghi, khác với 0 ml. Biểu đồ chỉ tính cữ đã kết thúc; tổng tháng/năm phụ thuộc số ngày đã ghi. Cuộn ngang để xem thêm cột." : "— means no volume logged, distinct from zero. Only finished sessions are included; monthly/yearly totals depend on days logged. Scroll horizontally for more bars."}</p>
      {pending > 0 && <p className="mt-2 text-xs text-muted-foreground">{pending} {vi ? "cữ trong kỳ chưa nhập lượng sữa." : "sessions in this period have no milk volume."}</p>}
    </div>
  </section>;
}
