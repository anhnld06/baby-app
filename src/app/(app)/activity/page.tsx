import { PageHeader } from "@/components/page-header";
import { TimelineList } from "@/components/timeline-list";
import { buildTimeline } from "@/features/timeline/timeline";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { db } from "@/lib/db";
import { getDictionary, getLocale } from "@/lib/i18n";

export default async function ActivityPage() {
  const [user, t, locale] = await Promise.all([
    requireUser(),
    getDictionary(),
    getLocale(),
  ]);
  const baby = await getSelectedBaby(user.id);
  if (!baby)
    return (
      <>
        <PageHeader title={t.nav.activity} />
        <p>{t.common.noData}</p>
      </>
    );
  const [feedings, sleeps, diapers, growthEntries, vaccinations, prescriptions, toothRecords] = await Promise.all([
    db.feeding.findMany({
      where: { babyId: baby.id },
      orderBy: { startTime: "desc" },
      take: 100,
    }),
    db.sleepEntry.findMany({
      where: { babyId: baby.id },
      orderBy: { startTime: "desc" },
      take: 100,
    }),
    db.diaperEntry.findMany({
      where: { babyId: baby.id },
      orderBy: { changedAt: "desc" },
      take: 100,
    }),
    db.growthEntry.findMany({
      where: { babyId: baby.id },
      orderBy: { measuredAt: "desc" },
      take: 100,
    }),
    db.vaccinationRecord.findMany({
      where: { babyId: baby.id },
      orderBy: { administeredAt: "desc" },
      take: 100,
    }),
    db.prescription.findMany({
      where: { babyId: baby.id },
      orderBy: { issuedAt: "desc" },
      include: { items: true },
      take: 100,
    }),
    db.toothRecord.findMany({
      where: { babyId: baby.id },
      orderBy: { eruptedAt: "desc" },
      take: 100,
    }),
  ]);
  return (
    <>
      <PageHeader title={t.nav.activity} subtitle={baby.name} />
      <TimelineList
        items={buildTimeline(
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
        )}
        locale={locale}
        empty={t.common.noData}
      />
    </>
  );
}
