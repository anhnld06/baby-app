import { Scale, ChevronRight } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatAge, toDateTimeLocal } from "@/lib/date";
import { calculateWho, weightAgeRange } from "@/features/growth/who-local";
import { whoEntryInput } from "@/features/growth/who-anthro";
import { interpretWho, type WhoIndicator } from "@/features/growth/who-interpretation";
import { RecalculateGrowthButton } from "@/components/recalculate-growth-button";

export async function WhoGrowthReference({ babyId, locale, timeZone, at = new Date(), compact = false, recalculate = false }: {
  babyId: string; locale: "vi" | "en"; timeZone: string; at?: Date; compact?: boolean; recalculate?: boolean;
}) {
  const vi = locale === "vi";
  const entry = await db.growthEntry.findFirst({
    where: { babyId, measuredAt: { lte: at } }, orderBy: [{ measuredAt: "desc" }, { id: "desc" }],
    include: { baby: { select: { gender: true, dateOfBirth: true, gestationalAgeAtBirth: true } } },
  });
  if (!entry) return <section data-who-reference className="my-4 rounded-2xl border border-border bg-card p-4"><h2 className="font-semibold">{vi ? "Tăng trưởng theo WHO" : "WHO growth reference"}</h2><p className="mt-2 text-sm text-muted-foreground">{vi ? "Thêm lần đo để tự động đối chiếu chuẩn WHO ngay tại đây." : "Add a measurement to see an automatic WHO comparison here."}</p><Link href="/tracking/growth?new=1" className="inline-flex min-h-11 items-center text-sm text-primary underline">{vi ? "Thêm chỉ số" : "Add measurement"}</Link></section>;
  const { input, reason } = whoEntryInput(entry, timeZone);
  const result = input ? calculateWho(input) : null;
  const range = input ? weightAgeRange(input.sex, input.ageInDays) : null;
  const weightLabel = result ? interpretWho(result.weightAgeZ, "weightAge", result.flags.includes("WEIGHT_AGE_IMPLAUSIBLE"), vi).label : null;
  const num = (value: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
  const date = toDateTimeLocal(entry.measuredAt, timeZone).slice(0, 10).split("-").reverse().join("/");
  const metrics: { key: "weightAgeZ" | "heightAgeZ" | "weightHeightZ" | "headAgeZ"; indicator: WhoIndicator; flag: string; label: string }[] = [
    { key: "weightAgeZ", indicator: "weightAge", flag: "WEIGHT_AGE_IMPLAUSIBLE", label: vi ? "Cân nặng / tuổi" : "Weight / age" },
    { key: "heightAgeZ", indicator: "heightAge", flag: "HEIGHT_AGE_IMPLAUSIBLE", label: vi ? "Chiều dài, cao / tuổi" : "Length, height / age" },
    { key: "weightHeightZ", indicator: "weightHeight", flag: "WEIGHT_HEIGHT_IMPLAUSIBLE", label: vi ? "Cân nặng / chiều dài, cao" : "Weight / length, height" },
    { key: "headAgeZ", indicator: "headAge", flag: "HEAD_AGE_IMPLAUSIBLE", label: vi ? "Vòng đầu / tuổi" : "Head circumference / age" },
  ];
  const needsReview = result && metrics.some(metric => interpretWho(result[metric.key], metric.indicator, result.flags.includes(metric.flag), vi).tone === "review");
  if (compact) {
    const z = result?.weightAgeZ;
    const flagged = result?.flags.includes("WEIGHT_AGE_IMPLAUSIBLE");
    const label = flagged ? (vi ? "Kiểm tra số đo" : "Check weight") : z == null ? (vi ? "Chưa đối chiếu" : "No comparison") : z < -2 ? (vi ? "Thấp theo tuổi" : "Low for age") : z > 2 ? (vi ? "Cao theo tuổi" : "High for age") : (vi ? "Trong khoảng WHO" : "Within WHO range");
    return <section data-who-reference className="rounded-2xl border border-border/60 bg-card p-4">
      <div className="flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-sm font-medium"><Scale className="size-4 text-sky-500" />{vi ? "Tăng trưởng theo WHO" : "WHO growth reference"}</h2><Link href="/tracking/growth" aria-label={vi ? "Chi tiết →" : "Details →"} className="flex min-h-9 min-w-9 items-center justify-center text-muted-foreground"><ChevronRight className="size-4" /></Link></div>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2"><p className="text-2xl font-semibold tabular-nums">{entry.weightKg != null ? num(entry.weightKg) : "—"} <span className="text-sm font-normal text-muted-foreground">kg</span></p><span className={`rounded-full px-2 py-1 text-[10px] font-medium ${needsReview ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200" : "bg-secondary text-muted-foreground"}`}>{label}</span></div>
      <p className="mt-1 text-[11px] text-muted-foreground">{range ? `WHO: ${num(range.min)}–${num(range.max)} kg · ` : ""}{date}</p>
      {needsReview && <p className="mt-2 text-[11px] text-amber-800 dark:text-amber-200">{vi ? "Kiểm tra số đo, trao đổi bác sĩ" : "Check measurement; discuss with clinician"}</p>}
    </section>;
  }
  return <section data-who-reference className="my-4 rounded-2xl border border-sky-200/70 bg-sky-50/50 p-4 dark:border-sky-900 dark:bg-sky-950/30 sm:p-5">
    <div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{vi ? "Tăng trưởng theo WHO" : "WHO growth reference"}</h2><p className="mt-1 text-xs text-muted-foreground">{vi ? "Đo ngày" : "Measured"} {date} · {formatAge(entry.baby.dateOfBirth, entry.measuredAt, timeZone)} {vi ? "tại lần đo" : "at measurement"}</p></div>{compact && <Link href="/tracking/growth" className="inline-flex min-h-11 shrink-0 items-center text-xs font-medium text-primary underline">{vi ? "Chi tiết →" : "Details →"}</Link>}</div>
    <p className="mt-3 text-xl font-semibold">{entry.weightKg != null ? `${num(entry.weightKg)} kg` : (vi ? "Chưa ghi cân nặng" : "No weight logged")}</p>
    {weightLabel && <p className="mt-1 text-sm font-medium">{weightLabel}</p>}
    {range && <p className="mt-2 text-xs leading-6 text-muted-foreground">{vi ? `Cân nặng theo tuổi, giới tính: ${num(range.min)}–${num(range.max)} kg (−2 đến +2 SD).` : `Weight by age and sex: ${num(range.min)}–${num(range.max)} kg (−2 to +2 SD).`}</p>}
    {needsReview && <p className="mt-2 text-xs leading-6 text-amber-800 dark:text-amber-200">{vi ? "Kiểm tra ngày sinh, ngày đo và số đo. Nếu thông tin đúng, hãy trao đổi với bác sĩ để đánh giá tăng trưởng của bé." : "Check birth date, measurement date and measurements. If correct, discuss baby's growth with a clinician."}</p>}
    {reason && <p className="mt-2 text-sm text-muted-foreground">{reason === "sex" ? (vi ? "Cập nhật giới tính của bé để chọn bảng WHO phù hợp." : "Set baby's sex to select the WHO reference.") : reason === "preterm" ? (vi ? "Bé sinh non cần biểu đồ và tuổi hiệu chỉnh riêng; chưa áp chuẩn trẻ đủ tháng." : "Preterm babies need a separate chart and corrected-age assessment.") : (vi ? "Chỉ áp dụng WHO 2006 từ ngày sinh đến dưới 60 tháng tuổi tại lần đo." : "WHO 2006 applies from birth to under 60 months at measurement.")}</p>}
    {!compact && result && <>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{metrics.map(metric => {
        const positionFlag = metric.key !== "weightAgeZ" && metric.key !== "headAgeZ" && result.flags.includes("MEASUREMENT_POSITION_IMPLAUSIBLE");
        const interpretation = interpretWho(result[metric.key], metric.indicator, positionFlag || result.flags.includes(metric.flag), vi);
        return <div key={metric.key} className="rounded-xl bg-background/80 p-3"><h3 className="text-xs text-muted-foreground">{metric.label}</h3><p className={`mt-2 text-sm font-medium ${interpretation.tone === "review" ? "text-amber-800 dark:text-amber-200" : ""}`}>{interpretation.label}</p><p className="mt-1 text-xs text-muted-foreground">Z-score: {result[metric.key] == null ? "—" : result[metric.key]!.toFixed(2)}</p></div>;
      })}</div>
      <p className="mt-3 text-xs leading-6 text-muted-foreground">{vi ? "Mỗi chỉ số được đối chiếu trực tiếp với bảng WHO theo giới tính và tuổi vào ngày đo. Khoảng −2 đến +2 SD là tham khảo, không phải mục tiêu phải đạt. Cân nặng cao theo tuổi chưa có nghĩa thừa cân; cần xem cùng chiều dài. Theo dõi nhiều lần đo để hiểu xu hướng tăng trưởng. Bé có phù cần được đánh giá riêng." : "Each indicator is compared locally by sex and age at measurement. The −2 to +2 SD range is a reference, not a target. High weight-for-age does not establish overweight; review length and trends with a clinician. Oedema needs separate assessment."}</p>
      {result.flags.length > 0 && <p className="mt-2 text-xs text-amber-800 dark:text-amber-200">{vi ? "Có số đo hoặc tư thế đo cần kiểm tra lại trước khi diễn giải." : "Check flagged measurements or measurement position before interpretation."}</p>}
      <details className="mt-2 text-xs leading-6 text-muted-foreground"><summary className="flex min-h-11 cursor-pointer items-center underline">{vi ? "Dữ liệu chuẩn & cách tính" : "Reference data & calculation"}</summary><p>{vi ? "Bảng WHO 2006 được lưu sẵn trong ứng dụng, tách theo giới tính và ngày tuổi. Điểm Z cho biết số đo cách mức giữa của chuẩn WHO bao nhiêu độ lệch chuẩn (SD). Không cần mở trang ngoài hoặc kết nối dịch vụ để đối chiếu. Khi không ghi tư thế, chiều dài/cao được hiểu theo tuổi; cần kiểm tra cách đo thực tế." : "WHO 2006 tables are bundled by sex and age in days. LMS calculations, extreme-score adjustment and position correction follow WHO anthro. No external lookup or service is needed. Missing measurement position is interpreted by age; check how the measurement was taken."}</p><p>WHO Child Growth Standards · 2006/2007</p></details>
    </>}
    {recalculate && <RecalculateGrowthButton babyId={babyId} locale={locale} />}
  </section>;
}
