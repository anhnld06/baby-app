import type { ReactNode } from "react";
import { CareIllustration, type CareIllustrationKind } from "@/components/care-illustration";

export function CareSummary({ kind, title, children }: {
  kind: CareIllustrationKind;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-label={title} className="mb-4 flex min-w-0 items-center gap-3 rounded-3xl border border-border/60 bg-secondary/40 p-4 sm:gap-4 sm:p-5">
      <span className="shrink-0 [&>.care-illustration]:size-14 sm:[&>.care-illustration]:size-16">
        <CareIllustration kind={kind} small />
      </span>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-6 sm:text-base">{title}</h2>
        <div className="mt-1 break-words text-xs leading-5 text-muted-foreground sm:text-sm">{children}</div>
      </div>
    </section>
  );
}
