import Link from "next/link";
import { db } from "@/lib/db";
import { prenatalBaseline, initialGrowthBaseline } from "@/features/growth/prenatal-baseline";

export async function PrenatalGrowthBaseline({ baby, userId, timeZone, locale }: { baby: { id: string; pregnancyId: string | null; dateOfBirth: Date; birthTime: string | null; birthWeightKg: number | null; birthLengthCm: number | null; birthHeadCircumferenceCm: number | null }; userId: string; timeZone: string; locale: "vi" | "en" }) {
  const vi = locale === "vi";
  if (!baby.pregnancyId) return <div className="mb-4 rounded-2xl border border-dashed p-4 text-xs text-muted-foreground"><Link href={`/profile/baby/${baby.id}`} className="underline">{vi ? "Liên kết thai kỳ để lấy mốc tăng trưởng trước sinh của con" : "Link a pregnancy to show your baby's prenatal baseline"} ↗</Link></div>;
  const pregnancy = await db.pregnancy.findFirst({ where: { id: baby.pregnancyId, mother: { userId }, pregnancyStatus: "DELIVERED" }, include: { checkups: true, _count: { select: { babies: true } } } });
  if (!pregnancy) return null;
  const result = pregnancy._count.babies > 1 ? { status: "MULTIPLE" as const } : prenatalBaseline(pregnancy.checkups, baby.dateOfBirth.toISOString().slice(0, 10), timeZone, baby.birthTime);
  const initial = initialGrowthBaseline(baby, result.status === "FOUND" ? result : null);
  const n = (value: number | null, unit: string) => value == null ? "—" : `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)} ${unit}`;
  return <section aria-label={vi ? "Mốc tăng trưởng trước sinh" : "Prenatal growth baseline"} className="mb-5 rounded-3xl border border-rose-200 bg-rose-50/40 p-4 sm:p-6 dark:border-rose-900 dark:bg-rose-950/20">
    <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600">{vi ? "Từ trong bụng mẹ đến ngày chào đời" : "From pregnancy to birth"}</p>
    <h2 className="mt-2 font-semibold">{vi ? "Mốc khởi đầu hành trình tăng trưởng" : "Your growth journey starts here"}</h2>
    {result.status === "FOUND" ? <>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-background p-4"><h3 className="text-xs font-semibold">{vi ? "Lần siêu âm cuối trước sinh" : "Last prenatal ultrasound"}</h3><p className="mt-1 text-xs text-muted-foreground">{result.day.split("-").reverse().join("/")}</p><dl className="mt-3 space-y-2 text-sm"><div><dt className="text-xs text-muted-foreground">{vi ? "Cân nặng ước tính" : "Estimated weight"}</dt><dd className="font-semibold">{n(result.weightKg, "kg")}</dd></div><div><dt className="text-xs text-muted-foreground">{vi ? "Vòng đầu siêu âm" : "Ultrasound head circumference"}</dt><dd className="font-semibold">{n(result.headCm, "cm")}</dd></div></dl><Link className="mt-3 inline-flex min-h-11 items-center text-xs underline" href={`/mother/pregnancy/checkups?pregnancy=${baby.pregnancyId}&edit=${result.id}`}>{vi ? "Xem phiếu gốc" : "View original report"} ↗</Link></div>
        <div className="rounded-2xl bg-background p-4" role="group" aria-label={vi ? "Chỉ số ban đầu đã đối chiếu" : "Resolved initial measurements"}>
          <h3 className="text-xs font-semibold">{vi ? "Mốc ban đầu của con" : "Your baby's initial baseline"}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{vi ? "Ưu tiên số đo lúc sinh · Bù từng chỉ số còn thiếu" : "Birth measurements first · Fill missing fields individually"}</p>
          <dl className="mt-3 space-y-3 text-sm">{[
            { key: "weight", label: vi ? "Cân nặng ban đầu" : "Initial weight", unit: "kg" },
            { key: "head", label: vi ? "Vòng đầu ban đầu" : "Initial head circumference", unit: "cm" },
            { key: "length", label: vi ? "Chiều dài lúc sinh" : "Birth length", unit: "cm" },
          ].map(({ key, label, unit }) => {
            const field = initial[key as keyof typeof initial];
            return <div key={key}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="font-semibold">{n(field.value, unit)}<span className="mt-1 block text-[11px] font-normal leading-5 text-muted-foreground">{field.source === "BIRTH" ? (vi ? "Số đo thực tế lúc sinh" : "Actual birth measurement") : field.source === "PRENATAL" ? (vi ? `Ước tính trước sinh · phiếu ${result.day.split("-").reverse().join("/")}` : `Prenatal estimate · report ${result.day}`) : (vi ? "Chưa có số đo tương ứng" : "No corresponding measurement")}</span></dd></div>;
          })}</dl>
          <Link className="mt-3 inline-flex min-h-11 items-center text-xs underline" href={`/profile/baby/${baby.id}`}>{vi ? "Cập nhật số đo chào đời" : "Update birth measurements"} ↗</Link>
        </div>
      </div><p className="mt-3 text-xs leading-6 text-muted-foreground">{vi ? "Chỉ số lúc sinh còn thiếu được bù từ phiếu cuối trước sinh, có ghi ngày và nguồn ước tính. Khi bổ sung số đo thực tế, mốc ban đầu tự ưu tiên số mới. Không quy đổi chiều dài xương đùi thành chiều dài cơ thể. Các biểu đồ và đánh giá WHO bên dưới dùng số đo thực tế sau sinh." : "Missing birth measurements use the last prenatal report, labelled with its date and estimated source. Actual birth values take priority once entered. Femur length is not body length. Charts and WHO assessments below use actual postnatal measurements."}</p>
    </> : <p className="mt-3 text-xs leading-6 text-muted-foreground">{result.status === "MULTIPLE" ? (vi ? "Chưa có số đo riêng từng thai: không tự gán cùng chỉ số cho các bé." : "Individual fetal measurements are unavailable; a shared baseline cannot be assigned.") : result.status === "AMBIGUOUS" ? (vi ? "Có nhiều phiếu cùng ngày chưa rõ thứ tự. Cần bổ sung giờ khám để xác định phiếu cuối." : "Same-day reports have ambiguous ordering. Add examination times to identify the last report.") : (vi ? "Chưa có phiếu siêu âm xác định được trước thời điểm sinh. Phiếu cùng ngày cần cả giờ sinh và giờ khám để xác định thứ tự." : "No clearly pre-birth ultrasound is recorded. Same-day reports require both examination and birth times.")}</p>}
  </section>;
}
