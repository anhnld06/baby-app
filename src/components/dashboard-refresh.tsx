"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Keep timers, midnight totals and another device's entries current while the dashboard is visible. */
export function DashboardRefresh({
  pauseSelector = "[data-handover][open]",
}: { pauseSelector?: string } = {}) {
  const router = useRouter();
  useEffect(() => {
    let lastRefresh = Date.now();
    const refresh = () => {
      if (
        document.visibilityState !== "visible" ||
        !navigator.onLine ||
        Date.now() - lastRefresh < 15_000
      )
        return;
      // Never interrupt a user copying or reading a handover.
      if (document.querySelector(pauseSelector)) return;
      lastRefresh = Date.now();
      router.refresh();
    };
    const interval = window.setInterval(refresh, 60_000);
    window.addEventListener("focus", refresh);
    window.addEventListener("online", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("online", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router, pauseSelector]);
  return null;
}
