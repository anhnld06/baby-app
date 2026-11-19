import type { ReactNode } from "react";
import {
  CareIllustration,
  type CareIllustrationKind,
} from "@/components/care-illustration";
import { cn } from "@/lib/utils";

export type CareTone =
  | "amber"
  | "violet"
  | "emerald"
  | "sky"
  | "rose"
  | "teal";

const HERO_TONES: Record<
  CareTone,
  { surface: string; badge: string; artBg: string }
> = {
  amber: {
    surface:
      "border-orange-200/70 bg-gradient-to-br from-[#fff5ee] via-card to-card dark:border-orange-900/50 dark:from-[#2b2220] dark:via-card dark:to-card",
    badge:
      "bg-orange-100/90 text-orange-800 dark:bg-orange-950/80 dark:text-orange-200",
    artBg: "bg-white/80 dark:bg-white/5",
  },
  violet: {
    surface:
      "border-indigo-200/70 bg-gradient-to-br from-[#f2f1fb] via-card to-card dark:border-indigo-900/50 dark:from-[#242338] dark:via-card dark:to-card",
    badge:
      "bg-indigo-100/90 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-200",
    artBg: "bg-white/80 dark:bg-white/5",
  },
  emerald: {
    surface:
      "border-emerald-200/70 bg-gradient-to-br from-[#ebf8f3] via-card to-card dark:border-emerald-900/50 dark:from-[#1d312c] dark:via-card dark:to-card",
    badge:
      "bg-emerald-100/90 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200",
    artBg: "bg-white/80 dark:bg-white/5",
  },
  sky: {
    surface:
      "border-sky-200/70 bg-gradient-to-br from-[#ecf5fc] via-card to-card dark:border-sky-900/50 dark:from-[#1d2d3d] dark:via-card dark:to-card",
    badge:
      "bg-sky-100/90 text-sky-800 dark:bg-sky-950/80 dark:text-sky-200",
    artBg: "bg-white/80 dark:bg-white/5",
  },
  rose: {
    surface:
      "border-rose-200/70 bg-gradient-to-br from-[#fff1f3] via-card to-card dark:border-rose-900/50 dark:from-[#312128] dark:via-card dark:to-card",
    badge:
      "bg-rose-100/90 text-rose-800 dark:bg-rose-950/80 dark:text-rose-200",
    artBg: "bg-white/80 dark:bg-white/5",
  },
  teal: {
    surface:
      "border-teal-200/70 bg-gradient-to-br from-[#eaf6f6] via-card to-card dark:border-teal-900/50 dark:from-[#1d3135] dark:via-card dark:to-card",
    badge:
      "bg-teal-100/90 text-teal-800 dark:bg-teal-950/80 dark:text-teal-200",
    artBg: "bg-white/80 dark:bg-white/5",
  },
};

export function CareBentoHero({
  kind,
  tone,
  eyebrow,
  title,
  description,
  badge,
  footer,
  children,
}: {
  kind: CareIllustrationKind;
  tone: CareTone;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}) {
  const palette = HERO_TONES[tone];
  return (
    <section
      className={cn(
        "mb-5 overflow-hidden rounded-[1.75rem] border p-4 shadow-[0_10px_30px_-22px_rgba(20,50,74,0.22)] sm:p-5",
        palette.surface,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
                palette.badge,
              )}
            >
              {eyebrow}
            </span>
            {badge}
          </div>
          <div className="mt-2.5 text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </div>
          {description && (
            <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
              {description}
            </p>
          )}
        </div>
        <span
          className={cn(
            "grid size-[4.5rem] shrink-0 place-items-center rounded-3xl border border-border/50 shadow-xs [&>.care-illustration]:size-16 sm:size-20 sm:[&>.care-illustration]:size-[4.5rem]",
            palette.artBg,
          )}
        >
          <CareIllustration kind={kind} small />
        </span>
      </div>
      {children && <div className="mt-4">{children}</div>}
      {footer && (
        <div className="mt-3.5 border-t border-border/60 pt-3">{footer}</div>
      )}
    </section>
  );
}

export function CareEmptyState({
  kind,
  title,
  description,
}: {
  kind: CareIllustrationKind;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/70 px-5 py-8 text-center">
      <span className="mx-auto mb-3 grid size-16 place-items-center rounded-2xl bg-secondary/70 [&>.care-illustration]:size-14">
        <CareIllustration kind={kind} small />
      </span>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
