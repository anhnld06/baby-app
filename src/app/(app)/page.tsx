import Link from "next/link";
import { JourneyOverview } from "@/components/journey-overview";
import { ChevronRight, BookHeart, HeartPulse } from "lucide-react";
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
  ] = await Promise.all([
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
  ]);
  const pregnancy = selectRelevantPregnancy(mother?.pregnancies ?? []);
  const timeline = buildTimeline(
    {
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
          <details className="surface-panel p-4 sm:p-5">
            <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3">
              <span>
                <strong className="block text-sm font-semibold">
                  Nhịp sinh hoạt trong 24 giờ
                </strong>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Bú, ngủ, tã và số đo gần nhất
                </span>
              </span>
              <ChevronRight className="size-4 text-primary" />
            </summary>
            <BabyDailySummary
              baby={baby}
              now={now}
              locale={locale}
              timeZone={user.timezone}
            />
          </details>
        </div>
        <div className="min-w-0 space-y-4 xl:sticky xl:top-8">
          <Link
            href="/statistics?owner=baby"
            className="surface-panel flex items-center justify-between gap-3 p-4"
          >
            <span>
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[.12em] text-primary">
                Cùng nhìn lại
              </span>
              <strong className="block text-sm">Thống kê của mẹ & bé</strong>
              <span className="mt-1 block text-xs text-muted-foreground">
                Những thay đổi qua từng ngày
              </span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-primary" />
          </Link>
          <UpcomingVaccination appointment={nextAppointment} />
          <CareHandover key={baby.id} summary={summary} />
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
          <Link
            href="/knowledge"
            className="flex items-center gap-3 rounded-3xl bg-secondary/60 p-5"
          >
            <BookHeart className="size-6 shrink-0 text-primary" />
            <span className="flex-1">
              <strong className="block text-sm">
                Cùng hiểu con hơn mỗi ngày
              </strong>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                Cẩm nang chăm mẹ và bé, kèm nguồn tham khảo.
              </span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-primary" />
          </Link>
        </div>
      </div>
    </>
  );
}
