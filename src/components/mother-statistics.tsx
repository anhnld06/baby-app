import Link from "next/link";
import { PumpingChart } from "@/components/pumping-chart";
import { PumpingTrends } from "@/components/pumping-trends";
import { MetricGrid } from "@/components/metric-grid";
import { BabySwitcher } from "@/components/baby-switcher";
import { pumpingChartData, pumpingChartPeriod } from "@/features/pumping/chart";
import { pumpingTrends, pumpingTrendWindow } from "@/features/pumping/trends";
import { pumpingSummary } from "@/features/pumping/pumping";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLocalDayRange } from "@/lib/date";
import { getLocale } from "@/lib/i18n";
import { getSelectedBabyId, listBabies, pickSelectedBaby } from "@/lib/data";
export async function MotherStatistics({
  chart,
  date,
}: {
  chart?: string;
  date?: string;
}) {
  const [user, locale] = await Promise.all([requireUser(), getLocale()]);
  const vi = locale === "vi";
  const [mother, babies, selected] = await Promise.all([
    db.mother.findUnique({ where: { userId: user.id } }),
    listBabies(user.id),
    getSelectedBabyId(),
  ]);
  if (!mother)
    return (
      <Link
        href="/profile/mother"
        className="block rounded-3xl border border-dashed p-6 text-sm text-primary"
      >
        {vi
          ? "Thêm hồ sơ mẹ để xem thống kê hút sữa →"
          : "Add mother's profile to view pumping statistics →"}
      </Link>
    );
  const now = new Date();
  const baby = pickSelectedBaby(babies, selected);
  const period = pumpingChartPeriod(chart, date, now, user.timezone);
  const window = pumpingTrendWindow(now, user.timezone);
  const day = getLocalDayRange(now, user.timezone);
  const [entries, recent, bottles, today] = await Promise.all([
    db.pumpingEntry.findMany({
      where: {
        motherId: mother.id,
        isRunning: false,
        startTime: { gte: period.start, lt: period.end },
      },
      select: {
        id: true,
        startTime: true,
        leftAmountMl: true,
        rightAmountMl: true,
      },
    }),
    db.pumpingEntry.findMany({
      where: {
        motherId: mother.id,
        isRunning: false,
        startTime: { gte: window.start, lt: window.end },
      },
    }),
    baby
      ? db.feeding.findMany({
          where: {
            babyId: baby.id,
            type: "BOTTLE_BREAST_MILK",
            startTime: { gte: window.start, lt: window.end },
          },
          select: { startTime: true, type: true, amountMl: true },
        })
      : [],
    db.pumpingEntry.findMany({
      where: {
        motherId: mother.id,
        isRunning: false,
        startTime: { gte: day.start, lt: day.end },
      },
    }),
  ]);
  const summary = pumpingSummary(today);
  const number = (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        {mother.name} · {vi ? "Thống kê hút sữa" : "Pumping statistics"}
      </p>
      <MetricGrid
        items={[
          {
            label: vi ? "Cữ hút hôm nay" : "Sessions today",
            value: String(summary.count),
          },
          {
            label: vi ? "Lượng đã ghi hôm nay" : "Volume logged today",
            value: today.some(
              (e) => e.leftAmountMl != null || e.rightAmountMl != null,
            )
              ? `${number(summary.totalMl)} ml`
              : "—",
          },
          {
            label: vi
              ? "Trung bình / cữ có lượng"
              : "Average / measured session",
            value: today.some(
              (e) => e.leftAmountMl != null || e.rightAmountMl != null,
            )
              ? `${number(summary.averageMl)} ml`
              : "—",
          },
          {
            label: vi ? "Cữ chờ nhập lượng" : "Sessions pending volume",
            value: String(
              today.filter(
                (e) => e.leftAmountMl == null && e.rightAmountMl == null,
              ).length,
            ),
          },
        ]}
      />
      <PumpingChart
        rows={pumpingChartData(period, entries, user.timezone)}
        mode={period.mode}
        anchor={period.anchor}
        previous={period.previous}
        next={period.next}
        today={period.today}
        locale={locale}
      />
      {baby && (
        <div className="mt-6">
          <p className="mb-3 text-sm text-muted-foreground">
            {vi
              ? "Chọn bé để đối chiếu phần sữa mẹ uống bình"
              : "Select a baby to compare logged bottle breast milk"}
          </p>
          <BabySwitcher
            babies={babies}
            selectedBabyId={baby.id}
            addLabel={vi ? "Thêm bé" : "Add baby"}
          />
        </div>
      )}
      <PumpingTrends
        trend={pumpingTrends(now, user.timezone, recent, bottles)}
        babyName={baby?.name}
        locale={locale}
      />
      <Link
        href="/mother/pumping"
        className="mt-5 inline-flex min-h-12 items-center text-primary"
      >
        {vi ? "Mở nhật ký & ghi cữ hút sữa →" : "Open pumping journal →"}
      </Link>
    </>
  );
}
