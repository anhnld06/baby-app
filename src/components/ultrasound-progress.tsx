import Link from "next/link";
import { ULTRASOUND_METRICS, sortUltrasoundVisits, type UltrasoundVisit } from "@/features/mother/ultrasound-progress";
import styles from "./pregnancy.module.css";

const number = (value: number) => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value);
export function UltrasoundProgress({ visits }: { visits: UltrasoundVisit[] }) {
  const ordered = sortUltrasoundVisits(visits);
  const metrics = ULTRASOUND_METRICS.filter((item) => ordered.some((visit) => visit.values[item.key] != null));
  return <section className={styles.panel} aria-label="Bảng so sánh các lần siêu âm"><p className={`${styles.muted} mb-3`}>Chọn ngày để mở phiếu gốc tại Khám & lịch. Ô trống là chỉ số không được ghi trên phiếu.</p><div className={styles.scanTableScroll} tabIndex={0} role="region" aria-label="Bảng chỉ số có thể cuộn ngang"><table className={styles.scanTable}><thead><tr><th scope="col">Ngày · tuổi thai</th>{metrics.map((item) => <th scope="col" key={item.key}>{item.short}<span className="block text-[10px] font-normal">{item.unit}</span></th>)}</tr></thead><tbody>{ordered.slice().reverse().map((visit) => <tr key={visit.id}><th scope="row"><Link href={`/mother/pregnancy/checkups?edit=${visit.id}`} className="block py-2 text-primary"><strong>{visit.dateLabel}</strong><span className="block text-[10px] font-normal text-muted-foreground">{visit.ageLabel}</span></Link></th>{metrics.map((item) => <td key={item.key}>{visit.values[item.key] == null ? <span aria-label="Chưa ghi nhận">—</span> : number(visit.values[item.key]!)}</td>)}</tr>)}</tbody></table></div>{!metrics.length && <p className={`${styles.muted} mt-3`}>Chưa có chỉ số định lượng để đối chiếu.</p>}</section>;
}
