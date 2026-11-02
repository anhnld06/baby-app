import { BabySwitcher } from "@/components/baby-switcher";
import { LullabyLibrary } from "@/components/lullaby-library";
import { PageHeader } from "@/components/page-header";
import { requireUser } from "@/lib/auth";
import { getSelectedBabyId, listBabies, pickSelectedBaby } from "@/lib/data";
import { lullabyAgeForBaby } from "@/features/lullabies/catalog";

export default async function LullabiesPage() {
  const user = await requireUser();
  const [babies, selectedId] = await Promise.all([
    listBabies(user.id),
    getSelectedBabyId(),
  ]);
  const baby = pickSelectedBaby(babies, selectedId);
  const recommendedAge = baby
    ? lullabyAgeForBaby(baby.dateOfBirth, new Date(), user.timezone)
    : "0-6";
  return (
    <>
      <PageHeader
        title="Nhạc hát ru"
        subtitle="Cùng con nghe một giai điệu quen thuộc"
        backHref="/baby"
      />
      <BabySwitcher
        babies={babies}
        selectedBabyId={baby?.id}
        addLabel="Thêm bé"
      />
      <LullabyLibrary
        key={baby?.id ?? "family"}
        recommendedAge={recommendedAge}
        babyName={baby?.nickname || baby?.name}
      />
    </>
  );
}
