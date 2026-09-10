import { Bell, CalendarDays, FileHeart, HeartPulse, ShieldCheck, Syringe, UserRound } from "lucide-react";
import { FeatureLink } from "@/components/feature-link";
import { PageHeader } from "@/components/page-header";
import { gestationalAge } from "@/features/mother/insights";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function MotherHubPage() {
  const user = await requireUser();
  const mother = await db.mother.findUnique({
    where: { userId: user.id },
    include: {
      pregnancies: { orderBy: { createdAt: "desc" }, take: 1, include: { _count: { select: { checkups: true } } } },
      _count: { select: { menstrualCycles: true, medicalVisits: true, insurancePolicies: true, vaccinationRecords: true } },
    },
  });
  if (!mother)
    return (
      <>
        <PageHeader title="Của mẹ" subtitle="Không gian sức khỏe riêng của mẹ" />
        <FeatureLink href="/profile/mother" icon={UserRound} title="Tạo hồ sơ mẹ" description="Thêm thông tin cơ bản trước khi bắt đầu theo dõi." />
      </>
    );

  const pregnancy = mother.pregnancies[0];
  const age = pregnancy?.pregnancyStatus === "PREGNANT" ? gestationalAge(pregnancy.lastMenstrualPeriod) : undefined;
  return (
    <>
      <PageHeader title="Của mẹ" subtitle={`${mother.name} · Sức khỏe và hành trình làm mẹ`} />
      <section className="mb-6 rounded-3xl bg-gradient-to-br from-rose-500 to-fuchsia-600 p-5 text-white shadow-lg shadow-rose-500/15">
        <p className="text-xs font-medium uppercase tracking-[.16em] opacity-80">Không gian riêng của mẹ</p>
        <h2 className="mt-2 text-2xl font-semibold">Theo dõi cơ thể, lưu hồ sơ gọn một nơi</h2>
        <p className="mt-2 text-sm leading-6 opacity-85">Dữ liệu của mẹ được tách hoàn toàn khỏi nhật ký của bé.</p>
      </section>
      <div className="space-y-3">
        <FeatureLink href="/mother/cycle" icon={CalendarDays} title="Chu kỳ kinh" description="Ngày bắt đầu, kết thúc, lượng kinh và triệu chứng." meta={`${mother._count.menstrualCycles} chu kỳ đã ghi`} tone="rose" />
        <FeatureLink href="/mother/pregnancy" icon={HeartPulse} title="Theo dõi thai kỳ" description="Tuổi thai, ngày dự sinh và lịch sử khám thai." meta={age ? `Hiện tại khoảng ${age.weeks} tuần ${age.days} ngày` : `${pregnancy?._count.checkups ?? 0} lần khám đã ghi`} tone="violet" />
        <FeatureLink href="/mother/medical" icon={FileHeart} title="Sổ khám bệnh của mẹ" description="Lý do khám, chẩn đoán, điều trị và lịch tái khám." meta={`${mother._count.medicalVisits} lượt khám`} tone="amber" />
        <FeatureLink href="/mother/insurance" icon={ShieldCheck} title="Bảo hiểm của mẹ" description="BHYT, bảo hiểm tư nhân, thời hạn và nơi đăng ký." meta={`${mother._count.insurancePolicies} thẻ / hợp đồng`} tone="emerald" />
        <FeatureLink href="/mother/vaccination" icon={Syringe} title="Mũi tiêm của mẹ" description="Uốn ván và các mũi tiêm trong thai kỳ." meta={`${mother._count.vaccinationRecords} mũi đã ghi`} tone="blue" />
        <FeatureLink href="/vaccination-schedule" icon={Bell} title="Lịch tiêm nhắc" description="Mũi nào đến hạn hoặc trễ hạn, đối chiếu lịch chuẩn." tone="rose" />
      </div>
    </>
  );
}

