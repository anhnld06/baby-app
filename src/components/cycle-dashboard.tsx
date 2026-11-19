"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Printer,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  deleteMotherDailyHealthLogAction,
  saveMotherDailyHealthLogAction,
} from "@/app/actions";
import { ActionResultForm } from "@/components/action-result-form";
import type { BiologicalPhase } from "@/components/cycle-orbital-canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const CycleOrbitalCanvas = dynamic(() => import("./cycle-orbital-canvas"), {
  ssr: false,
});

type DailyLog = {
  id: string;
  date: string;
  flow?: string;
  symptoms: string[];
  moods: string[];
  discharge?: string;
  sleepHours?: number;
  basalTemperatureC?: number;
  ovulationTest?: "NEGATIVE" | "POSITIVE" | "PEAK";
  weightKg?: number;
  waterGlasses?: number;
  notes?: string;
};

const symptomOptions = [
  "Đau bụng",
  "Đau lưng",
  "Đau đầu",
  "Đầy bụng",
  "Căng ngực",
  "Mệt mỏi",
  "Buồn nôn",
  "Thèm ăn",
  "Nổi mụn",
  "Mất ngủ",
  "Đau vùng chậu",
  "Khác",
];
const moodOptions = [
  "Bình yên",
  "Vui vẻ",
  "Nhiều năng lượng",
  "Nhạy cảm",
  "Lo âu",
  "Cáu gắt",
  "Buồn",
  "Căng thẳng",
];
const flowOptions = [
  { value: "", label: "Không có" },
  { value: "SPOTTING", label: "Rỉ ít" },
  { value: "LIGHT", label: "Ít" },
  { value: "MEDIUM", label: "Vừa" },
  { value: "HEAVY", label: "Nhiều" },
];
const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(key: string) {
  return new Date(`${key}T12:00:00`);
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function inRange(key: string, start?: string, end?: string) {
  return Boolean(start && end && key >= start && key <= end);
}

function SaveDailyButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-11 flex-1 rounded-xl">
      <Save className="size-4" />
      {pending ? "Đang lưu…" : "Lưu nhật ký ngày"}
    </Button>
  );
}

