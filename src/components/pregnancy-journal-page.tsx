import Link from "next/link";
import { Mail, Plus } from "lucide-react";
import styles from "./pregnancy.module.css";
import { PregnancyEmpty } from "@/components/pregnancy-section";
import { PregnancyJournalForm } from "@/components/pregnancy-journal-form";
import { EditFormTarget } from "@/components/edit-record-navigation";
import { RecordActions } from "@/components/record-actions";
import { getPregnancyContext } from "@/features/mother/pregnancy-data";
import { deletePregnancyJournal } from "@/features/mother/journal-actions";
import { db } from "@/lib/db";
import { toDateTimeLocal } from "@/lib/date";

export async function PregnancyJournalPage({ kind, params }: { kind: "HEALTH" | "MEMORY"; params: { edit?: string; page?: string; new?: string; saved?: string } }) {
  const { pregnancy, user } = await getPregnancyContext();
  if (!pregnancy) return <PregnancyEmpty />;
  const health = kind === "HEALTH";
  const path = `/mother/pregnancy/${health ? "health/journal" : "memories"}`;
  const requested = Number(params.page ?? 1);
  const page = Number.isSafeInteger(requested) && requested > 0 ? Math.min(requested, 10000) : 1;
  const where = { pregnancyId: pregnancy.id, kind };
  const [rows, editing] = await Promise.all([
    db.pregnancyJournalEntry.findMany({ where, orderBy: [{ occurredOn: "desc" }, { createdAt: "desc" }], skip: (page - 1) * 20, take: 21 }),
    params.edit ? db.pregnancyJournalEntry.findFirst({ where: { ...where, id: params.edit } }) : null,
  ]);
  return <>
    <div className={styles.intro}><span className={styles.eyebrow}>{health ? "Cơ thể mẹ, hành trình riêng" : "Gửi con, từ những ngày đầu"}</span><h2 className={styles.heading}>{health ? "Nhật ký cảm nhận" : "Kỷ niệm thai kỳ"}</h2><p className={styles.muted}>{health ? "Ghi lại cảm nhận và điều muốn trao đổi khi đi khám." : "Rồi con sẽ lớn. Những lời thương hôm nay vẫn ở đây."}</p></div>
    {!health && <section className={`${styles.panel} ${styles.paper} flex items-center gap-5`}><Mail size={46} strokeWidth={1} className="shrink-0 text-rose-400" /><div><h3 className="font-serif text-xl italic">Một chút hôm nay, thương đến mai sau.</h3><p className={`${styles.muted} mt-2`}>Lần đầu nghe tim con, một cái tên mẹ thích, hay chỉ là lời chào thật khẽ.</p></div></section>}
    <EditFormTarget recordId={editing?.id}><details className={styles.panel} open={!!editing || params.new === "1"}><summary className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold"><Plus size={17} />{editing ? "Chỉnh sửa ghi chép" : health ? "Ghi nhật ký hôm nay" : "Viết thư hoặc lưu dấu mốc"}</summary><div className="mt-4">
      <PregnancyJournalForm key={editing?.id ?? `new-${params.saved ?? "draft"}`} pregnancyId={pregnancy.id} kind={kind} today={toDateTimeLocal(new Date(), user.timezone).slice(0, 10)} editing={editing ? { id: editing.id, title: editing.title, content: editing.content, occurredOn: editing.occurredOn.toISOString().slice(0, 10) } : undefined} />
    </div></details></EditFormTarget>
    <h2 className="mb-3 mt-6 text-lg font-semibold">{health ? "Nhật ký đã lưu" : "Những điều mình thương"}</h2>
    <div className="space-y-3">{rows.slice(0, 20).map((entry) => <article key={entry.id} className="rounded-2xl border bg-card p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words font-medium">{entry.title}</h3><p className="mt-1 text-xs text-muted-foreground">{new Intl.DateTimeFormat("vi-VN", { dateStyle: "long", timeZone: "UTC" }).format(entry.occurredOn)}</p></div><RecordActions id={entry.id} editHref={`${path}?edit=${entry.id}`} deleteAction={deletePregnancyJournal} editLabel="Sửa ghi chép" deleteLabel="Xóa ghi chép" /></div><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6">{entry.content}</p></article>)}</div>
    {!rows.length && <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">{health ? "Chưa có nhật ký. Bắt đầu bằng một ghi chú ngắn về hôm nay." : "Chưa có kỷ niệm. Viết vài lời đầu tiên gửi con nhé."}</p>}
    <nav aria-label="Phân trang ghi chép" className="mt-4 flex justify-between text-sm">{page > 1 ? <Link className="p-3 underline" href={`${path}?page=${page - 1}`}>Trang trước</Link> : <span />}{rows.length > 20 && <Link className="p-3 underline" href={`${path}?page=${page + 1}`}>Trang sau</Link>}</nav>
    {health && <Link href="/knowledge?stage=PREGNANCY" className="mt-4 block rounded-2xl bg-secondary/50 p-4 text-sm text-primary">Cẩm nang chăm sóc mẹ trong thai kỳ →</Link>}
  </>;
}
