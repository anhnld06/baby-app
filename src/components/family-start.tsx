import Link from "next/link";
import type { Mother, Pregnancy } from "@prisma/client";
import { ArrowUpRight, CalendarDays, Heart, Sparkles } from "lucide-react";
import { BabyIcon as Baby, HandbookIcon as BookHeart, MotherIcon as HeartPulse } from "@/components/app-icons";
import { FeatureLink } from "@/components/feature-link";
import { PageHeader } from "@/components/page-header";
import { UpcomingVaccination } from "@/components/upcoming-vaccination";
import { gestationalAge } from "@/features/mother/insights";
import { selectRelevantPregnancy } from "@/features/mother/pregnancy";

export function FamilyStart({ mother, name, nextVaccination }: { mother: (Mother & { pregnancies: Pregnancy[] }) | null; name: string; nextVaccination?: { vaccineName: string; scheduledAt: Date } | null }) {
  const pregnancy = selectRelevantPregnancy(mother?.pregnancies ?? []);
  const pregnant = pregnancy?.pregnancyStatus === "PREGNANT";
  const age = pregnant ? gestationalAge(pregnancy.lastMenstrualPeriod) : undefined;
  const pregnancyHref = mother ? "/profile/pregnancy" : "/profile/mother?next=pregnancy";
  return (
    <>
      <PageHeader title={pregnant ? "Một ngày mới, cùng mẹ" : "Chào mừng gia đình mình"} subtitle={name} />
      <section className="family-hero relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div aria-hidden="true" className="family-orbit" />
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium"><Heart className="size-3.5" /> Vani Family · Luôn bên gia đình</span>
        <h2 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight">{pregnant ? age ? `Tuần ${age.weeks}, từng ngày thêm gần con` : "Chờ con, chăm sóc mẹ mỗi ngày" : "Những điều nhỏ bé, được chăm chút mỗi ngày."}</h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">{pregnant ? "Lưu lần khám, ghi lại thay đổi của cơ thể và chuẩn bị đón con trong một không gian riêng." : "Từ những ngày chờ con đến cữ bú đầu tiên. Bắt đầu với giai đoạn của gia đình mình."}</p>
        {pregnant && <Link href="/mother/pregnancy" className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-2xl bg-white px-4 text-sm font-semibold text-[#713649]">Mở nhật ký thai kỳ <ArrowUpRight className="size-4" /></Link>}
      </section>
      <UpcomingVaccination appointment={nextVaccination} />
      {pregnant ? (
        <div className="mt-5 space-y-3">
          <FeatureLink href="/mother/pregnancy" icon={CalendarDays} title="Lịch khám và chỉ số thai kỳ" description={pregnancy.estimatedDueDate ? `Ngày dự sinh đã ghi: ${new Intl.DateTimeFormat("vi", { timeZone: "UTC" }).format(pregnancy.estimatedDueDate)}` : "Bổ sung ngày dự sinh và lưu kết quả mỗi lần khám."} tone="rose" />
          <FeatureLink href="/mother" icon={HeartPulse} title="Dành một chút thời gian cho mẹ" description="Sổ khám, mũi tiêm và hồ sơ sức khỏe của mẹ." tone="violet" />
          <FeatureLink href="/profile/baby/new" icon={Baby} title="Bé đã chào đời?" description="Thêm hồ sơ bé để bắt đầu nhật ký bú, ngủ và thay tã." tone="amber" />
        </div>
      ) : (
        <section className="mt-7 space-y-3" aria-labelledby="start-title">
          <h2 id="start-title" className="mb-3 text-lg font-semibold">Gia đình mình đang ở giai đoạn nào?</h2>
          <FeatureLink href={pregnancyHref} icon={HeartPulse} title="Mình đang mang thai" description="Tạo hồ sơ mẹ, thêm thai kỳ và theo dõi lịch khám." tone="rose" />
          <FeatureLink href="/profile/baby/new" icon={Baby} title="Bé đã chào đời" description="Chỉ cần tên và ngày sinh để bắt đầu nhật ký chăm bé." tone="amber" />
          <FeatureLink href={mother ? "/mother/cycle" : "/profile/mother"} icon={Sparkles} title="Mình muốn theo dõi sức khỏe" description="Chu kỳ, nhật ký cơ thể và hồ sơ riêng của mẹ." tone="violet" />
        </section>
      )}
      <div className="mt-6"><FeatureLink href="/knowledge" icon={BookHeart} title="Cùng tìm hiểu, từng chút một" description="Đọc cẩm nang theo giai đoạn, kèm nguồn tham khảo." tone="emerald" /></div>
    </>
  );
}
