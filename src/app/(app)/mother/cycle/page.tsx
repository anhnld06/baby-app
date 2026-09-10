import Link from "next/link";
import { CalendarDays, Pencil, Settings2, Trash2 } from "lucide-react";
import {
  deleteMenstrualCycleAction,
  saveCycleSettingsAction,
  saveMenstrualCycleAction,
} from "@/app/actions";
import { CycleDashboard } from "@/components/cycle-dashboard";
import { Field, SelectField, TextAreaField } from "@/components/form-fields";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  analyzeCycles,
  averageCycleLength,
  estimatedFertileWindow,
  estimatedNextPeriod,
  periodStartsFromFlowLogs,
} from "@/features/mother/insights";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/i18n";

const dateInput = (date?: Date | null) => date?.toISOString().slice(0, 10) ?? "";
const dayMs = 86_400_000;

const confidenceLabel = {
  LOW: "Thấp",
  MEDIUM: "Trung bình",
  HIGH: "Cao",
} as const;

export default async function CyclePage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const [user, locale, params] = await Promise.all([requireUser(), getLocale(), searchParams]);
  const mother = await db.mother.findUnique({ where: { userId: user.id } });
  if (!mother) return <><PageHeader title="Chu kỳ kinh" backHref="/mother" /><p className="text-sm text-muted-foreground">Hãy tạo hồ sơ mẹ trước.</p></>;

  const [cycles, dailyLogs] = await Promise.all([
    db.menstrualCycle.findMany({ where: { motherId: mother.id }, orderBy: { periodStart: "desc" }, take: 24 }),
    db.motherDailyHealthLog.findMany({ where: { motherId: mother.id }, orderBy: { loggedAt: "desc" }, take: 370 }),
  ]);
  const editing = params.edit ? cycles.find((cycle) => cycle.id === params.edit) : undefined;
  const flowStarts = periodStartsFromFlowLogs(dailyLogs.filter((log) => log.flow).map((log) => log.loggedAt));
  const allStarts = [...new Map([...cycles.map((cycle) => cycle.periodStart), ...flowStarts].map((date) => [dateInput(date), date])).values()];
  const analysis = analyzeCycles(allStarts);
  const observedAverage = averageCycleLength(allStarts);
  const effectiveCycleLength = observedAverage ?? mother.cycleLengthDays;
  const next = estimatedNextPeriod(allStarts, mother.cycleLengthDays);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentStart = allStarts.filter((date) => date <= now).sort((a, b) => b.getTime() - a.getTime())[0];
  const currentCycleDay = currentStart ? Math.floor((now.getTime() - currentStart.getTime()) / dayMs) + 1 : undefined;
  const latestPositiveTest = dailyLogs.find((log) =>
    (log.ovulationTest === "POSITIVE" || log.ovulationTest === "PEAK") &&
    (!currentStart || log.loggedAt >= currentStart),
  )?.loggedAt;
  const predictionEligible = effectiveCycleLength >= 21 && effectiveCycleLength <= 60 && Boolean(next && next >= todayStart);
  const fertile = predictionEligible
    ? estimatedFertileWindow(next, mother.lutealPhaseDays, latestPositiveTest)
    : undefined;

  return (
    <>
      <PageHeader title="Chu kỳ của mẹ" subtitle="Lịch, dự báo và nhật ký cơ thể mỗi ngày" backHref="/mother" />
      <CycleDashboard
        motherId={mother.id}
        averageCycle={effectiveCycleLength}
        currentCycleDay={currentCycleDay}
        nextPeriod={dateInput(next)}
        predictedPeriodDays={mother.periodLengthDays}
        fertileStart={dateInput(fertile?.start)}
        fertileEnd={dateInput(fertile?.end)}
        ovulation={dateInput(fertile?.ovulation)}
        predictionConfidence={analysis.confidence}
        predictionUnavailable={!predictionEligible && allStarts.length > 0}
        cycleLengths={analysis.lengths.slice(-6)}
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
          ovulationTest: log.ovulationTest ?? undefined,
          weightKg: log.weightKg ?? undefined,
          waterGlasses: log.waterGlasses ?? undefined,
          notes: log.notes ?? undefined,
        }))}
      />

      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Phân tích chu kỳ</h2>
          <span className="text-xs text-muted-foreground">{allStarts.length} kỳ đã ghi</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">Độ dài trung bình</p>
            <strong className="mt-1 block text-xl">{effectiveCycleLength} ngày</strong>
            {!observedAverage && <span className="text-[11px] text-muted-foreground">Theo thiết lập</span>}
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">Độ tin cậy dự báo</p>
            <strong className="mt-1 block text-xl">{confidenceLabel[analysis.confidence]}</strong>
            <span className="text-[11px] text-muted-foreground">{analysis.lengths.length} khoảng chu kỳ</span>
          </div>
        </div>
        {analysis.irregular && (
          <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:bg-amber-950 dark:text-amber-100">
            Độ dài các chu kỳ gần đây chênh khoảng {analysis.variationDays} ngày. Dự báo rụng trứng có thể kém chính xác hơn.
          </p>
        )}
      </section>

      <details className="mt-5 rounded-2xl border bg-card p-4 shadow-sm">
        <summary className="flex cursor-pointer list-none items-center gap-2 font-medium"><Settings2 className="size-4" />Thiết lập dự báo cá nhân</summary>
        <form action={saveCycleSettingsAction} className="mt-5 space-y-4">
          <input type="hidden" name="motherId" value={mother.id} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field name="cycleLengthDays" type="number" min="15" max="60" required label="Chu kỳ thường dài (ngày)" defaultValue={mother.cycleLengthDays} />
            <Field name="periodLengthDays" type="number" min="1" max="15" required label="Kỳ kinh thường dài (ngày)" defaultValue={mother.periodLengthDays} />
            <Field name="lutealPhaseDays" type="number" min="7" max="20" required label="Pha hoàng thể (ngày)" defaultValue={mother.lutealPhaseDays} />
          </div>
          <p className="text-xs leading-5 text-muted-foreground">Khi có từ hai chu kỳ hợp lệ, lịch sử thực tế được ưu tiên hơn độ dài chu kỳ thiết lập.</p>
          <Button type="submit" className="h-11 w-full rounded-xl">Lưu thiết lập</Button>
        </form>
      </details>

      <details open={Boolean(editing)} className="mt-5 rounded-2xl border bg-card p-4 shadow-sm">
        <summary className="cursor-pointer font-medium">{editing ? "Chỉnh sửa kỳ kinh" : "Thêm kỳ kinh theo khoảng ngày"}</summary>
        <form action={saveMenstrualCycleAction} className="mt-5 space-y-4">
          <input type="hidden" name="motherId" value={mother.id} />
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="periodStart" type="date" required label="Ngày bắt đầu" defaultValue={dateInput(editing?.periodStart)} />
            <Field name="periodEnd" type="date" label="Ngày kết thúc" defaultValue={dateInput(editing?.periodEnd)} />
          </div>
          <SelectField name="flow" label="Lượng kinh thường gặp" defaultValue={editing?.flow ?? ""}>
            <option value="">Chưa ghi</option><option value="SPOTTING">Rỉ ít</option><option value="LIGHT">Ít</option><option value="MEDIUM">Vừa</option><option value="HEAVY">Nhiều</option>
          </SelectField>
          <TextAreaField name="symptoms" label="Triệu chứng nổi bật" defaultValue={editing?.symptoms ?? ""} />
          <TextAreaField name="notes" label="Ghi chú" defaultValue={editing?.notes ?? ""} />
          <div className="flex gap-2">
            {editing && <Link href="/mother/cycle" className="grid h-11 place-items-center rounded-xl border px-4 text-sm font-medium">Hủy</Link>}
            <Button type="submit" className="h-11 flex-1 rounded-xl"><CalendarDays className="size-4" />{editing ? "Cập nhật kỳ kinh" : "Xác nhận kỳ kinh"}</Button>
          </div>
        </form>
      </details>

      {cycles.length > 0 && (
        <div className="mt-4 space-y-2">
          {cycles.map((cycle) => (
            <div key={cycle.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm">
              <span className="grid size-10 place-items-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"><CalendarDays className="size-4" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{new Intl.DateTimeFormat(locale, { day: "2-digit", month: "long", year: "numeric" }).format(cycle.periodStart)}</p>
                <p className="text-xs text-muted-foreground">{cycle.periodEnd ? `Đến ${new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short" }).format(cycle.periodEnd)}` : "Chưa ghi ngày kết thúc"}</p>
              </div>
              <Link href={`/mother/cycle?edit=${cycle.id}`} aria-label="Sửa kỳ kinh" className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary"><Pencil className="size-4" /></Link>
              <form action={deleteMenstrualCycleAction}>
                <input type="hidden" name="id" value={cycle.id} />
                <Button type="submit" variant="ghost" size="icon" className="text-destructive"><Trash2 className="size-4" /></Button>
              </form>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
