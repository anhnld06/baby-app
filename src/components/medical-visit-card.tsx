import { CalendarClock, ChevronDown, Stethoscope } from "lucide-react";
import type { ReactNode } from "react";
import { RecordActions } from "@/components/record-actions";
import { formatDateInputDisplay } from "@/lib/date";
import { cn } from "@/lib/utils";

export type MedicalVisitView = {
  id: string;
  visitedAt: Date;
  facility: string | null;
  doctor: string | null;
  specialty: string | null;
  reason: string | null;
  diagnosis: string | null;
  treatment: string | null;
  nextVisitAt: Date | null;
  notes: string | null;
};

const DAY_MS = 86_400_000;

/** `nextVisitAt` is a `@db.Date` (UTC midnight); `today` is yyyy-mm-dd on the account calendar. */
function followUp(nextVisitAt: Date, today: string) {
  const key = nextVisitAt.toISOString().slice(0, 10);
  const days = Math.round((Date.parse(key) - Date.parse(today)) / DAY_MS);
  const date = formatDateInputDisplay(key);
  if (days < 0) return { text: `Tái khám ${date} · đã qua`, tone: "text-muted-foreground" };
  if (days === 0) return { text: "Tái khám hôm nay", tone: "text-amber-700 dark:text-amber-300" };
  return { text: `Tái khám ${date} · còn ${days} ngày`, tone: "text-primary" };
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-line wrap-break-word text-sm leading-6">{children}</dd>
    </div>
  );
}

export function MedicalVisitCard({ item, timeZone, today, basePath, deleteAction, defaultOpen = false }: {
  item: MedicalVisitView;
  timeZone: string;
  today: string;
  basePath: string;
  deleteAction: (formData: FormData) => Promise<void>;
  defaultOpen?: boolean;
}) {
  const visited = new Intl.DateTimeFormat("vi-VN", { timeZone, day: "2-digit", month: "2-digit", year: "numeric" }).format(item.visitedAt);
  const title = item.diagnosis || item.reason || "Lượt khám";
  const people = [item.specialty, item.doctor ? `BS. ${item.doctor}` : null].filter(Boolean).join(" · ");
  const next = item.nextVisitAt ? followUp(item.nextVisitAt, today) : null;
  const sections = [
    item.reason && { label: "Lý do khám / triệu chứng", value: item.reason },
    item.diagnosis && { label: "Chẩn đoán / kết luận", value: item.diagnosis },
    item.treatment && { label: "Điều trị / lời dặn", value: item.treatment },
    item.notes && { label: "Ghi chú thêm", value: item.notes },
  ].filter((section): section is { label: string; value: string } => !!section);

  const summary = (
    <>
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"><Stethoscope className="size-5" /></span>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 wrap-break-word font-semibold leading-6">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{[visited, item.facility].filter(Boolean).join(" · ")}</p>
        {people && <p className="mt-0.5 text-xs text-muted-foreground">{people}</p>}
        {next && <p className={cn("mt-1.5 text-xs font-medium leading-5", next.tone)}><CalendarClock aria-hidden className="mr-1 inline size-3.5 align-[-3px]" />{next.text}</p>}
      </div>
    </>
  );

  return (
    <article data-history-card aria-label={`Lượt khám ngày ${visited}`} className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/50">
      {sections.length ? (
        <details open={defaultOpen} className="group">
          <summary className="flex cursor-pointer list-none items-start gap-3 p-4 outline-none focus-visible:bg-secondary/60 [&::-webkit-details-marker]:hidden">
            {summary}
            <ChevronDown aria-hidden className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            <span className="sr-only">Xem chi tiết</span>
          </summary>
          <dl className="space-y-3 border-t border-border/60 px-4 py-3.5">
            {sections.map((section) => <Section key={section.label} label={section.label}>{section.value}</Section>)}
          </dl>
        </details>
      ) : (
        <div className="flex items-start gap-3 p-4">{summary}</div>
      )}
      <div className="flex justify-end border-t border-border/60 px-1">
        <RecordActions id={item.id} editHref={`${basePath}?edit=${item.id}`} deleteAction={deleteAction} editLabel="Sửa" deleteLabel="Xóa" />
      </div>
    </article>
  );
}
