import { CareIllustration, type CareIllustrationKind } from "@/components/care-illustration";
import { ProfileShortcut } from "@/components/profile-shortcut";
import { NotificationShortcut } from "@/components/notification-shortcut";
import type { ReactNode } from "react";
import { BackLink } from "@/components/back-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { VoiceLogShortcut } from "@/components/voice-log-context";
import { StickyPageBar } from "@/components/sticky-page-bar";

export function PageHeader({
  title,
  subtitle,
  backHref,
  meta,
  compact = false,
  illustration,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  meta?: ReactNode;
  compact?: boolean;
  illustration?: CareIllustrationKind;
}) {
  const actions = <><NotificationShortcut /><VoiceLogShortcut /><ThemeToggle /><ProfileShortcut /></>;
  const bar = <StickyPageBar title={title} start={backHref ? <BackLink fallback={backHref} /> : undefined} end={actions} />;
  // `contents`: the header box must not wrap the sticky bar, otherwise the bar only sticks
  // while the (short) header is on screen. Its containing block becomes the whole page.
  if (compact) {
    return (
      <header className="contents">
        {bar}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{subtitle}</p>}
            {meta}
          </div>
          {illustration && (
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-sky-50 dark:bg-sky-950/50 [&>.care-illustration]:size-14 sm:size-20 sm:[&>.care-illustration]:size-16">
              <CareIllustration kind={illustration} small />
            </span>
          )}
        </div>
      </header>
    );
  }
  return (
    <header className="contents">
      {bar}
      <div className="mb-6 min-w-0">
        <h1 className="text-[1.65rem] font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
        {meta}
      </div>
    </header>
  );
}
