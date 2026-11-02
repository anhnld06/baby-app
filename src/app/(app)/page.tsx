import Link from "next/link";
import {
  Baby,
  BedDouble,
  ChevronRight,
  Droplets,
  Shell,
  Sparkles,
  Weight,
  BookHeart,
  Moon,
  HeartPulse,
  ArrowUpRight,
} from "lucide-react";
import { BabySwitcher } from "@/components/baby-switcher";
import { PageHeader } from "@/components/page-header";
import { QuickTimers } from "@/components/quick-timers";
import { TimelineList } from "@/components/timeline-list";
import { CareHandover } from "@/components/care-handover";
import { FamilyStart } from "@/components/family-start";
import { UpcomingVaccination } from "@/components/upcoming-vaccination";
import { DashboardRefresh } from "@/components/dashboard-refresh";
import { buildTimeline } from "@/features/timeline/timeline";
import { activeFeedingWhere } from "@/features/timeline/active-feeding";
import { selectRelevantPregnancy } from "@/features/mother/pregnancy";
import { requireUser } from "@/lib/auth";
import { getSelectedBabyId, listBabies, pickSelectedBaby } from "@/lib/data";
import {
  formatAge,
  formatDateTime,
  formatDuration,
  getLocalDayRange,
  greetingPeriod,
} from "@/lib/date";
import { db } from "@/lib/db";
import { getDictionary, getLocale } from "@/lib/i18n";
import { totalDurationWithinRangeMinutes } from "@/lib/metrics";

