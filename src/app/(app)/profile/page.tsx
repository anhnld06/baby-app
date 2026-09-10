import Link from "next/link";
import {
  Baby as BabyIcon,
  ChevronRight,
  Languages,
  LogOut,
  Plus,
  UserRound,
} from "lucide-react";
import { setLocaleAction } from "@/app/actions";
import { logoutAction } from "@/app/auth-actions";
import { PageHeader } from "@/components/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { formatAge, formatDateOfBirth } from "@/lib/date";
import { db } from "@/lib/db";
import { getDictionary, getLocale } from "@/lib/i18n";
import { profileCoverUrl } from "@/lib/profile-cover";
import { cn } from "@/lib/utils";

export default async function ProfilePage() {
  const [user, t, locale] = await Promise.all([
    requireUser(),
    getDictionary(),
    getLocale(),
  ]);
  const [mother, babies] = await Promise.all([
    db.mother.findUnique({
      where: { userId: user.id },
      include: { coverImage: { select: { updatedAt: true } } },
    }),
    db.baby.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
      include: { coverImage: { select: { updatedAt: true } } },
    }),
  ]);
  const primaryBaby = babies[0];
  const primaryBabyCover = primaryBaby?.coverImage
    ? profileCoverUrl("baby", primaryBaby.id, primaryBaby.coverImage.updatedAt)
    : undefined;
  return (
    <>
      <PageHeader title={t.profile.title} subtitle={t.profile.subtitle} />
      {primaryBaby && (
        <section
          className={cn(
            "relative mb-7 overflow-hidden rounded-3xl p-5 text-primary-foreground shadow-lg shadow-primary/15",
            primaryBabyCover ? "bg-cover bg-center" : "bg-gradient-to-br from-primary to-fuchsia-500",
          )}
          style={primaryBabyCover
            ? { backgroundImage: `linear-gradient(90deg, rgb(62 24 52 / 82%), rgb(110 35 89 / 48%)), url(${JSON.stringify(primaryBabyCover)})` }
            : undefined}
        >
          {!primaryBabyCover && <div className="absolute -right-8 -top-10 size-36 rounded-full bg-white/10" />}
          <p className="text-xs font-medium uppercase tracking-[.18em] opacity-75">
            {t.profile.family}
          </p>
          <div className="relative mt-4 flex items-center gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-3xl bg-white/18 text-2xl font-semibold">
              {primaryBaby.nickname?.slice(0, 1) ??
                primaryBaby.name.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-semibold">
                {primaryBaby.nickname ?? primaryBaby.name}
              </h2>
              <p className="truncate text-sm opacity-90">{primaryBaby.name}</p>
              <p className="mt-1 text-xs opacity-75">
                {formatAge(primaryBaby.dateOfBirth, new Date(), locale)}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-3">
        <ProfileLink
          href="/profile/mother"
          icon={UserRound}
          title={t.profile.mother}
          value={mother?.name ?? t.profile.notAdded}
          imageUrl={mother?.coverImage
            ? profileCoverUrl("mother", mother.id, mother.coverImage.updatedAt)
            : undefined}
          detail={
            mother?.bloodType
              ? `${t.profile.bloodType}: ${mother.bloodType}`
              : undefined
          }
        />
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t.profile.baby}</h2>
          <Link
            href="/profile/baby/new"
            className={cn(
              buttonVariants({ size: "sm", variant: "secondary" }),
              "rounded-xl",
            )}
          >
            <Plus className="size-4" />
            {t.profile.addBaby}
          </Link>
        </div>
        <div className="space-y-3">
          {babies.map((baby) => (
            <ProfileLink
              key={baby.id}
              href={`/profile/baby/${baby.id}`}
              icon={BabyIcon}
              title={baby.nickname ?? baby.name}
              value={baby.name}
              detail={formatDateOfBirth(baby.dateOfBirth)}
              imageUrl={baby.coverImage
                ? profileCoverUrl("baby", baby.id, baby.coverImage.updatedAt)
                : undefined}
            />
          ))}
        </div>
      </section>

      <section className="mt-7 rounded-2xl bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary">
              <Languages className="size-5" />
            </span>
            <span className="font-medium">{t.profile.language}</span>
          </div>
          <form action={setLocaleAction}>
            <input
              type="hidden"
              name="locale"
              value={locale === "vi" ? "en" : "vi"}
            />
            <Button
              type="submit"
              variant="secondary"
              className="h-10 rounded-xl"
            >
              {locale === "vi" ? "English" : "Tiếng Việt"}
            </Button>
          </form>
        </div>
      </section>

      <section className="mt-3 rounded-2xl bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Tên đăng nhập</p>
            <p className="truncate font-medium">@{user.username}</p>
          </div>
          <form action={logoutAction}>
            <Button type="submit" variant="outline" className="h-10 rounded-xl">
              <LogOut className="size-4" />
              {t.profile.signOut}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}

function ProfileLink({
  href,
  icon: Icon,
  title,
  value,
  detail,
  imageUrl,
}: {
  href: string;
  icon: typeof UserRound;
  title: string;
  value: string;
  detail?: string;
  imageUrl?: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-w-0 items-center gap-3 rounded-2xl bg-card p-4 shadow-sm transition-transform active:scale-[.99]"
    >
      <span
        className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary bg-cover bg-center text-primary"
        style={imageUrl ? { backgroundImage: `url(${JSON.stringify(imageUrl)})` } : undefined}
      >
        {!imageUrl && <Icon className="size-5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-muted-foreground">{title}</span>
        <strong className="mt-0.5 block truncate font-medium">{value}</strong>
        {detail && (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {detail}
          </span>
        )}
      </span>
      <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
    </Link>
  );
}
