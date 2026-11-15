import Link from "next/link";
import { CalendarPlus, StickyNote } from "lucide-react";
import { MedicineIcon } from "@/components/app-icons";
import { RecordActions } from "@/components/record-actions";

type PrescriptionLine = {
  id: string;
  medicineName: string;
  dosage: string | null;
  frequency: string | null;
  durationDays: number | null;
  instructions: string | null;
};

export type PrescriptionView = {
  id: string;
  prescribedBy: string | null;
  diagnosis: string | null;
  issuedAt: Date;
  notes: string | null;
  items: PrescriptionLine[];
};

function Dose({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium text-muted-foreground">{label}</dt>
      <dd className="wrap-break-word text-sm font-semibold">{value}</dd>
    </div>
  );
}

export function PrescriptionCard({ item, timeZone, deleteAction, editLabel, deleteLabel }: {
  item: PrescriptionView;
  timeZone: string;
  deleteAction: (formData: FormData) => Promise<void>;
  editLabel: string;
  deleteLabel: string;
}) {
  const issued = new Intl.DateTimeFormat("vi-VN", { timeZone, day: "2-digit", month: "2-digit", year: "numeric" }).format(item.issuedAt);
  const meta = [issued, item.prescribedBy ? `BS. ${item.prescribedBy}` : null, item.items.length ? `${item.items.length} thuốc` : null].filter(Boolean).join(" · ");

  return (
    <article data-history-card aria-label={`Đơn thuốc ngày ${issued}`} className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/50">
      <header className="flex items-start gap-3 border-b border-dashed border-border/80 bg-violet-50/70 p-4 dark:bg-violet-950/40">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
          <MedicineIcon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-700 dark:text-violet-300">Đơn thuốc</p>
          <h3 className="wrap-break-word font-semibold leading-6">{item.diagnosis || "Chưa ghi chẩn đoán"}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>
        </div>
      </header>

      {item.items.length > 0 ? (
        <ol className="divide-y divide-border/60">
          {item.items.map((line, index) => (
            <li key={line.id} className="flex gap-3 px-4 py-3.5">
              <span aria-hidden className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-primary">{index + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="wrap-break-word font-semibold">{line.medicineName}</p>
                {(line.dosage || line.frequency || line.durationDays) && (
                  <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 rounded-xl bg-secondary/50 px-3 py-2">
                    {line.dosage && <Dose label="Liều dùng" value={line.dosage} />}
                    {line.frequency && <Dose label="Tần suất" value={line.frequency} />}
                    {line.durationDays != null && <Dose label="Số ngày" value={`${line.durationDays} ngày`} />}
                  </dl>
                )}
                {line.instructions && <p className="mt-2 whitespace-pre-line wrap-break-word text-sm leading-6 text-muted-foreground">{line.instructions}</p>}
                <Link
                  href={`/tracking/medication?new=1&name=${encodeURIComponent(line.medicineName)}&dosage=${encodeURIComponent(line.dosage ?? "")}`}
                  className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
                >
                  <CalendarPlus className="size-4" />Tạo lịch uống
                </Link>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="px-4 py-3.5 text-sm text-muted-foreground">Đơn này chưa có thuốc nào.</p>
      )}

      {item.notes && (
        <div className="flex gap-3 border-t border-border/60 px-4 py-3">
          <StickyNote className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">Ghi chú</p>
            <p className="whitespace-pre-line wrap-break-word text-sm leading-6">{item.notes}</p>
          </div>
        </div>
      )}

      <div className="flex justify-end border-t border-border/60 px-1">
        <RecordActions id={item.id} editHref={`/tracking/prescription?view=archive&edit=${item.id}`} deleteAction={deleteAction} editLabel={editLabel} deleteLabel={deleteLabel} />
      </div>
    </article>
  );
}
