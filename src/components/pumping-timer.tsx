"use client";

import { PumpingIcon as Droplets } from "@/components/app-icons";
import { useState } from "react";
import { unstable_rethrow } from "next/navigation";
import { startPumpingTimerAction, finishPumpingTimerAction } from "@/app/pumping-actions";
import { Elapsed, TimerButton } from "@/components/timer-controls";

export function PumpingTimer({ active, compact = false }: {
  active?: { id: string; startTime: string };
  compact?: boolean;
}) {
  const [error, setError] = useState("");
  async function submit(formData: FormData) {
    setError("");
    try {
      if (active) await finishPumpingTimerAction(formData);
      else await startPumpingTimerAction();
    } catch (error) {
      unstable_rethrow(error);
      setError("Chưa thể lưu cữ hút. Kiểm tra kết nối và thử lại.");
    }
  }
  return <section className={`${compact ? "mt-2" : "mb-5"} rounded-2xl bg-card p-3 shadow-sm`} aria-label="Bấm giờ hút sữa">
    <div className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><Droplets className="size-5" /></span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">Bấm giờ hút sữa</p>
        <Elapsed startTime={active?.startTime} />
      </div>
      <form action={submit}>
        {active && <input type="hidden" name="id" value={active.id} />}
        <TimerButton active={!!active} startLabel="Bắt đầu hút" stopLabel="Kết thúc" />
      </form>
    </div>
    {!compact && <p className="mt-2 text-sm text-muted-foreground">Bắt đầu khi hút, kết thúc để tự ghi thời lượng rồi nhập lượng sữa. Cữ đang hút được giữ lại khi rời trang.</p>}
    {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
  </section>;
}
