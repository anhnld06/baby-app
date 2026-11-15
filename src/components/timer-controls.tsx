"use client";

import { LoaderCircle, Play, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function TimerButton({ active, startLabel, stopLabel }: { active: boolean; startLabel: string; stopLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="sm"
      variant={active ? "default" : "secondary"}
      className="h-11 rounded-xl px-3"
      disabled={pending}
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : active ? <Square className="size-3.5" /> : <Play className="size-4" />}
      {active ? stopLabel : startLabel}
    </Button>
  );
}

export function Elapsed({ startTime }: { startTime?: string }) {
  const [now, setNow] = useState<number>();
  useEffect(() => {
    if (!startTime) return;
    const update = () => setNow(Date.now());
    const timeout = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1_000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [startTime]);
  if (!startTime || now === undefined) return null;
  const seconds = Math.max(0, Math.floor((now - new Date(startTime).getTime()) / 1_000));
  const hours = Math.floor(seconds / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);
  const display = [hours > 0 ? String(hours).padStart(2, "0") : undefined, String(minutes).padStart(2, "0"), String(seconds % 60).padStart(2, "0")].filter(Boolean).join(":");
  return (
    <span role="timer" className="text-xs font-semibold tabular-nums text-primary" aria-label="Thời gian đang bấm giờ" aria-live="off">
      {display}
    </span>
  );
}

