import Link from "next/link";
import {
  AlertTriangle,
  Baby,
  BedDouble,
  ChevronRight,
  Clock3,
  Droplets,
  Pill,
  Plus,
  Ruler,
  Shell,
  Smile,
  Sparkles,
  Syringe,
  Weight,
} from "lucide-react";
import { BabySwitcher } from "@/components/baby-switcher";
import { PageHeader } from "@/components/page-header";
import { TimelineList } from "@/components/timeline-list";
import { Card, CardContent } from "@/components/ui/card";
import { buildTimeline } from "@/features/timeline/timeline";
import { computeBabyDue, computeMotherDue } from "@/features/vaccination/due";
import { requireUser } from "@/lib/auth";
import { getSelectedBabyId, listBabies, pickSelectedBaby } from "@/lib/data";
import {
  formatAge,
  formatDuration,
  getLocalDayRange,
} from "@/lib/date";
import { db } from "@/lib/db";
import { getDictionary, getLocale } from "@/lib/i18n";
import { totalDurationMinutes } from "@/lib/metrics";

export default async function DashboardPage() {
  const [user, t, locale] = await Promise.all([
    requireUser(),
    getDictionary(),
    getLocale(),
  ]);
  const [babies, selectedBabyId] = await Promise.all([
    listBabies(user.id),
    getSelectedBabyId(),
  ]);
  const baby = pickSelectedBaby(babies, selectedBabyId);
  if (!baby)
    return (
      <>
        <PageHeader title={t.appName} subtitle={t.tagline} />
        <Card>
          <CardContent className="p-6 text-center">
            <Baby className="mx-auto mb-3 size-8 text-primary" />
            <p>{t.common.noData}</p>
            <Link
              href="/profile"
              className="mt-4 inline-block text-primary underline"
            >
              {t.profile.baby}
            </Link>
          </CardContent>
        </Card>
      </>
    );
  const now = new Date();
  const { start, end } = getLocalDayRange(now);
  const [feedings, sleeps, diapers, growth, vaccinations, prescriptions, toothRecords] = await Promise.all([
    db.feeding.findMany({
      where: { babyId: baby.id, startTime: { gte: start, lt: end } },
      orderBy: { startTime: "desc" },
    }),
    db.sleepEntry.findMany({
      where: { babyId: baby.id, startTime: { gte: start, lt: end } },
      orderBy: { startTime: "desc" },
    }),
    db.diaperEntry.findMany({
      where: { babyId: baby.id, changedAt: { gte: start, lt: end } },
      orderBy: { changedAt: "desc" },
    }),
    db.growthEntry.findMany({
      where: { babyId: baby.id },
      orderBy: { measuredAt: "desc" },
      take: 3,
    }),
    db.vaccinationRecord.findMany({
      where: { babyId: baby.id },
      orderBy: { administeredAt: "desc" },
      take: 3,
    }),
    db.prescription.findMany({
      where: { babyId: baby.id },
      orderBy: { issuedAt: "desc" },
      include: { items: true },
      take: 3,
    }),
    db.toothRecord.findMany({
      where: { babyId: baby.id },
      orderBy: { eruptedAt: "desc" },
      take: 3,
    }),
  ]);
  const [allVaccinations, mother] = await Promise.all([
    db.vaccinationRecord.findMany({ where: { babyId: baby.id }, select: { vaccineName: true, doseNumber: true } }),
    db.mother.findUnique({ where: { userId: user.id }, include: { pregnancies: { orderBy: { createdAt: "desc" }, take: 1 } } }),
  ]);
  const pregnancy = mother?.pregnancies[0];
  const motherRecords = mother
    ? await db.motherVaccinationRecord.findMany({ where: { motherId: mother.id }, select: { vaccineName: true, doseNumber: true } })
    : [];
  const dueCount = [
    ...computeBabyDue(baby.dateOfBirth, allVaccinations),
    ...(pregnancy?.lastMenstrualPeriod ? computeMotherDue(pregnancy.lastMenstrualPeriod, motherRecords) : []),
  ].filter((item) => item.status === "DUE" || item.status === "OVERDUE").length;
  const timeline = buildTimeline(
    { feedings, sleeps, diapers, growthEntries: growth, vaccinations, prescriptions, toothRecords },
    {
      feeding: t.dashboard.feeding,
      sleep: t.dashboard.sleep,
      diaper: t.dashboard.diaper,
      growth: t.dashboard.growth,
      sleeping: t.dashboard.sleeping,
      vaccination: t.dashboard.vaccination,
      prescription: t.dashboard.prescription,
      teeth: t.dashboard.teeth,
      centralIncisor: t.tracking.centralIncisor,
      lateralIncisor: t.tracking.lateralIncisor,
      canine: t.tracking.canine,
      firstMolar: t.tracking.firstMolar,
      secondMolar: t.tracking.secondMolar,
    },
    locale,
  ).slice(0, 5);
  const activeSleep = sleeps.find((sleep) => sleep.endTime === null);
  const lastFeed = feedings[0];
  const wet = diapers.filter(
    (item) => item.type === "WET" || item.type === "BOTH",
  ).length;
  const stool = diapers.filter(
    (item) => item.type === "STOOL" || item.type === "BOTH",
  ).length;
  const quickActions = [
    {
      href: "/tracking/feeding",
      label: t.dashboard.feeding,
      icon: Baby,
      className:
        "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    },
    {
      href: "/tracking/sleep",
      label: t.dashboard.sleep,
      icon: BedDouble,
      className:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
    },
    {
      href: "/tracking/diaper",
      label: t.dashboard.diaper,
      icon: Shell,
      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    },
    {
      href: "/tracking/growth",
      label: t.dashboard.growth,
      icon: Ruler,
      className: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    },
    {
      href: "/tracking/vaccination",
      label: t.dashboard.vaccination,
      icon: Syringe,
      className: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
    },
    {
      href: "/tracking/prescription",
      label: t.dashboard.prescription,
      icon: Pill,
      className:
        "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    },
    {
      href: "/tracking/teeth",
      label: t.dashboard.teeth,
      icon: Smile,
      className: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
    },
  ];
  return (
    <>
      <PageHeader title={`${t.dashboard.hello} 🌿`} subtitle={user.name} />
      <BabySwitcher
        babies={babies}
        selectedBabyId={baby.id}
        addLabel={t.profile.addBaby}
      />
      <section className="relative overflow-hidden rounded-3xl bg-primary px-5 py-6 text-primary-foreground shadow-lg shadow-primary/15">
        <div className="absolute -right-5 -top-8 size-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 left-10 size-24 rounded-full bg-white/10" />
        <div className="relative">
          <div className="flex items-center gap-2 text-sm opacity-85">
            <Sparkles className="size-4" />
            {t.dashboard.age}
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            {baby.name}
          </h2>
          <p className="mt-1 text-sm opacity-90">
            {baby.nickname ? `${baby.nickname} · ` : ""}
            {formatAge(baby.dateOfBirth, now, locale)}
          </p>
        </div>
      </section>
      <section className="mt-5 grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-xl bg-secondary text-primary">
                <Weight className="size-4" />
              </span>
              {growth[0]?.weightKg !== undefined &&
                growth[0]?.weightKg !== null && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {t.dashboard.healthy}
                  </span>
                )}
            </div>
            <p className="mt-3 text-2xl font-semibold">
              {growth[0]?.weightKg ? `${growth[0].weightKg} kg` : "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {t.tracking.weight}
              {growth[0] &&
                ` · ${new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short" }).format(growth[0].measuredAt)}`}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-xl bg-secondary text-primary">
                <Ruler className="size-4" />
              </span>
              {growth[0]?.heightCm !== undefined &&
                growth[0]?.heightCm !== null && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {t.dashboard.healthy}
                  </span>
                )}
            </div>
            <p className="mt-3 text-2xl font-semibold">
              {growth[0]?.heightCm ? `${growth[0].heightCm} cm` : "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {t.tracking.height}
              {growth[0] &&
                ` · ${new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short" }).format(growth[0].measuredAt)}`}
            </p>
          </CardContent>
        </Card>
      </section>
      <Link
        href="/tracking/growth"
        className="mt-3 flex items-center justify-between rounded-2xl bg-card p-4 shadow-sm"
      >
        <span className="text-sm font-medium">{t.dashboard.growthStandard}</span>
        <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
          {t.dashboard.viewDetail}
          <ChevronRight className="size-4" />
        </span>
      </Link>
      {dueCount > 0 && (
        <Link
          href="/vaccination-schedule"
          className="mt-3 flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <AlertTriangle className="size-5" />
          </span>
          <span className="flex-1 text-sm font-medium">
            {dueCount} {t.vaccinationSchedule.dashboardCount}
          </span>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </Link>
      )}
      <section className="mt-7">
        <h2 className="mb-3 text-lg font-semibold">{t.dashboard.quickAdd}</h2>
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map(({ href, label, icon: Icon, className }) => (
            <Link
              href={href}
              key={href}
              className="group flex min-h-24 min-w-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-card px-1 text-xs font-medium shadow-sm transition-transform active:scale-95"
            >
              <span
                className={`relative grid size-11 place-items-center rounded-2xl ${className}`}
              >
                <Icon className="size-5" />
                <Plus className="absolute -right-1 -top-1 size-4 rounded-full bg-card p-0.5" />
              </span>
              <span className="max-w-full truncate px-1">{label}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="mt-7">
        <h2 className="mb-3 text-lg font-semibold">{t.dashboard.overview}</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="size-4 text-orange-600" />
                {t.dashboard.lastFeed}
              </div>
              <p className="mt-3 text-xl font-semibold">
                {lastFeed
                  ? new Intl.RelativeTimeFormat(locale, {
                      numeric: "auto",
                    }).format(
                      -Math.round(
                        (now.getTime() - lastFeed.startTime.getTime()) /
                          3_600_000,
                      ),
                      "hour",
                    )
                  : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {feedings.length} {t.dashboard.feedsToday}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BedDouble className="size-4 text-indigo-600" />
                {activeSleep ? t.dashboard.sleeping : t.dashboard.awake}
              </div>
              <p className="mt-3 text-xl font-semibold">
                {formatDuration(totalDurationMinutes(sleeps, now), locale)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.dashboard.sleepToday}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Droplets className="size-4 text-emerald-600" />
                {t.dashboard.diaper}
              </div>
              <p className="mt-3 text-xl font-semibold">
                {wet} / {stool}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.dashboard.wet} · {t.dashboard.stool}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Ruler className="size-4 text-sky-600" />
                {t.dashboard.latestWeight}
              </div>
              <p className="mt-3 text-xl font-semibold">
                {growth[0]?.weightKg ? `${growth[0].weightKg} kg` : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {growth[0]
                  ? new Intl.DateTimeFormat(locale, {
                      day: "2-digit",
                      month: "short",
                    }).format(growth[0].measuredAt)
                  : t.common.noData}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="mt-7">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t.dashboard.recent}</h2>
          <Link href="/activity" className="text-sm font-medium text-primary">
            {t.common.seeAll}
          </Link>
        </div>
        <TimelineList items={timeline} locale={locale} />
      </section>
    </>
  );
}
