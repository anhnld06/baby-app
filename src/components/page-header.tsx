import { CareIllustration, type CareIllustrationKind } from "@/components/care-illustration";
import { ProfileShortcut } from "@/components/profile-shortcut";
import { NotificationShortcut } from "@/components/notification-shortcut";
import type { ReactNode } from "react";
import { BackLink } from "@/components/back-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { VoiceLogShortcut } from "@/components/voice-log-context";

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
  if (compact) {
    return (
      <header className="mb-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          {backHref && <BackLink fallback={backHref} />}
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <NotificationShortcut /><VoiceLogShortcut /><ThemeToggle /><ProfileShortcut />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
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
    <>
    <header className="mb-6 grid grid-cols-[auto_1fr] items-start gap-3 sm:flex sm:justify-between">
      <div className="contents sm:flex sm:min-w-32 sm:flex-1 sm:items-start sm:gap-2">
        {backHref && (
          <BackLink fallback={backHref} />
        )}
        <div className="col-span-2 row-start-2 min-w-0">
          <h1 className="text-[1.65rem] font-semibold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
          {meta}
        </div>
      </div>
      <div className="col-start-2 row-start-1 ml-auto flex shrink-0 items-center gap-1"><NotificationShortcut /><VoiceLogShortcut /><ThemeToggle /><ProfileShortcut /></div>
    </header>
    </>
  );
}
