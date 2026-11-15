import Link from "next/link";
import { MoonStar, TrendingUp, ArrowUpRight, Clock3, Info, NotebookPen } from "lucide-react";
import { PumpingIcon as Droplets } from "@/components/app-icons";
import { db } from "@/lib/db";
import { formatAge, formatDuration } from "@/lib/date";
import { loggedSleepMinutes } from "@/features/daily-summary/summary";
import { formatNumber } from "@/lib/format";

export async function BabyDailySummary({ baby, now, timeZone }: {
  baby: { id: string; name: string; dateOfBirth: Date; gestationalAgeAtBirth?: number | null }; now: Date; timeZone: string;
}) {
  const vi = true;
  const start = new Date(now.getTime() - 86_400_000);
  const [sleeps, diapers, weights] = await Promise.all([
    db.sleepEntry.findMany({ where: { babyId: baby.id, startTime: { lt: now }, OR: [{ endTime: null }, { endTime: { gt: start } }] }, select: { startTime: true, endTime: true } }),
    db.diaperEntry.findMany({ where: { babyId: baby.id, changedAt: { gte: start, lte: now } }, select: { type: true } }),
    db.growthEntry.findMany({ where: { babyId: baby.id, weightKg: { not: null }, measuredAt: { lte: now } }, orderBy: [{ measuredAt: "desc" }, { id: "desc" }], take: 2, select: { weightKg: true, measuredAt: true } }),
  ]);
  const wet = diapers.filter((diaper) => diaper.type === "WET" || diaper.type === "BOTH").length;
  const stool = diapers.filter((diaper) => diaper.type === "STOOL" || diaper.type === "BOTH").length;
  const sleep = loggedSleepMinutes(sleeps, start, now);
  const weight = weights[0];
  const older = weights[1];
  const days = weight && older ? Math.floor((weight.measuredAt.getTime() - older.measuredAt.getTime()) / 86_400_000) : 0;
  const delta = weight && older ? Math.round((weight.weightKg! - older.weightKg!) * 1000) : 0;
  const date = (d: Date) => new Intl.DateTimeFormat("vi-VN", { timeZone, day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
  const windowLabel = (d: Date) => new Intl.DateTimeFormat("vi-VN", { timeZone, day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(d);
  const cards = [
    {
      title: "Giấc ngủ", icon: MoonStar, href: "/tracking/sleep",
      tone: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
      value: sleeps.length ? formatDuration(sleep) : "—", unit: "đã ghi trong 24 giờ",
      detail: sleeps.some((s) => s.endTime === null) ? "Có giấc đang bấm giờ" : "Gồm ngủ ngày và ngủ đêm",
      note: "Tổng thời gian từ nhật ký đã ghi, có thể chưa đầy đủ.",
    },
    {
      title: "Thay tã", icon: Droplets, href: "/tracking/diaper",
      tone: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
      value: diapers.length ? String(wet) : "—", unit: "tã ướt đã ghi",
      detail: diapers.length ? `${stool} tã có phân · ${diapers.length} lần thay` : "Chưa có bản ghi trong 24 giờ",
      note: "Tã có cả nước tiểu và phân được tính vào cả hai nhóm.",
    },
    {
      title: "Tăng trưởng", icon: TrendingUp, href: "/tracking/growth",
      tone: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
      value: weight ? formatNumber(weight.weightKg!) : "—", unit: weight ? "kg" : "chưa có lần cân",
      detail: weight ? `Đo ngày ${date(weight.measuredAt)}` : "Thêm số đo để theo dõi thay đổi",
      note: older && days > 0 ? `${delta >= 0 ? "+" : ""}${formatNumber(delta)} g / ${days} ngày giữa hai lần cân. Xem biểu đồ để theo dõi xu hướng.` : "Cần hai lần cân ở các ngày khác nhau để so sánh.",
    },
  ];
  return <section className="mt-7" aria-labelledby="daily-summary-title">
    <div className="rounded-t-[1.75rem] border border-b-0 border-primary/10 bg-gradient-to-br from-secondary/80 via-card to-card px-5 pb-5 pt-5 sm:px-6">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-primary"><span className="size-1.5 rounded-full bg-primary" />Cùng hiểu con mỗi ngày</div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <h2 id="daily-summary-title" className="text-xl font-semibold tracking-tight">Nhịp sinh hoạt của bé</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 px-2.5 py-1.5 text-xs font-medium"><Clock3 className="size-3" />24 giờ gần nhất</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{baby.name} · {formatAge(baby.dateOfBirth, now, timeZone)}</p>
      <p className="mt-1 text-xs text-muted-foreground">{windowLabel(start)} → {windowLabel(now)}</p>
    </div>
    <div className="rounded-b-[1.75rem] border border-t-0 border-primary/10 bg-card/50 p-3 sm:p-4">
      <div className="grid gap-3 min-[360px]:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ title, icon: Icon, href, tone, value, unit, detail, note }) => <Link key={href} href={href} className="group flex min-w-0 flex-col rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-colors hover:border-primary/35 hover:bg-secondary/20 sm:p-5">
          <div className="flex items-center justify-between"><span className={`inline-flex size-10 items-center justify-center rounded-2xl ${tone}`}><Icon className="size-5" /></span><ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" /></div>
          <h3 className="mt-3 text-sm font-medium">{title}</h3>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-2"><span className="text-3xl font-semibold tracking-tight tabular-nums">{value}</span><span className="text-xs text-muted-foreground">{unit}</span></p>
          <p className="mb-4 mt-2 text-xs text-muted-foreground">{detail}</p>
          <p className="mt-auto border-t border-border/60 pt-3 text-xs leading-5 text-muted-foreground">{note}</p>
        </Link>)}
      </div>
      <div className="mt-3 flex gap-2 rounded-xl bg-secondary/45 px-3 py-3 text-xs leading-5 text-muted-foreground"><NotebookPen className="mt-0.5 size-4 shrink-0 text-primary" /><p>{vi ? "Dựa trên nhật ký đã ghi, có thể chưa đầy đủ. Không suy ra ml từ phút bú; lượng bú bình gồm phần ml đã ghi của cữ kết hợp, không gồm bú trực tiếp." : "Based on logs, which may be incomplete. Feeding minutes do not determine milk volume; bottle totals include recorded mixed-feed volumes but exclude direct breastfeeding."}</p></div>
      <details className="mt-2 px-1 text-xs text-muted-foreground"><summary className="flex min-h-11 cursor-pointer items-center gap-1.5 underline underline-offset-4"><Info className="size-3.5" />{vi ? "Cách đọc số liệu" : "How to read the figures"}</summary><p className="pb-3 leading-5">{vi ? "Mốc tăng trưởng WHO và bú theo tuổi được hiển thị ở Hôm nay và Thống kê. Các con số mô tả nhật ký, có thể còn thiếu bản ghi; không dùng riêng một chỉ số để kết luận bé bú đủ hoặc chẩn đoán sức khỏe. Cân nặng là lần đo gần nhất, đối chiếu theo tuổi tại ngày đo." : "WHO, AASM and NHS references are integrated into Today and Statistics. Logged figures may be incomplete; one indicator alone does not establish adequate feeding or a diagnosis. Weight is the latest measurement and is compared by age at measurement."}</p></details>
    </div>
  </section>;
}
