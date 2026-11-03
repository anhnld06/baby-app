import Link from "next/link";
import type { PregnancyCheckup } from "@prisma/client";
import { ArrowUpRight, CalendarCheck, HeartPulse, MapPin, MessageSquareText, ScanLine, Stethoscope } from "lucide-react";
import { deletePregnancyCheckupAction } from "@/app/actions";
import { PregnancyCheckupDetail } from "@/components/pregnancy-checkup-detail";
import { RecordActions } from "@/components/record-actions";
import { previousUltrasoundMeasurement, sortUltrasoundVisits, ULTRASOUND_METRICS, type UltrasoundMetric, type UltrasoundVisit } from "@/features/mother/ultrasound-progress";
import styles from "./pregnancy.module.css";

const priorities: UltrasoundMetric[] = ["estimatedFetalWeightG", "hcMm", "acMm", "flMm", "bpdMm", "crlMm"];
const number = (value: number) => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value);
const types = { PRENATAL_VISIT: "Khám thai", ULTRASOUND: "Siêu âm", COMBINED: "Khám & siêu âm" };

export function PregnancyVisitTimeline({ items, visits, timeZone, latestId, orderStart, allowDelete = false, idPrefix = "ultrasound", label = "Hành trình những lần gặp con" }: {
  items: PregnancyCheckup[]; visits: UltrasoundVisit[]; timeZone: string; latestId?: string;
  orderStart: number; allowDelete?: boolean; idPrefix?: string; label?: string;
}) {
  const ordered = sortUltrasoundVisits(visits);
  const multiple = visits.some((visit) => (visit.fetusCount ?? 1) > 1);
  return <ol className={styles.visitTimeline} aria-label={label}>{items.map((item, index) => {
    const scan = item.visitType !== "PRENATAL_VISIT";
    const visitIndex = ordered.findIndex((visit) => visit.id === item.id);
    const visit = ordered[visitIndex];
    const previousVisit = visitIndex > 0 ? ordered[visitIndex - 1] : undefined;
    const daysSince = visit && previousVisit ? Math.round((Date.parse(visit.day) - Date.parse(previousVisit.day)) / 86400000) : null;
    const metrics = scan && visit ? priorities.filter((key) => visit.values[key] != null).slice(0, 4) : [];
    const dateZone = item.checkedAtTimeKnown ? timeZone : "UTC";
    const dateLabel = new Intl.DateTimeFormat("vi-VN", { dateStyle: "long", timeZone: dateZone }).format(item.checkedAt);
    const shortMonth = new Intl.DateTimeFormat("vi-VN", { month: "2-digit", year: "numeric", timeZone: dateZone }).format(item.checkedAt);
    const Icon = item.visitType === "ULTRASOUND" ? ScanLine : item.visitType === "COMBINED" ? HeartPulse : Stethoscope;
    const newest = item.id === latestId;
    const maternal = [item.weightKg != null ? { label: "Cân nặng mẹ", value: `${number(item.weightKg)} kg` } : null, item.bloodPressure ? { label: "Huyết áp", value: `${item.bloodPressure} mmHg` } : null, item.maternalPulse != null ? { label: "Mạch mẹ", value: `${item.maternalPulse} lần/phút` } : null].filter((value) => value != null);
    return <li key={item.id} className={styles.visitStop}>
      <div className={styles.visitRail} aria-hidden="true"><div className={styles.visitDot} data-latest={newest}><Icon size={19} strokeWidth={1.5} /></div><span>{String(Math.max(1, orderStart - index)).padStart(2, "0")}</span></div>
      <article id={`${idPrefix}-${item.id}`} data-visit-type={item.visitType} className={styles.visitCard} data-latest={newest}>
        <div className={styles.visitCardTop}><span className={styles.visitType} data-type={item.visitType}><Icon size={13} />{types[item.visitType]}</span><span className={newest ? styles.latestVisit : styles.visitOrdinal}>{newest ? "Gần nhất" : `Mốc ${String(Math.max(1, orderStart - index)).padStart(2, "0")}`}</span></div>
        <div className={styles.visitTitleRow}><div><h3>{item.gestationalWeek != null ? <><strong>{item.gestationalWeek}</strong> tuần <span>{item.gestationalDay} ngày</span></> : scan ? "Một lần gặp con" : "Lần khám của mẹ"}</h3><p>{dateLabel}{item.checkedAtTimeKnown ? ` · ${new Intl.DateTimeFormat("vi-VN", { timeStyle: "short", timeZone }).format(item.checkedAt)}` : ""}</p></div><span className={styles.visitMonth}>{shortMonth}</span></div>
        {(item.facility || item.doctor) && <p className={styles.visitFacility}><MapPin size={13} className="shrink-0" />{[item.facility, item.doctor ? `BS. ${item.doctor}` : ""].filter(Boolean).join(" · ")}</p>}
        {scan && metrics.length > 0 && <div className={styles.visitMeasurements}>{metrics.map((key) => {
          const definition = ULTRASOUND_METRICS.find((metric) => metric.key === key)!;
          const change = previousUltrasoundMeasurement(ordered, item.id, key);
          return <div key={key} className={styles.visitMeasurement}><span>{definition.short}</span><strong>{number(visit.values[key]!)} <small>{definition.unit}</small></strong>{change ? <><p className={styles.measurementChange}>{change.difference > 0 ? "+" : ""}{number(change.difference)} {definition.unit}</p><p className={styles.measurementSource}>Từ {number(change.previous.values[key]!)} {definition.unit} · {change.previous.dateLabel}</p></> : <p className={styles.measurementSource}>{multiple ? "Số đo ghi trên phiếu" : "Lần đầu ghi trong hồ sơ"}</p>}</div>;
        })}</div>}
        {scan && daysSince != null && <p className={styles.visitInterval}>{daysSince === 0 ? "Có phiếu siêu âm trước đó trong cùng ngày" : `${daysSince} ngày từ phiếu siêu âm trước`} · {previousVisit!.ageLabel}</p>}
        {scan && !metrics.length && <p className={styles.muted}>Phiếu chưa ghi các số đo sinh trắc học.</p>}
        <div className={styles.visitChips}>{item.fetalHeartRate != null && <span><HeartPulse size={12} />Tim thai {number(item.fetalHeartRate)} lần/phút</span>}{item.fetalPresentation && <span>Ngôi thai: {item.fetalPresentation}</span>}{item.amnioticFluid && <span>Ối: {item.amnioticFluid}</span>}{!scan && maternal.map((value) => <span key={value.label}>{value.label}: {value.value}</span>)}</div>
        {item.findings && <div className={styles.visitConclusion}><MessageSquareText size={16} className="shrink-0" /><div><span>Kết luận trên phiếu</span><p>{item.findings}</p></div></div>}
        {item.followupInstruction && <div className={styles.visitFollowup}><CalendarCheck size={14} className="shrink-0" /><p>{item.followupInstruction}</p></div>}
        <div className={styles.visitCardFoot}><span className={styles.muted}>{scan ? "Phiếu siêu âm đã lưu" : "Lần khám đã lưu"}</span>{allowDelete ? <RecordActions id={item.id} editHref={`/mother/pregnancy/checkups?edit=${item.id}`} deleteAction={deletePregnancyCheckupAction} editLabel="Sửa" deleteLabel="Xóa" /> : <Link href={`/mother/pregnancy/checkups?edit=${item.id}`} className={styles.textLink}>Sửa phiếu <ArrowUpRight size={13} /></Link>}</div>
        <PregnancyCheckupDetail item={item} timeZone={timeZone} />
      </article>
    </li>;
  })}</ol>;
}
