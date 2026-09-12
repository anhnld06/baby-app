import { Download } from "lucide-react";
import { HistoryLoadMore } from "@/components/history-load-more";
import { PageHeader } from "@/components/page-header";
import { TimelineList } from "@/components/timeline-list";
import { buildTimeline } from "@/features/timeline/timeline";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { db } from "@/lib/db";
import { getDictionary, getLocale } from "@/lib/i18n";
import { parseHistoryLimit } from "@/lib/pagination";

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ limit?: string }>;
}) {
  const [user, t, locale, params] = await Promise.all([
    requireUser(),
    getDictionary(),
    getLocale(),
    searchParams,
  ]);
  const baby = await getSelectedBaby(user.id);
  if (!baby)
    return (
      <>
        <PageHeader title={t.nav.activity} />
        <p>{t.common.noData}</p>
      </>
    );
  const limit = parseHistoryLimit(params.limit, 100, 500);
  const queryLimit = limit + 1;
  const [feedings, sleeps, diapers, growthEntries, vaccinations, prescriptions, toothRecords] = await Promise.all([
    db.feeding.findMany({
      where: { babyId: baby.id },
      orderBy: { startTime: "desc" },
      take: queryLimit,
    }),
    db.sleepEntry.findMany({
      where: { babyId: baby.id },
      orderBy: { startTime: "desc" },
      take: queryLimit,
    }),
    db.diaperEntry.findMany({
      where: { babyId: baby.id },
      orderBy: { changedAt: "desc" },
      take: queryLimit,
    }),
    db.growthEntry.findMany({
      where: { babyId: baby.id },
      orderBy: { measuredAt: "desc" },
      take: queryLimit,
    }),
    db.vaccinationRecord.findMany({
      where: { babyId: baby.id },
      orderBy: { administeredAt: "desc" },
      take: queryLimit,
    }),
    db.prescription.findMany({
      where: { babyId: baby.id },
      orderBy: { issuedAt: "desc" },
      include: { items: true },
      take: queryLimit,
    }),
    db.toothRecord.findMany({
      where: { babyId: baby.id },
      orderBy: { eruptedAt: "desc" },
      take: queryLimit,
    }),
  ]);
  const timeline = buildTimeline(
    { feedings, sleeps, diapers, growthEntries, vaccinations, prescriptions, toothRecords },
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
  );
  const hasMore = timeline.length > limit || [feedings, sleeps, diapers, growthEntries, vaccinations, prescriptions, toothRecords].some((items) => items.length > limit);
  return (
    <>
      <PageHeader title={t.nav.activity} subtitle={baby.name} />
      <a
        href="/api/export/baby-journal"
        download
        className="mb-5 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-secondary px-4 text-sm font-semibold text-primary"
      >
        <Download className="size-4" />
        {locale === "vi" ? "Tải báo cáo CSV" : "Download CSV report"}
      </a>
      <TimelineList
        items={timeline.slice(0, limit)}
        locale={locale}
        empty={t.common.noData}
      />
      <HistoryLoadMore href="/activity" currentLimit={limit} increment={100} maximum={500} hasMore={hasMore} />
    </>
  );
}
