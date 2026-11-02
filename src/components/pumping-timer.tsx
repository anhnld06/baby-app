"use client";

import { Droplets } from "lucide-react";
import { useState } from "react";
import { unstable_rethrow } from "next/navigation";
import { startPumpingTimerAction, finishPumpingTimerAction } from "@/app/pumping-actions";
import { Elapsed, TimerButton } from "@/components/quick-timers";

export function PumpingTimer({ active, locale, compact = false }: {
  active?: { id: string; startTime: string };
  locale: "vi" | "en";
  compact?: boolean;
}) {
  const [error, setError] = useState("");
  const vi = locale === "vi";
  async function submit(formData: FormData) {
    setError("");
    try {
      if (active) await finishPumpingTimerAction(formData);
      else await startPumpingTimerAction();
    } catch (error) {
      unstable_rethrow(error);
      setError(vi ? "Chưa thể lưu cữ hút. Kiểm tra kết nối và thử lại." : "Could not save the session. Check your connection and try again.");
    }
  }
  return <section className={`${compact ? "mt-2" : "mb-5"} rounded-2xl bg-card p-3 shadow-sm`} aria-label={vi ? "Bấm giờ hút sữa" : "Pumping timer"}>
    <div className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><Droplets className="size-5" /></span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{vi ? "Bấm giờ hút sữa" : "Pumping timer"}</p>
        <Elapsed startTime={active?.startTime} locale={locale} />
      </div>
      <form action={submit}>
        {active && <input type="hidden" name="id" value={active.id} />}
        <TimerButton active={!!active} startLabel={vi ? "Bắt đầu hút" : "Start pumping"} stopLabel={vi ? "Kết thúc" : "Finish"} />
      </form>
    </div>
    {!compact && <p className="mt-2 text-sm text-muted-foreground">{vi ? "Bắt đầu khi hút, kết thúc để tự ghi thời lượng rồi nhập lượng sữa. Cữ đang hút được giữ lại khi rời trang." : "Start when pumping; finish to record the duration, then enter milk volume. Your active session is saved when leaving this page."}</p>}
    {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
  </section>;
}
