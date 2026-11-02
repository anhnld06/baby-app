"use client";

import Link from "next/link";
import { useEffect, useRef, type ComponentProps, type ReactNode } from "react";

const EDIT_TARGET = "record-edit-form";

function revealEditForm(element: HTMLElement) {
  element.focus({ preventScroll: true });
  element.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    block: "start",
  });
}

/** A stable destination for edit links; switching records also resets form drafts. */
export function EditFormTarget({ recordId, children }: { recordId?: string; children: ReactNode }) {
  const target = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!recordId) return;
    const frame = requestAnimationFrame(() => {
      if (target.current) revealEditForm(target.current);
    });
    return () => cancelAnimationFrame(frame);
  }, [recordId]);

  return <div key={recordId ?? "new"} ref={target} id={recordId ? EDIT_TARGET : undefined}
    data-edit-record={recordId} tabIndex={recordId ? -1 : undefined}
    aria-label={recordId ? "Biểu mẫu chỉnh sửa" : undefined}
    className="min-w-0 scroll-mt-6 outline-none">
    {children}
  </div>;
}

export function EditRecordLink({ href, onClick, ...props }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  return <Link {...props} href={`${href.split("#")[0]}#${EDIT_TARGET}`} replace scroll={false}
    onClick={(event) => {
      onClick?.(event);
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const destination = new URL(href, window.location.href);
      if (destination.pathname === window.location.pathname && destination.search === window.location.search) {
        const target = document.getElementById(EDIT_TARGET);
        if (target) revealEditForm(target);
      }
    }} />;
}
