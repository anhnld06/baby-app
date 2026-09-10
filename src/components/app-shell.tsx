"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Baby, BookHeart, Bot, HeartPulse, House, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

type Labels = {
  home: string;
  mother: string;
  baby: string;
  handbook: string;
  assistant: string;
  profile: string;
};

export function AppShell({
  children,
  labels,
  appName,
}: {
  children: React.ReactNode;
  labels: Labels;
  appName: string;
}) {
  const pathname = usePathname();
  const links = [
    { href: "/", label: labels.home, icon: House, paths: ["/"] },
    { href: "/mother", label: labels.mother, icon: HeartPulse, paths: ["/mother"] },
    { href: "/baby", label: labels.baby, icon: Baby, paths: ["/baby", "/tracking", "/activity"] },
    { href: "/knowledge", label: labels.handbook, icon: BookHeart, paths: ["/knowledge", "/stories"] },
    { href: "/profile", label: labels.profile, icon: UserRound, paths: ["/profile"] },
  ];
  return (
    <div className="mx-auto min-h-dvh w-full max-w-7xl overflow-x-clip bg-background lg:flex lg:border-x lg:border-border/60">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border/70 bg-card/60 p-4 lg:flex">
        <Link href="/" className="mb-7 flex items-center gap-3 px-2 py-2">
          <Image
            src="/icons/vani-family-192.png"
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-2xl object-cover shadow-sm"
          />
          <span><strong className="block text-lg">{appName}</strong><span className="text-xs text-muted-foreground">Nhật ký gia đình</span></span>
        </Link>
        <nav className="space-y-1" aria-label="Điều hướng chính">
          {links.map(({ href, label, icon: Icon, paths }) => {
            const active = paths.some((path) => path === "/" ? pathname === "/" : pathname.startsWith(path));
            return <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors", active && "bg-secondary text-primary")}><Icon className="size-5" strokeWidth={active ? 2.5 : 1.8} />{label}</Link>;
          })}
        </nav>
        <div className="mt-auto">
          <Link href="/assistant" className={cn("flex items-center gap-3 rounded-2xl bg-primary px-3 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20", pathname.startsWith("/assistant") && "ring-2 ring-ring ring-offset-2 ring-offset-background")}><Bot className="size-5" />{labels.assistant}</Link>
        </div>
      </aside>
      <main className="page-enter mx-auto min-w-0 w-full max-w-3xl flex-1 px-4 pb-36 pt-5 sm:px-6 lg:pb-20 lg:pt-7">{children}</main>
      <nav
        aria-label="Main navigation"
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto grid w-full grid-cols-5 border-t border-border/70 bg-card/98 px-1 pt-2 shadow-[0_-8px_24px_-20px_rgba(0,0,0,0.35)] lg:hidden"
      >
        {links.map(({ href, label, icon: Icon, paths }) => {
          const active = paths.some((path) => path === "/" ? pathname === "/" : pathname.startsWith(path));
          return (
            <Link
              key={href}
              href={href}
              prefetch
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-14 min-w-0 touch-manipulation flex-col items-center justify-center gap-1 rounded-2xl px-0.5 text-[10px] font-medium text-muted-foreground transition-[color,background-color,transform] duration-100 active:scale-95",
                active && "bg-secondary text-primary",
              )}
            >
              <Icon className="size-5" strokeWidth={active ? 2.5 : 1.8} />
              <span className="max-w-full truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
