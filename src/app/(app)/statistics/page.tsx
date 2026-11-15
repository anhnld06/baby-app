import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { BabyStatistics } from "@/components/baby-statistics";
import { MotherStatistics } from "@/components/mother-statistics";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
export default async function StatisticsPage({
  searchParams,
}: {
  searchParams: Promise<{
    owner?: string;
    date?: string;
    days?: string;
    chart?: string;
  }>;
}) {
  const [user, query] = await Promise.all([
    requireUser(),
    searchParams,
  ]);
  const baby = await getSelectedBaby(user.id);
  const owner =
    query.owner === "mother" || (!query.owner && !baby) ? "mother" : "baby";
  return (
    <>
      <PageHeader
        title="Thống kê"
        subtitle={
          "Nhìn lại nhịp sinh hoạt của mẹ và bé"
        }
        backHref="/"
      />
      <nav
        aria-label="Thống kê của ai"
        className="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-secondary p-1"
      >
        {(["baby", "mother"] as const).map((value) => (
          <Link
            key={value}
            href={`/statistics?owner=${value}`}
            aria-current={owner === value ? "page" : undefined}
            className={`flex min-h-12 items-center justify-center rounded-xl text-sm font-semibold ${owner === value ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
          >
            {value === "baby"
              ? "Của bé"
              : "Của mẹ"}
          </Link>
        ))}
      </nav>
      {owner === "mother" ? (
        <MotherStatistics chart={query.chart} date={query.date} />
      ) : (
        <BabyStatistics
          searchParams={Promise.resolve({ days: query.days, date: query.date })}
        />
      )}
    </>
  );
}
