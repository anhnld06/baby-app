import { PregnancyComparisonChart } from "@/components/pregnancy-comparison-chart";
import { ULTRASOUND_METRICS, type UltrasoundMetric, type UltrasoundVisit } from "@/features/mother/ultrasound-progress";
import styles from "./pregnancy.module.css";

const groups: { title: string; metric: UltrasoundMetric }[] = [
  { title: "Cân nặng thai ước tính", metric: "estimatedFetalWeightG" },
  { title: "Chu vi đầu · HC", metric: "hcMm" }, { title: "Chu vi bụng · AC", metric: "acMm" },
  { title: "Chiều dài xương đùi · FL", metric: "flMm" }, { title: "Lưỡng đỉnh · BPD", metric: "bpdMm" },
  { title: "Chiều dài đầu mông · CRL", metric: "crlMm" },
  { title: "Tim thai siêu âm", metric: "fetalHeartRate" }, { title: "Chỉ số ối · AFI", metric: "afiMm" },
];
export function UltrasoundDashboard({ visits }: { visits: UltrasoundVisit[] }) {
  if (visits.some((visit) => (visit.fetusCount ?? 1) > 1)) return <div className={`${styles.notice} mb-4`}>Có phiếu ghi đa thai nhưng chưa có số đo riêng từng bé. Mở bảng đối chiếu hoặc phiếu nguồn để xem từng kết quả; không ghép chúng thành một đường phát triển.</div>;
  const available = groups.filter((group) => visits.some((visit) => visit.values[group.metric] != null));
  return <section aria-label="Dashboard thống kê em bé"><div className={styles.sectionHeading}><h3 className="font-semibold">So sánh các chỉ số theo thời gian</h3><span className={styles.muted}>Từ kết quả siêu âm</span></div><div className={styles.analyticsGrid}>{available.map((group, index) => {
    const definition = ULTRASOUND_METRICS.find((item) => item.key === group.metric)!;
    return <PregnancyComparisonChart key={group.metric} title={group.title} chartLabel={`Biểu đồ ${definition.short} của bé`} unit={definition.unit} series={[{ key: group.metric, label: definition.short, color: index % 2 ? "#9c83bd" : "#ca667f", points: visits.map((visit) => ({ key: visit.id, day: visit.day, dateLabel: visit.dateLabel, ageLabel: visit.ageLabel, value: visit.values[group.metric], sourceLabel: "Phiếu siêu âm", sourceHref: `/mother/pregnancy/checkups?edit=${visit.id}` })) }]} />;
  })}</div>{!available.length && <p className={`${styles.panel} ${styles.muted}`}>Các phiếu hiện chưa ghi số đo để vẽ biểu đồ. Mở phiếu nguồn tại Khám & lịch để bổ sung nếu có.</p>}</section>;
}
