import { CalendarDays, Trash2 } from "lucide-react";
import { deleteMenstrualCycleAction, saveMenstrualCycleAction } from "@/app/actions";
import { CycleDashboard } from "@/components/cycle-dashboard";
import { Field, SelectField, TextAreaField } from "@/components/form-fields";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { averageCycleLength, estimatedFertileWindow, estimatedNextPeriod, periodStartsFromFlowLogs } from "@/features/mother/insights";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/i18n";

const dateInput = (date?: Date | null) => date?.toISOString().slice(0, 10) ?? "";
const dayMs = 86_400_000;

export default async function CyclePage() {
  const [user, locale] = await Promise.all([requireUser(), getLocale()]);
  const mother = await db.mother.findUnique({ where: { userId: user.id } });
  if (!mother) return <><PageHeader title="Chu kỳ kinh" backHref="/mother" /><p className="text-sm text-muted-foreground">Hãy tạo hồ sơ mẹ trước.</p></>;

  const [cycles, dailyLogs] = await Promise.all([
    db.menstrualCycle.findMany({ where: { motherId: mother.id }, orderBy: { periodStart: "desc" }, take: 24 }),
    db.motherDailyHealthLog.findMany({ where: { motherId: mother.id }, orderBy: { loggedAt: "desc" }, take: 370 }),
  ]);
  const flowStarts = periodStartsFromFlowLogs(dailyLogs.filter((log) => log.flow).map((log) => log.loggedAt));
  const allStarts = [...new Map([...cycles.map((cycle) => cycle.periodStart), ...flowStarts].map((date) => [dateInput(date), date])).values()];
  const average = averageCycleLength(allStarts);
  const next = estimatedNextPeriod(allStarts);
  const fertile = allStarts.length >= 2 ? estimatedFertileWindow(next) : undefined;
  const now = new Date();
  const currentStart = allStarts.filter((date) => date <= now).sort((a, b) => b.getTime() - a.getTime())[0];
  const currentCycleDay = currentStart ? Math.floor((now.getTime() - currentStart.getTime()) / dayMs) + 1 : undefined;

  return (
    <>
      <PageHeader title="Chu kỳ của mẹ" subtitle="Lịch, dự báo và nhật ký cơ thể mỗi ngày" backHref="/mother" />
      <CycleDashboard
        motherId={mother.id}
        averageCycle={average}
        currentCycleDay={currentCycleDay}
        nextPeriod={dateInput(next)}
        fertileStart={dateInput(fertile?.start)}
        fertileEnd={dateInput(fertile?.end)}
        ovulation={dateInput(fertile?.ovulation)}
        periodRanges={cycles.map((cycle) => ({ start: dateInput(cycle.periodStart), end: dateInput(cycle.periodEnd ?? cycle.periodStart) }))}
        logs={dailyLogs.map((log) => ({
          id: log.id,
          date: dateInput(log.loggedAt),
          flow: log.flow ?? undefined,
          symptoms: log.symptoms,
          moods: log.moods,
          discharge: log.discharge ?? undefined,
          sleepHours: log.sleepHours ?? undefined,
          basalTemperatureC: log.basalTemperatureC ?? undefined,
          weightKg: log.weightKg ?? undefined,
          waterGlasses: log.waterGlasses ?? undefined,
          notes: log.notes ?? undefined,
        }))}
      />

      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Phân tích chu kỳ</h2><span className="text-xs text-muted-foreground">{cycles.length} kỳ đã xác nhận</span></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-4 shadow-sm"><p className="text-xs text-muted-foreground">Độ dài trung bình</p><strong className="mt-1 block text-xl">{average ? `${average} ngày` : "—"}</strong></div>
          <div className="rounded-2xl bg-card p-4 shadow-sm"><p className="text-xs text-muted-foreground">Kỳ tiếp theo</p><strong className="mt-1 block text-base">{next ? new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(next) : "Chưa đủ dữ liệu"}</strong></div>
        </div>
      </section>

      <details className="mt-5 rounded-2xl border bg-card p-4 shadow-sm">
        <summary className="cursor-pointer font-medium">Chỉnh ngày bắt đầu và kết thúc kỳ kinh</summary>
        <form action={saveMenstrualCycleAction} className="mt-5 space-y-4">
          <input type="hidden" name="motherId" value={mother.id} />
          <div className="grid gap-4 min-[430px]:grid-cols-2"><Field name="periodStart" type="date" required label="Ngày bắt đầu" /><Field name="periodEnd" type="date" label="Ngày kết thúc" /></div>
          <SelectField name="flow" label="Lượng kinh thường gặp"><option value="">Chưa ghi</option><option value="SPOTTING">Rỉ ít</option><option value="LIGHT">Ít</option><option value="MEDIUM">Vừa</option><option value="HEAVY">Nhiều</option></SelectField>
          <TextAreaField name="symptoms" label="Triệu chứng nổi bật" />
          <TextAreaField name="notes" label="Ghi chú" />
          <Button type="submit" className="h-11 w-full rounded-xl"><CalendarDays className="size-4" />Xác nhận kỳ kinh</Button>
        </form>
      </details>

      {cycles.length > 0 && <div className="mt-4 space-y-2">{cycles.map((cycle) => <div key={cycle.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm"><span className="grid size-10 place-items-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"><CalendarDays className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-medium">{new Intl.DateTimeFormat(locale, { day: "2-digit", month: "long", year: "numeric" }).format(cycle.periodStart)}</p><p className="text-xs text-muted-foreground">{cycle.periodEnd ? `Đến ${new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short" }).format(cycle.periodEnd)}` : "Chưa ghi ngày kết thúc"}</p></div><form action={deleteMenstrualCycleAction}><input type="hidden" name="id" value={cycle.id} /><Button type="submit" variant="ghost" size="icon" className="text-destructive"><Trash2 className="size-4" /></Button></form></div>)}</div>}
    </>
  );
}
