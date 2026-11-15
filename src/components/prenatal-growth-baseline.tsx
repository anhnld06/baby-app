import Link from "next/link";
import { db } from "@/lib/db";
import { prenatalBaseline, initialGrowthBaseline } from "@/features/growth/prenatal-baseline";
import { formatNumber } from "@/lib/format";

export async function PrenatalGrowthBaseline({ baby, userId, timeZone }: { baby: { id: string; pregnancyId: string | null; dateOfBirth: Date; birthTime: string | null; birthWeightKg: number | null; birthLengthCm: number | null; birthHeadCircumferenceCm: number | null }; userId: string; timeZone: string }) {
  if (!baby.pregnancyId) return <div className="mb-4 rounded-2xl border border-dashed p-4 text-xs text-muted-foreground"><Link href={`/profile/baby/${baby.id}`} className="underline">{"Liên kết thai kỳ để lấy mốc tăng trưởng trước sinh của con"} ↗</Link></div>;
  const pregnancy = await db.pregnancy.findFirst({ where: { id: baby.pregnancyId, mother: { userId }, pregnancyStatus: "DELIVERED" }, include: { checkups: true, _count: { select: { babies: true } } } });
  if (!pregnancy) return null;
  const result = pregnancy._count.babies > 1 ? { status: "MULTIPLE" as const } : prenatalBaseline(pregnancy.checkups, baby.dateOfBirth.toISOString().slice(0, 10), timeZone, baby.birthTime);
  const initial = initialGrowthBaseline(baby, result.status === "FOUND" ? result : null);
  const n = (value: number | null, unit: string) => value == null ? "—" : `${formatNumber(value)} ${unit}`;
  return <section aria-label="Mốc tăng trưởng trước sinh" className="mb-5 rounded-3xl border border-rose-200 bg-rose-50/40 p-4 sm:p-6 dark:border-rose-900 dark:bg-rose-950/20">
    <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">Từ trong bụng mẹ đến ngày chào đời</p>
    <h2 className="mt-2 font-semibold">Mốc khởi đầu hành trình tăng trưởng</h2>
    {result.status === "FOUND" ? <>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-background p-4"><h3 className="text-xs font-semibold">Lần siêu âm cuối trước sinh</h3><p className="mt-1 text-xs text-muted-foreground">{result.day.split("-").reverse().join("/")}</p><dl className="mt-3 space-y-2 text-sm"><div><dt className="text-xs text-muted-foreground">Cân nặng ước tính</dt><dd className="font-semibold">{n(result.weightKg, "kg")}</dd></div><div><dt className="text-xs text-muted-foreground">Vòng đầu siêu âm</dt><dd className="font-semibold">{n(result.headCm, "cm")}</dd></div></dl><Link className="mt-3 inline-flex min-h-11 items-center text-xs underline" href={`/mother/pregnancy/checkups?pregnancy=${baby.pregnancyId}&edit=${result.id}`}>{"Xem phiếu gốc"} ↗</Link></div>
        <div className="rounded-2xl bg-background p-4" role="group" aria-label="Chỉ số ban đầu đã đối chiếu">
          <h3 className="text-xs font-semibold">Mốc ban đầu của con</h3>
          <p className="mt-1 text-xs text-muted-foreground">Ưu tiên số đo lúc sinh · Bù từng chỉ số còn thiếu</p>
          <dl className="mt-3 space-y-3 text-sm">{[
            { key: "weight", label: "Cân nặng ban đầu", unit: "kg" },
            { key: "head", label: "Vòng đầu ban đầu", unit: "cm" },
            { key: "length", label: "Chiều dài lúc sinh", unit: "cm" },
          ].map(({ key, label, unit }) => {
            const field = initial[key as keyof typeof initial];
            return <div key={key}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="font-semibold">{n(field.value, unit)}<span className="mt-1 block text-xs font-normal leading-5 text-muted-foreground">{field.source === "BIRTH" ? "Số đo thực tế lúc sinh" : field.source === "PRENATAL" ? (`Ước tính trước sinh · phiếu ${result.day.split("-").reverse().join("/")}`) : "Chưa có số đo tương ứng"}</span></dd></div>;
          })}</dl>
          <Link className="mt-3 inline-flex min-h-11 items-center text-xs underline" href={`/profile/baby/${baby.id}`}>{"Cập nhật số đo chào đời"} ↗</Link>
        </div>
      </div><p className="mt-3 text-xs leading-6 text-muted-foreground">Chỉ số lúc sinh còn thiếu được bù từ phiếu cuối trước sinh, có ghi ngày và nguồn ước tính. Khi bổ sung số đo thực tế, mốc ban đầu tự ưu tiên số mới. Không quy đổi chiều dài xương đùi thành chiều dài cơ thể. Các biểu đồ và đánh giá WHO bên dưới dùng số đo thực tế sau sinh.</p>
    </> : <p className="mt-3 text-xs leading-6 text-muted-foreground">{result.status === "MULTIPLE" ? "Chưa có số đo riêng từng thai: không tự gán cùng chỉ số cho các bé." : result.status === "AMBIGUOUS" ? "Có nhiều phiếu cùng ngày chưa rõ thứ tự. Cần bổ sung giờ khám để xác định phiếu cuối." : "Chưa có phiếu siêu âm xác định được trước thời điểm sinh. Phiếu cùng ngày cần cả giờ sinh và giờ khám để xác định thứ tự."}</p>}
  </section>;
}
