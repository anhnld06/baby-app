export default function RootLoading() {
  return (
    <div
      className="grid min-h-dvh place-items-center bg-background px-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Đang tải nội dung…
        </p>
      </div>
    </div>
  );
}
