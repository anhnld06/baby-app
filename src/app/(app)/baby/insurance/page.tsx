import { deleteBabyInsuranceAction, saveBabyInsuranceAction } from "@/app/actions";
import { InsuranceBook } from "@/components/insurance-book";
import { PageHeader } from "@/components/page-header";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/i18n";

export default async function BabyInsurancePage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const [user, locale, params] = await Promise.all([requireUser(), getLocale(), searchParams]);
  const baby = await getSelectedBaby(user.id);
  if (!baby) return <><PageHeader title="Bảo hiểm của bé" backHref="/baby" /><p>Chưa có hồ sơ bé.</p></>;
  const [items, editing] = await Promise.all([db.babyInsurancePolicy.findMany({ where: { babyId: baby.id }, orderBy: { validUntil: "desc" }, take: 20 }), params.edit ? db.babyInsurancePolicy.findFirst({ where: { id: params.edit, babyId: baby.id } }) : null]);
  return <InsuranceBook title="Bảo hiểm của bé" subtitle={baby.name} backHref="/baby" basePath="/baby/insurance" ownerField="babyId" ownerId={baby.id} items={items} editing={editing} saveAction={saveBabyInsuranceAction} deleteAction={deleteBabyInsuranceAction} locale={locale} />;
}
