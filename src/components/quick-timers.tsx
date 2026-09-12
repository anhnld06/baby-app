"use client";

import { Baby, BedDouble, LoaderCircle, Play, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  finishFeedingTimerAction,
  finishSleepTimerAction,
  startFeedingTimerAction,
  startSleepTimerAction,
} from "@/app/timer-actions";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/date";

function TimerButton({ active, startLabel, stopLabel }: { active: boolean; startLabel: string; stopLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="sm"
      variant={active ? "default" : "secondary"}
      className="h-11 rounded-xl px-3"
      disabled={pending}
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : active ? <Square className="size-3.5" /> : <Play className="size-4" />}
      {active ? stopLabel : startLabel}
    </Button>
  );
}

function Elapsed({ startTime, locale }: { startTime?: string; locale: "vi" | "en" }) {
  const [now, setNow] = useState<number>();
  useEffect(() => {
    if (!startTime) return;
    const update = () => setNow(Date.now());
    const timeout = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 30_000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [startTime]);
  if (!startTime || now === undefined) return null;
  return (
    <span className="text-xs font-semibold text-primary" aria-live="polite">
      {formatDuration((now - new Date(startTime).getTime()) / 60_000, locale)}
    </span>
  );
}

export function QuickTimers({
  babyId,
  locale,
  activeFeedingStartedAt,
  activeSleepStartedAt,
}: {
  babyId: string;
  locale: "vi" | "en";
  activeFeedingStartedAt?: string;
  activeSleepStartedAt?: string;
}) {
  const vi = locale === "vi";
  const timers = [
    {
      key: "feeding",
      icon: Baby,
      title: vi ? "Hẹn giờ cữ bú" : "Feeding timer",
      active: Boolean(activeFeedingStartedAt),
      startedAt: activeFeedingStartedAt,
      action: activeFeedingStartedAt ? finishFeedingTimerAction : startFeedingTimerAction,
      startLabel: vi ? "Bắt đầu bú" : "Start feed",
      stopLabel: vi ? "Kết thúc" : "Finish",
      color: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    },
    {
      key: "sleep",
      icon: BedDouble,
      title: vi ? "Hẹn giờ giấc ngủ" : "Sleep timer",
      active: Boolean(activeSleepStartedAt),
      startedAt: activeSleepStartedAt,
      action: activeSleepStartedAt ? finishSleepTimerAction : startSleepTimerAction,
      startLabel: vi ? "Bắt đầu ngủ" : "Start sleep",
      stopLabel: vi ? "Thức dậy" : "Wake up",
      color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
    },
  ];

  return (
    <section className="mt-5 grid gap-2 sm:grid-cols-2" aria-label={vi ? "Hẹn giờ nhanh" : "Quick timers"}>
      {timers.map(({ key, icon: Icon, title, active, startedAt, action, startLabel, stopLabel, color }) => (
        <div key={key} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm">
          <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${color}`}>
            <Icon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{title}</p>
            <Elapsed startTime={startedAt} locale={locale} />
          </div>
          <form action={action}>
            <input type="hidden" name="babyId" value={babyId} />
            <TimerButton active={active} startLabel={startLabel} stopLabel={stopLabel} />
          </form>
        </div>
      ))}
    </section>
  );
}
