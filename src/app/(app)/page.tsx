import Link from "next/link";
import { JourneyOverview } from "@/components/journey-overview";
import { ChevronRight, Activity, ChartNoAxesCombined, ArrowUpRight } from "lucide-react";
import { WellbeingIcon as HeartPulse } from "@/components/app-icons";
import { DailySentence } from "@/components/daily-sentence";
import { HomeQuickActions } from "@/components/home-quick-actions";
import { BabyDailySummary } from "@/components/baby-daily-summary";
import { BabySwitcher } from "@/components/baby-switcher";
import { PageHeader } from "@/components/page-header";
import { PumpingTimer } from "@/components/pumping-timer";
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
    db.mother.findUnique({
      where: { userId: user.id },
      include: {
        pregnancies: { orderBy: { createdAt: "desc" } },
        pumpingEntries: {
          where: { isRunning: true },
          select: { id: true, startTime: true },
          take: 1,
        },
      },
    }),
  ]);
  const openPumping = mother?.pumpingEntries[0];
  const pumpingTimer = mother ? (
    <PumpingTimer
      compact
      locale={locale}
      active={
        openPumping
          ? {
              id: openPumping.id,
              startTime: openPumping.startTime.toISOString(),
            }
          : undefined
      }
    />
  ) : (
    <Link
      href="/profile/mother"
      className="mt-2 block rounded-2xl bg-card p-3 text-sm text-primary shadow-sm"
    >
      {locale === "vi"
        ? "Thêm hồ sơ mẹ để bấm giờ hút sữa"
        : "Add mother profile to use pumping timer"}
    </Link>
  );
  const baby = pickSelectedBaby(babies, selectedBabyId);
  if (!baby) {
    const nextVaccination = mother
      ? await db.vaccinationAppointment.findFirst({
          where: {
            motherId: mother.id,
            motherVaccinationRecordId: null,
            vaccinationRecordId: null,
          },
          orderBy: { scheduledAt: "asc" },
        })
      : null;
    return (
      <>
        <FamilyStart
          mother={mother}
          name={user.name}
          timeZone={user.timezone}
          nextVaccination={nextVaccination}
        />
        {pumpingTimer}
        <Link
          href="/statistics?owner=mother"
          className="mt-5 flex min-h-12 items-center rounded-2xl bg-secondary px-4 text-sm font-medium text-primary"
        >
          Xem thống kê hút sữa →
        </Link>
      </>
    );
  }
  const now = new Date();
  const { start, end } = getLocalDayRange(now, user.timezone);
  const [
    temperatures,
    medicationDoses,
    careEntries,
    feedings,
    sleeps,
    diapers,
    growth,
    vaccinations,
    prescriptions,
    toothRecords,
    openFeeding,
    lastFeed,
    lastDiaper,
    nextAppointment,
    todayMedicationDoses,
    todayTemperature,
    todayMeals,
  ] = await Promise.all([
    db.temperatureEntry.findMany({where:{babyId:baby.id},orderBy:{measuredAt:"desc"},take:5}),
    db.medicationDose.findMany({where:{schedule:{babyId:baby.id}},orderBy:{takenAt:"desc"},take:5,include:{schedule:{select:{name:true,dosage:true}}}}),
    db.babyCareEntry.findMany({
      where: { babyId: baby.id, kind: { not: "ROUTINE" } },
      select: {
        id: true,
        kind: true,
        occurredAt: true,
        title: true,
        details: true,
      },
      orderBy: { occurredAt: "desc" },
      take: 5,
    }),
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
    db.feeding.findFirst({
      where: { babyId: baby.id, startTime: { lte: now } },
      orderBy: { startTime: "desc" },
    }),
    db.diaperEntry.findFirst({
      where: { babyId: baby.id, changedAt: { lte: now } },
      orderBy: { changedAt: "desc" },
    }),
    db.vaccinationAppointment.findFirst({
      where: {
        vaccinationRecordId: null,
        motherVaccinationRecordId: null,
        OR: [{ babyId: baby.id }, ...(mother ? [{ motherId: mother.id }] : [])],
      },
      orderBy: { scheduledAt: "asc" },
    }),
    db.medicationDose.findMany({
      where: { schedule: { babyId: baby.id }, takenAt: { gte: start, lt: end } },
      select: { schedule: { select: { name: true } } },
      orderBy: { takenAt: "asc" },
    }),
    db.temperatureEntry.findFirst({
      where: { babyId: baby.id, measuredAt: { gte: start, lt: end } },
      select: { celsius: true },
      orderBy: { measuredAt: "desc" },
    }),
    db.babyCareEntry.findMany({
      where: { babyId: baby.id, kind: "MEAL", occurredAt: { gte: start, lt: end } },
      select: { id: true, title: true },
      orderBy: { occurredAt: "asc" },
    }),
  ]);
  const pregnancy = selectRelevantPregnancy(mother?.pregnancies ?? []);
  const timeline = buildTimeline(
    {
      temperatures,
      medicationDoses,
      careEntries,
      feedings,
      sleeps,
      diapers,
      growthEntries: growth,
      vaccinations,
      prescriptions,
      toothRecords,
    },
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
  const clock = (date: Date) =>
    new Intl.DateTimeFormat(locale, {
      timeZone: user.timezone,
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  const summary = [
    `${baby.name} · ${formatAge(baby.dateOfBirth, now, locale)}`,
    `Cập nhật: ${formatDateTime(now, user.timezone, locale)}`,
    `Hôm nay: ${feedings.length} cữ bú · ngủ ${formatDuration(sleepMinutes, locale)} · ${wet} tã ướt / ${stool} tã phân.`,
    lastFeed
      ? `Cữ bú gần nhất: ${clock(lastFeed.startTime)}${lastFeed.amountMl != null ? ` · ${lastFeed.amountMl} ml` : ""}.`
      : "Chưa có bản ghi bú.",
    lastDiaper
      ? `Thay tã gần nhất: ${clock(lastDiaper.changedAt)}.`
      : "Chưa có bản ghi thay tã.",
    activeSleep
      ? `Đang ngủ từ ${clock(activeSleep.startTime)}.`
      : "Không có giấc ngủ đang bấm giờ.",
    activeFeeding ? `Đang bú từ ${clock(activeFeeding.startTime)}.` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const greetingLabel = {
    morning: t.dashboard.helloMorning,
    noon: t.dashboard.helloNoon,
    afternoon: t.dashboard.helloAfternoon,
    evening: t.dashboard.helloEvening,
  }[greetingPeriod(now, user.timezone)];
  const measuredBottles = feedings.filter(
    (item) => item.type !== "BREASTFEEDING" && item.amountMl != null,
  );
  const bottleMl = measuredBottles.length
    ? measuredBottles.reduce((total, item) => total + item.amountMl!, 0)
    : null;
  return (
    <>
      <DashboardRefresh />
      <PageHeader
        title="Hôm nay"
        subtitle={`${greetingLabel} · ${new Intl.DateTimeFormat(locale, { timeZone: user.timezone, weekday: "short", day: "numeric", month: "numeric" }).format(now)}`}
      />
      <BabySwitcher
        babies={babies}
        selectedBabyId={baby.id}
        addLabel={t.profile.addBaby}
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-6">
          <DailySentence
            baby={baby}
            now={now}
            locale={locale}
            feedCount={feedings.length}
            bottleMl={bottleMl}
            sleepMinutes={sleepMinutes}
            hasSleep={sleeps.length > 0}
            diaperCount={diapers.length}
            takenMedications={[...new Set(todayMedicationDoses.map(dose => dose.schedule.name))]}
            temperatureCelsius={todayTemperature?.celsius}
            meals={todayMeals}
            lastFeedAt={lastFeed?.startTime}
            timeZone={user.timezone}
            activeSleep={Boolean(activeSleep)}
            activeFeeding={Boolean(activeFeeding)}
          />
          <HomeQuickActions />
          <section
            className="surface-panel px-4 pb-4 pt-4"
            aria-label="Bấm giờ chăm mẹ và bé"
          >
            <p className="mb-1 text-xs font-semibold text-muted-foreground">
              Bấm giờ, rồi cứ yên tâm bên con
            </p>
            <QuickTimers
              babyId={baby.id}
              locale={locale}
              activeFeedingStartedAt={activeFeeding?.startTime.toISOString()}
              activeSleepStartedAt={activeSleep?.startTime.toISOString()}
            />
            {pumpingTimer}
          </section>
          <section
            className="surface-panel p-4 sm:p-5"
            aria-labelledby="recent-journal-title"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-muted-foreground">
                  Từng khoảnh khắc của con
                </p>
                <h2
                  id="recent-journal-title"
                  className="mt-1 text-lg font-semibold"
                >
                  {t.dashboard.recent}
                </h2>
              </div>
              <Link
                href="/activity"
                className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-primary"
              >
                {t.common.seeAll}
                <ChevronRight className="size-3.5" />
              </Link>
            </div>
            <TimelineList
              items={timeline}
              locale={locale}
              timeZone={user.timezone}
              empty="Một ngày mới bắt đầu. Ghi cữ bú, giấc ngủ hoặc lần thay tã đầu tiên ở phía trên nhé."
            />
          </section>
          <details className="group rounded-3xl border border-border/60 bg-card p-4 sm:p-5">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><Activity className="size-5" /></span>
              <span>
                <strong className="block text-sm font-semibold">
                  Nhịp sinh hoạt 24 giờ
                </strong>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Bú, ngủ, tã và số đo gần nhất
                </span>
              </span>
              <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
            </summary>
            <BabyDailySummary
              baby={baby}
              now={now}
              locale={locale}
              timeZone={user.timezone}
            />
          </details>
        </div>
        <div className="min-w-0 space-y-6 xl:sticky xl:top-8">
          <section aria-labelledby="family-recap-heading" className="overflow-hidden rounded-[1.75rem] border border-border/40 bg-card shadow-[0_8px_30px_-22px_rgba(25,66,80,0.25)]">
            <div className="flex items-center justify-between px-4 pb-1 pt-4 sm:px-5">
              <h2 id="family-recap-heading" className="text-[10px] font-semibold uppercase tracking-[.16em] text-muted-foreground">Nhìn lại hôm nay</h2>
              <span aria-hidden="true" className="size-1.5 rounded-full bg-primary/50" />
            </div>
            <Link href="/statistics?owner=baby" className="flex items-center gap-3 p-4 transition-colors hover:bg-secondary/30 sm:p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary"><ChartNoAxesCombined className="size-5" /></span>
              <span className="min-w-0 flex-1"><strong className="block text-sm">Thống kê của mẹ & bé</strong><span className="mt-1 block text-xs text-muted-foreground">Những thay đổi qua từng ngày</span></span>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
            <div className="mx-4 border-t border-border/60 sm:mx-5" />
            <CareHandover key={baby.id} summary={summary} />
          </section>
          <UpcomingVaccination appointment={nextAppointment} />
          <JourneyOverview baby={baby} timeZone={user.timezone} />
          {pregnancy?.pregnancyStatus === "PREGNANT" && (
            <Link
              href="/mother/pregnancy"
              className="surface-panel flex items-center gap-3 p-4"
            >
              <HeartPulse className="size-5 text-primary" />
              <span className="flex-1 text-sm font-medium">
                Tiếp tục theo dõi thai kỳ của mẹ
              </span>
              <ChevronRight className="size-4" />
            </Link>
          )}

        </div>
      </div>
    </>
  );
}
