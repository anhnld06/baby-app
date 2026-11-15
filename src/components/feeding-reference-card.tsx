import { Baby as FeedingIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { getLocalDayRange, toDateTimeLocal, zonedDateTimeToUtc, formatAge } from "@/lib/date";
import { validDay } from "@/features/journey/dates";
import { feedingReference, feedingSources, feedingTotals } from "@/features/feeding-reference/reference";
import { FeedingAssessment } from "@/components/feeding-assessment";

type Baby = { id: string; dateOfBirth: Date; gestationalAgeAtBirth?: number | null };

export async function FeedingReferenceCard({ baby, now, timeZone, locale, day, compact = false }: {
  baby: Baby; now: Date; timeZone: string; locale: "vi" | "en"; day?: string; compact?: boolean;
}) {
  const vi = locale === "vi";
  const today = toDateTimeLocal(now, timeZone).slice(0, 10);
  const selected = validDay(day, today) > today ? today : validDay(day, today);
  const { start, end } = getLocalDayRange(zonedDateTimeToUtc(`${selected}T12:00`, timeZone), timeZone);
  const [feeds, weight, diapers] = await Promise.all([
    db.feeding.findMany({ where: { babyId: baby.id, startTime: { gte: start, lt: end, lte: now } }, select: { type: true, amountMl: true, endTime: true } }),
    db.growthEntry.findFirst({ where: { babyId: baby.id, measuredAt: { lt: end, lte: now }, weightKg: { not: null } }, orderBy: [{ measuredAt: "desc" }, { id: "desc" }], select: { weightKg: true, measuredAt: true } }),
    compact ? Promise.resolve(0) : db.diaperEntry.count({ where: { babyId: baby.id, changedAt: { gte: start, lt: end, lte: now }, type: { in: ["WET", "BOTH"] } } }),
  ]);
  const ref = feedingReference(baby.dateOfBirth, selected, baby.gestationalAgeAtBirth, weight);
  const totals = feedingTotals(feeds);
  const volume = totals.formulaOnly ? ref.volume : null;
  const displayVolume = !totals.direct && (totals.formulaOnly || totals.count === 0) ? ref.volume : null;
  const num = (n: number) => new Intl.NumberFormat(locale).format(n);
  const range = displayVolume ? `${num(displayVolume.min)}–${num(displayVolume.max)}` : null;
  const feedRange = totals.direct && !ref.premature && ref.days >= 0 && ref.days < 28 ? "8–12" : (totals.formulaOnly || totals.count === 0) && ref.feeds ? `${ref.feeds.min}–${ref.feeds.max}` : null;
  const detailHref = `/statistics?owner=baby&date=${selected}#feeding-reference`;
  const reason = ref.premature ? (vi ? "Bé sinh non: đối chiếu theo kế hoạch dinh dưỡng riêng." : "Preterm baby: follow an individual feeding plan.")
    : ref.days < 0 ? (vi ? "Ngày được chọn trước ngày sinh của bé." : "Selected date is before birth.")
    : totals.direct ? (vi ? "Có bú mẹ trực tiếp · Không quy đổi phút bú thành ml." : "Includes direct breastfeeding · Minutes cannot determine ml.")
    : totals.count === 0 ? (vi ? "Chưa có cữ bú được ghi; chưa đánh giá đủ/thiếu." : "No feeds logged; intake cannot be assessed.")
    : !totals.formulaOnly ? (vi ? "Mốc ml này dành cho bú hoàn toàn sữa công thức; không áp chung cho sữa mẹ hoặc ngày chưa có bản ghi." : "This volume reference applies to exclusive formula feeding, not breast milk or days without logs.")
    : ref.days < 7 ? (vi ? "Tuần đầu: theo dõi từng ngày tuổi, chưa đặt mốc tổng ml/ngày." : "First week: monitor day by day; no daily volume target.")
    : ref.months >= 6 ? (vi ? "Từ 6 tháng: cần xem cùng ăn dặm và kế hoạch dinh dưỡng; chưa đặt mốc ml chung." : "From 6 months: consider solids and individual nutrition; no generic volume target.")
    : !ref.weight ? (vi ? "Thêm lần cân trong 30 ngày gần nhất để tính khoảng ml tham khảo." : "Add a weight from the last 30 days to calculate a volume reference.") : null;
  if (compact) return <section data-feeding-reference aria-label={vi ? "Đối chiếu bú theo tuổi" : "Age-based feeding reference"} className="rounded-2xl border border-border/60 bg-card p-4">
    <div className="flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-sm font-medium"><FeedingIcon className="size-4 text-orange-500" />{vi ? "Bú hôm nay" : "Feeding today"}</h2><Link href={detailHref} aria-label={vi ? "Chi tiết →" : "Details →"} className="flex min-h-9 min-w-9 items-center justify-center rounded-full text-muted-foreground"><ChevronRight className="size-4" /></Link></div>
    <div className="mt-2 grid grid-cols-2 divide-x divide-border/60">
      <div className="pr-3"><p className="text-2xl font-semibold tabular-nums">{num(totals.ml)} <span className="text-sm font-normal text-muted-foreground">ml</span></p><p className="mt-1 text-[11px] text-muted-foreground">{range ? `${vi ? "Mốc SCT" : "Formula ref"}: ${range} ml` : (vi ? "Sữa bình đã ghi" : "Logged bottle milk")}</p></div>
      <div className="pl-4"><p className="text-2xl font-semibold tabular-nums">{totals.count} <span className="text-sm font-normal text-muted-foreground">{vi ? "cữ" : "feeds"}</span></p><p className="mt-1 text-[11px] text-muted-foreground">{feedRange ? `${vi ? "Mốc" : "Ref"}: ${feedRange} ${vi ? "cữ/ngày" : "feeds/day"}` : (vi ? "Đã ghi hôm nay" : "Logged today")}</p></div>
    </div>
    <p className="mt-3 text-[11px] text-muted-foreground">{totals.pending ? (vi ? `${totals.pending} cữ thiếu ml` : `${totals.pending} volumes missing`) : totals.direct ? (vi ? "Có bú mẹ trực tiếp · Chưa so tổng ml" : "Direct breastfeeding · Total unknown") : (vi ? "Ngày đang diễn ra · Mốc tham khảo" : "Day in progress · Reference only")}</p>
  </section>;
  return <section id={compact ? undefined : "feeding-reference"} aria-label={vi ? "Đối chiếu bú theo tuổi" : "Age-based feeding reference"} className="my-4 scroll-mt-24 rounded-2xl border border-orange-200/70 bg-orange-50/50 p-4 dark:border-orange-900 dark:bg-orange-950/20 sm:p-5" data-feeding-reference>
    <div className="flex items-start justify-between gap-3">
      <div><h2 className="font-semibold">{compact ? (vi ? "Bú hôm nay" : "Feeding today") : (vi ? "Đối chiếu bú theo tuổi" : "Age-based feeding reference")}</h2>
        {!compact && <p className="mt-1 text-xs text-muted-foreground">{selected.split("-").reverse().join("/")} · {formatAge(baby.dateOfBirth, new Date(`${selected}T12:00Z`), timeZone)}</p>}</div>
      {compact && <Link className="inline-flex min-h-11 shrink-0 items-center text-xs font-medium text-primary underline underline-offset-4" href={detailHref}>{vi ? "Chi tiết →" : "Details →"}</Link>}
    </div>
    <div className="mt-3 grid grid-cols-2 gap-4">
      <div><p className="text-xl font-semibold tabular-nums">{num(totals.ml)} <span className="text-sm font-normal">ml</span></p><p className="text-xs text-muted-foreground">{vi ? "sữa bình đã ghi" : "logged bottle milk"}</p><p className="mt-2 text-xs leading-5">{range ? (vi ? `Tham khảo SCT: ${range} ml/ngày` : `Formula reference: ${range} ml/day`) : (vi ? "Chưa đối chiếu tổng ml" : "No total-volume comparison")}</p></div>
      <div><p className="text-xl font-semibold tabular-nums">{totals.count} <span className="text-sm font-normal">{vi ? "cữ" : "feeds"}</span></p><p className="text-xs text-muted-foreground">{vi ? "đã ghi" : "logged"}</p><p className="mt-2 text-xs leading-5">{feedRange ? (vi ? `${totals.direct ? "Tham khảo" : "Tham khảo SCT"}: ${feedRange} cữ/ngày` : `Reference: ${feedRange} feeds/day`) : (vi ? "Theo tín hiệu đói–no của bé" : "Follow hunger/fullness cues")}</p></div>
    </div>
    {reason && <p className="mt-3 text-xs leading-5 text-muted-foreground">{reason}</p>}
    {totals.pending > 0 && <p className="mt-2 text-xs text-amber-800 dark:text-amber-200">{vi ? `${totals.pending} cữ chưa nhập ml; tổng lượng chưa đầy đủ.` : `${totals.pending} feeds await volumes; total is incomplete.`}</p>}
    {compact ? <p className="mt-3 text-[11px] text-muted-foreground">{vi ? "Ngày đang diễn ra · Mốc tham khảo, không phải lượng bắt buộc." : "Day in progress · A reference, not a required intake."}</p> : <>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"><span>{vi ? "Tã ướt đã ghi" : "Logged wet diapers"}: {diapers}</span><span>{vi ? "Cân gần nhất" : "Latest weight"}: {weight ? `${weight.weightKg} kg · ${toDateTimeLocal(weight.measuredAt, timeZone).slice(0, 10).split("-").reverse().join("/")}` : "—"}</span></div>
      <FeedingAssessment key={`${baby.id}-${selected}-${totals.ml}-${totals.count}`} vi={vi} ml={totals.ml} range={volume} eligible={!!volume && totals.pending === 0 && !totals.active} ended={end <= now} />
      <details className="mt-3 text-xs leading-6 text-muted-foreground"><summary className="flex min-h-11 cursor-pointer items-center underline underline-offset-4">{vi ? "Cách tính & nguồn tham khảo" : "Calculation & references"}</summary>
        <p>{vi ? "Khoảng lượng sữa công thức: 150–200 ml/kg/24 giờ, sau tuần đầu đến trước 6 tháng, dành cho bé khỏe mạnh đủ tháng. Cân trong 30 ngày là quy tắc độ mới dữ liệu của ứng dụng, không phải ngưỡng y khoa. Các mốc không xác định bé đủ/thiếu sữa và không áp dụng nếu bé có kế hoạch dinh dưỡng riêng." : "Formula reference: 150–200 ml/kg/24h after the first week to under 6 months, for healthy full-term babies. The 30-day weight freshness rule is an app rule, not a medical threshold. References do not diagnose intake or replace individual feeding plans."}</p>
        <p>{vi ? "Số cữ: sơ sinh dưới 28 ngày 8–12; sau đó trước 4 tháng 6–8, từ 4 đến trước 6 tháng 4–6 với sữa công thức. Không dùng số cữ để kết luận đủ sữa. Tổng ml gồm lượng bình đã ghi của cữ kết hợp, nhưng không có lượng bú trực tiếp." : "Frequency: under 28 days 8–12; then under 4 months 6–8, from 4 to under 6 months 4–6 for formula. Feed counts do not establish adequacy. Bottle totals include recorded mixed-feed volumes, but not direct breastfeeding."}</p>
        <div className="mt-2 flex flex-wrap gap-x-4">{Object.entries(feedingSources).map(([key, href]) => <a key={key} href={href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center underline">{({ formula: "NHS · ml/kg", frequency: "HSE · cữ bú", newborn: "CDC · sơ sinh", breastfeeding: "CDC · bú mẹ", signs: "NHS · dấu hiệu bú đủ" })[key]}</a>)}</div>
      </details>
    </>}
  </section>;
}