export function CycleDashboard({
  motherId,
  averageCycle,
  currentCycleDay,
  nextPeriod,
  predictedPeriodDays,
  fertileStart,
  fertileEnd,
  ovulation,
  predictionConfidence,
  predictionUnavailable,
  cycleLengths,
  periodRanges,
  logs,
}: {
  motherId: string;
  averageCycle?: number;
  currentCycleDay?: number;
  nextPeriod?: string;
  predictedPeriodDays: number;
  fertileStart?: string;
  fertileEnd?: string;
  ovulation?: string;
  predictionConfidence: "LOW" | "MEDIUM" | "HIGH";
  predictionUnavailable: boolean;
  cycleLengths: number[];
  periodRanges: { start: string; end: string }[];
  logs: DailyLog[];
}) {
  const today = new Date();
  const todayKey = dateKey(today);
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selected, setSelected] = useState(todayKey);
  const [orbitalReady, setOrbitalReady] = useState(false);
  const logsByDate = useMemo(
    () => new Map(logs.map((log) => [log.date, log])),
    [logs],
  );
  const selectedLog = logsByDate.get(selected);

  const calendarDays = useMemo(() => {
    const first = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      1,
    );
    const mondayOffset = (first.getDay() + 6) % 7;
    const start = addDays(first, -mondayOffset);
    return Array.from({ length: 42 }, (_, index) => addDays(start, index));
  }, [visibleMonth]);

  const todayIsPeriod =
    periodRanges.some((range) => inRange(todayKey, range.start, range.end)) ||
    Boolean(logsByDate.get(todayKey)?.flow);
  const todayInFertile = inRange(todayKey, fertileStart, fertileEnd);

  const phase: BiologicalPhase = todayIsPeriod
    ? "period"
    : todayInFertile
      ? "fertile"
      : currentCycleDay && averageCycle && currentCycleDay > averageCycle * 0.54
        ? "luteal"
        : "follicular";

  const phaseBadgeLabel: Record<BiologicalPhase, string> = {
    period: "Pha hành kinh",
    follicular: "Pha nang noãn",
    fertile: "Cửa sổ dễ thụ thai",
    luteal: "Pha hoàng thể",
  };

  const status = todayIsPeriod
    ? "Đang trong kỳ kinh"
    : todayInFertile
      ? "Cửa sổ dễ thụ thai ước tính"
      : currentCycleDay
        ? `Ngày ${currentCycleDay} của chu kỳ`
        : "Bắt đầu bằng cách ghi kỳ kinh";

  const progress =
    averageCycle && currentCycleDay
      ? Math.min(100, Math.max(4, (currentCycleDay / averageCycle) * 100))
      : 6;

  const daysToPeriod = nextPeriod
    ? Math.ceil(
        (parseDate(nextPeriod).getTime() - parseDate(todayKey).getTime()) /
          86_400_000,
      )
    : undefined;

  const predictionText = predictionUnavailable
    ? "Tạm ẩn dự báo rụng trứng vì chu kỳ đang trễ hoặc nằm ngoài khoảng dự báo an toàn."
    : daysToPeriod === undefined
      ? "Ghi ít nhất 2 kỳ để có dự báo cá nhân chính xác hơn."
      : daysToPeriod < 0
        ? `Đã qua ngày dự kiến ${Math.abs(daysToPeriod)} ngày.`
        : daysToPeriod === 0
          ? "Kỳ tiếp theo dự kiến bắt đầu hôm nay."
          : `Còn khoảng ${daysToPeriod} ngày đến kỳ tiếp theo.`;

  const isCurrentMonth =
    visibleMonth.getFullYear() === today.getFullYear() &&
    visibleMonth.getMonth() === today.getMonth();

  return (
    <>
      <section className="relative mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#6f273d] via-[#8c3550] to-[#a64660] p-5 text-white shadow-lg shadow-rose-950/15 sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-14 -top-14 size-52 rounded-full bg-white/8 blur-2xl"
        />
        <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
          <div className="relative grid size-36 shrink-0 place-items-center sm:size-40">
            {!orbitalReady && (
              <div
                aria-hidden="true"
                className="absolute inset-2 rounded-full"
                style={{
                  background: `conic-gradient(rgba(255,255,255,.95) ${progress}%, rgba(255,255,255,.2) ${progress}% 100%)`,
                  maskImage:
                    "radial-gradient(circle, transparent 58%, black 60%)",
                  WebkitMaskImage:
                    "radial-gradient(circle, transparent 58%, black 60%)",
                }}
              />
            )}
            <div className="absolute inset-0">
              <CycleOrbitalCanvas
                progress={progress}
                phase={phase}
                onReady={() => setOrbitalReady(true)}
              />
            </div>
            <div className="relative z-10 text-center">
              {currentCycleDay ? (
                <>
                  <strong className="block text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
                    {currentCycleDay}
                  </strong>
                  <span className="mt-0.5 block text-[11px] font-medium text-rose-50/95">
                    {averageCycle ? `/ ${averageCycle} ngày` : "ngày chu kỳ"}
                  </span>
                </>
              ) : (
                <CalendarDays className="mx-auto size-7 text-rose-50" />
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/14 px-3 py-1 text-xs font-medium text-white">
              <Sparkles className="size-3.5" />
              {currentCycleDay ? phaseBadgeLabel[phase] : "Lắng nghe cơ thể"}
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-[1.65rem]">
              {status}
            </h2>
            <p className="mt-2 text-sm leading-6 text-rose-50/95">
              {predictionText}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5 text-[11px] text-rose-50/90 sm:justify-start">
              <span className="rounded-full bg-white/12 px-2.5 py-1">
                Kinh nguyệt ~{predictedPeriodDays} ngày
              </span>
              {averageCycle && (
                <span className="rounded-full bg-white/12 px-2.5 py-1">
                  Chu kỳ ~{averageCycle} ngày
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelected(todayKey);
            setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
            document
              .getElementById("daily-cycle-log")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="relative mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#6f273d] shadow-xs transition-transform active:scale-[.99]"
        >
          <Plus className="size-4" />
          Ghi triệu chứng hôm nay
        </button>
      </section>

      <section className="surface-panel mb-5 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label="Tháng trước"
            onClick={() =>
              setVisibleMonth(
                new Date(
                  visibleMonth.getFullYear(),
                  visibleMonth.getMonth() - 1,
                  1,
                ),
              )
            }
            className="grid size-10 place-items-center rounded-full border border-border/70 bg-muted/50 transition-colors hover:bg-secondary"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold capitalize">
              {new Intl.DateTimeFormat("vi", {
                month: "long",
                year: "numeric",
              }).format(visibleMonth)}
            </h2>
            {!isCurrentMonth && (
              <button
                type="button"
                onClick={() => {
                  setVisibleMonth(
                    new Date(today.getFullYear(), today.getMonth(), 1),
                  );
                  setSelected(todayKey);
                }}
                className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-primary"
              >
                Hôm nay
              </button>
            )}
          </div>
          <button
            type="button"
            aria-label="Tháng sau"
            onClick={() =>
              setVisibleMonth(
                new Date(
                  visibleMonth.getFullYear(),
                  visibleMonth.getMonth() + 1,
                  1,
                ),
              )
            }
            className="grid size-10 place-items-center rounded-full border border-border/70 bg-muted/50 transition-colors hover:bg-secondary"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 text-center">
          {weekDays.map((day) => (
            <span
              key={day}
              className="pb-2 text-xs font-semibold text-muted-foreground"
            >
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1.5">
          {calendarDays.map((date) => {
            const key = dateKey(date);
            const inMonth = date.getMonth() === visibleMonth.getMonth();
            const log = logsByDate.get(key);
            const actualPeriod =
              Boolean(log?.flow) ||
              periodRanges.some((range) => inRange(key, range.start, range.end));
            const predictedPeriod =
              !actualPeriod && nextPeriod
                ? inRange(
                    key,
                    nextPeriod,
                    dateKey(addDays(parseDate(nextPeriod), predictedPeriodDays - 1)),
                  )
                : false;
            const fertile =
              !actualPeriod && inRange(key, fertileStart, fertileEnd);
            const ovulationDay = key === ovulation;

            return (
              <button
                type="button"
                key={key}
                onClick={() => setSelected(key)}
                className={cn(
                  "relative mx-auto grid size-10 place-items-center rounded-full tabular-nums transition-[background-color,transform] active:scale-95",
                  inMonth
                    ? "text-sm font-medium text-foreground"
                    : "text-xs text-muted-foreground",
                  key === selected &&
                    "ring-2 ring-primary ring-offset-2 ring-offset-card",
                  actualPeriod && "bg-[#c65365] font-semibold text-white shadow-xs",
                  predictedPeriod &&
                    "border border-dashed border-[#c65365]/70 bg-rose-50 text-[#9c3b4c] dark:bg-rose-950/70 dark:text-rose-200",
                  fertile &&
                    "bg-teal-50 font-medium text-teal-800 dark:bg-teal-950/70 dark:text-teal-200",
                  ovulationDay && "ring-2 ring-teal-500",
                  key === todayKey &&
                    !actualPeriod &&
                    "bg-secondary/70 font-bold text-primary",
                )}
              >
                {date.getDate()}
                {log && (
                  <span
                    className={cn(
                      "absolute bottom-1 size-1 rounded-full bg-primary",
                      actualPeriod && "bg-white",
                      (log.ovulationTest === "POSITIVE" ||
                        log.ovulationTest === "PEAK") &&
                        "size-1.5 bg-teal-600",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-border/60 pt-3.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-full bg-[#c65365]" />
            Kỳ kinh đã ghi
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-full border border-dashed border-[#c65365] bg-rose-50 dark:bg-rose-950" />
            Kỳ dự kiến
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-full bg-teal-300 dark:bg-teal-600" />
            Dễ thụ thai ước tính
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-full ring-2 ring-teal-500" />
            Rụng trứng dự kiến
          </span>
        </div>
      </section>

      <section className="surface-panel mb-5 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold">Xu hướng độ dài chu kỳ</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {cycleLengths.length
                ? `${cycleLengths.length} chu kỳ gần nhất · độ tin cậy ${predictionConfidence === "HIGH" ? "cao" : predictionConfidence === "MEDIUM" ? "trung bình" : "thấp"}`
                : "Ghi từ 2 kỳ kinh trở lên để xem biểu đồ xu hướng độ dài chu kỳ."}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl print:hidden"
            onClick={() => window.print()}
          >
            <Printer className="size-4" />
            In báo cáo
          </Button>
        </div>
        {cycleLengths.length > 0 && (
          <div
            className="mt-4 rounded-2xl bg-muted/35 p-4"
            aria-label="Biểu đồ độ dài chu kỳ"
          >
            <div className="mb-3 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Khoảng tham khảo phổ biến: 21–35 ngày</span>
              {averageCycle && <span>Trung bình: {averageCycle} ngày</span>}
            </div>
            <div className="flex h-36 items-end gap-2.5 pt-4">
              {cycleLengths.map((length, index) => {
                const outOfRange = length < 21 || length > 35;
                return (
                  <div
                    key={`${index}-${length}`}
                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end text-center"
                  >
                    <span className="mb-1.5 rounded-md bg-card px-1.5 py-0.5 text-xs font-semibold tabular-nums shadow-2xs">
                      {length}n
                    </span>
                    <span
                      className={cn(
                        "w-full max-w-11 rounded-t-xl rounded-b-sm transition-all",
                        outOfRange
                          ? "bg-gradient-to-t from-amber-500 to-amber-300"
                          : "bg-gradient-to-t from-[#c65365] to-[#e99dad]",
                      )}
                      style={{
                        height: `${Math.max(20, Math.min(100, (length / 45) * 100))}%`,
                      }}
                    />
                    <span className="mt-1.5 text-xs font-medium text-muted-foreground">
                      K{index + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section
        id="daily-cycle-log"
        className="surface-panel scroll-mt-28 p-5"
      >
        <div className="mb-5 flex items-start justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">
              Nhật ký cơ thể theo ngày
            </p>
            <h2 className="mt-1 text-lg font-semibold capitalize">
              {new Intl.DateTimeFormat("vi", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              }).format(parseDate(selected))}
            </h2>
          </div>
          {selectedLog && (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-primary">
              Đã ghi
            </span>
          )}
        </div>

        <ActionResultForm
          key={`${selected}-${selectedLog?.id ?? "new"}`}
          action={saveMotherDailyHealthLogAction}
          className="space-y-6"
        >
          <input type="hidden" name="motherId" value={motherId} />
          <input type="hidden" name="loggedAt" value={selected} />

          <fieldset>
            <legend className="mb-2.5 text-sm font-semibold">Lượng kinh</legend>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {flowOptions.map((option) => (
                <label key={option.value || "none"} className="cursor-pointer">
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="flow"
                    value={option.value}
                    defaultChecked={(selectedLog?.flow ?? "") === option.value}
                  />
                  <span className="flex min-h-11 items-center justify-center rounded-xl border border-border/70 bg-muted/30 px-1 text-center text-xs text-muted-foreground transition-colors peer-checked:border-[#c65365] peer-checked:bg-rose-50 peer-checked:font-semibold peer-checked:text-[#9c3b4c] dark:peer-checked:bg-rose-950/80 dark:peer-checked:text-rose-200">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <ChipGroup
            name="symptoms"
            title="Triệu chứng cơ thể"
            options={symptomOptions}
            selected={selectedLog?.symptoms ?? []}
          />
          <ChipGroup
            name="moods"
            title="Tâm trạng hôm nay"
            options={moodOptions}
            selected={selectedLog?.moods ?? []}
          />

          <div className="space-y-4 rounded-2xl border border-border/60 bg-muted/35 p-4">
            <p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">
              Dấu hiệu sinh học & chỉ số trong ngày
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="discharge">Dịch âm đạo</Label>
                <select
                  id="discharge"
                  name="discharge"
                  defaultValue={selectedLog?.discharge ?? ""}
                  className="h-11 w-full rounded-xl border bg-card px-3 text-sm"
                >
                  <option value="">Không ghi</option>
                  <option value="DRY">Khô / ít</option>
                  <option value="CREAMY">Dạng kem</option>
                  <option value="WATERY">Loãng</option>
                  <option value="EGG_WHITE">
                    Trong, dai như lòng trắng trứng
                  </option>
                  <option value="UNUSUAL">Khác thường</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ovulationTest">Que thử rụng trứng (LH)</Label>
                <select
                  id="ovulationTest"
                  name="ovulationTest"
                  defaultValue={selectedLog?.ovulationTest ?? ""}
                  className="h-11 w-full rounded-xl border bg-card px-3 text-sm"
                >
                  <option value="">Chưa thử / không ghi</option>
                  <option value="NEGATIVE">Âm tính</option>
                  <option value="POSITIVE">Dương tính</option>
                  <option value="PEAK">Đỉnh LH</option>
                </select>
              </div>
            </div>
            <p className="text-xs leading-4 text-muted-foreground">
              Kết quả dương tính hoặc đỉnh LH sẽ điều chỉnh ngày rụng trứng ước
              tính của chu kỳ hiện tại.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricField
                name="sleepHours"
                label="Ngủ (giờ)"
                step="0.1"
                max="24"
                value={selectedLog?.sleepHours}
              />
              <MetricField
                name="basalTemperatureC"
                label="Nhiệt độ (°C)"
                step="0.01"
                min="30"
                max="45"
                value={selectedLog?.basalTemperatureC}
              />
              <MetricField
                name="weightKg"
                label="Cân nặng (kg)"
                step="0.1"
                value={selectedLog?.weightKg}
              />
              <MetricField
                name="waterGlasses"
                label="Nước (ly)"
                step="1"
                max="100"
                value={selectedLog?.waterGlasses}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="daily-notes">Ghi chú thêm</Label>
            <Textarea
              id="daily-notes"
              name="notes"
              className="min-h-20 rounded-xl bg-muted/30"
              defaultValue={selectedLog?.notes ?? ""}
              placeholder="Điều gì đáng chú ý về cơ thể hoặc giấc ngủ hôm nay?"
            />
          </div>

          <div className="flex gap-2">
            <SaveDailyButton />
            {selectedLog && (
              <Button
                type="submit"
                data-own-action
                formAction={deleteMotherDailyHealthLogAction}
                name="id"
                value={selectedLog.id}
                variant="destructive"
                className="h-11 rounded-xl"
                aria-label="Xóa nhật ký ngày"
                onClick={(event) => {
                  if (
                    !window.confirm(
                      "Xóa nhật ký ngày này? Hành động này không thể hoàn tác.",
                    )
                  )
                    event.preventDefault();
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        </ActionResultForm>
      </section>

      <p className="mt-4 flex gap-2 rounded-2xl bg-secondary/60 p-3 text-xs leading-5 text-muted-foreground">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
        Ngày rụng trứng và cửa sổ dễ thụ thai chỉ là ước tính từ lịch chu kỳ, có
        thể sai ngay cả khi chu kỳ đều. Không dùng dự báo này như biện pháp tránh
        thai hoặc chẩn đoán.
      </p>
    </>
  );
}

function ChipGroup({
  name,
  title,
  options,
  selected,
}: {
  name: string;
  title: string;
  options: string[];
  selected: string[];
}) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-sm font-semibold">{title}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input
              type="checkbox"
              name={name}
              value={option}
              defaultChecked={selected.includes(option)}
              className="peer sr-only"
            />
            <span className="block rounded-full border border-border/70 bg-muted/25 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted/60 peer-checked:border-primary peer-checked:bg-secondary peer-checked:font-medium peer-checked:text-primary">
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function MetricField({
  name,
  label,
  value,
  step,
  min = "0",
  max,
}: {
  name: string;
  label: string;
  value?: number;
  step: string;
  min?: string;
  max?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-xs">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        defaultValue={value ?? ""}
        className="h-11 rounded-xl bg-card"
      />
    </div>
  );
}
