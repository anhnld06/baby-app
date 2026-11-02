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
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  meta?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-32 flex-1 items-start gap-2">
        {backHref && (
          <BackLink fallback={backHref} />
        )}
        <div className="min-w-0">
          <h1 className="text-[1.65rem] font-semibold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
          {meta}
        </div>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1"><NotificationShortcut /><VoiceLogShortcut /><ThemeToggle /><ProfileShortcut /></div>
    </header>
  );
}
