import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineTone =
  | "violet"
  | "amber"
  | "emerald"
  | "sky"
  | "rose"
  | "teal";

const TONE_STYLES: Record<
  TimelineTone,
  { rail: string; activePill: string; activeDot: string; doneDot: string }
> = {
  violet: {
    rail: "border-indigo-200 dark:border-indigo-900/80",
    activePill: "bg-indigo-600 text-white",
    activeDot: "border-indigo-500 bg-card ring-4 ring-indigo-100 dark:ring-indigo-950",
    doneDot:
      "border-indigo-400 bg-indigo-400 text-white dark:border-indigo-600 dark:bg-indigo-600",
  },
  amber: {
    rail: "border-orange-200 dark:border-orange-900/70",
    activePill: "bg-orange-600 text-white",
    activeDot: "border-orange-500 bg-card ring-4 ring-orange-100 dark:ring-orange-950",
    doneDot:
      "border-orange-400 bg-orange-400 text-white dark:border-orange-600 dark:bg-orange-600",
  },
  emerald: {
    rail: "border-emerald-200 dark:border-emerald-900/70",
    activePill: "bg-emerald-600 text-white",
    activeDot:
      "border-emerald-500 bg-card ring-4 ring-emerald-100 dark:ring-emerald-950",
    doneDot:
      "border-emerald-500 bg-emerald-500 text-white dark:border-emerald-600 dark:bg-emerald-600",
  },
  sky: {
    rail: "border-sky-200 dark:border-sky-900/70",
    activePill: "bg-sky-600 text-white",
    activeDot: "border-sky-500 bg-card ring-4 ring-sky-100 dark:ring-sky-950",
    doneDot:
      "border-sky-500 bg-sky-500 text-white dark:border-sky-600 dark:bg-sky-600",
  },
  rose: {
    rail: "border-rose-200 dark:border-rose-900/70",
    activePill: "bg-rose-600 text-white",
    activeDot: "border-rose-500 bg-card ring-4 ring-rose-100 dark:ring-rose-950",
    doneDot:
      "border-rose-400 bg-rose-400 text-white dark:border-rose-600 dark:bg-rose-600",
  },
  teal: {
    rail: "border-teal-200 dark:border-teal-900/70",
    activePill: "bg-teal-600 text-white",
    activeDot: "border-teal-500 bg-card ring-4 ring-teal-100 dark:ring-teal-950",
    doneDot:
      "border-teal-500 bg-teal-500 text-white dark:border-teal-600 dark:bg-teal-600",
  },
};

export function HistoryTimelineItem({
  at,
  timeZone,
  active = false,
  planned = false,
  showDate = false,
  dateOnly = false,
  tone = "violet",
  children,
}: {
  at: Date;
  timeZone?: string;
  active?: boolean;
  planned?: boolean;
  showDate?: boolean;
  dateOnly?: boolean;
  tone?: TimelineTone;
  children: ReactNode;
}) {
  const palette = TONE_STYLES[tone];
  return (
    <div
      data-history-timeline-item
      data-timeline-status={active ? "active" : planned ? "planned" : "recorded"}
      className="record-history-item relative grid min-w-0 grid-cols-[3rem_1rem_minmax(0,1fr)] gap-x-2 pb-4 sm:grid-cols-[3.5rem_1.25rem_minmax(0,1fr)] sm:gap-x-3"
    >
      <div className="pt-4 text-center">
        <time
          dateTime={at.toISOString()}
          className={cn(
            "inline-block text-xs font-semibold tabular-nums",
            active
              ? cn("rounded-full px-1.5 py-1", palette.activePill)
              : "py-1 text-muted-foreground",
          )}
        >
          {dateOnly
            ? "Cả ngày"
            : new Intl.DateTimeFormat("vi-VN", {
                timeZone,
                hour: "2-digit",
                minute: "2-digit",
                hourCycle: "h23",
              }).format(at)}
        </time>
        {showDate && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {new Intl.DateTimeFormat("vi-VN", {
              timeZone: dateOnly ? "UTC" : timeZone,
              day: "2-digit",
              month: "2-digit",
            }).format(at)}
          </p>
        )}
      </div>
      <div aria-hidden="true" className="relative flex justify-center pt-5">
        <span
          className={cn(
            "timeline-rail absolute left-1/2 top-6 bottom-[-1.25rem] -translate-x-1/2 border-l-2",
            planned ? "border-dashed border-border" : palette.rail,
          )}
        />
        <span
          className={cn(
            "relative z-10 grid size-4 shrink-0 place-items-center rounded-full border-2",
            active
              ? palette.activeDot
              : planned
                ? "border-border bg-card"
                : palette.doneDot,
          )}
        >
          {!active && !planned && <Check className="size-2.5" strokeWidth={3} />}
        </span>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
