import Link from "next/link";
import { saveMedicationAction } from "@/app/health-actions";
import { Field } from "@/components/form-fields";
import { matchesSupplement, supplementTopics } from "@/features/health/supplements";

export function SupplementOptions({ babyId, months, today, schedules }: {
  babyId: string;
  months: number | undefined;
  today: string;
  schedules: { id: string; name: string }[];
}) {
  const topics = supplementTopics(months);
  return (
    <section className="mt-7" aria-labelledby="supplement-options-title">
      <h2 id="supplement-options-title" className="text-lg font-semibold">Bổ sung theo giai đoạn</h2>
      <p className="mb-4 mt-1 text-sm leading-6 text-muted-foreground">
        {months != null ? `Bé hiện ${months} tháng. ` : ""}
        Chọn mục bé đang được hướng dẫn dùng để thiết lập một lần, sau đó đánh dấu ở checklist mỗi ngày.
      </p>
      {!topics.length && <p className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">Chưa có mục tham khảo cho độ tuổi này. Bạn có thể thêm thuốc hoặc bổ sung theo hướng dẫn riêng của bé bên dưới.</p>}
      <div className="space-y-3">
        {topics.map(topic => {
          const existing = schedules.find(schedule => matchesSupplement(schedule.name, topic));
          return <article key={topic.id} className="rounded-3xl border border-border/60 bg-card p-4 sm:p-5">
            <h3 className="font-semibold">{topic.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{topic.context}</p>
            <a href={topic.source} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-xs font-medium text-primary underline underline-offset-4">Tham khảo CDC ↗</a>
            {existing ? <Link href={`/tracking/medication?edit=${existing.id}`} className="flex min-h-11 items-center text-sm font-medium text-primary">Đã có lịch · Xem hoặc điều chỉnh →</Link> : (
              <details data-supplement-option className="mt-1 rounded-2xl bg-muted/50 p-3">
                <summary className="cursor-pointer py-1 text-sm font-medium">Thiết lập {topic.name} cho bé</summary>
                <form action={saveMedicationAction} className="mt-4 space-y-4" data-supplement-setup>
                  <input type="hidden" name="babyId" value={babyId} />
                  <input type="hidden" name="preset" value={topic.id} />
                  <input type="hidden" name="name" value={topic.name} />
                  <input type="hidden" name="startDate" value={today} />
                  <input type="hidden" name="active" value="on" />
                  <Field id={`${topic.id}-dosage`} name="dosage" label="Sản phẩm và liều đang được hướng dẫn" required maxLength={200} placeholder="Nhập đúng tên sản phẩm, hàm lượng và liều đã xác nhận" />
                  <Field id={`${topic.id}-time`} name="times" label="Giờ dùng hằng ngày" type="time" required defaultValue="08:00" />
                  <label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" name="confirmed" required className="mt-1 size-5 shrink-0 accent-primary" />Tôi đã xác nhận loại bổ sung và liều phù hợp cho bé.</label>
                  <button className="min-h-12 rounded-2xl bg-primary px-5 text-sm font-medium text-primary-foreground">Đưa vào checklist hằng ngày</button>
                </form>
              </details>
            )}
          </article>;
        })}
      </div>
    </section>
  );
}
