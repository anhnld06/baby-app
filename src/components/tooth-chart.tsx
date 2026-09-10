import type { ToothPosition } from "@prisma/client";
import Link from "next/link";
import {
  LOWER_TOOTH_ORDER,
  TOOTH_ERUPTION_INFO,
  toothTypeLabelKey,
  UPPER_TOOTH_ORDER,
} from "@/features/teeth/teeth";
import { cn } from "@/lib/utils";

type ToothLabels = {
  centralIncisor: string;
  lateralIncisor: string;
  canine: string;
  firstMolar: string;
  secondMolar: string;
  upperJaw: string;
  lowerJaw: string;
  babyRight: string;
  babyLeft: string;
  primaryTooth: string;
  fdiCode: string;
  expectedEruption: string;
  eruptionOrder: string;
  monthShort: string;
  erupted: string;
  notErupted: string;
};

export function ToothChart({
  href,
  eruptedPositions,
  selectedPosition,
  labels,
}: {
  href: (position: ToothPosition) => string;
  eruptedPositions: Set<ToothPosition>;
  selectedPosition?: ToothPosition;
  labels: ToothLabels;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 text-[10px] font-medium text-muted-foreground">
        <span>{labels.babyRight}</span>
        <span className="text-right">{labels.babyLeft}</span>
      </div>
      <p className="text-center text-xs font-semibold text-foreground">
        {labels.upperJaw}
      </p>
      <ToothRow
        positions={UPPER_TOOTH_ORDER}
        href={href}
        eruptedPositions={eruptedPositions}
        selectedPosition={selectedPosition}
        labels={labels}
      />
      <div className="relative mx-auto h-px w-11/12 bg-border">
        <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border" />
      </div>
      <ToothRow
        positions={LOWER_TOOTH_ORDER}
        href={href}
        eruptedPositions={eruptedPositions}
        selectedPosition={selectedPosition}
        labels={labels}
      />
      <p className="text-center text-xs font-semibold text-foreground">
        {labels.lowerJaw}
      </p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
        <span><strong className="text-foreground">51</strong> {labels.fdiCode}</span>
        <span><strong className="text-foreground">#1</strong> {labels.eruptionOrder}</span>
        <span><strong className="text-foreground">6–10</strong> {labels.monthShort}</span>
        <span><strong className="text-emerald-600 dark:text-emerald-400">✓</strong> {labels.erupted}</span>
      </div>
    </div>
  );
}

function ToothRow({
  positions,
  href,
  eruptedPositions,
  selectedPosition,
  labels,
}: {
  positions: ToothPosition[];
  href: (position: ToothPosition) => string;
  eruptedPositions: Set<ToothPosition>;
  selectedPosition?: ToothPosition;
  labels: ToothLabels;
}) {
  return (
    <div className="grid grid-cols-10 gap-0.5">
      {positions.map((position, index) => {
        const erupted = eruptedPositions.has(position);
        const active = position === selectedPosition;
        const info = TOOTH_ERUPTION_INFO[position];
        const typeLabel = labels[toothTypeLabelKey(position)];
        const stateLabel = erupted ? labels.erupted : labels.notErupted;

        return (
          <Link
            key={position}
            href={href(position)}
            aria-current={active ? "true" : undefined}
            title={`${info.fdiNumber} · ${typeLabel} · ${info.expectedMonths[0]}–${info.expectedMonths[1]} ${labels.monthShort}`}
            aria-label={`${labels.primaryTooth} ${info.fdiNumber}, ${typeLabel}, ${labels.expectedEruption} ${info.expectedMonths[0]}–${info.expectedMonths[1]} ${labels.monthShort}, ${stateLabel}`}
            className={cn(
              "relative flex h-14 min-w-0 flex-col items-center justify-center overflow-hidden rounded-[45%_45%_35%_35%] border px-px transition-colors sm:h-16",
              erupted
                ? "border-emerald-600 bg-emerald-500 text-white shadow-sm dark:border-emerald-400 dark:bg-emerald-600"
                : "border-dashed border-border bg-card text-muted-foreground",
              active && "ring-2 ring-primary ring-offset-2 ring-offset-background",
              index === 4 && "mr-1",
            )}
          >
            {erupted && (
              <span className="absolute right-0.5 top-0.5 text-[8px] font-bold leading-none">
                ✓
              </span>
            )}
            <span className="text-[8px] font-medium leading-none opacity-75 sm:text-[9px]">
              #{info.eruptionOrder}
            </span>
            <strong className="mt-1 text-[10px] leading-none sm:text-xs">
              {info.fdiNumber}
            </strong>
            <span className="mt-1 whitespace-nowrap text-[7px] font-medium leading-none opacity-80 sm:text-[8px]">
              {info.expectedMonths[0]}–{info.expectedMonths[1]}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
