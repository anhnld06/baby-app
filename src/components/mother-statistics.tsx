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
import { getSelectedBabyId, listBabies, pickSelectedBaby } from "@/lib/data";
import { formatNumber } from "@/lib/format";
export async function MotherStatistics({
  chart,
  date,
}: {
  chart?: string;
  date?: string;
}) {
  const user = await requireUser();
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
        Thêm hồ sơ mẹ để xem thống kê hút sữa →
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
  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        {mother.name} · {"Thống kê hút sữa"}
      </p>
      <MetricGrid
        items={[
          {
            label: "Cữ hút hôm nay",
            value: String(summary.count),
          },
          {
            label: "Lượng đã ghi hôm nay",
            value: today.some(
              (e) => e.leftAmountMl != null || e.rightAmountMl != null,
            )
              ? `${formatNumber(summary.totalMl, 1)} ml`
              : "—",
          },
          {
            label: "Trung bình / cữ có lượng",
            value: today.some(
              (e) => e.leftAmountMl != null || e.rightAmountMl != null,
            )
              ? `${formatNumber(summary.averageMl, 1)} ml`
              : "—",
          },
          {
            label: "Cữ chờ nhập lượng",
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
      />
      {baby && (
        <div className="mt-6">
          <p className="mb-3 text-sm text-muted-foreground">
            Chọn bé để đối chiếu phần sữa mẹ uống bình
          </p>
          <BabySwitcher
            babies={babies}
            selectedBabyId={baby.id}
            addLabel="Thêm bé"
          />
        </div>
      )}
      <PumpingTrends
        trend={pumpingTrends(now, user.timezone, recent, bottles)}
        babyName={baby?.name}
      />
      <Link
        href="/mother/pumping"
        className="mt-5 inline-flex min-h-12 items-center text-primary"
      >
        {"Mở nhật ký & ghi cữ hút sữa →"}
      </Link>
    </>
  );
}
