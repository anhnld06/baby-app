import Link from "next/link";
import {
  ArrowUpRight,
  Baby,
  Milk,
  Shell,
  BedDouble,
  Droplets,
  Utensils,
  type LucideIcon,
} from "lucide-react";
const actions: {
  kind: string;
  icon: LucideIcon;
  iconTone: string;
  title: string;
  detail: string;
  href: string;
  tone: string;
}[] = [
  {
    kind: "breast",
    icon: Baby,
    iconTone: "text-orange-700 dark:text-orange-200",
    title: "Bú mẹ",
    detail: "Bên bú & thời gian",
    href: "/tracking/feeding?new=1&type=BREASTFEEDING",
    tone: "bg-[#fff1e9] dark:bg-[#3a2d2a]",
  },
  {
    kind: "bottle",
    icon: Milk,
    iconTone: "text-teal-700 dark:text-teal-200",
    title: "Bình sữa",
    detail: "Loại sữa & lượng uống",
    href: "/tracking/feeding?new=1&type=BOTTLE_BREAST_MILK",
    tone: "bg-[#e5f4f4] dark:bg-[#203b3d]",
  },
  {
    kind: "diaper",
    icon: Shell,
    iconTone: "text-sky-700 dark:text-sky-200",
    title: "Thay tã",
    detail: "Tã ướt, phân hoặc cả hai",
    href: "/tracking/diaper?new=1",
    tone: "bg-[#e8f3fb] dark:bg-[#24384b]",
  },
  {
    kind: "sleep",
    icon: BedDouble,
    iconTone: "text-violet-700 dark:text-violet-200",
    title: "Giấc ngủ",
    detail: "Giấc ngày & giấc đêm",
    href: "/tracking/sleep?new=1",
    tone: "bg-[#eeedf8] dark:bg-[#302e46]",
  },
  {
    kind: "pumping",
    icon: Droplets,
    iconTone: "text-purple-700 dark:text-purple-200",
    title: "Hút sữa",
    detail: "Nhật ký riêng của mẹ",
    href: "/mother/pumping",
    tone: "bg-[#f2eafb] dark:bg-[#382d46]",
  },
  {
    kind: "meal",
    icon: Utensils,
    iconTone: "text-emerald-700 dark:text-emerald-200",
    title: "Ăn dặm",
    detail: "Món ăn & trải nghiệm",
    href: "/baby/meals?new=1",
    tone: "bg-[#eaf5ec] dark:bg-[#283d30]",
  },
];
export function HomeQuickActions() {
  return (
    <section aria-labelledby="daily-actions-title">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-muted-foreground">
            Những điều nhỏ mỗi ngày
          </p>
          <h2 id="daily-actions-title" className="mt-1 text-lg font-semibold">
            Ghi cho con
          </h2>
        </div>
        <Link
          href="/baby"
          className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-primary"
        >
          Tất cả
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {actions.map(({ icon: Icon, ...action }) => (
          <Link
            key={action.kind}
            href={action.href}
            className={`care-action flex min-w-0 flex-col items-center rounded-[1.25rem] px-2 py-4 text-center sm:items-start sm:px-4 ${action.tone}`}
          >
            <span
              className={`mb-3 grid size-12 place-items-center rounded-2xl bg-white/70 dark:bg-white/10 sm:size-14 ${action.iconTone}`}
            >
              <Icon
                aria-hidden="true"
                className="size-6 sm:size-7"
                strokeWidth={1.8}
              />
            </span>
            <strong className="mt-1 text-xs font-semibold sm:text-sm">
              {action.title}
            </strong>
            <span className="mt-1 hidden text-[11px] leading-4 text-muted-foreground sm:block">
              {action.detail}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
