import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { lastMaternalNote, type MaternalObservation } from "@/features/mother/maternal-observations";
import styles from "./pregnancy.module.css";

export function MaternalClinicalNotes({ observations }: { observations: MaternalObservation[] }) {
  const fields = [
    { field: "edema", label: "Phù ghi trên phiếu" }, { field: "urine", label: "Nước tiểu albumin/đường" },
    { field: "healthStatus", label: "Tình trạng sức khỏe theo phiếu" }, { field: "treatment", label: "Thuốc & điều trị đã ghi" },
    { field: "care", label: "Dặn dò của bác sĩ" }, { field: "followup", label: "Lời hẹn tái khám" },
  ] as const;
  const notes = fields.flatMap((item) => {
    const row = lastMaternalNote(observations, item.field);
    return row ? [{ ...item, row, value: item.field === "edema" ? row.edema === "ABSENT" ? "Không phù (-)" : row.edema === "PRESENT" ? "Có phù (+)" : row.edema : row[item.field] }] : [];
  });
  const rawPressure = lastMaternalNote(observations, "bloodPressure");
  return <section className={styles.panel} aria-label="Ghi nhận của bác sĩ cho mẹ"><div className="mb-3 flex items-center gap-2"><ClipboardCheck size={18} className="text-rose-400" /><h3 className="text-sm font-semibold">Ghi nhận & dặn dò từ các lần khám</h3></div><p className={`${styles.muted} mb-3`}>Lấy lần gần nhất có ghi từng mục. Ngày và nguồn được giữ riêng, kể cả khi lần siêu âm mới hơn không có thông tin của mẹ.</p>
    {rawPressure && rawPressure.values.systolic == null && <div className={styles.clinicalNote}><strong>Huyết áp ghi trên phiếu: {rawPressure.bloodPressure}</strong><p className={styles.muted}>Chưa đọc được thành cặp số để vẽ biểu đồ.</p><Link href={rawPressure.editHref} className={styles.textLink}>{rawPressure.dateLabel} · Xem phiếu gốc</Link></div>}
    <dl className={styles.clinicalNotes}>{notes.map((item) => <div key={item.field} className={styles.clinicalNote}><dt>{item.label}</dt><dd className="mt-1 whitespace-pre-wrap text-sm leading-6">{item.value}</dd><dd><Link href={item.row.editHref} className={styles.textLink}>{item.row.dateLabel} · Phiếu khám</Link></dd></div>)}</dl>
    {!notes.length && <p className={styles.muted}>Chưa có ghi nhận bổ sung. Các mục có trên phiếu sẽ tự xuất hiện tại đây, không cần nhập lại.</p>}

  </section>;
}
