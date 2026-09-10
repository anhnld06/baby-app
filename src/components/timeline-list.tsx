import { Baby, BedDouble, Pill, Ruler, Shell, Smile, Syringe } from "lucide-react";
import type { TimelineItem } from "@/features/timeline/timeline";

const icons = {
  feeding: Baby,
  sleep: BedDouble,
  diaper: Shell,
  growth: Ruler,
  vaccination: Syringe,
  prescription: Pill,
  tooth: Smile,
};
const colors = {
  feeding:
    "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  sleep:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  diaper:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  growth: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  vaccination:
    "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  prescription:
    "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  tooth: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
};

export function TimelineList({
  items,
  locale = "vi",
  empty = "Chưa có hoạt động",
}: {
  items: TimelineItem[];
  locale?: string;
  empty?: string;
}) {
  if (items.length === 0)
    return (
      <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        {empty}
      </div>
    );
  return (
    <div className="relative space-y-1 before:absolute before:bottom-6 before:left-5 before:top-6 before:w-px before:bg-border">
      {items.map((item) => {
        const Icon = icons[item.kind];
        return (
          <div
            key={`${item.kind}-${item.id}`}
            className="relative flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-card"
          >
            <div
              className={`z-10 grid size-10 shrink-0 place-items-center rounded-full ${colors[item.kind]}`}
            >
              <Icon className="size-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="truncate text-sm text-muted-foreground">
                {item.detail}
              </p>
            </div>
            <time className="text-xs tabular-nums text-muted-foreground">
              {new Intl.DateTimeFormat(locale, {
                hour: "2-digit",
                minute: "2-digit",
              }).format(item.at)}
            </time>
          </div>
        );
      })}
    </div>
  );
}
