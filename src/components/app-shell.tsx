"use client";

import Image from "next/image";
import { ProfileLabelContext } from "@/components/profile-shortcut";
import { NotificationCountContext } from "@/components/notification-shortcut";
import { QuickLogSheet } from "@/components/quick-log-sheet";
import Link from "next/link";
import { useLinkStatus } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Baby, ChartColumn, BookHeart, Bot, HeartPulse, House, UserRound } from "lucide-react";
import { VoiceLogContext } from "@/components/voice-log-context";
import { NavigationHistory } from "@/components/back-link";
import { isRouteActive } from "@/lib/navigation";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Labels = {
  home: string;
  mother: string;
  baby: string;
  handbook: string;
  assistant: string;
  profile: string;
};

function NavigationHint() {
  const { pending } = useLinkStatus();
  return <span aria-hidden="true" className={cn("absolute right-2 top-2 size-1.5 rounded-full bg-current opacity-0 transition-opacity delay-150", pending && "animate-pulse opacity-100")} />;
}

export function AppShell({
  children,
  labels,
  appName,
  voiceLog,
  unreadCount = 0,
}: {
  children: React.ReactNode;
  labels: Labels;
  appName: string;
  unreadCount?: number;
  voiceLog?: { babyId: string; locale: Locale };
}) {
  const pathname = usePathname();
  const query = useSearchParams();
  const owner = query.get("owner");
  const recordEditor = (query.get("new") === "1" || !!query.get("edit")) && (["/tracking/feeding", "/tracking/sleep", "/tracking/diaper", "/tracking/temperature", "/tracking/medication", "/mother/pumping", "/baby/meals"].includes(pathname));
  const motherVaccinations = owner === "mother";
  const links = [
    { href: "/", label: labels.home, icon: House, paths: ["/"] },
    { href: "/mother", label: labels.mother, icon: HeartPulse, paths: ["/mother", ...(motherVaccinations ? ["/vaccination-schedule"] : [])] },
    { href: "/baby", label: labels.baby, icon: Baby, paths: ["/baby", "/tracking", "/activity", ...(!motherVaccinations ? ["/vaccination-schedule"] : [])] },
    { href: "/knowledge", label: labels.handbook, icon: BookHeart, paths: ["/knowledge", "/stories", "/assistant"] },
    { href: "/profile", label: labels.profile, icon: UserRound, paths: ["/profile"] },
  ];
  const statisticsLink = { href: "/statistics", label: voiceLog?.locale === "en" ? "Statistics" : "Thống kê", icon: ChartColumn, paths: ["/statistics"] };
  const desktopLinks = [links[0], statisticsLink, ...links.slice(1)];
  const mobileLinks = [links[0], links[1], links[2], statisticsLink, links[3]];
  return (
    <ProfileLabelContext.Provider value={labels.profile}>
    <VoiceLogContext.Provider value={voiceLog}>
    <NotificationCountContext.Provider value={unreadCount}>
    <div className="mx-auto min-h-dvh w-full max-w-[1440px] overflow-x-clip bg-background lg:flex lg:border-x lg:border-border/50">
      <NavigationHistory />
      {!recordEditor && <QuickLogSheet babyId={voiceLog?.babyId} />}
      <a href="#main-content" className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-xl bg-primary px-4 py-3 text-primary-foreground focus:translate-y-0">Đến nội dung chính</a>
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border/70 bg-card p-4 lg:flex">
        <Link href="/" className="mb-7 flex items-center gap-3 px-2 py-2">
          <Image
            src="/icons/vani-photo-192.png"
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-2xl object-cover ring-4 ring-secondary"
          />
          <span><strong className="block text-lg">{appName}</strong><span className="text-xs text-muted-foreground">Nhật ký gia đình</span></span>
        </Link>
        <nav className="space-y-1.5" aria-label="Điều hướng chính">
          {desktopLinks.map(({ href, label, icon: Icon, paths }) => {
            const active = paths.some((path) => isRouteActive(pathname, path));
            return <Link key={href} href={href} replace={pathname === href} aria-current={active ? "page" : undefined} className={cn("relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted", active && "bg-secondary text-primary shadow-[inset_3px_0_0_var(--primary)]")}><Icon className="size-5" strokeWidth={active ? 2.5 : 1.8} />{label}<NavigationHint /></Link>;
          })}
        </nav>
        <div className="mt-auto">
          <Link href="/assistant" className={cn("flex items-center gap-3 rounded-2xl bg-primary px-3 py-3 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/15", pathname.startsWith("/assistant") && "ring-2 ring-ring ring-offset-2 ring-offset-background")}><Bot className="size-5" />{labels.assistant}</Link>
        </div>
      </aside>
      <main id="main-content" tabIndex={-1} className="mx-auto min-w-0 w-full max-w-5xl flex-1 px-4 pb-36 pt-[max(1.5rem,env(safe-area-inset-top))] outline-none sm:px-6 lg:pb-20 lg:pt-9">{children}</main>
      <nav
        aria-label="Điều hướng chính"
        hidden={recordEditor}
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto grid w-full grid-cols-5 border-t border-border/60 bg-card/95 px-2 pt-2 shadow-[0_-8px_32px_-20px_rgba(0,0,0,0.2)] supports-[backdrop-filter:blur(12px)]:bg-card/85 supports-[backdrop-filter:blur(12px)]:backdrop-blur-xl lg:hidden"
      >
        {mobileLinks.map(({ href, label, icon: Icon, paths }) => {
          const active = paths.some((path) => isRouteActive(pathname, path));
          return (
            <Link
              key={href}
              href={href}
              replace={pathname === href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-h-14 min-w-0 touch-manipulation flex-col items-center justify-center gap-1 rounded-2xl px-0.5 text-[11px] font-medium text-muted-foreground transition-[color,background-color,transform] duration-150 active:scale-95",
                active && "bg-secondary text-primary",
              )}
            >
              <Icon className="size-5" strokeWidth={active ? 2.5 : 1.8} />
              <span className="max-w-full truncate">{label}</span>
              <NavigationHint />
            </Link>
          );
        })}
      </nav>
    </div>
    </NotificationCountContext.Provider>
    </VoiceLogContext.Provider>
    </ProfileLabelContext.Provider>
  );
}
