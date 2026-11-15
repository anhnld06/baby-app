import Link from "next/link";
import { CalendarClock, CalendarDays, ChevronRight } from "lucide-react";
import { STATUS_LABEL, bookingHref, formatDay, type DosePlan } from "@/features/vaccination/expected";

/**
 * Home-screen vaccination card: the next saved appointment and, when no saved
 * appointment covers it, the next computed TCMR dose. The computed date is
 * display-only (no reminder); "Đặt hẹn ngày này" opens the appointment form.
 */
export function UpcomingVaccination({ appointment, expected }: {
  appointment?: { vaccineName: string; scheduledAt: Date } | null;
  expected?: DosePlan | null;
}) {
  const showExpected = expected?.expected && (!appointment || expected.expected.getTime() < appointment.scheduledAt.getTime());
  if (!appointment && !showExpected) return null;
  return <div className="mt-4 divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-card">
    {appointment && <Link href="/vaccination-schedule" className="flex items-center gap-3 p-4">
      <CalendarDays className="size-5 shrink-0 text-primary" />
      <span className="min-w-0 flex-1 text-sm"><span className="block text-xs text-muted-foreground">Lịch tiêm đã hẹn</span><strong className="mt-1 block break-words font-medium">{appointment.vaccineName} · {formatDay(appointment.scheduledAt)}</strong></span>
      <ChevronRight className="size-4 shrink-0" />
    </Link>}
    {showExpected && expected && <Link href={bookingHref(expected)} data-expected-vaccination={expected.entry.key} className="flex items-center gap-3 p-4">
      <CalendarClock className="size-5 shrink-0 text-primary" />
      <span className="min-w-0 flex-1 text-sm">
        <span className="block text-xs text-muted-foreground">Dự kiến tiêm{expected.status === "upcoming" ? "" : ` · ${STATUS_LABEL[expected.status]}`}</span>
        <strong className="mt-1 block break-words font-medium">{expected.entry.label} · {formatDay(expected.expected!)} (chưa đặt hẹn)</strong>
        <span className="mt-1 block text-xs font-medium text-primary">Đặt hẹn ngày này</span>
      </span>
      <ChevronRight className="size-4 shrink-0" />
    </Link>}
  </div>;
}
