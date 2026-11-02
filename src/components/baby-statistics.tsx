import { ReportOverview } from "@/components/report-overview";
import Link from "next/link";
import { Baby, Milk, Moon, Droplets } from "lucide-react";
import { MetricBarChart } from "@/components/metric-bar-chart";
import { Field } from "@/components/form-fields";
import { GrowthTrends } from "@/components/growth-trends";
import { validDay } from "@/features/journey/dates";
import { BabySwitcher } from "@/components/baby-switcher";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSelectedBabyId, listBabies, pickSelectedBaby } from "@/lib/data";
import { dailyCareStats } from "@/features/care/stats";
import { zonedDateTimeToUtc, toDateTimeLocal } from "@/lib/date";
export async function BabyStatistics({
  searchParams,
}: {
  searchParams: Promise<{ days?: string; date?: string }>;
}) {
  const user = await requireUser();
  const [babies, selected, query] = await Promise.all([
    listBabies(user.id),
    getSelectedBabyId(),
    searchParams,
  ]);
  const baby = pickSelectedBaby(babies, selected);
  if (!baby)
    return (
      <>
        <Link href="/profile/baby/new">Thêm hồ sơ bé</Link>
      </>
    );
  const days = query.days === "30" ? 30 : 7;
  const now = new Date();
  const today = toDateTimeLocal(now, user.timezone).slice(0, 10);
  const selectedDay =
    validDay(query.date, today) > today ? today : validDay(query.date, today);
  const endCalendar = new Date(`${selectedDay}T12:00Z`);
  endCalendar.setUTCDate(endCalendar.getUTCDate() + 1);
  const end = zonedDateTimeToUtc(
    `${endCalendar.toISOString().slice(0, 10)}T00:00`,
    user.timezone,
  );
  const calendar = new Date(`${selectedDay}T12:00:00Z`);
  calendar.setUTCDate(calendar.getUTCDate() - days);
  const start = zonedDateTimeToUtc(
    `${calendar.toISOString().slice(0, 10)}T00:00`,
    user.timezone,
  );
  const [feeds, sleeps, diapers, growth] = await Promise.all([
    db.feeding.findMany({
      where: { babyId: baby.id, startTime: { gte: start, lt: end, lte: now } },
      select: { startTime: true, amountMl: true, type: true },
    }),
    db.sleepEntry.findMany({
      where: {
        babyId: baby.id,
        startTime: { lt: end, lte: now },
        OR: [{ endTime: null }, { endTime: { gt: start } }],
      },
      select: { startTime: true, endTime: true },
    }),
    db.diaperEntry.findMany({
      where: { babyId: baby.id, changedAt: { gte: start, lt: end, lte: now } },
      select: { changedAt: true },
    }),
    db.growthEntry.findMany({
      where: { babyId: baby.id, measuredAt: { lt: end, lte: now } },
      orderBy: { measuredAt: "asc" },
      select: {
        id: true,
        measuredAt: true,
        weightKg: true,
        heightCm: true,
        headCircumferenceCm: true,
      },
    }),
  ]);
  const allRows = dailyCareStats(
    now,
    days + 1,
    user.timezone,
    feeds,
    sleeps,
    diapers,
    selectedDay,
  );
  const rows = allRows.slice(1);
  const selectedRow = allRows.at(-1)!;
  const previousRow = allRows.at(-2)!;
  const charts = [
    {
      key: "milk",
      title: "Lượng sữa bình đã ghi",
      unit: "ml",
      tone: "bg-teal-400",
    },
    {
      key: "sleep",
      title: "Thời gian ngủ đã ghi",
      unit: "giờ",
      tone: "bg-violet-400",
    },
    { key: "feeds", title: "Cữ bú đã ghi", unit: "cữ", tone: "bg-orange-400" },
    {
      key: "diapers",
      title: "Thay tã đã ghi",
      unit: "lần",
      tone: "bg-sky-400",
    },
  ] as const;
  return (
    <>
      <BabySwitcher
        babies={babies}
        selectedBabyId={baby.id}
        addLabel="Thêm bé"
      />
      <ReportOverview name={baby.name} days={days} recordedDays={rows.filter(row=>row.feeds!=null||row.sleep!=null||row.diapers!=null).length} growth={growth} from={rows[0].day} to={selectedDay} />
      <form className="my-5 flex items-end gap-3">
        <input type="hidden" name="days" value={days} />
        <Field
          label="Thống kê đến ngày"
          type="date"
          name="date"
          required
          max={today}
          defaultValue={selectedDay}
        />
        <button className="min-h-12 rounded-xl bg-secondary px-4 text-primary">
          Xem
        </button>
      </form>
      <section className="mb-5 rounded-3xl bg-secondary/50 p-5">
        <h2 className="font-semibold">
          Tổng quan ngày {selectedDay.split("-").reverse().join("/")}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {charts.map((chart) => {
            const value = selectedRow[chart.key];
            const previous = previousRow[chart.key];
            return (
              <div key={chart.key}>
                <h3 className="text-xs text-muted-foreground">{chart.title}</h3>
                <p className="mt-2 text-xl font-semibold">
                  {value == null ? "—" : Number(value.toFixed(1))}{" "}
                  <span className="text-xs font-normal">{chart.unit}</span>
                </p>
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                  {value != null && previous != null
                    ? `${value - previous >= 0 ? "+" : ""}${Number((value - previous).toFixed(1))} ${chart.unit} so với ngày trước`
                    : "Chưa đủ bản ghi để so sánh"}
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {selectedDay === today ? "Hôm nay chưa kết thúc. " : ""}Chỉ so số liệu
          đã ghi; ngày trước là cả ngày.
        </p>
      </section>
      <nav aria-label="Khoảng thống kê" className="my-5 flex gap-2">
        {[7, 30].map((n) => (
          <Link
            key={n}
            replace
            href={`/statistics?owner=baby&days=${n}&date=${selectedDay}`}
            aria-current={days === n ? "page" : undefined}
            className={`rounded-full px-5 py-3 text-sm ${days === n ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
          >
            {n === 7 ? "Tuần · 7 ngày" : "30 ngày"}
          </Link>
        ))}
      </nav>
      <p className="mb-5 text-sm leading-6 text-muted-foreground">
        Nhật ký là số liệu gia đình đã ghi. “—” là chưa có bản ghi, khác với 0
        ml đã ghi. Sữa bình gồm phần ml của cữ kết hợp; không quy đổi phút bú mẹ
        thành ml. Nhật ký có thể chưa đầy đủ.
      </p>
      <div className="grid items-start gap-5 xl:grid-cols-2">
        {charts.map((chart) => {
          const Icon = {
            milk: Milk,
            sleep: Moon,
            feeds: Baby,
            diapers: Droplets,
          }[chart.key];
          const tone = {
            milk: "teal",
            sleep: "violet",
            feeds: "amber",
            diapers: "sky",
          }[chart.key] as "teal" | "violet" | "amber" | "sky";
          const total = rows.reduce((sum, r) => sum + (r[chart.key] ?? 0), 0);
          return (
            <section
              key={chart.key}
              className="surface-panel min-w-0 p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">{chart.title}</h2>
                <span
                  className={`grid size-9 place-items-center rounded-xl ${chart.tone} text-white`}
                >
                  <Icon className="size-4" />
                </span>
              </div>
              <p className="mt-2 text-3xl font-semibold tabular-nums">
                {rows.some((r) => r[chart.key] !== null)
                  ? new Intl.NumberFormat(user.locale, {
                      maximumFractionDigits: 1,
                    }).format(total)
                  : "—"}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  {chart.unit} / {days} ngày
                </span>
              </p>
              <div className="mt-5">
                <MetricBarChart
                  label={chart.title}
                  unit={chart.unit}
                  tone={tone}
                  locale={user.locale}
                  rows={rows.map((row) => ({
                    key: row.day,
                    label: `${row.day.slice(8)}/${row.day.slice(5, 7)}`,
                    value: row[chart.key],
                    current: row.current,
                    note: [
                      row.current ? "Hôm nay chưa kết thúc" : "",
                      chart.key === "milk" && row.missingMilk
                        ? `${row.missingMilk} cữ chưa nhập ml`
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" · "),
                  }))}
                />
              </div>
              <details className="mt-5">
                <summary className="min-h-11 cursor-pointer text-sm text-primary">
                  Xem số liệu từng ngày
                </summary>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="py-2">Ngày</th>
                      <th>{chart.unit}</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.day} className="border-t">
                        <td className="py-2">
                          {row.day.split("-").reverse().join("/")}
                        </td>
                        <td>
                          {row[chart.key] == null
                            ? "—"
                            : Number((row[chart.key] ?? 0).toFixed(1))}
                        </td>
                        <td className="text-xs text-muted-foreground">
                          {row.current ? "Chưa hết ngày. " : ""}
                          {chart.key === "milk" && row.missingMilk
                            ? `${row.missingMilk} cữ chưa nhập ml`
                            : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            </section>
          );
        })}
      </div>
      <GrowthTrends
        measurements={growth}
        dateOfBirth={baby.dateOfBirth}
        gestationalAgeAtBirth={baby.gestationalAgeAtBirth}
        locale={user.locale === "en" ? "en" : "vi"}
      />
      <Link
        href="/tracking/growth"
        className="mt-5 flex min-h-14 items-center rounded-2xl bg-secondary p-4 text-primary"
      >
        Xem biểu đồ tăng trưởng →
      </Link>
    </>
  );
}
