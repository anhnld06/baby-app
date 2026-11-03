import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PregnancyEmpty } from "@/components/pregnancy-section";
import { PregnancySessionTool } from "@/components/pregnancy-session-tool";
import { PregnancyRecordDelete } from "@/components/pregnancy-record-delete";
import { getPregnancyContext } from "@/features/mother/pregnancy-data";
import { durationLabel, trackingEventSchema, sessionSummary } from "@/features/mother/tracking-validation";
import { db } from "@/lib/db";
import styles from "./pregnancy.module.css";

export async function PregnancyTrackingToolPage({ kind, page: pageParam }: { kind: "KICKS" | "CONTRACTIONS"; page?: string }) {
  const { pregnancy, user } = await getPregnancyContext();
  if (!pregnancy) return <PregnancyEmpty />;
  const page = /^\d+$/.test(pageParam ?? "") ? Math.max(1, Math.min(10000, Number(pageParam))) : 1;
  const rows = await db.pregnancyTrackingSession.findMany({ where: { pregnancyId: pregnancy.id, kind }, orderBy: { startedAt: "desc" }, take: 21, skip: (page - 1) * 20 });
  const history = rows.slice(0, 20).map((record) => ({ id: record.id, startedAt: record.startedAt.toISOString(), endedAt: record.endedAt.toISOString(), events: trackingEventSchema.array().parse(record.events) }));
  const kicks = kind === "KICKS";
  const path = `/mother/pregnancy/${kicks ? "baby/kicks" : "health/contractions"}`;
  return <>
    <Link href={`/mother/pregnancy/${kicks ? "baby" : "health"}`} className={styles.textLink}><ChevronLeft size={14} />{kicks ? "Em bé" : "Sức khỏe mẹ"}</Link>
    <div className={styles.intro}><span className={styles.eyebrow}>Công cụ theo dõi</span><h2 className={styles.heading}>{kicks ? "Từng cử động của con" : "Theo dõi cơn co"}</h2><p className={styles.muted}>{kicks ? "Ghi lại những chuyển động mẹ cảm nhận để trao đổi khi đi khám." : "Ghi thời lượng và khoảng cách từ lúc bắt đầu cơn này đến cơn tiếp theo."}</p></div>
    <PregnancySessionTool pregnancyId={pregnancy.id} kind={kind} active={pregnancy.pregnancyStatus === "PREGNANT"} history={history} />
    <div className={`${styles.notice} mt-4`}>{kicks ? <>Không có một số cử động cố định được coi là bình thường cho mọi bé. Nếu bé cử động ít hơn, ngừng cử động hoặc khác thường, liên hệ cơ sở sản khoa ngay, không chờ đếm đủ. <a className="underline" href="https://www.nhs.uk/pregnancy/keeping-well/your-babys-movements/" target="_blank" rel="noreferrer">Nguồn: NHS</a></> : <>Công cụ chỉ ghi thời gian, không xác định chuyển dạ hay quyết định thời điểm nhập viện. Làm theo hướng dẫn riêng của cơ sở sản khoa.</>}</div>
    <div className={styles.sectionHeading}><h2>Lịch sử đã lưu</h2><span className={styles.muted}>Trang {page}</span></div>
    <div className={styles.panel}>{history.map((record) => {
      const summary = sessionSummary(record.events, kind);
      return <article key={record.id} className={styles.historyRow}><div><strong>{new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short", timeZone: user.timezone }).format(new Date(record.startedAt))}</strong><p className={styles.muted}>{summary.count} {kicks ? "cử động" : "cơn co"} · {durationLabel(new Date(record.endedAt).getTime() - new Date(record.startedAt).getTime())}{!kicks && summary.averageDurationMs != null ? ` · Dài TB ${durationLabel(summary.averageDurationMs)}` : ""}</p></div><PregnancyRecordDelete id={record.id} recordType="session" /></article>;
    })}{!history.length && <p className={styles.muted}>Chưa có phiên theo dõi nào được lưu.</p>}</div>
    <nav aria-label="Phân trang phiên theo dõi" className="flex justify-between text-sm">{page > 1 ? <Link className={styles.textLink} href={`${path}?page=${page - 1}`}>Trang trước</Link> : <span />}{rows.length > 20 && <Link className={styles.textLink} href={`${path}?page=${page + 1}`}>Trang sau</Link>}</nav>
  </>;
}
