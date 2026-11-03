"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { savePregnancyMeasurement } from "@/features/mother/tracking-actions";
import { MaternalObservationTable } from "@/components/maternal-trends";
import type { MaternalObservation } from "@/features/mother/maternal-observations";
import styles from "./pregnancy.module.css";

type Measurement = { id: string; day: string; weightKg: number | null; bellyCm: number | null; notes: string | null };
export function PregnancyMeasurements({ pregnancyId, today, measurements, initialDate, observations }: {
  pregnancyId: string; today: string; measurements: Measurement[]; prePregnancyWeightKg?: number | null; initialDate?: string; observations: MaternalObservation[];
}) {
  const [day, setDay] = useState(initialDate ?? today);
  const [state, action, pending] = useActionState(async (previous: { error: string; saved: boolean }, form: FormData) => {
    try { return await savePregnancyMeasurement(previous, form); } catch (error) { unstable_rethrow(error); return { error: "Chưa lưu được số đo. Kiểm tra kết nối và thử lại.", saved: false }; }
  }, { error: "", saved: false });
  const entry = measurements.find((row) => row.day === day);
  const onDay = observations.filter((row) => row.source === "CHECKUP" && row.day === day && row.values.weightKg != null);
  const format = (value: number) => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(value);
  return <>
    <MaternalObservationTable observations={observations} />
    <details className={styles.panel} id="measurement-form" open={!!initialDate}>
      <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold">Bổ sung số đo ở nhà (tùy chọn)</summary>
      <p className={`${styles.muted} mb-4 mt-2`}>Chỉ dùng khi mẹ tự đo thêm ở nhà. Số đo từ khám thai đã có trong thống kê phía trên; sửa số trên phiếu ở Khám & lịch.</p>
      <form action={action} key={`${day}-${entry?.id ?? "new"}`} className="space-y-4">
        <input type="hidden" name="pregnancyId" value={pregnancyId} />
        <label className="block text-xs">Ngày đo<input className={styles.field} name="measuredOn" type="date" required max={today} value={day} onChange={(event) => setDay(event.target.value)} /></label>
        {onDay.length > 0 && <div className={styles.notice}>Ngày này đã có cân nặng trên phiếu: {onDay.map((row) => `${format(row.values.weightKg!)} kg`).join(" · ")}. Không cần nhập lại. <Link href={onDay.at(-1)!.editHref} className="underline">Xem / sửa phiếu</Link></div>}
        <div className={styles.formGrid}><label>Cân nặng đo ở nhà (kg)<input className={styles.field} type="number" step="0.1" min="1" max="400" name="weightKg" defaultValue={entry?.weightKg ?? ""} placeholder="Chỉ khi đo thêm" /></label><label>Vòng bụng (cm)<input className={styles.field} type="number" step="0.1" min="1" max="250" name="bellyCm" defaultValue={entry?.bellyCm ?? ""} placeholder="Nếu có đo" /></label></div>
        <label className="block text-xs">Ghi chú<textarea className={styles.field} name="notes" maxLength={1000} rows={2} defaultValue={entry?.notes ?? ""} /></label>
        <p className={styles.muted}>Mỗi ngày một bản ghi tại nhà. Lưu lại cùng ngày chỉ cập nhật bản ghi tại nhà, không thay đổi phiếu khám.</p>
        <button className={styles.button} disabled={pending}>{pending ? "Đang lưu…" : "Lưu số đo"}</button>
        {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}{state.saved && <p role="status" className="text-sm text-emerald-700">Đã lưu số đo của mẹ.</p>}
      </form>
    </details>
  </>;
}
