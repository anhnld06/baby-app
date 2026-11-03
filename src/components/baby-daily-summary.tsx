import Link from "next/link";
import { MoonStar, TrendingUp, ArrowUpRight, Clock3, Info, NotebookPen } from "lucide-react";
import { BabyIcon as Baby, PumpingIcon as Droplets } from "@/components/app-icons";
import { db } from "@/lib/db";
import { formatAge, formatDuration } from "@/lib/date";
import { loggedSleepMinutes, sleepReference } from "@/features/daily-summary/summary";

export async function BabyDailySummary({ baby, now, locale, timeZone }: {
  baby: { id: string; name: string; dateOfBirth: Date }; now: Date; locale: "vi" | "en"; timeZone: string;
}) {
  const vi = locale === "vi";
  const start = new Date(now.getTime() - 86_400_000);
  const previous = new Date(start.getTime() - 86_400_000);
  const [feeds, sleeps, diapers, weights] = await Promise.all([
    db.feeding.findMany({ where: { babyId: baby.id, startTime: { gte: previous, lte: now } }, select: { startTime: true, type: true, amountMl: true } }),
    db.sleepEntry.findMany({ where: { babyId: baby.id, startTime: { lt: now }, OR: [{ endTime: null }, { endTime: { gt: start } }] }, select: { startTime: true, endTime: true } }),
    db.diaperEntry.findMany({ where: { babyId: baby.id, changedAt: { gte: start, lte: now } }, select: { type: true } }),
    db.growthEntry.findMany({ where: { babyId: baby.id, weightKg: { not: null }, measuredAt: { lte: now } }, orderBy: [{ measuredAt: "desc" }, { id: "desc" }], take: 2, select: { weightKg: true, measuredAt: true } }),
  ]);
  const recent = feeds.filter((feed) => feed.startTime >= start);
  const before = feeds.length - recent.length;
  const bottles = recent.filter((feed) => feed.type === "BOTTLE_BREAST_MILK" || feed.type === "FORMULA");
  const measuredBottles = bottles.filter((feed) => feed.amountMl != null);
  const milk = measuredBottles.reduce((sum, feed) => sum + feed.amountMl!, 0);
  const wet = diapers.filter((diaper) => diaper.type === "WET" || diaper.type === "BOTH").length;
  const stool = diapers.filter((diaper) => diaper.type === "STOOL" || diaper.type === "BOTH").length;
  const sleep = loggedSleepMinutes(sleeps, start, now);
  const ref = sleepReference(baby.dateOfBirth, now);
  const weight = weights[0];
  const older = weights[1];
  const days = weight && older ? Math.floor((weight.measuredAt.getTime() - older.measuredAt.getTime()) / 86_400_000) : 0;
  const delta = weight && older ? Math.round((weight.weightKg! - older.weightKg!) * 1000) : 0;
  const num = (n: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(n);
  const date = (d: Date) => new Intl.DateTimeFormat(locale, { timeZone, day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
  const windowLabel = (d: Date) => new Intl.DateTimeFormat(locale, { timeZone, day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(d);
  const cards = [
    {
      title: vi ? "Bú & ăn" : "Feeding", icon: Baby, href: "/tracking/feeding",
      tone: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
      value: recent.length ? String(recent.length) : "—", unit: vi ? "cữ đã ghi" : "logged feeds",
      detail: measuredBottles.length ? `${num(milk)} ml ${vi ? "bú bình đã ghi" : "logged by bottle"}${measuredBottles.length < bottles.length ? (vi ? " · còn cữ thiếu ml" : " · volumes missing") : ""}` : (vi ? "Chưa có lượng bú bình được ghi" : "No bottle volumes logged"),
      note: recent.length && before ? (vi ? `${recent.length - before >= 0 ? "+" : ""}${recent.length - before} cữ so với 24 giờ trước đó. Chỉ so các cữ đã ghi.` : `${recent.length - before >= 0 ? "+" : ""}${recent.length - before} feeds vs the previous 24 hours, based on logs.`) : (vi ? "Chưa đủ dữ liệu để so với 24 giờ trước đó." : "Not enough data to compare with the previous 24 hours."),
    },
    {
      title: vi ? "Giấc ngủ" : "Sleep", icon: MoonStar, href: "/tracking/sleep",
      tone: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
      value: sleeps.length ? formatDuration(sleep, locale) : "—", unit: vi ? "đã ghi trong 24 giờ" : "logged in 24 hours",
      detail: sleeps.some((s) => s.endTime === null) ? (vi ? "Có giấc đang bấm giờ" : "A sleep timer is active") : (vi ? "Gồm ngủ ngày và ngủ đêm" : "Includes naps and night sleep"),
      note: ref ? (vi ? `Tham khảo theo tuổi: ${ref.min}–${ref.max} giờ/24 giờ. Cần ghi đủ giấc trước khi đối chiếu.` : `Age reference: ${ref.min}–${ref.max} hours/24 hours. Log all sleep before comparing.`) : (vi ? "Chưa đặt ngưỡng đánh giá cho tuổi này; theo dõi nhịp ngủ của bé qua nhiều ngày." : "No assessment threshold for this age; follow sleep patterns over time."),
    },
    {
      title: vi ? "Thay tã" : "Diapers", icon: Droplets, href: "/tracking/diaper",
      tone: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
      value: diapers.length ? String(wet) : "—", unit: vi ? "tã ướt đã ghi" : "logged wet diapers",
      detail: diapers.length ? `${stool} ${vi ? "tã có phân" : "stool diapers"} · ${diapers.length} ${vi ? "lần thay" : "changes"}` : (vi ? "Chưa có bản ghi trong 24 giờ" : "No records in 24 hours"),
      note: vi ? "Tã có cả nước tiểu và phân được tính vào cả hai nhóm." : "A diaper with urine and stool is counted in both groups.",
    },
    {
      title: vi ? "Tăng trưởng" : "Growth", icon: TrendingUp, href: "/tracking/growth",
      tone: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
      value: weight ? num(weight.weightKg!) : "—", unit: weight ? "kg" : (vi ? "chưa có lần cân" : "no weight logged"),
      detail: weight ? `${vi ? "Đo ngày" : "Measured"} ${date(weight.measuredAt)}` : (vi ? "Thêm số đo để theo dõi thay đổi" : "Add measurements to track changes"),
      note: older && days > 0 ? `${delta >= 0 ? "+" : ""}${num(delta)} g / ${days} ${vi ? "ngày giữa hai lần cân. Xem biểu đồ để theo dõi xu hướng." : "days between weigh-ins. View the chart for trends."}` : (vi ? "Cần hai lần cân ở các ngày khác nhau để so sánh." : "Two weigh-ins on different days are needed for comparison."),
    },
  ];
  return <section className="mt-7" aria-labelledby="daily-summary-title">
    <div className="rounded-t-[1.75rem] border border-b-0 border-primary/10 bg-gradient-to-br from-secondary/80 via-card to-card px-5 pb-5 pt-5 sm:px-6">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.14em] text-primary"><span className="size-1.5 rounded-full bg-primary" />{vi ? "Cùng hiểu con mỗi ngày" : "Understand your baby each day"}</div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <h2 id="daily-summary-title" className="text-xl font-semibold tracking-tight">{vi ? "Nhịp sinh hoạt của bé" : "Your baby's daily rhythm"}</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 px-2.5 py-1.5 text-[11px] font-medium"><Clock3 className="size-3" />{vi ? "24 giờ gần nhất" : "Last 24 hours"}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{baby.name} · {formatAge(baby.dateOfBirth, now, locale)}</p>
      <p className="mt-1 text-xs text-muted-foreground">{windowLabel(start)} → {windowLabel(now)}</p>
    </div>
    <div className="rounded-b-[1.75rem] border border-t-0 border-primary/10 bg-card/50 p-3 sm:p-4">
      <div className="grid gap-3 min-[360px]:grid-cols-2">
        {cards.map(({ title, icon: Icon, href, tone, value, unit, detail, note }) => <Link key={href} href={href} className="group flex min-w-0 flex-col rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-colors hover:border-primary/35 hover:bg-secondary/20 sm:p-5">
          <div className="flex items-center justify-between"><span className={`inline-flex size-10 items-center justify-center rounded-2xl ${tone}`}><Icon className="size-5" /></span><ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" /></div>
          <h3 className="mt-3 text-sm font-medium">{title}</h3>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-2"><span className="text-3xl font-semibold tracking-tight tabular-nums">{value}</span><span className="text-xs text-muted-foreground">{unit}</span></p>
          <p className="mb-4 mt-2 text-xs text-muted-foreground">{detail}</p>
          <p className="mt-auto border-t border-border/60 pt-3 text-xs leading-5 text-muted-foreground">{note}</p>
        </Link>)}
      </div>
      <div className="mt-3 flex gap-2 rounded-xl bg-secondary/45 px-3 py-3 text-xs leading-5 text-muted-foreground"><NotebookPen className="mt-0.5 size-4 shrink-0 text-primary" /><p>{vi ? "Dựa trên nhật ký đã ghi, có thể chưa đầy đủ. Không suy ra ml từ phút bú; lượng bú bình không gồm bú trực tiếp hoặc cữ kết hợp." : "Based on logs, which may be incomplete. Feeding minutes do not determine milk volume; bottle totals exclude direct breastfeeding and mixed feeds."}</p></div>
      <details className="mt-2 px-1 text-xs text-muted-foreground"><summary className="flex min-h-11 cursor-pointer items-center gap-1.5 underline underline-offset-4"><Info className="size-3.5" />{vi ? "Cách đọc & nguồn tham khảo" : "How to read this & references"}</summary><p className="pb-3 leading-5">{vi ? "Các con số mô tả hoạt động đã ghi, chưa đủ để kết luận bé bú đủ hay thiếu hoặc chẩn đoán sức khỏe. Cân nặng là lần đo gần nhất, không phải cân mỗi ngày. Khoảng ngủ tham khảo theo tuổi từ " : "Figures describe logged activity and do not establish adequate intake or diagnose health conditions. Weight is the latest measurement. Age-based sleep references: "}<a className="underline" href="https://aasm.org/resources/pdf/pediatricsleepdurationconsensus.pdf" target="_blank" rel="noreferrer">AASM</a> · <a className="underline" href="https://www.nhs.uk/baby/breastfeeding-and-bottle-feeding/breastfeeding-problems/enough-milk/" target="_blank" rel="noreferrer">NHS</a>.</p></details>
    </div>
  </section>;
}
