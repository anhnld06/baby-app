import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PregnancyEmpty } from "@/components/pregnancy-section";
import { PregnancyMeasurements } from "@/components/pregnancy-measurements";
import { getPregnancyContext } from "@/features/mother/pregnancy-data";
import { getMaternalData } from "@/features/mother/maternal-data";
import { toDateTimeLocal } from "@/lib/date";
import styles from "@/components/pregnancy.module.css";

export default async function MeasurementsPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { pregnancy, mother, user } = await getPregnancyContext();
  if (!pregnancy) return <PregnancyEmpty />;
  const params = await searchParams;
  const { observations, measurements } = await getMaternalData(pregnancy.id, user.timezone);
  return <><Link href="/mother/pregnancy/health" className={styles.textLink}><ChevronLeft size={14} />Sức khỏe mẹ</Link><div className={styles.intro}><span className={styles.eyebrow}>Một nguồn kết quả, theo dõi xuyên suốt</span><h2 className={styles.heading}>Nguồn số đo của mẹ</h2><p className={styles.muted}>Tự tổng hợp cân nặng, huyết áp và mạch mẹ từ phiếu khám; số đo tại nhà được giữ riêng theo nguồn.</p></div><PregnancyMeasurements pregnancyId={pregnancy.id} today={toDateTimeLocal(new Date(), user.timezone).slice(0, 10)} prePregnancyWeightKg={mother?.prePregnancyWeightKg} initialDate={params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date) ? params.date : undefined} observations={observations} measurements={measurements.map((row) => ({ id: row.id, day: row.measuredOn.toISOString().slice(0, 10), weightKg: row.weightKg, bellyCm: row.bellyCm, notes: row.notes }))} /></>;
}
