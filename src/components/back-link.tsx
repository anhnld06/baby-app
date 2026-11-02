"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { NavigationLedger, parentRoute, type BackTarget } from "@/lib/navigation";

// Only records routes visited inside the authenticated shell, never a login or external page.
let target: BackTarget | undefined;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
const snapshot = () => target;
const serverSnapshot = () => undefined;

export function NavigationHistory() {
  useEffect(() => {
    const history = window.history;
    const key = "vaniNavigation";
    const session = crypto.randomUUID();
    const currentHref = () => `${window.location.pathname}${window.location.search}${window.location.hash}`;
    let ledger = new NavigationLedger(currentHref());
    const originalPush = history.pushState;
    const originalReplace = history.replaceState;
    const publish = () => {
      target = ledger.previous();
      listeners.forEach((listener) => listener());
    };
    const stamp = (data: unknown, index: number) => ({
      ...(typeof data === "object" && data !== null ? data : {}),
      [key]: { session, index },
    });
    // Preserve all framework-owned history fields. No router internals are modified.
    originalReplace.call(history, stamp(history.state, 0), "");
    const push: History["pushState"] = (data, unused, url) => {
      originalPush.call(history, stamp(data, ledger.index + 1), unused, url);
      ledger.push(currentHref());
      publish();
    };
    const replace: History["replaceState"] = (data, unused, url) => {
      originalReplace.call(history, stamp(data, ledger.index), unused, url);
      ledger.replace(currentHref());
      publish();
    };
    const traverse = (event: PopStateEvent) => {
      const entry = event.state?.[key];
      if (entry?.session !== session || !ledger.traverse(entry.index)) {
        // A direct visit or a different document is not a trusted back destination.
        ledger = new NavigationLedger(currentHref());
        originalReplace.call(history, stamp(history.state, 0), "");
      }
      publish();
    };
    history.pushState = push;
    history.replaceState = replace;
    window.addEventListener("popstate", traverse);
    publish();
    return () => {
      if (history.pushState === push) history.pushState = originalPush;
      if (history.replaceState === replace) history.replaceState = originalReplace;
      window.removeEventListener("popstate", traverse);
      target = undefined;
    };
  }, []);
  return null;
}

export function BackLink({ fallback }: { fallback?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const previous = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return (
    <Link
      href={previous?.href ?? fallback ?? parentRoute(pathname)}
      replace
      aria-label="Quay lại"
      className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-2xl border border-border/60 bg-card shadow-sm transition-[background-color,transform] hover:bg-secondary active:scale-95"
      onNavigate={(event) => {
        // Editing is a state of a list, not another level in the navigation hierarchy.
        if (["edit", "record"].some((key) => new URLSearchParams(window.location.search).has(key))) {
          event.preventDefault();
          router.replace(pathname, { scroll: false });
        } else if (previous) {
          event.preventDefault();
          window.history.go(previous.delta);
        }
      }}
    >
      <ArrowLeft className="size-5" />
    </Link>
  );
}
