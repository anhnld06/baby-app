import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";

export function UpcomingVaccination({ appointment }: {
  appointment?: { vaccineName: string; scheduledAt: Date } | null;
}) {
  if (!appointment) return null;
  const day = new Intl.DateTimeFormat("vi", { timeZone: "UTC", day: "2-digit", month: "2-digit" }).format(appointment.scheduledAt);
  return <Link href="/vaccination-schedule" className="mt-4 flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4">
    <CalendarDays className="size-5 shrink-0 text-primary" />
    <span className="min-w-0 flex-1 text-sm"><span className="block text-xs text-muted-foreground">Lịch tiêm đã hẹn</span><strong className="mt-1 block break-words font-medium">{appointment.vaccineName} · {day}</strong></span>
    <ChevronRight className="size-4 shrink-0" />
  </Link>;
}
