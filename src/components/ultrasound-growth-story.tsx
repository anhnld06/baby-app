import { ArrowRight, Ruler, Scale, Sprout } from "lucide-react";
import { ULTRASOUND_METRICS, ultrasoundMeasurementSpan, type UltrasoundMetric, type UltrasoundVisit } from "@/features/mother/ultrasound-progress";
import styles from "./pregnancy.module.css";

const priorities: UltrasoundMetric[] = ["estimatedFetalWeightG", "hcMm", "flMm", "acMm", "bpdMm", "crlMm"];
const number = (value: number) => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value);
export function UltrasoundGrowthStory({ visits }: { visits: UltrasoundVisit[] }) {
  const stories = priorities.flatMap((key) => {
    const span = ultrasoundMeasurementSpan(visits, key);
    return span ? [{ ...span, definition: ULTRASOUND_METRICS.find((item) => item.key === key)! }] : [];
  }).slice(0, 3);
  if (!stories.length) return null;
  return <section className={styles.growthStory} aria-label="Những thay đổi của con"><div className={styles.growthStoryHeading}><span className={styles.storyEmblem}><Sprout size={25} strokeWidth={1.4} /></span><div><span className={styles.eyebrow}>Từng lần gặp, thêm một dấu mốc</span><h3>Con đã thay đổi thế nào?</h3><p>Cùng nhìn từ lần đầu đến lần gần nhất có ghi từng chỉ số.</p></div></div><div className={styles.growthStoryGrid} role="group" tabIndex={0} aria-label="Các chỉ số thay đổi, có thể cuộn ngang">{stories.map(({ definition, first, last, difference, count }) => {
    const Icon = definition.key === "estimatedFetalWeightG" ? Scale : Ruler;
    return <article key={definition.key} className={styles.growthStoryCard}><div className={styles.storyMetricLabel}><Icon size={15} /><span>{definition.label}</span></div><div className={styles.storyValues}><span>{number(first.values[definition.key]!)}<small>{definition.unit}</small></span><ArrowRight size={17} strokeWidth={1.5} /><strong>{number(last.values[definition.key]!)}<small>{definition.unit}</small></strong></div><p className={styles.storyDifference}>{difference > 0 ? "+" : ""}{number(difference)} {definition.unit}<span> · qua {count} phiếu có số đo</span></p><div className={styles.storyDates}><div><strong>{first.ageLabel}</strong><span>{first.dateLabel}</span></div><div><strong>{last.ageLabel}</strong><span>{last.dateLabel}</span></div></div></article>;
  })}</div><p className={styles.storyFootnote}>Các mốc lấy đúng từ phiếu đã lưu; mỗi chỉ số có thể được ghi ở những lần khác nhau.<span className="mt-1 block sm:hidden">Vuốt ngang để xem thêm chỉ số.</span></p></section>;
}
