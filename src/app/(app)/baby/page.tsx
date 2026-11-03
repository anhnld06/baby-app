import { Thermometer, Star, Utensils, Sun, ChartColumn, Heart, Baby, Music2, BedDouble, FileHeart, Pill, Ruler, Shell, ShieldCheck, Smile, Syringe } from "lucide-react";
import { BabySwitcher } from "@/components/baby-switcher";
import { FeatureLink } from "@/components/feature-link";
import { PageHeader } from "@/components/page-header";
import { requireUser } from "@/lib/auth";
import { getSelectedBabyId, listBabies, pickSelectedBaby } from "@/lib/data";
import { formatAge } from "@/lib/date";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/i18n";
import { profileCoverUrl } from "@/lib/profile-cover";

export default async function BabyHubPage() {
  const [user, locale] = await Promise.all([requireUser(), getLocale()]);
  const [babies, selectedId] = await Promise.all([listBabies(user.id), getSelectedBabyId()]);
  const baby = pickSelectedBaby(babies, selectedId);
  if (!baby) return <><PageHeader title="Của bé" /><FeatureLink href="/profile/baby/new" icon={Baby} title="Thêm hồ sơ bé" description="Tạo hồ sơ để bắt đầu nhật ký riêng cho bé." tone="blue" /></>;
  const counts = await db.baby.findUnique({
    where: { id: baby.id },
    select: {
      _count: { select: { medicalVisits: true, insurancePolicies: true } },
      coverImage: { select: { updatedAt: true } },
    },
  });
  const coverImageUrl = counts?.coverImage
    ? profileCoverUrl("baby", baby.id, counts.coverImage.updatedAt)
    : undefined;
  return (
    <>
      <PageHeader title="Của bé" subtitle={`${baby.name} · ${formatAge(baby.dateOfBirth, new Date(), locale)}`} />
      <BabySwitcher babies={babies} selectedBabyId={baby.id} addLabel="Thêm bé" />
      {coverImageUrl && (
        <section
          aria-label={`Ảnh nền hồ sơ của ${baby.name}`}
          className="mt-4 aspect-[16/7] rounded-3xl bg-muted bg-cover bg-center shadow-sm"
          style={{ backgroundImage: `url(${JSON.stringify(coverImageUrl)})` }}
        />
      )}
      <h2 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-[.14em] text-muted-foreground">Chăm sóc hằng ngày</h2>
      <div className="grid gap-3 min-[520px]:grid-cols-2">
        <FeatureLink href="/tracking/feeding" icon={Baby} title="Bú và ăn" description="Theo dõi cữ bú, loại sữa và lượng ăn." tone="amber" />
        <FeatureLink href="/tracking/sleep" icon={BedDouble} title="Giấc ngủ" description="Giấc ngày, giấc đêm và thời lượng." tone="violet" />
        <FeatureLink href="/tracking/diaper" icon={Shell} title="Bỉm / tã" description="Tã ướt, đi ngoài và ghi chú." tone="emerald" />
        <FeatureLink href="/tracking/growth" icon={Ruler} title="Tăng trưởng" description="Cân nặng, chiều cao và vòng đầu." tone="blue" />
      </div>
      <h2 className="mb-3 mt-7 text-sm font-semibold uppercase tracking-[.14em] text-muted-foreground">Nhịp sống & kỷ niệm</h2>
      <div className="grid gap-3 min-[520px]:grid-cols-2">
        <FeatureLink href="/statistics?owner=baby" icon={ChartColumn} title="Thống kê chăm bé" description="Bú, ngủ và tã trong 7 / 30 ngày." tone="emerald" />
        <FeatureLink href="/baby/development" icon={Sun} title="Tuần khủng hoảng" description="Theo dõi thực tế, giấc ngủ và tham khảo theo tuần." tone="violet" />
        <FeatureLink href="/baby/routine" icon={Sun} title="Nếp ngày EASY" description="Lịch theo tuổi, tùy chỉnh và điều chỉnh theo nhật ký." tone="amber" />
        <FeatureLink href="/baby/meals" icon={Utensils} title="Ăn dặm" description="Món ăn, nguyên liệu và quan sát sau bữa." tone="rose" />
        <FeatureLink href="/baby/mailbox" icon={Heart} title="Hộp thư cho bé" description="Gói ảnh, thước phim và thư tay thành tem kỷ niệm." tone="rose" />
        <FeatureLink href="/baby/milestones" icon={Star} title="Mốc phát triển" description="Lưu những lần đầu, ảnh và kỷ niệm." tone="violet" />
        <FeatureLink href="/baby/wellbeing" icon={Heart} title="Dấu hiệu & tâm trạng" description="Nhật ký quan sát của gia đình." tone="blue" />
      </div>
      <div className="mt-4"><FeatureLink href="/baby/lullabies" icon={Music2} title="Nhạc hát ru" description="Chọn bài theo độ tuổi, nghe cùng con và hẹn dừng nhạc." tone="violet" /></div>
      <h2 className="mb-3 mt-7 text-sm font-semibold uppercase tracking-[.14em] text-muted-foreground">Sức khỏe của bé</h2>
      <div className="space-y-3">
        <FeatureLink href="/baby/medical" icon={FileHeart} title="Sổ khám bệnh của bé" description="Tách riêng lịch sử khám và tái khám của bé." meta={`${counts?._count.medicalVisits ?? 0} lượt khám`} tone="rose" />
        <FeatureLink href="/baby/insurance" icon={ShieldCheck} title="Bảo hiểm của bé" description="BHYT và bảo hiểm riêng của bé." meta={`${counts?._count.insurancePolicies ?? 0} thẻ / hợp đồng`} tone="emerald" />
        <FeatureLink href="/vaccination-schedule" icon={Syringe} title="Tiêm chủng" description="Ngày hẹn, đánh dấu đã tiêm và xem lịch sử." tone="rose" />
        <FeatureLink href="/tracking/temperature" icon={Thermometer} title="Nhiệt độ" description="Ghi °C, vị trí đo và xem lịch sử." tone="rose" />
        <FeatureLink href="/tracking/medication" icon={Pill} title="Thuốc & bổ sung" description="Checklist hằng ngày, bổ sung theo tuổi và toa thuốc đã lưu." tone="violet" />
        <FeatureLink href="/tracking/teeth" icon={Smile} title="Mọc răng" description="Sơ đồ và thời điểm mọc từng răng." tone="blue" />
      </div>
    </>
  );
}