export default async function DashboardPage() {
  const [user, t, locale] = await Promise.all([
    requireUser(),
    getDictionary(),
    getLocale(),
  ]);
  const [babies, selectedBabyId, mother] = await Promise.all([
    listBabies(user.id),
    getSelectedBabyId(),
    db.mother.findUnique({ where: { userId: user.id }, include: { pregnancies: { orderBy: { createdAt: "desc" } } } }),
  ]);
  const baby = pickSelectedBaby(babies, selectedBabyId);
  if (!baby) {
    const nextVaccination = mother ? await db.vaccinationAppointment.findFirst({
      where: { motherId: mother.id, motherVaccinationRecordId: null, vaccinationRecordId: null },
      orderBy: { scheduledAt: "asc" },
    }) : null;
    return <FamilyStart mother={mother} name={user.name} nextVaccination={nextVaccination} />;
  }
  const now = new Date();
  const { start, end } = getLocalDayRange(now, user.timezone);
  const [feedings, sleeps, diapers, growth, vaccinations, prescriptions, toothRecords, openFeeding, lastFeed, lastDiaper, nextAppointment] = await Promise.all([
    db.feeding.findMany({
      where: { babyId: baby.id, startTime: { gte: start, lt: end } },
      orderBy: { startTime: "desc" },
    }),
    db.sleepEntry.findMany({
      where: {
        babyId: baby.id,
        startTime: { lt: end },
        OR: [{ endTime: null }, { endTime: { gt: start } }],
      },
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
    db.feeding.findFirst({
      where: { babyId: baby.id, ...activeFeedingWhere },
      orderBy: { startTime: "desc" },
    }),
    db.feeding.findFirst({ where: { babyId: baby.id, startTime: { lte: now } }, orderBy: { startTime: "desc" } }),
    db.diaperEntry.findFirst({ where: { babyId: baby.id, changedAt: { lte: now } }, orderBy: { changedAt: "desc" } }),
    db.vaccinationAppointment.findFirst({
      where: { vaccinationRecordId: null, motherVaccinationRecordId: null, OR: [{ babyId: baby.id }, ...(mother ? [{ motherId: mother.id }] : [])] },
      orderBy: { scheduledAt: "asc" },
    }),
  ]);
  const pregnancy = selectRelevantPregnancy(mother?.pregnancies ?? []);
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
  const activeFeeding = openFeeding;
  const wet = diapers.filter(
    (item) => item.type === "WET" || item.type === "BOTH",
  ).length;
  const stool = diapers.filter(
    (item) => item.type === "STOOL" || item.type === "BOTH",
  ).length;
  const sleepMinutes = totalDurationWithinRangeMinutes(sleeps, start, end, now);
  const ago = (date: Date) => {
    const minutes = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 60_000));
    if (minutes < 1) return "Vừa xong";
    return `${formatDuration(minutes, locale)} trước`;
  };
  const clock = (date: Date) => new Intl.DateTimeFormat(locale, { timeZone: user.timezone, hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }).format(date);
  const summary = [
    `${baby.name} · ${formatAge(baby.dateOfBirth, now, locale)}`,
    `Cập nhật: ${formatDateTime(now, user.timezone, locale)}`,
    `Hôm nay: ${feedings.length} cữ bú · ngủ ${formatDuration(sleepMinutes, locale)} · ${wet} tã ướt / ${stool} tã phân.`,
    lastFeed ? `Cữ bú gần nhất: ${clock(lastFeed.startTime)}${lastFeed.amountMl != null ? ` · ${lastFeed.amountMl} ml` : ""}.` : "Chưa có bản ghi bú.",
    lastDiaper ? `Thay tã gần nhất: ${clock(lastDiaper.changedAt)}.` : "Chưa có bản ghi thay tã.",
    activeSleep ? `Đang ngủ từ ${clock(activeSleep.startTime)}.` : "Không có giấc ngủ đang bấm giờ.",
    activeFeeding ? `Đang bú từ ${clock(activeFeeding.startTime)}.` : "",
  ].filter(Boolean).join("\n");
  const greetingLabel = {
    morning: t.dashboard.helloMorning,
    noon: t.dashboard.helloNoon,
    afternoon: t.dashboard.helloAfternoon,
    evening: t.dashboard.helloEvening,
  }[greetingPeriod(now, user.timezone)];
  const dailyActions = [
    { href: "/tracking/feeding", title: "Ghi cữ bú", icon: Baby, tone: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
    { href: "/tracking/sleep", title: "Ghi giấc ngủ", icon: BedDouble, tone: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" },
    { href: "/tracking/diaper", title: "Ghi thay tã", icon: Shell, tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  ];
  return (
    <>
      <DashboardRefresh />
      <PageHeader title={greetingLabel} subtitle={new Intl.DateTimeFormat(locale, { timeZone: user.timezone, weekday: "long", day: "numeric", month: "long" }).format(now)} />
      <BabySwitcher babies={babies} selectedBabyId={baby.id} addLabel={t.profile.addBaby} />
      <section className="family-hero relative overflow-hidden rounded-[2rem] p-5 shadow-lg shadow-primary/10 sm:p-7">
        <div aria-hidden="true" className="family-orbit" />
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-white/80"><Sparkles className="size-3.5" /> Mỗi ngày bên con</span>
          <Link href={`/profile/baby/${baby.id}`} aria-label={`Hồ sơ của ${baby.name}`} className="grid size-11 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 transition-colors hover:bg-white/20"><ArrowUpRight className="size-5" /></Link>
        </div>
        <h2 className="mt-3 break-words text-3xl font-semibold tracking-tight sm:text-4xl">{baby.nickname || baby.name}</h2>
        <p className="mt-2 text-sm text-white/80">{formatAge(baby.dateOfBirth, now, locale)}</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-medium">
          {activeSleep ? <Moon className="size-3.5" /> : <HeartPulse className="size-3.5" />}
          {activeSleep ? `Đang ngủ · từ ${new Intl.DateTimeFormat(locale, { timeZone: user.timezone, hour: "2-digit", minute: "2-digit" }).format(activeSleep.startTime)}` : activeFeeding ? "Đang trong cữ bú" : "Cùng con ghi lại một ngày"}
        </div>
      </section>

      <section className="mt-6" aria-labelledby="daily-actions-title">
        <div className="mb-3 flex items-center justify-between gap-3"><h2 id="daily-actions-title" className="text-lg font-semibold">Chăm bé mỗi ngày</h2><Link href="/baby" className="inline-flex min-h-11 items-center gap-1 text-xs font-medium text-primary">Tất cả <ChevronRight className="size-3.5" /></Link></div>
        <div className="grid grid-cols-3 gap-3">
          {dailyActions.map(({ href, title, icon: Icon, tone }) => <Link key={href} href={`${href}?new=1`} className="flex min-h-28 min-w-0 flex-col items-center justify-center gap-3 rounded-3xl border border-border/50 bg-card p-3 text-center text-xs font-semibold shadow-sm transition-[transform,box-shadow] hover:shadow-md active:scale-95"><span className={`grid size-12 place-items-center rounded-2xl ${tone}`}><Icon className="size-5" /></span>{title}</Link>)}
        </div>
      </section>
      <QuickTimers babyId={baby.id} locale={locale} activeFeedingStartedAt={activeFeeding?.startTime.toISOString()} activeSleepStartedAt={activeSleep?.startTime.toISOString()} />

      <section className="mt-7" aria-labelledby="today-title">
        <h2 id="today-title" className="mb-3 text-lg font-semibold">Hôm nay của con</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/tracking/feeding" className="rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-colors hover:bg-secondary/40">
            <span className="flex items-center gap-2 text-xs text-muted-foreground"><Baby className="size-4 text-orange-600" /> Cữ bú gần nhất</span>
            <p className="mt-3 text-xl font-semibold tabular-nums">{lastFeed ? ago(lastFeed.startTime) : "Chưa ghi"}</p>
            <p className="mt-1 text-xs text-muted-foreground">{feedings.length} cữ đã ghi hôm nay</p>
          </Link>
          <Link href="/tracking/sleep" className="rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-colors hover:bg-secondary/40">
            <span className="flex items-center gap-2 text-xs text-muted-foreground"><BedDouble className="size-4 text-indigo-500" /> Tổng giấc ngủ</span>
            <p className="mt-3 text-xl font-semibold tabular-nums">{formatDuration(sleepMinutes, locale)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{activeSleep ? "Có giấc ngủ đang bấm giờ" : `${sleeps.length} giấc đã ghi hôm nay`}</p>
          </Link>
          <Link href="/tracking/diaper" className="rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-colors hover:bg-secondary/40">
            <span className="flex items-center gap-2 text-xs text-muted-foreground"><Droplets className="size-4 text-emerald-600" /> Thay tã</span>
            <p className="mt-3 text-xl font-semibold tabular-nums">{diapers.length} lần</p>
            <p className="mt-1 text-xs text-muted-foreground">{wet} tã ướt · {stool} tã phân</p>
          </Link>
          <Link href="/tracking/growth" className="rounded-3xl border border-border/50 bg-card p-4 shadow-sm transition-colors hover:bg-secondary/40">
            <span className="flex items-center gap-2 text-xs text-muted-foreground"><Weight className="size-4 text-sky-600" /> Số đo gần nhất</span>
            <p className="mt-3 text-xl font-semibold tabular-nums">{growth[0]?.weightKg != null ? `${growth[0].weightKg} kg` : growth[0]?.heightCm != null ? `${growth[0].heightCm} cm` : "Chưa ghi"}</p>
            <p className="mt-1 text-xs text-muted-foreground">{growth[0] ? new Intl.DateTimeFormat(locale, { timeZone: user.timezone, day: "2-digit", month: "2-digit" }).format(growth[0].measuredAt) : "Thêm cân nặng hoặc chiều cao"}</p>
          </Link>
        </div>
      </section>
      <UpcomingVaccination appointment={nextAppointment} />
      <CareHandover key={baby.id} summary={summary} />
      {pregnancy?.pregnancyStatus === "PREGNANT" && <Link href="/mother/pregnancy" className="mt-4 flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4"><HeartPulse className="size-5 text-primary" /><span className="flex-1 text-sm font-medium">Tiếp tục theo dõi thai kỳ của mẹ</span><ChevronRight className="size-4" /></Link>}

      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">{t.dashboard.recent}</h2><Link href="/activity" className="inline-flex min-h-11 items-center gap-1 text-xs font-medium text-primary">{t.common.seeAll}<ChevronRight className="size-3.5" /></Link></div>
        <TimelineList items={timeline} locale={locale} timeZone={user.timezone} empty="Một ngày mới bắt đầu. Ghi cữ bú, giấc ngủ hoặc lần thay tã đầu tiên ở phía trên nhé." />
      </section>
      <Link href="/knowledge" className="mt-6 flex items-center gap-3 rounded-3xl bg-secondary/60 p-5"><BookHeart className="size-6 shrink-0 text-primary" /><span className="flex-1"><strong className="block text-sm">Cùng hiểu con hơn mỗi ngày</strong><span className="mt-1 block text-xs leading-5 text-muted-foreground">Cẩm nang chăm mẹ và bé, kèm nguồn tham khảo.</span></span><ChevronRight className="size-4 shrink-0 text-primary" /></Link>
    </>
  );
}
