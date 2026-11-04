import { PushNotificationSettings } from "@/components/push-notification-settings";
import { SupplementOptions } from "@/components/supplement-options";
import { ageMonthsOn } from "@/features/health/supplements";
import { DashboardRefresh } from "@/components/dashboard-refresh";
import Link from "next/link";
import { MedicineIcon as Pill } from "@/components/app-icons";
import { deleteMedicationAction, saveMedicationAction } from "@/app/health-actions";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { Field, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { MedicationCheck } from "@/components/medication-check";
import { PageHeader } from "@/components/page-header";
import { RecordActions } from "@/components/record-actions";
import { scheduledOn } from "@/features/health/validation";
import { validDay } from "@/features/journey/dates";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { db } from "@/lib/db";
import { toDateTimeLocal } from "@/lib/date";

export default async function MedicationPage({searchParams}:{searchParams:Promise<{edit?:string;new?:string;date?:string;saved?:string;name?:string;dosage?:string;baby?:string}>}) {
  const [user,query] = await Promise.all([requireUser(),searchParams]);
  const baby = query.baby ? await db.baby.findFirst({ where: { id: query.baby, userId: user.id } }) : await getSelectedBaby(user.id);
  if (!baby) return <><PageHeader compact title="Thuốc của bé" backHref="/baby"/><p>Thêm hồ sơ bé để tạo lịch thuốc.</p></>;
  const now = new Date(), today = toDateTimeLocal(now,user.timezone).slice(0,10), day = validDay(query.date,today);
  const schedules = await db.medicationSchedule.findMany({where:{babyId:baby.id},orderBy:{createdAt:"desc"},include:{doses:{where:{day:new Date(`${day}T00:00Z`)}}}});
  const editing = schedules.find(row=>row.id===query.edit);
  const entries = schedules.filter(schedule=>scheduledOn(schedule,day)).flatMap(schedule=>schedule.times.map(time=>({schedule,time,dose:schedule.doses.find(dose=>dose.time===time)}))).sort((a,b)=>a.time.localeCompare(b.time)||a.schedule.name.localeCompare(b.schedule.name));
  const completed = entries.filter(row=>row.dose).length;
  const months = ageMonthsOn(baby.dateOfBirth, today);
  return <>
    <DashboardRefresh pauseSelector="#medication-form, [data-supplement-option][open]"/>
    <PageHeader compact title="Thuốc & bổ sung" subtitle={`${baby.name}${months == null ? "" : ` · ${months} tháng`}`} backHref="/baby"/>
    <PushNotificationSettings publicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY} description="Dùng chung cài đặt với Hồ sơ. Thông báo phụ thuộc lịch chạy của hệ thống, hiện không bảo đảm nhắc thuốc sát giờ. Cữ đã xác nhận sẽ được bỏ qua. Cho phép thông báo một lần trên thiết bị này."/>
    <section className="mt-4 rounded-3xl border border-border/60 bg-card p-4 sm:p-5">
      <form className="mb-5 flex flex-wrap items-end gap-2"><input type="hidden" name="baby" value={baby.id}/><div className="min-w-40 flex-1"><Field name="date" type="date" label="Ngày theo dõi" required defaultValue={day}/></div><button className="min-h-12 rounded-xl bg-secondary px-4 text-sm font-medium text-primary">Xem</button></form>
      <div><div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4"><h3 className="font-semibold">{day===today ? "Hôm nay bé đã dùng gì?" : `Checklist ngày ${day.split('-').reverse().join('/')}`}</h3><span role="status" className="rounded-full bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 dark:bg-violet-900 dark:text-violet-200">{entries.length && completed===entries.length ? "Đã dùng đủ" : `${completed}/${entries.length} cữ đã dùng`}</span></div>
      <div className="divide-y">{entries.map(({schedule,time,dose})=><div key={`${schedule.id}-${day}-${time}`} className="flex items-start gap-3 py-4"><MedicationCheck scheduleId={schedule.id} name={schedule.name} day={day} time={time} taken={!!dose} disabled={day>today}/><div className="min-w-0 flex-1"><p className="break-words font-semibold">{schedule.name}</p><p className="mt-1 text-sm text-muted-foreground">Lịch dùng lúc {time} · {schedule.dosage}</p>{dose && <p className="mt-1 text-xs text-violet-600 dark:text-violet-300">Đã xác nhận {new Intl.DateTimeFormat("vi",{timeZone:user.timezone,dateStyle:"short",timeStyle:"short"}).format(dose.takenAt)}</p>}{!dose && day<=today && (day<today || time <= toDateTimeLocal(now,user.timezone).slice(11,16)) && <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">Đã đến giờ · chưa xác nhận</p>}{schedule.instructions && <p className="mt-2 whitespace-pre-wrap break-words text-xs text-muted-foreground">{schedule.instructions}</p>}</div></div>)}</div>
      {!entries.length && <p className="py-6 text-sm text-muted-foreground">Chưa có mục cần đánh dấu cho ngày này. Chọn bổ sung đang dùng theo giai đoạn hoặc thêm thuốc khác bên dưới.</p>}</div>

    </section>
    {!editing && query.new !== "1" && <SupplementOptions babyId={baby.id} months={months} today={today} schedules={schedules} />}
    {query.saved && <p role="status" className="mt-4 text-sm text-primary">Đã lưu lịch thuốc.</p>}
    <div className="mt-6"><CollapsibleRecordForm prominent key={editing?.id ?? `new-${schedules.length}`} editingId={editing?.id} defaultOpen={!!editing||query.new==="1"} addLabel="Thêm thuốc / bổ sung khác" closeLabel="Hủy">
      <form id="medication-form" action={saveMedicationAction} className="space-y-4 rounded-3xl bg-card p-5 shadow-sm">
        <input type="hidden" name="babyId" value={baby.id}/>{editing&&<input type="hidden" name="id" value={editing.id}/>}
        <Field name="name" label="Tên thuốc / thực phẩm bổ sung" required maxLength={200} defaultValue={editing?.name ?? query.name?.slice(0,200) ?? ""}/>
        <Field name="dosage" label="Liều dùng theo đơn / hướng dẫn đã có" required maxLength={200} placeholder="Nhập đúng liều đã được hướng dẫn" defaultValue={editing?.dosage ?? query.dosage?.slice(0,200) ?? ""}/>
        <div className="grid gap-4 sm:grid-cols-2"><Field name="startDate" type="date" label="Ngày bắt đầu" required defaultValue={editing?.startDate.toISOString().slice(0,10) ?? today}/><Field name="endDate" type="date" label="Ngày kết thúc (nếu có)" defaultValue={editing?.endDate?.toISOString().slice(0,10) ?? ""}/></div>
        <Field name="times" label="Giờ dùng mỗi ngày (24 giờ)" required placeholder="08:00, 18:00" defaultValue={editing?.times.join(", ") ?? "08:00"}/><p className="text-xs text-muted-foreground">Cách nhau bằng dấu phẩy. Giờ theo múi giờ hồ sơ: {user.timezone}.</p>
        <TextAreaField name="instructions" label="Lời dặn / ghi chú" maxLength={2000} defaultValue={editing?.instructions ?? ""}/>
        <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" name="active" defaultChecked={editing?.active ?? true} className="size-5 accent-violet-600"/>Đang sử dụng lịch thuốc này</label>
      </form>
      <FormActionBar formId="medication-form" saveAction={saveMedicationAction} saveLabel={editing ? "Cập nhật lịch thuốc" : "Lưu lịch thuốc"} cancelHref={`/tracking/medication?baby=${encodeURIComponent(baby.id)}`} cancelLabel="Hủy" deleteAction={editing ? deleteMedicationAction : undefined} deleteId={editing?.id} deleteLabel="Xóa lịch thuốc"/>
    </CollapsibleRecordForm></div>
    <details className="mt-7 rounded-3xl border border-border/60 bg-card p-4"><summary className="cursor-pointer py-1 font-semibold">Quản lý lịch đã lưu ({schedules.length})</summary><div className="space-y-3">{schedules.map(schedule=><article key={schedule.id} className="flex items-start gap-3 rounded-2xl border bg-card p-4"><Pill className="mt-1 size-5 shrink-0 text-violet-600"/><div className="min-w-0 flex-1"><p className="break-words font-semibold">{schedule.name}</p><p className="mt-1 text-sm text-muted-foreground">{schedule.dosage} · {schedule.times.join(" · ")}</p><p className="mt-1 text-xs text-muted-foreground">{schedule.startDate.toISOString().slice(0,10)} → {schedule.endDate?.toISOString().slice(0,10) ?? "Chưa đặt ngày kết thúc"} · {schedule.active ? "Đang bật" : "Đã tạm dừng"}</p></div><RecordActions id={schedule.id} editHref={`/tracking/medication?edit=${schedule.id}&baby=${encodeURIComponent(baby.id)}`} deleteAction={deleteMedicationAction} editLabel="Sửa lịch thuốc" deleteLabel="Xóa lịch thuốc"/></article>)}</div>
    </details>
    <Link href="/tracking/prescription?view=archive" className="mt-5 inline-flex min-h-12 items-center text-sm font-medium text-primary">Đơn thuốc bác sĩ & toa đã lưu →</Link>
  </>;
}
