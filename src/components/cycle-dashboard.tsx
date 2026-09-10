"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import { deleteMotherDailyHealthLogAction, saveMotherDailyHealthLogAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type DailyLog = {
  id: string;
  date: string;
  flow?: string;
  symptoms: string[];
  moods: string[];
  discharge?: string;
  sleepHours?: number;
  basalTemperatureC?: number;
  weightKg?: number;
  waterGlasses?: number;
  notes?: string;
};

const symptomOptions = ["Đau bụng", "Đau lưng", "Đau đầu", "Đầy bụng", "Căng ngực", "Mệt mỏi", "Buồn nôn", "Thèm ăn", "Nổi mụn", "Mất ngủ", "Đau vùng chậu", "Khác"];
const moodOptions = ["Bình yên", "Vui vẻ", "Nhiều năng lượng", "Nhạy cảm", "Lo âu", "Cáu gắt", "Buồn", "Căng thẳng"];
const flowOptions = [{ value: "SPOTTING", label: "Rỉ ít" }, { value: "LIGHT", label: "Ít" }, { value: "MEDIUM", label: "Vừa" }, { value: "HEAVY", label: "Nhiều" }];
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
  return <Button type="submit" disabled={pending} className="h-11 flex-1 rounded-xl"><Save className="size-4" />{pending ? "Đang lưu…" : "Lưu nhật ký ngày"}</Button>;
}

