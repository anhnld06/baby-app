import { BreastfeedingIcon as Baby, SleepIcon as BedDouble } from "@/components/app-icons";
import {
  finishFeedingTimerAction,
  finishSleepTimerAction,
  startFeedingTimerAction,
  startSleepTimerAction,
} from "@/app/timer-actions";
import { Elapsed, TimerButton } from "@/components/timer-controls";

// Server-rendered shell; only the ticking clock and the pending-aware button are client code.
// Re-exported for existing imports (e.g. pumping-timer.tsx).
export { Elapsed, TimerButton };

export function QuickTimers({
  babyId,
  activeFeedingStartedAt,
  activeSleepStartedAt,
}: {
  babyId: string;
  activeFeedingStartedAt?: string;
  activeSleepStartedAt?: string;
}) {
  const timers = [
    {
      key: "feeding",
      icon: Baby,
      title: "Bấm giờ bú",
      active: Boolean(activeFeedingStartedAt),
      startedAt: activeFeedingStartedAt,
      action: activeFeedingStartedAt ? finishFeedingTimerAction : startFeedingTimerAction,
      startLabel: "Bắt đầu bú",
      stopLabel: "Kết thúc",
      color: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    },
    {
      key: "sleep",
      icon: BedDouble,
      title: "Bấm giờ ngủ",
      active: Boolean(activeSleepStartedAt),
      startedAt: activeSleepStartedAt,
      action: activeSleepStartedAt ? finishSleepTimerAction : startSleepTimerAction,
      startLabel: "Bắt đầu ngủ",
      stopLabel: "Thức dậy",
      color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
    },
  ];

  return (
    <section className="mt-3 grid gap-2.5 sm:grid-cols-2" aria-label="Hẹn giờ nhanh">
      {timers.map(({ key, icon: Icon, title, active, startedAt, action, startLabel, stopLabel, color }) => (
        <div key={key} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/45 p-3">
          <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${color}`}>
            <Icon className="size-8" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{title}</p>
            <Elapsed startTime={startedAt} />
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
