"use client";

export function RetryButton() {
  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="mt-5 inline-flex min-h-12 items-center rounded-2xl bg-primary px-5 font-medium text-primary-foreground"
    >
      Thử tải lại
    </button>
  );
}
