import { ToothIcon, MilestoneIcon } from "@/components/app-icons";
import Link from "next/link";
import { Sun, Heart } from "lucide-react";
import { MealIcon as Utensils, TemperatureIcon as Thermometer, BottleIcon as Baby, SleepIcon as BedDouble, MedicineIcon as Pill, GrowthIcon as Ruler, DiaperIcon as Shell, VaccineIcon as Syringe } from "@/components/app-icons";
import { HistoryTimelineItem } from "@/components/history-timeline-item";
import type { TimelineItem } from "@/features/timeline/timeline";
const icons = {temperature:Thermometer,medication:Pill,care:Heart,feeding:Baby,sleep:BedDouble,diaper:Shell,growth:Ruler,vaccination:Syringe,prescription:Pill,tooth:ToothIcon};
const colors = {temperature:"bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",medication:"bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",care:"bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",feeding:"bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",sleep:"bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",diaper:"bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",growth:"bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",vaccination:"bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",prescription:"bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",tooth:"bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"};
export function TimelineList({items,locale="vi",timeZone,showDate=false,empty="Chưa có hoạt động"}:{items:TimelineItem[];locale?:string;timeZone?:string;showDate?:boolean;empty?:string}) {
  if(!items.length)return <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">{empty}</p>;
  return <div aria-label={locale.startsWith("vi") ? "Dòng thời gian hoạt động" : "Activity timeline"}>{items.map(item=>{
    const Icon=item.careKind === "WAKE" ? Sun : item.careKind === "MEAL" ? Utensils : item.careKind === "MILESTONE" ? MilestoneIcon : icons[item.kind];
    const href=item.href ?? (item.kind==="care" ? "/activity" : item.kind==="medication" ? "/tracking/medication" : item.kind==="vaccination" ? "/vaccination-schedule?owner=baby" : `/tracking/${item.kind==="tooth" ? "teeth" : item.kind}?edit=${item.id}`);
    return <HistoryTimelineItem key={`${item.kind}-${item.id}`} at={item.at} locale={locale} timeZone={timeZone} active={item.active} dateOnly={item.dateOnly} showDate={showDate}>
      <Link href={href} className={`flex min-w-0 items-start gap-3 rounded-3xl border p-4 transition-colors ${item.active ? "border-violet-300 bg-violet-100/80 dark:border-violet-700 dark:bg-violet-950/70" : "border-border/60 bg-card hover:bg-secondary/30"}`}><span className={`grid size-10 shrink-0 place-items-center rounded-2xl ${colors[item.kind]}`}><Icon className="size-8"/></span><div className="min-w-0 flex-1"><p className={`mb-1 text-[10px] font-medium ${item.active ? "text-violet-700 dark:text-violet-300" : "text-muted-foreground"}`}>{locale.startsWith("vi") ? item.active ? "Đang diễn ra · đã ghi" : "Đã ghi" : item.active ? "In progress · recorded" : "Recorded"}</p><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{item.detail}</p></div></Link>
    </HistoryTimelineItem>;
  })}</div>;
}
