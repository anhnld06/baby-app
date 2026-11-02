export default function AppLoading() {
  return (
    <div className="space-y-5" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Đang tải nội dung…</span>

      <div className="fixed inset-x-0 top-0 z-[70] h-1 overflow-hidden bg-primary/15">
        <div className="h-full w-1/2 animate-[loading-bar_1.1s_ease-in-out_infinite] rounded-full bg-primary" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-28 animate-pulse rounded-full bg-muted" />
        <div className="h-8 w-52 max-w-[75%] animate-pulse rounded-xl bg-muted" />
      </div>

      <div className="h-10 w-40 animate-pulse rounded-full bg-muted" />
      <div className="h-52 animate-pulse rounded-[2rem] bg-muted" />
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-3xl bg-muted" />
        ))}
      </div>

      <div className="space-y-3 rounded-3xl border border-border/70 bg-card p-4">
        <div className="h-5 w-36 animate-pulse rounded-full bg-muted" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
