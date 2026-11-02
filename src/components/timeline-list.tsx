import { Heart, Baby, BedDouble, Pill, Ruler, Shell, Smile, Syringe } from "lucide-react";
import type { TimelineItem } from "@/features/timeline/timeline";

const icons = {
  care: Heart,
  feeding: Baby,
  sleep: BedDouble,
  diaper: Shell,
  growth: Ruler,
  vaccination: Syringe,
  prescription: Pill,
  tooth: Smile,
};
const colors = {
  care: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  feeding:
    "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  sleep:
    "bg-slate-100 text-slate-600 dark:bg-indigo-950 dark:text-indigo-300",
  diaper:
    "bg-sky-50 text-sky-700 dark:bg-emerald-950 dark:text-emerald-300",
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
  timeZone,
  showDate = false,
  empty = "Chưa có hoạt động",
}: {
  items: TimelineItem[];
  locale?: string;
  timeZone?: string;
  showDate?: boolean;
  empty?: string;
}) {
  if (items.length === 0)
    return (
      <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        {empty}
      </div>
    );
  return (
    <div className="divide-y divide-border/60">
      {items.map((item) => {
        const Icon = icons[item.kind];
        return (
          <div
            key={`${item.kind}-${item.id}`}
            className={`relative flex items-start gap-3 rounded-xl py-3.5 transition-colors ${item.active ? "bg-secondary/70 ring-1 ring-primary/20" : "hover:bg-card"}`}
          >
            <time dateTime={item.at.toISOString()} className="order-last w-16 shrink-0 pt-2 text-right text-xs tabular-nums text-muted-foreground">
              {new Intl.DateTimeFormat(locale, {
                timeZone,
                ...(showDate ? { day: "2-digit", month: "2-digit" } as const : {}),
                hour: "2-digit",
                minute: "2-digit",
              }).format(item.at)}
            </time>
            <div
              className={`z-10 grid size-10 shrink-0 place-items-center rounded-xl ${colors[item.kind]}`}
            >
              <Icon className="size-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{item.title}</p>
              {item.active && <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">{locale.startsWith("vi") ? "Đang diễn ra" : "In progress"}</span>}
              <p className="break-words text-xs leading-5 text-muted-foreground">
                {item.detail}
              </p>
            </div>

          </div>
        );
      })}
    </div>
  );
}
