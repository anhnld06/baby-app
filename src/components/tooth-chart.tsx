import type { ToothPosition } from "@prisma/client";
import Link from "next/link";
import {
  LOWER_TOOTH_ORDER,
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
    <div className="space-y-3">
      <ToothRow
        positions={UPPER_TOOTH_ORDER}
        href={href}
        eruptedPositions={eruptedPositions}
        selectedPosition={selectedPosition}
        labels={labels}
      />
      <div className="mx-auto h-px w-4/5 bg-border" />
      <ToothRow
        positions={LOWER_TOOTH_ORDER}
        href={href}
        eruptedPositions={eruptedPositions}
        selectedPosition={selectedPosition}
        labels={labels}
      />
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
    <div className="flex justify-center gap-1.5">
      {positions.map((position, index) => {
        const erupted = eruptedPositions.has(position);
        const active = position === selectedPosition;
        return (
          <Link
            key={position}
            href={href(position)}
            title={labels[toothTypeLabelKey(position)]}
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-xl border text-[10px] font-semibold transition-colors sm:size-9",
              erupted
                ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                : "border-dashed border-border bg-card text-muted-foreground",
              active && "ring-2 ring-primary ring-offset-2 ring-offset-background",
              index === 4 && "mr-1.5",
            )}
          >
            {erupted ? "✓" : ""}
          </Link>
        );
      })}
    </div>
  );
}
