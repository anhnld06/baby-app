"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Toolbar that stays at the top of the screen while the page scrolls.
 * Once the page's large <h1> scrolls under the bar, the bar shows a compact
 * copy of the title (aria-hidden: the real heading stays the accessible one).
 */
export function StickyPageBar({ title, start, end }: { title: string; start?: ReactNode; end: ReactNode }) {
  const bar = useRef<HTMLDivElement>(null);
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const element = bar.current;
    const heading = element?.closest("header")?.querySelector("h1");
    if (!element || !heading || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setCondensed(!entry.isIntersecting && entry.boundingClientRect.top < element.offsetHeight),
      { rootMargin: `-${element.offsetHeight}px 0px 0px 0px` },
    );
    observer.observe(heading);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={bar}
      data-page-bar
      data-condensed={condensed ? "" : undefined}
      className={cn(
        "sticky top-0 z-30 -mx-4 mb-3 flex min-h-14 items-center gap-2 border-b border-transparent bg-background/95 px-4 pb-1.5 pt-[max(0.375rem,env(safe-area-inset-top))] transition-[border-color,box-shadow] duration-200 sm:-mx-6 sm:px-6",
        // Stay 95% opaque even with blur: content behind must never compete with the title (some WebViews skip the blur).
        "supports-[backdrop-filter:blur(12px)]:backdrop-blur-xl",
        "data-condensed:border-border/60 data-condensed:shadow-[0_10px_24px_-22px_rgba(15,23,42,0.45)]",
      )}
    >
      {start}
      <span
        aria-hidden="true"
        className={cn(
          "min-w-0 flex-1 truncate text-base font-semibold tracking-tight transition-[opacity,transform] duration-200 motion-reduce:transition-none",
          condensed ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0",
        )}
      >
        {title}
      </span>
      <div className="ml-auto flex shrink-0 items-center gap-1">{end}</div>
    </div>
  );
}