export function CycleDashboard({
  motherId,
  averageCycle,
  currentCycleDay,
  nextPeriod,
  fertileStart,
  fertileEnd,
  ovulation,
  periodRanges,
  logs,
}: {
  motherId: string;
  averageCycle?: number;
  currentCycleDay?: number;
  nextPeriod?: string;
  fertileStart?: string;
  fertileEnd?: string;
  ovulation?: string;
  periodRanges: { start: string; end: string }[];
  logs: DailyLog[];
}) {
  const today = new Date();
  const todayKey = dateKey(today);
  const [visibleMonth, setVisibleMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(todayKey);
  const logsByDate = useMemo(() => new Map(logs.map((log) => [log.date, log])), [logs]);
  const selectedLog = logsByDate.get(selected);

  const calendarDays = useMemo(() => {
    const first = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const mondayOffset = (first.getDay() + 6) % 7;
    const start = addDays(first, -mondayOffset);
    return Array.from({ length: 42 }, (_, index) => addDays(start, index));
  }, [visibleMonth]);

  const todayIsPeriod = periodRanges.some((range) => inRange(todayKey, range.start, range.end)) || Boolean(logsByDate.get(todayKey)?.flow);
  const todayInFertile = inRange(todayKey, fertileStart, fertileEnd);
  const status = todayIsPeriod ? "Đang trong kỳ kinh" : todayInFertile ? "Cửa sổ dễ thụ thai ước tính" : currentCycleDay ? `Ngày ${currentCycleDay} của chu kỳ` : "Bắt đầu bằng cách ghi kỳ kinh";
  const progress = averageCycle && currentCycleDay ? Math.min(100, Math.max(3, (currentCycleDay / averageCycle) * 100)) : 4;
  const daysToPeriod = nextPeriod ? Math.ceil((parseDate(nextPeriod).getTime() - parseDate(todayKey).getTime()) / 86_400_000) : undefined;
  const predictionText = daysToPeriod === undefined
    ? "Ghi ít nhất 2 kỳ để có dự báo cá nhân"
    : daysToPeriod < 0
      ? `Đã qua ngày dự kiến ${Math.abs(daysToPeriod)} ngày`
      : daysToPeriod === 0
        ? "Kỳ tiếp theo dự kiến hôm nay"
        : `Còn khoảng ${daysToPeriod} ngày đến kỳ tiếp theo`;

  return (
    <>
      <section className="relative mb-5 overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 p-5 text-white shadow-xl shadow-rose-500/20">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
        <div className="relative flex items-center gap-5">
          <div className="relative grid size-32 shrink-0 place-items-center rounded-full bg-white/15" style={{ background: `conic-gradient(rgba(255,255,255,.95) ${progress}%, rgba(255,255,255,.18) ${progress}% 100%)` }}>
            <div className="grid size-[7rem] place-items-center rounded-full bg-rose-500/90 text-center backdrop-blur">
              <div>{currentCycleDay ? <><strong className="block text-3xl">{currentCycleDay}</strong><span className="text-[11px] opacity-85">ngày chu kỳ</span></> : <CalendarDays className="size-7" />}</div>
            </div>
          </div>
          <div className="min-w-0"><p className="text-xs font-medium uppercase tracking-[.15em] opacity-75">Hôm nay</p><h2 className="mt-2 text-xl font-semibold leading-6">{status}</h2><p className="mt-2 text-sm leading-5 opacity-85">{predictionText}</p></div>
        </div>
        <button type="button" onClick={() => { setSelected(todayKey); setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1)); }} className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-rose-600 shadow-sm"><Plus className="size-4" />Ghi triệu chứng hôm nay</button>
      </section>

      <section className="mb-5 rounded-3xl bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <button type="button" aria-label="Tháng trước" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))} className="grid size-9 place-items-center rounded-full bg-secondary"><ChevronLeft className="size-4" /></button>
          <h2 className="font-semibold capitalize">{new Intl.DateTimeFormat("vi", { month: "long", year: "numeric" }).format(visibleMonth)}</h2>
          <button type="button" aria-label="Tháng sau" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))} className="grid size-9 place-items-center rounded-full bg-secondary"><ChevronRight className="size-4" /></button>
        </div>
        <div className="grid grid-cols-7 text-center">{weekDays.map((day) => <span key={day} className="pb-2 text-[11px] font-medium text-muted-foreground">{day}</span>)}</div>
        <div className="grid grid-cols-7 gap-y-1">{calendarDays.map((date) => {
          const key = dateKey(date);
          const inMonth = date.getMonth() === visibleMonth.getMonth();
          const log = logsByDate.get(key);
          const actualPeriod = Boolean(log?.flow) || periodRanges.some((range) => inRange(key, range.start, range.end));
          const predictedPeriod = !actualPeriod && nextPeriod ? inRange(key, nextPeriod, dateKey(addDays(parseDate(nextPeriod), 4))) : false;
          const fertile = !actualPeriod && inRange(key, fertileStart, fertileEnd);
          const ovulationDay = key === ovulation;
          return <button type="button" key={key} onClick={() => setSelected(key)} className={cn("relative mx-auto grid size-10 place-items-center rounded-full text-sm transition-colors", !inMonth && "text-muted-foreground/35", key === selected && "ring-2 ring-primary ring-offset-2 ring-offset-card", actualPeriod && "bg-rose-500 font-semibold text-white", predictedPeriod && "border border-dashed border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950", fertile && "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200", ovulationDay && "ring-2 ring-teal-500", key === todayKey && !actualPeriod && "font-bold text-primary")}>
            {date.getDate()}{log && <span className={cn("absolute -bottom-0.5 size-1 rounded-full bg-primary", actualPeriod && "bg-white")} />}
          </button>;
        })}</div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t pt-3 text-[11px] text-muted-foreground"><span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-rose-500" />Kỳ kinh đã ghi</span><span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full border border-dashed border-rose-500" />Kỳ dự kiến</span><span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-teal-200" />Dễ thụ thai ước tính</span></div>
      </section>

      <section className="rounded-3xl bg-card p-5 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-3"><div><p className="text-xs text-muted-foreground">Nhật ký ngày</p><h2 className="mt-1 text-lg font-semibold capitalize">{new Intl.DateTimeFormat("vi", { weekday: "long", day: "2-digit", month: "long" }).format(parseDate(selected))}</h2></div>{selectedLog && <span className="rounded-full bg-secondary px-2 py-1 text-[11px] font-medium text-primary">Đã ghi</span>}</div>
        <form key={`${selected}-${selectedLog?.id ?? "new"}`} action={saveMotherDailyHealthLogAction} className="space-y-6">
          <input type="hidden" name="motherId" value={motherId} /><input type="hidden" name="loggedAt" value={selected} />
          <fieldset><legend className="mb-3 text-sm font-medium">Lượng kinh</legend><div className="grid grid-cols-4 gap-2">{flowOptions.map((option) => <label key={option.value} className="cursor-pointer"><input className="peer sr-only" type="radio" name="flow" value={option.value} defaultChecked={selectedLog?.flow === option.value} /><span className="flex h-10 items-center justify-center rounded-xl border text-xs text-muted-foreground peer-checked:border-rose-500 peer-checked:bg-rose-50 peer-checked:font-medium peer-checked:text-rose-700 dark:peer-checked:bg-rose-950">{option.label}</span></label>)}</div><label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-xs text-muted-foreground"><input type="radio" name="flow" value="" defaultChecked={!selectedLog?.flow} />Không có kinh</label></fieldset>
          <ChipGroup name="symptoms" title="Triệu chứng" options={symptomOptions} selected={selectedLog?.symptoms ?? []} />
          <ChipGroup name="moods" title="Tâm trạng" options={moodOptions} selected={selectedLog?.moods ?? []} />
          <div className="space-y-2"><Label htmlFor="discharge">Dịch âm đạo</Label><select id="discharge" name="discharge" defaultValue={selectedLog?.discharge ?? ""} className="h-11 w-full rounded-xl border bg-background px-3 text-sm"><option value="">Không ghi</option><option value="DRY">Khô / ít</option><option value="CREAMY">Dạng kem</option><option value="WATERY">Loãng</option><option value="EGG_WHITE">Trong, dai như lòng trắng trứng</option><option value="UNUSUAL">Khác thường</option></select></div>
          <div className="grid grid-cols-2 gap-3"><MetricField name="sleepHours" label="Ngủ (giờ)" step="0.1" max="24" value={selectedLog?.sleepHours} /><MetricField name="basalTemperatureC" label="Nhiệt độ cơ bản (°C)" step="0.01" min="30" max="45" value={selectedLog?.basalTemperatureC} /><MetricField name="weightKg" label="Cân nặng (kg)" step="0.1" value={selectedLog?.weightKg} /><MetricField name="waterGlasses" label="Nước (ly)" step="1" max="100" value={selectedLog?.waterGlasses} /></div>
          <div className="space-y-2"><Label htmlFor="daily-notes">Ghi chú</Label><Textarea id="daily-notes" name="notes" className="min-h-20 rounded-xl bg-background" defaultValue={selectedLog?.notes ?? ""} placeholder="Điều gì đáng chú ý hôm nay?" /></div>
          <div className="flex gap-2"><SaveDailyButton />{selectedLog && <Button type="submit" formAction={deleteMotherDailyHealthLogAction} name="id" value={selectedLog.id} variant="destructive" className="h-11 rounded-xl" aria-label="Xóa nhật ký ngày"><Trash2 className="size-4" /></Button>}</div>
        </form>
      </section>
      <p className="mt-4 flex gap-2 rounded-2xl bg-secondary/60 p-3 text-xs leading-5 text-muted-foreground"><Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />Ngày rụng trứng và cửa sổ dễ thụ thai chỉ là ước tính từ lịch chu kỳ, có thể sai ngay cả khi chu kỳ đều. Không dùng dự báo này như biện pháp tránh thai hoặc chẩn đoán.</p>
    </>
  );
}

function ChipGroup({ name, title, options, selected }: { name: string; title: string; options: string[]; selected: string[] }) {
  return <fieldset><legend className="mb-3 text-sm font-medium">{title}</legend><div className="flex flex-wrap gap-2">{options.map((option) => <label key={option} className="cursor-pointer"><input type="checkbox" name={name} value={option} defaultChecked={selected.includes(option)} className="peer sr-only" /><span className="block rounded-full border px-3 py-2 text-xs text-muted-foreground transition-colors peer-checked:border-primary peer-checked:bg-secondary peer-checked:font-medium peer-checked:text-primary">{option}</span></label>)}</div></fieldset>;
}

function MetricField({ name, label, value, step, min = "0", max }: { name: string; label: string; value?: number; step: string; min?: string; max?: string }) {
  return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} type="number" inputMode="decimal" min={min} max={max} step={step} defaultValue={value ?? ""} className="h-11 rounded-xl bg-background" /></div>;
}
