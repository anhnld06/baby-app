import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, BookHeart } from "lucide-react";
import { MaternalTrends } from "@/components/maternal-trends";
import { MaternalClinicalNotes } from "@/components/maternal-clinical-notes";
import { PregnancyEmpty } from "@/components/pregnancy-section";
import { getPregnancyContext } from "@/features/mother/pregnancy-data";
import { getMaternalData } from "@/features/mother/maternal-data";
import styles from "@/components/pregnancy.module.css";

export default async function HealthPage({ searchParams }: { searchParams: Promise<{ edit?: string; page?: string; new?: string; saved?: string }> }) {
  const params = await searchParams;
  if (params.edit || params.new || params.saved) {
    const query = new URLSearchParams(Object.entries(params).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
    redirect(`/mother/pregnancy/health/journal?${query}`);
  }
  const { pregnancy, mother, user } = await getPregnancyContext();
  if (!pregnancy) return <PregnancyEmpty />;
  const { observations } = await getMaternalData(pregnancy.id, user.timezone);
  return <>
    <div className={styles.intro}><span className={styles.eyebrow}>Theo dõi bằng số liệu</span><h2 className={styles.heading}>Sức khỏe mẹ</h2><p className={styles.muted}>So sánh cân nặng, huyết áp và mạch mẹ qua các lần đo.</p></div>
    <MaternalTrends observations={observations} prePregnancyWeightKg={mother?.prePregnancyWeightKg} />
    <details className={styles.detailedProgress}><summary>Ghi nhận & dặn dò của bác sĩ</summary><div className="mt-4"><MaternalClinicalNotes observations={observations} /></div></details>
    <div className="mt-5 grid grid-cols-2 gap-3"><Link href="/mother/pregnancy/health/journal" className={styles.panel}><BookHeart size={22} className="mb-3 text-rose-400" /><strong className="text-sm">Nhật ký cảm nhận</strong><p className={styles.muted}>Ghi chú riêng của mẹ</p></Link><Link href="/mother/pregnancy/health/contractions" className={styles.panel}><Activity size={22} className="mb-3 text-rose-400" /><strong className="text-sm">Theo dõi cơn co</strong><p className={styles.muted}>Bấm giờ khi cần</p></Link></div>
  </>;
}
