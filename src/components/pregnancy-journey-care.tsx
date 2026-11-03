"use client";
import Link from "next/link";
import { useActionState } from "react";
import { unstable_rethrow } from "next/navigation";
import { CheckCheck, NotebookPen, CalendarHeart, ArrowUpRight } from "lucide-react";
import { journeyTasks, tasksForWeek, type JourneyTask } from "@/features/mother/journey-tasks";
import { saveJourneyTask } from "@/features/mother/journey-actions";
import styles from "./pregnancy.module.css";

export type JourneySaved = { taskKey: string; done: boolean; note: string; remindOn: string };
export type JourneyVisit = { id: string; week: number | null; scan: boolean; date: string };
export type JourneyCareData = { pregnancyId: string; today: string; saved: JourneySaved[]; visits: JourneyVisit[]; advice?: string | null; adviceId?: string };
function TaskCard({ task, data, active }: { task: JourneyTask; data: JourneyCareData; active: boolean }) {
  const saved = data.saved.find((row) => row.taskKey === task.key);
  const [state, action, pending] = useActionState(async (previous: { error: string; saved: boolean }, form: FormData) => {
    try { return await saveJourneyTask(previous, form); } catch (error) { unstable_rethrow(error); return { error: "Chưa lưu được. Kiểm tra kết nối và thử lại.", saved: false }; }
  }, { error: "", saved: false });
  const sources = data.visits.filter((visit) => visit.week != null && visit.week >= task.from && visit.week <= task.to && (!task.scan || visit.scan)).slice(0, 2);
  return <article className={styles.careCard} aria-label={task.title}>
    <div className={styles.careCardTop}><span className={styles.eyebrow}>{task.group} · Tuần {task.from}–{task.to}</span>{saved?.done && <span className={styles.badge}><CheckCheck size={13} />Đã làm</span>}</div>
    <h4 className="mt-2 text-sm font-semibold">{task.title}</h4><p className={`${styles.muted} mt-2`}>{task.description}</p>
    <div className="mt-3 flex flex-wrap items-center gap-4"><Link href={`/mother/pregnancy/${task.href}`} className={styles.textLink}>Mở mục liên quan <ArrowUpRight size={13} /></Link><a href={task.source} target="_blank" rel="noreferrer" className="text-[10px] underline text-muted-foreground">Tham khảo NHS</a></div>
    {task.group === "Khám & sàng lọc" && <div className={styles.careSource}>{sources.length ? <><p>Phiếu trong khoảng tuần này · mẹ đối chiếu để xác nhận:</p>{sources.map((visit) => <Link key={visit.id} href={`/mother/pregnancy/checkups?edit=${visit.id}`}>{visit.date} · tuần {visit.week} ↗</Link>)}</> : <p>Chưa có thông tin kết quả liên quan trong hồ sơ; không có nghĩa mẹ chưa thực hiện.</p>}</div>}
    <details className="mt-4"><summary className="flex min-h-11 cursor-pointer items-center gap-2 text-xs font-semibold"><NotebookPen size={15} />{saved?.note || saved?.remindOn || saved?.done ? "Xem / sửa ghi chú & trạng thái" : "Ghi chú, đánh dấu & nhắc lại"}</summary>
      <form action={action} className="mt-3 space-y-3">
        <input type="hidden" name="pregnancyId" value={data.pregnancyId} /><input type="hidden" name="taskKey" value={task.key} />
        <label className="flex min-h-11 items-center gap-2 text-xs"><input type="checkbox" name="done" defaultChecked={saved?.done} />Mẹ xác nhận đã làm</label>
        <label className="block text-xs">Ghi chú của mẹ<textarea className={styles.field} name="note" rows={3} maxLength={3000} defaultValue={saved?.note ?? ""} placeholder={task.key === "supplements" ? "Tên sản phẩm · thành phần · liều theo đơn · ngày bắt đầu/kết thúc…" : "Câu hỏi cho bác sĩ, điều cần chuẩn bị…"} /></label>
        <label className="block text-xs">Ngày nhắc lại (tùy chọn)<input className={styles.field} type="date" name="remindOn" defaultValue={saved?.remindOn ?? ""} disabled={!active} /></label>
        <p className={styles.muted}>Nhắc việc một lần vào ngày đã chọn khi bật thông báo trong Hồ sơ; không phải lịch uống thuốc hằng ngày. Đánh dấu đã làm sẽ dừng nhắc.</p>
        <button className={styles.button} disabled={pending}>{pending ? "Đang lưu…" : "Lưu việc cần làm"}</button>
        {state.error && <p role="alert" className="text-xs text-destructive">{state.error}</p>}{state.saved && <p role="status" className="text-xs text-emerald-700">Đã lưu vào hành trình của mẹ.</p>}
      </form>
    </details>
    {saved?.remindOn && !saved.done && <p className="mt-3 text-xs text-rose-600"><CalendarHeart size={13} className="mr-1 inline" />{saved.remindOn < data.today ? "Ngày nhắc đã qua" : "Nhắc lại"}: {saved.remindOn.split("-").reverse().join("/")}</p>}
  </article>;
}
export function PregnancyJourneyCare({ week, currentWeek, active, data }: { week: number; currentWeek?: number; active: boolean; data: JourneyCareData }) {
  const visible = tasksForWeek(week);
  const upcoming = journeyTasks.filter((task) => task.from > week).sort((a, b) => a.from - b.from).slice(0, 2);
  const due = data.saved.filter((row) => !row.done && row.remindOn && row.remindOn <= data.today);
  return <section className={styles.careSection} id="journey-care" aria-label="Việc cần làm trong hành trình">
    <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Hành trình yêu thương</p><h3 className="mt-1">Mẹ cần gì ở tuần {week}?</h3></div><span className={styles.badge}>{visible.filter((task) => data.saved.some((row) => row.taskKey === task.key && row.done)).length}/{visible.length} đã làm</span></div>
    <p className={`${styles.muted} mb-4`}>{week === currentWeek && active ? "Dành cho tuần hiện tại của mẹ." : "Đang khám phá tuần được chọn."} Khung tham khảo theo giai đoạn; lịch và chỉ định tại nơi mẹ khám được ưu tiên. Mục dài nhiều tuần dùng chung một ghi chú và trạng thái.</p>
    {!!due.length && active && <div className={`${styles.notice} mb-4`}><strong className="text-xs">Việc đến ngày nhắc</strong>{due.map((row) => <p key={row.taskKey} className="mt-1 text-xs">{journeyTasks.find((task) => task.key === row.taskKey)?.title} · {row.remindOn.split("-").reverse().join("/")}</p>)}<p className="mt-2 text-xs">Mở “Tất cả giai đoạn” bên dưới để cập nhật cả những việc ngoài tuần đang xem.</p></div>}
    <div className={styles.careGrid}>{visible.map((task) => <TaskCard key={`${data.pregnancyId}-${task.key}`} task={task} data={data} active={active} />)}</div>
    {upcoming.length > 0 && <div className={styles.careUpcoming}><h4 className="text-xs font-semibold">Sắp tới · Chuẩn bị trước</h4>{upcoming.map((task) => <p key={task.key} className="mt-2 text-xs"><span className="font-semibold">Tuần {task.from}–{task.to}</span> · {task.title}</p>)}</div>}
    {data.advice && <div className={styles.careUpcoming}><h4 className="text-xs font-semibold">Cần nhớ từ phiếu khám gần nhất có lời dặn</h4><p className={`${styles.muted} mt-2 whitespace-pre-line`}>{data.advice}</p><Link className={`${styles.textLink} mt-2`} href={`/mother/pregnancy/checkups?edit=${data.adviceId}`}>Xem phiếu gốc ↗</Link></div>}
    <details className={styles.careUpcoming}><summary className="min-h-11 cursor-pointer text-xs font-semibold">Tất cả giai đoạn · Những việc ngoài tuần {week}</summary><div className={`${styles.careGrid} mt-3`}>{journeyTasks.filter((task) => !visible.some((item) => item.key === task.key)).map((task) => <TaskCard key={`${data.pregnancyId}-${task.key}`} task={task} data={data} active={active} />)}</div></details>
    <div className={styles.careSafety}><strong className="text-xs">Khi cần trợ giúp, không chờ đến lịch nhắc</strong><p className="mt-2 text-xs leading-6">Nếu con cử động ít hơn, mất cử động hoặc thay đổi so với thường ngày, liên hệ cơ sở sản khoa ngay; không chờ bộ đếm hay đến ngày hôm sau.</p><a className="mt-2 inline-block text-xs underline" href="https://www.nhs.uk/pregnancy/keeping-well/your-babys-movements/" target="_blank" rel="noreferrer">Hướng dẫn cử động thai · NHS ↗</a></div>
    <Link className={`${styles.textLink} mt-4`} href="/mother/pregnancy/memories?new=1">Giữ một khoảnh khắc của tuần này ↗</Link>
  </section>;
}
