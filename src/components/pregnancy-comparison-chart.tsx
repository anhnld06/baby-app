"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { comparisonGeometry, comparisonStats, type ComparisonSeries } from "@/features/mother/comparison-chart";
import styles from "./pregnancy.module.css";

const number = (value: number) => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value);
export function PregnancyComparisonChart({ title, unit, series, chartLabel, id }: { title: string; unit: string; series: ComparisonSeries[]; chartLabel: string; id?: string }) {
  const [selectedKey, setSelectedKey] = useState<string>();
  const geometry = comparisonGeometry(series);
  const stats = series.map((item) => ({ ...comparisonStats(item.points), label: item.label }));
  const latest = stats.find((item) => item.latest)?.latest;
  const selected = geometry.series.flatMap((item) => item.measured).find((point) => point.key === selectedKey) ?? latest;
  const selectedValues = series.flatMap((item) => { const point = item.points.find((value) => value.key === selected?.key && value.value != null); return point ? [{ label: item.label, value: point.value! }] : []; });
  const labelDate = (time: number) => new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", timeZone: "UTC" }).format(time);
  return <section id={id} className={styles.analyticsCard} aria-label={`Thống kê ${title.toLowerCase()}`}>
    <div className={styles.analyticsCardHead}><div><h3>{title}</h3><p>{stats[0]?.count ?? 0} ghi nhận có số đo</p></div><span>{unit}</span></div>
    {latest ? <>
      <div className={styles.analyticsValue}>{stats.flatMap((item) => item.latest ? [number(item.latest.value!)] : []).join(" / ")}<small>{unit}</small></div>
      <div className={styles.analyticsLegend}>{series.map((item) => <span key={item.key}><i style={{ background: item.color }} />{item.label}</span>)}</div>
      <svg viewBox="0 0 360 205" className={styles.analyticsSvg} role="group" aria-label={chartLabel}>
        {[0, 1, 2, 3].map((tick) => { const y = 166 - tick / 3 * 128; return <g key={tick}><line x1="46" x2="326" y1={y} y2={y} className="stroke-border" strokeDasharray="4 5" /><text x="38" y={y + 4} textAnchor="end" className="fill-muted-foreground" fontSize="10">{number(geometry.low + (geometry.high - geometry.low) * tick / 3)}</text></g>; })}
        {geometry.series.map((item) => <g key={item.key}><path d={item.path} fill="none" stroke={item.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />{item.measured.map((point) => <g key={point.key} role="button" tabIndex={0} aria-label={`${point.dateLabel} · ${point.sourceLabel} · ${item.label}: ${number(point.value!)} ${unit}`} aria-pressed={selected?.key === point.key} className="chart-growth-point cursor-pointer outline-none" onClick={() => setSelectedKey(point.key)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedKey(point.key); } }}><circle className="chart-point-hit" cx={point.x} cy={point.y} r="19" fill="transparent" />{selected?.key === point.key && <circle cx={point.x} cy={point.y} r="10" fill={item.color} opacity=".13" />}<circle cx={point.x} cy={point.y} r={selected?.key === point.key ? 5 : 3.5} fill="var(--card)" stroke={item.color} strokeWidth="2" /></g>)}</g>)}
        <text x="46" y="193" className="fill-muted-foreground" fontSize="10">{labelDate(geometry.firstDay)}</text>{geometry.lastDay !== geometry.firstDay && <text x="326" y="193" textAnchor="end" className="fill-muted-foreground" fontSize="10">{labelDate(geometry.lastDay)}</text>}
      </svg>
      <div className={styles.analyticsChange}>{stats.map((item) => <p key={item.label}><strong>{series.length > 1 ? `${item.label}: ` : ""}{item.difference == null ? "Chưa đủ hai ngày đo để so sánh" : `${item.difference > 0 ? "+" : ""}${number(item.difference)} ${unit}`}</strong>{item.first && item.latest && item.difference != null && <span>{number(item.first.value!)} → {number(item.latest.value!)} {unit} · {item.first.dateLabel} – {item.latest.dateLabel}</span>}</p>)}</div>
      {selected && <div className={styles.analyticsSelection} aria-live="polite"><div><strong>{selectedValues.map((item) => `${item.label} ${number(item.value)} ${unit}`).join(" · ")}</strong><span>{selected.dateLabel}{selected.ageLabel ? ` · ${selected.ageLabel}` : ""} · {selected.sourceLabel}</span></div><Link href={selected.sourceHref} aria-label={`Mở nguồn ${title.toLowerCase()} ngày ${selected.dateLabel}`}><ArrowUpRight size={17} /></Link></div>}
    </> : <div className={styles.analyticsEmpty}>Chưa có chỉ số này trên các phiếu đã lưu.</div>}
  </section>;
}
