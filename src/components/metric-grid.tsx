import { cn } from "@/lib/utils";

export function MetricGrid({
  items,
  embedded = false,
}: {
  items: Array<{ label: string; value: string; hint?: string }>;
  embedded?: boolean;
}) {
  const oddCount = items.length > 2 && items.length % 2 === 1;
  const smCols =
    items.length === 3
      ? "sm:grid-cols-3"
      : items.length === 4
        ? "sm:grid-cols-4"
        : items.length >= 5
          ? "sm:grid-cols-3"
          : "sm:grid-cols-2";

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2.5 sm:gap-3",
        smCols,
        !embedded && "mb-6",
      )}
    >
      {items.map((item, index) => (
        <div
          key={item.label}
          className={cn(
            "min-w-0 rounded-2xl border border-border/70 p-3.5",
            embedded
              ? "bg-card/85 backdrop-blur-xs"
              : "surface-panel p-4",
            oddCount && index === 0 && "col-span-2 sm:col-span-1",
          )}
        >
          <p className="truncate text-xs leading-5 text-muted-foreground first-letter:uppercase">
            {item.label}
          </p>
          <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">
            {item.value}
          </p>
          {item.hint && (
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {item.hint}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
