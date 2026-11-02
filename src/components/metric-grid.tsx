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
          className="surface-panel min-w-0 p-4"
        >
          <p className="text-xs leading-5 text-muted-foreground">{item.label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
