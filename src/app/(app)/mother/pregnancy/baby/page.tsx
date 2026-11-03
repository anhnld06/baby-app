import Link from "next/link";
import { Footprints, ChevronRight, ScanLine, ChartNoAxesCombined } from "lucide-react";
import { FetalClinicalTrend } from "@/components/fetal-clinical-trend";
import { toDateTimeLocal } from "@/lib/date";
import { UltrasoundProgress } from "@/components/ultrasound-progress";
import { PregnancyEmpty } from "@/components/pregnancy-section";
import { UltrasoundDashboard } from "@/components/ultrasound-dashboard";
import { getPregnancyContext } from "@/features/mother/pregnancy-data";
import { sortUltrasoundVisits } from "@/features/mother/ultrasound-progress";
import { ultrasoundVisitFromRecord } from "@/features/mother/ultrasound-record";
import { db } from "@/lib/db";
import styles from "@/components/pregnancy.module.css";

export default async function PregnancyBabyPage() {
  const { pregnancy, user } = await getPregnancyContext();
  if (!pregnancy) return <PregnancyEmpty />;
  const [ultrasounds, clinical] = await Promise.all([
    db.pregnancyCheckup.findMany({ where: { pregnancyId: pregnancy.id, visitType: { in: ["ULTRASOUND", "COMBINED"] } }, orderBy: [{ checkedAt: "asc" }, { id: "asc" }] }),
    db.pregnancyCheckup.findMany({ where: { pregnancyId: pregnancy.id, OR: [{ clinicalFetalHeartRate: { not: null } }, { visitType: "PRENATAL_VISIT", fetalHeartRate: { not: null } }] }, select: { id: true, checkedAt: true, checkedAtTimeKnown: true, clinicalFetalHeartRate: true, fetalHeartRate: true, fetusCount: true, gestationalWeek: true, gestationalDay: true }, orderBy: [{ checkedAt: "asc" }, { id: "asc" }] }),
  ]);
  const clinicalReadings = clinical.map((item) => {
    const day = item.checkedAtTimeKnown ? toDateTimeLocal(item.checkedAt, user.timezone).slice(0, 10) : item.checkedAt.toISOString().slice(0, 10);
    return { id: item.id, value: item.clinicalFetalHeartRate ?? item.fetalHeartRate!, day, dateLabel: new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`)), ageLabel: item.gestationalWeek != null ? `${item.gestationalWeek} tuần ${item.gestationalDay} ngày` : "Chưa ghi tuổi thai" };
  }).sort((a, b) => a.day.localeCompare(b.day));
  const visits = sortUltrasoundVisits(ultrasounds.map((item) => ultrasoundVisitFromRecord(item, user.timezone)));
  const latest = visits.at(-1);
  return <>
    <div className={styles.intro}><span className={styles.eyebrow}>Từ những lần gặp con</span><h2 className={styles.heading}>Em bé trong bụng mẹ</h2><p className={styles.muted}>Nhìn lại sự thay đổi qua từng phiếu siêu âm của chính bé.</p></div>
    {visits.length ? <>
      <section className={styles.scanOverview}><div><span className={styles.eyebrow}>Hành trình siêu âm</span><strong>{visits.length} <span>lần đã ghi</span></strong><p className={styles.muted}>Từ {visits[0].dateLabel} đến {latest!.dateLabel}</p></div><div><span className={styles.eyebrow}>Lần gần nhất</span><strong className="text-lg">{latest!.ageLabel}</strong><p className={styles.muted}>{latest!.dateLabel}{latest!.facility ? ` · ${latest!.facility}` : ""}</p></div></section>
      <UltrasoundDashboard visits={visits} />
      <details className={styles.detailedProgress}><summary><ChartNoAxesCombined size={18} /><span>Bảng đối chiếu số đo</span><ChevronRight size={16} /></summary><div className="mt-4"><UltrasoundProgress visits={visits} /></div></details>
      <Link href="/mother/pregnancy/checkups" className={styles.textLink}>Mở phiếu khám & siêu âm gốc <ChevronRight size={14} /></Link>

    </> : <section className={styles.panel}><ScanLine className="mb-4 text-rose-300" size={32} strokeWidth={1.3} /><h3 className="font-semibold">Bắt đầu từ phiếu siêu âm đầu tiên</h3><p className={`${styles.muted} mt-2`}>Lưu ngày khám, tuổi thai và các chỉ số có trên phiếu. Khi có thêm lần siêu âm, biểu đồ và bảng đối chiếu sẽ nối tiếp hành trình của bé.</p><Link href="/mother/pregnancy/checkups" className={`${styles.button} mt-4`}>Thêm phiếu siêu âm</Link></section>}
    <FetalClinicalTrend readings={clinicalReadings} multiple={ultrasounds.some((item) => (item.fetusCount ?? 1) > 1) || clinical.some((item) => (item.fetusCount ?? 1) > 1)} />
    <Link href="/mother/pregnancy/baby/kicks" className={`${styles.panel} mt-5 flex items-center gap-3`}><span className={styles.toolIcon}><Footprints size={22} /></span><span className="flex-1"><strong className="text-sm">Từng cử động của con</strong><span className={`block ${styles.muted}`}>Nhật ký cử động giữa các lần khám</span></span><ChevronRight size={16} /></Link>
  </>;
}
