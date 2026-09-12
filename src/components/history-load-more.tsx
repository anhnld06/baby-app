import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { nextHistoryLimit } from "@/lib/pagination";

export function HistoryLoadMore({
  href,
  currentLimit,
  increment = 30,
  maximum = 300,
  hasMore,
}: {
  href: string;
  currentLimit: number;
  increment?: number;
  maximum?: number;
  hasMore: boolean;
}) {
  if (!hasMore || currentLimit >= maximum) return null;
  const separator = href.includes("?") ? "&" : "?";
  return (
    <Link
      href={`${href}${separator}limit=${nextHistoryLimit(currentLimit, increment, maximum)}`}
      scroll={false}
      className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-dashed bg-card px-4 text-sm font-semibold text-primary"
    >
      <ChevronDown className="size-4" />
      Xem thêm lịch sử
    </Link>
  );
}
