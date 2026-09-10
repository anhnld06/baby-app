import type { Baby } from "@prisma/client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { setSelectedBabyAction } from "@/app/actions";
import { cn } from "@/lib/utils";

export function BabySwitcher({
  babies,
  selectedBabyId,
  addLabel,
}: {
  babies: Pick<Baby, "id" | "name" | "nickname">[];
  selectedBabyId?: string;
  addLabel: string;
}) {
  if (babies.length === 0) return null;
  return (
    <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
      {babies.map((baby) => {
        const active = baby.id === selectedBabyId;
        const label = baby.nickname ?? baby.name;
        return (
          <form key={baby.id} action={setSelectedBabyAction}>
            <input type="hidden" name="babyId" value={baby.id} />
            <button
              type="submit"
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold",
                  active ? "bg-white/25" : "bg-secondary text-primary",
                )}
              >
                {label.slice(0, 1)}
              </span>
              <span className="max-w-24 truncate">{label}</span>
            </button>
          </form>
        );
      })}
      <Link
        href="/profile/baby/new"
        className="flex shrink-0 items-center gap-1 rounded-full bg-card py-1.5 pl-2.5 pr-3.5 text-sm font-medium text-muted-foreground"
      >
        <Plus className="size-4" />
        {addLabel}
      </Link>
    </div>
  );
}
