import { db } from "@/lib/db";
import { getLocalDayRange, toDateTimeLocal, zonedDateTimeToUtc, formatAge } from "@/lib/date";
import { formatNumber } from "@/lib/format";
import { validDay } from "@/features/journey/dates";
import { feedingReference, feedingSources, feedingTotals } from "@/features/feeding-reference/reference";
import { FeedingAssessment } from "@/components/feeding-assessment";

type Baby = { id: string; dateOfBirth: Date; gestationalAgeAtBirth?: number | null };

/** Daily feeding log compared with age references (Statistics, one selected day). */
export async function FeedingReferenceCard({ baby, now, timeZone, day }: {
  baby: Baby; now: Date; timeZone: string; day?: string;
}) {
  const today = toDateTimeLocal(now, timeZone).slice(0, 10);
  const selected = validDay(day, today) > today ? today : validDay(day, today);
  const { start, end } = getLocalDayRange(zonedDateTimeToUtc(`${selected}T12:00`, timeZone), timeZone);
  const [feeds, weight, diapers] = await Promise.all([
    db.feeding.findMany({ where: { babyId: baby.id, startTime: { gte: start, lt: end, lte: now } }, select: { type: true, amountMl: true, endTime: true } }),
    db.growthEntry.findFirst({ where: { babyId: baby.id, measuredAt: { lt: end, lte: now }, weightKg: { not: null } }, orderBy: [{ measuredAt: "desc" }, { id: "desc" }], select: { weightKg: true, measuredAt: true } }),
    db.diaperEntry.count({ where: { babyId: baby.id, changedAt: { gte: start, lt: end, lte: now }, type: { in: ["WET", "BOTH"] } } }),
  ]);
  const ref = feedingReference(baby.dateOfBirth, selected, baby.gestationalAgeAtBirth, weight);
  const totals = feedingTotals(feeds);
  // Formula references are shown only for days actually logged as formula-only, never as a target for other days.
  const volume = totals.formulaOnly ? ref.volume : null;
  const range = volume ? `${formatNumber(volume.min)}–${formatNumber(volume.max)}` : null;
  const breastfedNewborn = totals.direct && !ref.premature && ref.days >= 0 && ref.days < 28;
  const feedRange = breastfedNewborn ? "8–12" : totals.formulaOnly && ref.feeds ? `${ref.feeds.min}–${ref.feeds.max}` : null;
  const reason = ref.premature ? "Bé sinh non: đối chiếu theo kế hoạch dinh dưỡng riêng."
    : ref.days < 0 ? "Ngày được chọn trước ngày sinh của bé."
    : totals.count === 0 ? "Chưa có cữ bú được ghi trong ngày."
    : totals.direct ? "Có bú mẹ trực tiếp: không quy đổi phút bú thành ml."
    : !totals.formulaOnly ? "Mốc ml chỉ áp dụng khi bé bú hoàn toàn sữa công thức; không áp cho sữa mẹ vắt."
    : ref.days < 7 ? "Tuần đầu: theo dõi từng ngày tuổi, chưa đặt mốc tổng ml/ngày."
    : ref.months >= 6 ? "Từ 6 tháng: cần xem cùng ăn dặm và kế hoạch dinh dưỡng; chưa đặt mốc ml chung."
    : !ref.weight ? "Thêm lần cân trong 30 ngày gần nhất để tính khoảng ml tham khảo." : null;
  const shortDate = (value: string) => value.split("-").reverse().join("/");
  return <section id="feeding-reference" aria-label="Đối chiếu bú theo tuổi" className="my-4 scroll-mt-24 rounded-2xl border border-orange-200/70 bg-orange-50/50 p-4 dark:border-orange-900 dark:bg-orange-950/20 sm:p-5" data-feeding-reference>
    <h2 className="font-semibold">Đối chiếu bú theo tuổi</h2>
    <p className="mt-1 text-xs text-muted-foreground">{shortDate(selected)} · {formatAge(baby.dateOfBirth, new Date(`${selected}T12:00Z`), timeZone)}</p>
    <div className="mt-3 grid grid-cols-2 gap-4">
      <div><p className="text-xl font-semibold tabular-nums">{formatNumber(totals.ml)} <span className="text-sm font-normal">ml</span></p><p className="text-xs text-muted-foreground">sữa bình đã ghi</p>{range && <p className="mt-2 text-xs leading-5">Tham khảo sữa công thức: {range} ml/ngày</p>}</div>
      <div><p className="text-xl font-semibold tabular-nums">{totals.count} <span className="text-sm font-normal">cữ</span></p><p className="text-xs text-muted-foreground">đã ghi</p>{feedRange && <p className="mt-2 text-xs leading-5">Tham khảo theo tuổi: {feedRange} cữ/ngày</p>}</div>
    </div>
    {reason && <p className="mt-3 text-xs leading-5 text-muted-foreground">{reason}</p>}
    {totals.pending > 0 && <p className="mt-2 text-xs text-amber-800 dark:text-amber-200">{totals.pending} cữ chưa nhập ml; tổng lượng chưa đầy đủ.</p>}
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"><span>Tã ướt đã ghi: {diapers}</span><span>Cân gần nhất: {weight?.weightKg != null ? `${formatNumber(weight.weightKg)} kg · ${shortDate(toDateTimeLocal(weight.measuredAt, timeZone).slice(0, 10))}` : "—"}</span></div>
    <FeedingAssessment key={`${baby.id}-${selected}-${totals.ml}-${totals.count}`} ml={totals.ml} range={volume} eligible={!!volume && totals.pending === 0 && !totals.active} ended={end <= now} />
    <details className="mt-3 text-xs leading-6 text-muted-foreground"><summary className="flex min-h-11 cursor-pointer items-center underline underline-offset-4">Cách tính &amp; nguồn tham khảo</summary>
      <p>Khoảng lượng sữa công thức: 150–200 ml/kg/24 giờ, sau tuần đầu đến trước 6 tháng, dành cho bé khỏe mạnh đủ tháng. Cân trong 30 ngày là quy tắc độ mới dữ liệu của ứng dụng, không phải ngưỡng y khoa. Các mốc không xác định bé đủ/thiếu sữa và không áp dụng nếu bé có kế hoạch dinh dưỡng riêng.</p>
      <p>Số cữ: sơ sinh dưới 28 ngày 8–12; sau đó trước 4 tháng 6–8, từ 4 đến trước 6 tháng 4–6 với sữa công thức. Không dùng số cữ để kết luận đủ sữa. Tổng ml gồm lượng bình đã ghi của cữ kết hợp, nhưng không có lượng bú trực tiếp.</p>
      <div className="mt-2 flex flex-wrap gap-x-4">{Object.entries(feedingSources).map(([key, href]) => <a key={key} href={href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center underline">{({ formula: "NHS · ml/kg", frequency: "HSE · cữ bú", newborn: "CDC · sơ sinh", breastfeeding: "CDC · bú mẹ", signs: "NHS · dấu hiệu bú đủ" })[key]}</a>)}</div>
    </details>
  </section>;
}
