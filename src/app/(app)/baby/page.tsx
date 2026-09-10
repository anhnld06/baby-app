import { Baby, BedDouble, Bell, FileHeart, Pill, Ruler, Shell, ShieldCheck, Smile, Syringe } from "lucide-react";
import { BabySwitcher } from "@/components/baby-switcher";
import { FeatureLink } from "@/components/feature-link";
import { PageHeader } from "@/components/page-header";
import { requireUser } from "@/lib/auth";
import { getSelectedBabyId, listBabies, pickSelectedBaby } from "@/lib/data";
import { formatAge } from "@/lib/date";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/i18n";

export default async function BabyHubPage() {
  const [user, locale] = await Promise.all([requireUser(), getLocale()]);
  const [babies, selectedId] = await Promise.all([listBabies(user.id), getSelectedBabyId()]);
  const baby = pickSelectedBaby(babies, selectedId);
  if (!baby) return <><PageHeader title="Của bé" /><FeatureLink href="/profile/baby/new" icon={Baby} title="Thêm hồ sơ bé" description="Tạo hồ sơ để bắt đầu nhật ký riêng cho bé." tone="blue" /></>;
  const counts = await db.baby.findUnique({
    where: { id: baby.id },
    select: { _count: { select: { medicalVisits: true, insurancePolicies: true } } },
  });
  return (
    <>
      <PageHeader title="Của bé" subtitle={`${baby.name} · ${formatAge(baby.dateOfBirth, new Date(), locale)}`} />
      <BabySwitcher babies={babies} selectedBabyId={baby.id} addLabel="Thêm bé" />
      <h2 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-[.14em] text-muted-foreground">Chăm sóc hằng ngày</h2>
      <div className="grid gap-3 min-[520px]:grid-cols-2">
        <FeatureLink href="/tracking/feeding" icon={Baby} title="Bú và ăn" description="Theo dõi cữ bú, loại sữa và lượng ăn." tone="amber" />
        <FeatureLink href="/tracking/sleep" icon={BedDouble} title="Giấc ngủ" description="Giấc ngày, giấc đêm và thời lượng." tone="violet" />
        <FeatureLink href="/tracking/diaper" icon={Shell} title="Bỉm / tã" description="Tã ướt, đi ngoài và ghi chú." tone="emerald" />
        <FeatureLink href="/tracking/growth" icon={Ruler} title="Tăng trưởng" description="Cân nặng, chiều cao và vòng đầu." tone="blue" />
      </div>
      <h2 className="mb-3 mt-7 text-sm font-semibold uppercase tracking-[.14em] text-muted-foreground">Sức khỏe của bé</h2>
      <div className="space-y-3">
        <FeatureLink href="/baby/medical" icon={FileHeart} title="Sổ khám bệnh của bé" description="Tách riêng lịch sử khám và tái khám của bé." meta={`${counts?._count.medicalVisits ?? 0} lượt khám`} tone="rose" />
        <FeatureLink href="/baby/insurance" icon={ShieldCheck} title="Bảo hiểm của bé" description="BHYT và bảo hiểm riêng của bé." meta={`${counts?._count.insurancePolicies ?? 0} thẻ / hợp đồng`} tone="emerald" />
        <FeatureLink href="/tracking/vaccination" icon={Syringe} title="Tiêm chủng" description="Mũi tiêm, liều và lịch hẹn tiếp theo." tone="rose" />
        <FeatureLink href="/vaccination-schedule" icon={Bell} title="Lịch tiêm nhắc" description="Mũi nào đến hạn hoặc trễ hạn, đối chiếu lịch chuẩn." tone="amber" />
        <FeatureLink href="/tracking/prescription" icon={Pill} title="Đơn thuốc" description="Thuốc, liều dùng và lời dặn." tone="violet" />
        <FeatureLink href="/tracking/teeth" icon={Smile} title="Mọc răng" description="Sơ đồ và thời điểm mọc từng răng." tone="blue" />
      </div>
    </>
  );
}
