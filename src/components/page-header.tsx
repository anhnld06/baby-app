import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <header className="mb-6 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-2">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Back"
            className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-full bg-card shadow-sm"
          >
            <ArrowLeft className="size-5" />
          </Link>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
          {meta}
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
