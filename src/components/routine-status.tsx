"use client";
import { useEffect, useState } from "react";
export function RoutineStatus({
  at,
  minutes,
  completed,
}: {
  at: string;
  minutes: number | null;
  completed: boolean;
}) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);
  const start = new Date(at).getTime();
  const end = start + (minutes ?? 0) * 60000;
  const ongoing =
    now !== null && minutes !== null && now >= start && now < end && !completed;
  const label = completed
    ? "Đã hoàn thành"
    : ongoing
      ? `Trong khung dự kiến · còn ${Math.ceil((end - now!) / 60000)} phút`
      : now !== null && now >= start
        ? "Đã đến giờ dự kiến · chưa đánh dấu"
        : "Dự kiến";
  return (
    <span
      className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${completed ? "bg-emerald-100 text-emerald-800" : ongoing ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}`}
    >
      {label}
    </span>
  );
}
