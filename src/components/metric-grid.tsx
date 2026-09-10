export function MetricGrid({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="min-w-0 rounded-2xl bg-card p-4 shadow-sm"
        >
          <p className="truncate text-xs text-muted-foreground">{item.label}</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
