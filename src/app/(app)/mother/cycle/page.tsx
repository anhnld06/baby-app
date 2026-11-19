import {
  EditFormTarget,
  EditRecordLink,
} from "@/components/edit-record-navigation";
import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Pencil,
  Plus,
  Settings2,
  Trash2,
} from "lucide-react";
import { CycleIcon } from "@/components/app-icons";
import {
  deleteMenstrualCycleAction,
  saveCycleSettingsAction,
  saveMenstrualCycleAction,
} from "@/app/actions";
import { ActionResultForm } from "@/components/action-result-form";
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

const dateInput = (date?: Date | null) => date?.toISOString().slice(0, 10) ?? "";
const dayMs = 86_400_000;

const confidenceLabel = {
  LOW: "Thấp",
  MEDIUM: "Trung bình",
  HIGH: "Cao",
} as const;

const flowLabels: Record<string, string> = {
  SPOTTING: "Rỉ ít",
  LIGHT: "Lượng ít",
  MEDIUM: "Lượng vừa",
  HEAVY: "Lượng nhiều",
};

export default async function CyclePage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const [user, params] = await Promise.all([requireUser(), searchParams]);
  const mother = await db.mother.findUnique({ where: { userId: user.id } });
  if (!mother)
    return (
      <>
        <PageHeader compact title="Chu kỳ kinh" backHref="/mother" />
        <p className="text-sm text-muted-foreground">Hãy tạo hồ sơ mẹ trước.</p>
      </>
    );

  const [cycles, dailyLogs] = await Promise.all([
    db.menstrualCycle.findMany({
      where: { motherId: mother.id },
      orderBy: { periodStart: "desc" },
      take: 24,
    }),
    db.motherDailyHealthLog.findMany({
      where: { motherId: mother.id },
      orderBy: { loggedAt: "desc" },
      take: 370,
    }),
  ]);
  const editing = params.edit
    ? await db.menstrualCycle.findFirst({
        where: { id: params.edit, motherId: mother.id },
      })
    : null;
  const flowStarts = periodStartsFromFlowLogs(
    dailyLogs.filter((log) => log.flow).map((log) => log.loggedAt),
  );
  const allStarts = [
    ...new Map(
      [...cycles.map((cycle) => cycle.periodStart), ...flowStarts].map(
        (date) => [dateInput(date), date],
      ),
    ).values(),
  ];
  const analysis = analyzeCycles(allStarts);
  const observedAverage = averageCycleLength(allStarts);
  const effectiveCycleLength = observedAverage ?? mother.cycleLengthDays;
  const next = estimatedNextPeriod(allStarts, mother.cycleLengthDays);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentStart = allStarts
    .filter((date) => date <= now)
    .sort((a, b) => b.getTime() - a.getTime())[0];
  const currentCycleDay = currentStart
    ? Math.floor((now.getTime() - currentStart.getTime()) / dayMs) + 1
    : undefined;
  const latestPositiveTest = dailyLogs.find(
    (log) =>
      (log.ovulationTest === "POSITIVE" || log.ovulationTest === "PEAK") &&
      (!currentStart || log.loggedAt >= currentStart),
  )?.loggedAt;
  const predictionEligible =
    effectiveCycleLength >= 21 &&
    effectiveCycleLength <= 60 &&
    Boolean(next && next >= todayStart);
  const fertile = predictionEligible
    ? estimatedFertileWindow(next, mother.lutealPhaseDays, latestPositiveTest)
    : undefined;

  return (
    <>
      <PageHeader
        compact
        illustration="cycle"
        title="Chu kỳ của mẹ"
        subtitle="Lịch, dự báo sinh học và nhật ký cơ thể mỗi ngày"
        backHref="/mother"
      />
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
        periodRanges={cycles.map((cycle) => ({
          start: dateInput(cycle.periodStart),
          end: dateInput(cycle.periodEnd ?? cycle.periodStart),
        }))}
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
          <span className="text-xs text-muted-foreground">
            {allStarts.length} kỳ đã ghi
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="surface-panel p-4">
            <p className="text-xs text-muted-foreground">Độ dài trung bình</p>
            <strong className="mt-1.5 block text-2xl font-semibold tracking-tight tabular-nums">
              {effectiveCycleLength} ngày
            </strong>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              {observedAverage ? "Từ lịch sử thực tế" : "Theo thiết lập"}
            </span>
          </div>
          <div className="surface-panel p-4">
            <p className="text-xs text-muted-foreground">Độ tin cậy dự báo</p>
            <strong className="mt-1.5 block text-2xl font-semibold tracking-tight">
              {confidenceLabel[analysis.confidence]}
            </strong>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              {analysis.lengths.length} khoảng chu kỳ
            </span>
          </div>
        </div>
        {analysis.irregular && (
          <p className="mt-3 rounded-2xl border border-amber-200/70 bg-amber-50 p-3.5 text-xs leading-5 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/70 dark:text-amber-100">
            Độ dài các chu kỳ gần đây chênh khoảng {analysis.variationDays} ngày.
            Dự báo rụng trứng có thể kém chính xác hơn.
          </p>
        )}
      </section>

      <details className="surface-panel group mt-5 p-4">
        <summary className="flex min-h-10 cursor-pointer list-none items-center gap-3 font-medium [&::-webkit-details-marker]:hidden">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
            <Settings2 className="size-4" />
          </span>
          <span className="flex-1 text-sm font-semibold">
            Thiết lập dự báo cá nhân
          </span>
          <ChevronRight className="size-4 text-muted-foreground transition-transform group-open:rotate-90" />
        </summary>
        <ActionResultForm
          action={saveCycleSettingsAction}
          className="mt-4 space-y-4 border-t border-border/60 pt-4"
        >
          <input type="hidden" name="motherId" value={mother.id} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              name="cycleLengthDays"
              type="number"
              min="15"
              max="60"
              required
              label="Chu kỳ thường dài (ngày)"
              defaultValue={mother.cycleLengthDays}
            />
            <Field
              name="periodLengthDays"
              type="number"
              min="1"
              max="15"
              required
              label="Kỳ kinh thường dài (ngày)"
              defaultValue={mother.periodLengthDays}
            />
            <Field
              name="lutealPhaseDays"
              type="number"
              min="7"
              max="20"
              required
              label="Pha hoàng thể (ngày)"
              defaultValue={mother.lutealPhaseDays}
            />
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            Khi có từ hai chu kỳ hợp lệ, lịch sử thực tế được ưu tiên hơn độ dài
            chu kỳ thiết lập.
          </p>
          <Button type="submit" className="h-11 w-full rounded-xl">
            Lưu thiết lập
          </Button>
        </ActionResultForm>
      </details>

      <EditFormTarget recordId={editing?.id}>
        <details
          open={Boolean(editing)}
          className="surface-panel group mt-4 p-4"
        >
          <summary className="flex min-h-10 cursor-pointer list-none items-center gap-3 font-medium [&::-webkit-details-marker]:hidden">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-rose-100 text-[#9c3b4c] dark:bg-rose-950 dark:text-rose-200">
              <Plus className="size-4" />
            </span>
            <span className="flex-1 text-sm font-semibold">
              {editing ? "Chỉnh sửa kỳ kinh" : "Thêm kỳ kinh theo khoảng ngày"}
            </span>
            <ChevronRight className="size-4 text-muted-foreground transition-transform group-open:rotate-90" />
          </summary>
          <ActionResultForm
            action={saveMenstrualCycleAction}
            className="mt-4 space-y-4 border-t border-border/60 pt-4"
          >
            <input type="hidden" name="motherId" value={mother.id} />
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                name="periodStart"
                type="date"
                required
                label="Ngày bắt đầu"
                defaultValue={dateInput(editing?.periodStart)}
              />
              <Field
                name="periodEnd"
                type="date"
                label="Ngày kết thúc"
                defaultValue={dateInput(editing?.periodEnd)}
              />
            </div>
            <SelectField
              name="flow"
              label="Lượng kinh thường gặp"
              defaultValue={editing?.flow ?? ""}
            >
              <option value="">Chưa ghi</option>
              <option value="SPOTTING">Rỉ ít</option>
              <option value="LIGHT">Ít</option>
              <option value="MEDIUM">Vừa</option>
              <option value="HEAVY">Nhiều</option>
            </SelectField>
            <TextAreaField
              name="symptoms"
              label="Triệu chứng nổi bật"
              defaultValue={editing?.symptoms ?? ""}
            />
            <TextAreaField
              name="notes"
              label="Ghi chú"
              defaultValue={editing?.notes ?? ""}
            />
            <div className="flex gap-2">
              {editing && (
                <Link
                  href="/mother/cycle"
                  className="grid h-11 place-items-center rounded-xl border px-4 text-sm font-medium"
                >
                  Hủy
                </Link>
              )}
              <Button type="submit" className="h-11 flex-1 rounded-xl">
                <CalendarDays className="size-4" />
                {editing ? "Cập nhật kỳ kinh" : "Xác nhận kỳ kinh"}
              </Button>
            </div>
          </ActionResultForm>
        </details>
      </EditFormTarget>

      {cycles.length > 0 && (
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Lịch sử các kỳ đã ghi</h2>
            <span className="text-xs text-muted-foreground">
              {cycles.length} bản ghi
            </span>
          </div>
          <div className="space-y-2.5">
            {cycles.map((cycle) => {
              const durationDays = cycle.periodEnd
                ? Math.max(
                    1,
                    Math.round(
                      (cycle.periodEnd.getTime() - cycle.periodStart.getTime()) /
                        dayMs,
                    ) + 1,
                  )
                : null;
              return (
                <div
                  key={cycle.id}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-xs transition-colors hover:border-rose-200 dark:hover:border-rose-900/60"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-rose-50 dark:bg-rose-950/60">
                    <CycleIcon className="size-9" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">
                        {new Intl.DateTimeFormat("vi-VN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }).format(cycle.periodStart)}
                      </p>
                      {durationDays != null && (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-medium text-[#9c3b4c] dark:bg-rose-950 dark:text-rose-200">
                          {durationDays} ngày
                        </span>
                      )}
                      {cycle.flow && flowLabels[cycle.flow] && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                          {flowLabels[cycle.flow]}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {cycle.periodEnd
                        ? `Đến ${new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }).format(cycle.periodEnd)}`
                        : "Chưa ghi ngày kết thúc"}
                    </p>
                    {(cycle.symptoms || cycle.notes) && (
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {[cycle.symptoms, cycle.notes].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <EditRecordLink
                    href={`/mother/cycle?edit=${cycle.id}`}
                    aria-label="Sửa kỳ kinh"
                    className="grid size-11 place-items-center rounded-xl text-muted-foreground hover:bg-secondary"
                  >
                    <Pencil className="size-4" />
                  </EditRecordLink>
                  <form action={deleteMenstrualCycleAction}>
                    <input type="hidden" name="id" value={cycle.id} />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      aria-label="Xóa kỳ kinh"
                      className="size-11 text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </form>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
