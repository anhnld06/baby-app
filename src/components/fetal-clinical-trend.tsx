import Link from "next/link";
import { PregnancyComparisonChart } from "@/components/pregnancy-comparison-chart";
import styles from "./pregnancy.module.css";

export function FetalClinicalTrend({ readings, multiple = false }: { readings: { id: string; value: number; day: string; dateLabel: string; ageLabel: string }[]; multiple?: boolean }) {
  if (!readings.length) return null;
  return <section className="mt-5" aria-label="Tim thai từ khám lâm sàng">{multiple ? <div className={styles.notice}>Tim thai khi khám chưa tách theo từng bé. <Link href="/mother/pregnancy/checkups" className="underline">Xem phiếu nguồn</Link></div> : <PregnancyComparisonChart title="Tim thai khi khám" unit="lần/phút" chartLabel="Diễn biến tim thai khi khám" series={[{ key: "clinical-fhr", label: "Tim thai khi khám", color: "#9c83bd", points: readings.map((row) => ({ ...row, key: row.id, sourceLabel: "Phiếu khám", sourceHref: `/mother/pregnancy/checkups?edit=${row.id}` })) }]} />}</section>;
}
