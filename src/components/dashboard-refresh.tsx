"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const REFRESH_INTERVAL_MS = 120_000;
const MIN_GAP_MS = 30_000;
const OPEN_DIALOG_SELECTOR =
  'dialog[open], [role="dialog"], [role="alertdialog"], [data-slot="dialog-content"]';

/** True when a field differs from its server-rendered default or is being edited. */
function hasUnsavedInput() {
  const active = document.activeElement;
  if (
    active instanceof HTMLElement &&
    (active.isContentEditable ||
      active.matches("textarea, select, input:not([type=button]):not([type=submit]):not([type=reset]):not([type=checkbox]):not([type=radio])"))
  )
    return true;
  const fields = document.querySelectorAll<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >("form input, form textarea, form select");
  for (const field of fields) {
    if (field instanceof HTMLSelectElement) {
      const options = Array.from(field.options);
      if (field.multiple) {
        if (options.some((option) => option.selected !== option.defaultSelected)) return true;
      } else if (options.length) {
        const defaultIndex = options.findIndex((option) => option.defaultSelected);
        if (field.selectedIndex !== (defaultIndex === -1 ? 0 : defaultIndex)) return true;
      }
    } else if (field instanceof HTMLTextAreaElement) {
      if (field.value !== field.defaultValue) return true;
    } else {
      if (["hidden", "submit", "button", "reset", "image"].includes(field.type)) continue;
      if (field.type === "checkbox" || field.type === "radio") {
        if (field.checked !== field.defaultChecked) return true;
        continue;
      }
      // Range/colour inputs report a non-empty value without a value attribute.
      if ((field.type === "range" || field.type === "color") && !field.hasAttribute("value")) continue;
      if (field.value !== field.defaultValue) return true;
    }
  }
  return false;
}

/**
 * Keep timers, midnight totals and another device's entries current while the dashboard is visible.
 * Never refreshes while the tab is hidden, offline, a dialog is open, the user is typing or a form
 * holds unsaved input, or while `pauseSelector` matches (e.g. an open handover).
 */
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
        Date.now() - lastRefresh < MIN_GAP_MS
      )
        return;
      if (
        document.querySelector(pauseSelector) ||
        document.querySelector(OPEN_DIALOG_SELECTOR) ||
        hasUnsavedInput()
      )
        return;
      lastRefresh = Date.now();
      router.refresh();
    };
    const interval = window.setInterval(refresh, REFRESH_INTERVAL_MS);
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
