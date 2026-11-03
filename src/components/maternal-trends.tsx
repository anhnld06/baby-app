"use client";

import Link from "next/link";
import { useState } from "react";
import { Activity, HeartPulse, Scale } from "lucide-react";
import { PregnancyRecordDelete } from "@/components/pregnancy-record-delete";
import { PregnancyComparisonChart } from "@/components/pregnancy-comparison-chart";
import { maternalMetricSummary, type MaternalMetric, type MaternalObservation } from "@/features/mother/maternal-observations";
import styles from "./pregnancy.module.css";

const number = (value: number) => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value);
export function MaternalTrends({ observations, prePregnancyWeightKg }: { observations: MaternalObservation[]; prePregnancyWeightKg?: number | null }) {
  const [source, setSource] = useState<"ALL" | "CHECKUP" | "HOME">("ALL");
  const filtered = source === "ALL" ? observations : observations.filter((row) => row.source === source);
  const points = (metric: MaternalMetric) => filtered.map((row) => ({ key: row.id, day: row.day, dateLabel: row.dateLabel, value: row.values[metric], sourceLabel: row.sourceLabel, sourceHref: row.editHref, ageLabel: row.ageLabel }));
  const cards = [{ key: "weightKg" as const, icon: Scale, label: "Cân nặng mẹ", unit: "kg" }, { key: "systolic" as const, icon: HeartPulse, label: "Huyết áp", unit: "mmHg" }, { key: "pulse" as const, icon: Activity, label: "Mạch mẹ", unit: "lần/phút" }];
  const weight = maternalMetricSummary(filtered, "weightKg");
  return <section aria-label="Thống kê sức khỏe mẹ từ kết quả khám">
    <p className={`${styles.muted} mb-4`}>Tự tổng hợp từ kết quả khám và số đo bổ sung. Chọn điểm trên biểu đồ để đối chiếu phiếu nguồn.</p>
    <div className={styles.topicTabs} aria-label="Nguồn số đo">{[{ key: "ALL", label: "Tất cả nguồn" }, { key: "CHECKUP", label: "Phiếu khám" }, { key: "HOME", label: "Đo thêm ở nhà" }].map((item) => <button key={item.key} aria-pressed={source === item.key} onClick={() => setSource(item.key as typeof source)}>{item.label}</button>)}</div>
    <div className={styles.maternalCards}>{cards.map((card) => {
      const result = maternalMetricSummary(filtered, card.key), row = result?.latest;
      return <button key={card.key} className={styles.maternalCard} aria-controls={`maternal-${card.key}`} onClick={() => document.getElementById(`maternal-${card.key}`)?.scrollIntoView({ block: "start", behavior: "instant" })}><card.icon size={18} strokeWidth={1.5} /><span>{card.label}</span><strong>{row ? card.key === "systolic" ? `${number(row.value)}/${number(row.values.diastolic!)}` : number(row.value) : "—"}<small>{card.unit}</small></strong>{row ? <><p>{row.dateLabel} · {row.sourceLabel}</p>{result.difference != null && <p className={styles.maternalDifference}>{result.difference > 0 ? "+" : ""}{number(result.difference)} {card.unit}{card.key === "systolic" ? " tâm thu" : ""} so với ngày đo trước</p>}</> : <p>Chưa có số đo được ghi</p>}</button>;
    })}</div>
    {weight && prePregnancyWeightKg != null && <p className={`${styles.muted} mb-4`}>Cân nặng gần nhất thay đổi {weight.latest.value - prePregnancyWeightKg > 0 ? "+" : ""}{number(weight.latest.value - prePregnancyWeightKg)} kg so với trước mang thai đã lưu.</p>}
    <div className={styles.analyticsGrid}>
      <PregnancyComparisonChart id="maternal-weightKg" title="Cân nặng mẹ" unit="kg" chartLabel="Diễn biến cân nặng mẹ" series={[{ key: "weightKg", label: "Cân nặng", color: "#c66b84", points: points("weightKg") }]} />
      <PregnancyComparisonChart id="maternal-systolic" title="Huyết áp mẹ" unit="mmHg" chartLabel="So sánh huyết áp tâm thu và tâm trương" series={[{ key: "systolic", label: "Tâm thu", color: "#c66b84", points: points("systolic") }, { key: "diastolic", label: "Tâm trương", color: "#4a9d9b", points: points("diastolic") }]} />
      <PregnancyComparisonChart id="maternal-pulse" title="Mạch mẹ" unit="lần/phút" chartLabel="Diễn biến mạch mẹ" series={[{ key: "pulse", label: "Mạch", color: "#9780b7", points: points("pulse") }]} />
      {filtered.some((row) => row.values.bellyCm != null) && <PregnancyComparisonChart title="Vòng bụng mẹ" unit="cm" chartLabel="Diễn biến vòng bụng mẹ" series={[{ key: "bellyCm", label: "Vòng bụng", color: "#a38a60", points: points("bellyCm") }]} />}
    </div>
    <div className={styles.analyticsFooter}><p>Số đo thiếu được giữ trống. So sánh từ ngày đầu đến ngày gần nhất có ghi từng chỉ số, không tự xếp loại sức khỏe.</p><Link href="/mother/pregnancy/health/measurements" className={styles.textLink}>Bảng dữ liệu & nguồn →</Link></div>
  </section>;
}

export function MaternalObservationTable({ observations }: { observations: MaternalObservation[] }) {
  const [limit, setLimit] = useState(15);
  const history = observations.filter((row) => Object.values(row.values).some((value) => value != null) || row.bloodPressure).slice().reverse();
  return <section className={styles.panel} aria-label="Bảng nguồn số đo mẹ"><h3 className="mb-3 font-semibold">Đối chiếu số liệu theo nguồn</h3><div className={styles.scanTableScroll} tabIndex={0} role="region" aria-label="Bảng số đo mẹ có thể cuộn ngang"><table className={styles.scanTable}><thead><tr><th>Ngày / nguồn</th><th>Cân nặng<br />kg</th><th>Huyết áp<br />mmHg</th><th>Mạch mẹ<br />lần/phút</th><th>Vòng bụng<br />cm</th><th>Phiếu nguồn</th></tr></thead><tbody>{history.slice(0, limit).map((row) => <tr key={row.id}><th scope="row">{row.dateLabel}<span className="block text-[10px] font-normal text-muted-foreground">{row.sourceLabel}</span></th><td>{row.values.weightKg == null ? "—" : number(row.values.weightKg)}</td><td>{row.bloodPressure || "—"}</td><td>{row.values.pulse == null ? "—" : number(row.values.pulse)}</td><td>{row.values.bellyCm == null ? "—" : number(row.values.bellyCm)}</td><td><div className="flex items-center justify-end gap-2"><Link className={styles.textLink} href={row.editHref}>Xem nguồn</Link>{row.source === "HOME" && <PregnancyRecordDelete id={row.id.slice(5)} recordType="measurement" />}</div></td></tr>)}</tbody></table></div>{!history.length && <p className={styles.muted}>Chưa có số đo trong hồ sơ.</p>}{history.length > limit && <button className={styles.textLink} onClick={() => setLimit((value) => value + 15)}>Xem thêm dữ liệu</button>}</section>;
}
