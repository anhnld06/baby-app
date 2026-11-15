import { Scale, ChevronRight } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatAge, toDateTimeLocal } from "@/lib/date";
import { formatNumber } from "@/lib/format";
import { calculateWho, weightAgeRange } from "@/features/growth/who-local";
import { whoEntryInput } from "@/features/growth/who-anthro";
import { interpretWho, type WhoIndicator } from "@/features/growth/who-interpretation";
import { RecalculateGrowthButton } from "@/components/recalculate-growth-button";

type MetricKey = "weightAgeZ" | "heightAgeZ" | "weightHeightZ" | "bmiAgeZ" | "headAgeZ";
const METRICS: { key: MetricKey; indicator: WhoIndicator; flag: string; label: string; usesLength: boolean }[] = [
  { key: "weightAgeZ", indicator: "weightAge", flag: "WEIGHT_AGE_IMPLAUSIBLE", label: "Cân nặng / tuổi", usesLength: false },
  { key: "heightAgeZ", indicator: "heightAge", flag: "HEIGHT_AGE_IMPLAUSIBLE", label: "Chiều dài, cao / tuổi", usesLength: true },
  { key: "weightHeightZ", indicator: "weightHeight", flag: "WEIGHT_HEIGHT_IMPLAUSIBLE", label: "Cân nặng / chiều dài, cao", usesLength: true },
  { key: "bmiAgeZ", indicator: "bmiAge", flag: "BMI_AGE_IMPLAUSIBLE", label: "BMI / tuổi", usesLength: true },
  { key: "headAgeZ", indicator: "headAge", flag: "HEAD_AGE_IMPLAUSIBLE", label: "Vòng đầu / tuổi", usesLength: false },
];
const zScore = new Intl.NumberFormat("vi-VN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const reviewText = "text-amber-800 dark:text-amber-200";

export async function WhoGrowthReference({ babyId, timeZone, at = new Date(), compact = false, recalculate = false, open = false }: {
  babyId: string; timeZone: string; at?: Date; compact?: boolean; recalculate?: boolean;
  /** Opens the detail section, e.g. after a failed save so the recalculate button is visible. */
  open?: boolean;
}) {
  const entry = await db.growthEntry.findFirst({
    where: { babyId, measuredAt: { lte: at } }, orderBy: [{ measuredAt: "desc" }, { id: "desc" }],
    include: { baby: { select: { gender: true, dateOfBirth: true, gestationalAgeAtBirth: true } } },
  });
  if (!entry) return <section data-who-reference className={`${compact ? "" : "my-4 "}rounded-2xl border border-border bg-card p-4`}><h2 className="font-semibold">Tăng trưởng theo WHO</h2><p className="mt-2 text-sm text-muted-foreground">Thêm lần đo để tự động đối chiếu chuẩn WHO ngay tại đây.</p><Link href="/tracking/growth?new=1" className="inline-flex min-h-11 items-center text-sm text-primary underline">Thêm chỉ số</Link></section>;
  const { input, reason } = whoEntryInput(entry, timeZone);
  const result = input ? calculateWho(input) : null;
  const range = input ? weightAgeRange(input.sex, input.ageInDays) : null;
  const date = toDateTimeLocal(entry.measuredAt, timeZone).slice(0, 10).split("-").reverse().join("/");
  const metrics = result ? METRICS.map(metric => {
    const positionFlag = metric.usesLength && result.flags.includes("MEASUREMENT_POSITION_IMPLAUSIBLE");
    const interpretation = interpretWho(result[metric.key], metric.indicator, positionFlag || result.flags.includes(metric.flag));
    return { ...metric, z: result[metric.key], tone: interpretation.tone, status: interpretation.label };
  }) : [];
  const weight = metrics[0];
  const othersNeedReview = metrics.slice(1).some(metric => metric.tone === "review");
  const weightReview = weight?.tone === "review";
  const unsupported = reason === "sex" ? "Cập nhật giới tính của bé để chọn bảng WHO phù hợp."
    : reason === "preterm" ? "Bé sinh non cần biểu đồ và tuổi hiệu chỉnh riêng; chưa áp chuẩn trẻ đủ tháng."
    : reason ? "Chỉ áp dụng WHO 2006 từ ngày sinh đến dưới 60 tháng tuổi tại lần đo." : null;
  // Same label on every screen: the weight-for-age interpretation.
  const badge = weight && <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${weightReview ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200" : "bg-secondary text-muted-foreground"}`}>{weight.status}</span>;
  const weightValue = <p className="flex items-baseline gap-1.5 text-2xl font-semibold tabular-nums">{entry.weightKg != null ? formatNumber(entry.weightKg) : "—"}<span className="text-sm font-normal text-muted-foreground">kg</span></p>;

  if (compact) {
    return <section data-who-reference className="rounded-2xl border border-border/60 bg-card p-4">
      <div className="flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-sm font-medium"><Scale className="size-4 text-sky-500" />Tăng trưởng theo WHO</h2><Link href="/tracking/growth" aria-label="Xem trang tăng trưởng" className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted-foreground"><ChevronRight className="size-4" /></Link></div>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2">{weightValue}{badge}</div>
      <p className="mt-1 text-xs text-muted-foreground">{range ? `Khoảng WHO: ${formatNumber(range.min)}–${formatNumber(range.max)} kg · ` : ""}đo ngày {date}</p>
      {unsupported && <p className="mt-2 text-xs text-muted-foreground">{unsupported}</p>}
      {(weightReview || othersNeedReview) && <p className={`mt-2 text-xs leading-5 ${reviewText}`}>{weightReview ? "Nên xem lại số đo; nếu đúng, hãy hỏi bác sĩ." : "Có chỉ số khác nên xem lại ở trang Tăng trưởng."}</p>}
    </section>;
  }

  return <section data-who-reference className="my-4 rounded-2xl border border-sky-200/70 bg-sky-50/50 p-4 dark:border-sky-900 dark:bg-sky-950/30 sm:p-5">
    <h2 className="font-semibold">Tăng trưởng theo WHO</h2>
    <p className="mt-1 text-xs text-muted-foreground">Đo ngày {date} · {formatAge(entry.baby.dateOfBirth, entry.measuredAt, timeZone)} tại lần đo</p>
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">{entry.weightKg != null ? weightValue : <p className="text-sm text-muted-foreground">Chưa ghi cân nặng</p>}{badge}</div>
    {range && <p className="mt-1 text-xs leading-5 text-muted-foreground">Khoảng WHO theo tuổi, giới tính: {formatNumber(range.min)}–{formatNumber(range.max)} kg</p>}
    {unsupported && <p className="mt-2 text-sm text-muted-foreground">{unsupported}</p>}
    {(weightReview || othersNeedReview) && <p className={`mt-2 text-xs leading-5 ${reviewText}`}>{weightReview ? "Nên xem lại ngày sinh, ngày đo và số đo. Nếu thông tin đúng, hãy trao đổi với bác sĩ." : "Có chỉ số khác nên xem lại; bấm xem chi tiết bên dưới."}</p>}
    {(result || recalculate) && <details open={open} className="group mt-3 border-t border-sky-200/70 pt-1 dark:border-sky-900">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-primary [&::-webkit-details-marker]:hidden">
        Chi tiết các chỉ số &amp; cách tính<ChevronRight className="size-4 transition-transform group-open:rotate-90 motion-reduce:transition-none" />
      </summary>
      {result && <>
        <div className="mt-1 grid gap-2 sm:grid-cols-2">{metrics.map(metric => <div key={metric.key} className="flex items-baseline justify-between gap-3 rounded-xl bg-background/80 px-3 py-2.5">
          <div className="min-w-0"><h3 className="text-xs text-muted-foreground">{metric.label}</h3><p className={`mt-0.5 text-sm font-medium ${metric.tone === "review" ? reviewText : ""}`}>{metric.status}</p></div>
          <p className="shrink-0 text-xs tabular-nums text-muted-foreground">Z {metric.z == null ? "—" : zScore.format(metric.z)}</p>
        </div>)}</div>
        {result.flags.length > 0 && <p className={`mt-2 text-xs ${reviewText}`}>Có số đo hoặc tư thế đo cần kiểm tra lại trước khi diễn giải.</p>}
        <div className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
          <p>Mỗi chỉ số được đối chiếu với bảng WHO theo giới tính và tuổi vào ngày đo. Khoảng −2 đến +2 SD là tham khảo, không phải mục tiêu phải đạt. Cân nặng cao theo tuổi chưa có nghĩa thừa cân; cần xem cùng chiều dài. Theo dõi nhiều lần đo để thấy xu hướng. Bé có phù cần được đánh giá riêng.</p>
          <p>Điểm Z cho biết số đo cách mức giữa của chuẩn WHO bao nhiêu độ lệch chuẩn (SD). Bảng WHO 2006 được lưu sẵn trong ứng dụng, tách theo giới tính và ngày tuổi; không cần mở trang ngoài hoặc kết nối dịch vụ để đối chiếu. Khi không ghi tư thế đo, chiều dài/cao được hiểu theo tuổi.</p>
          <p>WHO Child Growth Standards · 2006/2007</p>
        </div>
      </>}
      {recalculate && <RecalculateGrowthButton babyId={babyId} />}
    </details>}
  </section>;
}
