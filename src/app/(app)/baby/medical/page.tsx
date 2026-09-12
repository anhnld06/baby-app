import { deleteBabyMedicalVisitAction, saveBabyMedicalVisitAction } from "@/app/actions";
import { MedicalBook } from "@/components/medical-book";
import { PageHeader } from "@/components/page-header";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/i18n";

export default async function BabyMedicalPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const [user, locale, params] = await Promise.all([requireUser(), getLocale(), searchParams]);
  const baby = await getSelectedBaby(user.id);
  if (!baby) return <><PageHeader title="Sổ khám bệnh của bé" backHref="/baby" /><p>Chưa có hồ sơ bé.</p></>;
  const [items, editing] = await Promise.all([db.babyMedicalVisit.findMany({ where: { babyId: baby.id }, orderBy: { visitedAt: "desc" }, take: 50 }), params.edit ? db.babyMedicalVisit.findFirst({ where: { id: params.edit, babyId: baby.id } }) : null]);
  return <MedicalBook title="Sổ khám bệnh của bé" subtitle={baby.name} backHref="/baby" basePath="/baby/medical" ownerField="babyId" ownerId={baby.id} items={items} editing={editing} saveAction={saveBabyMedicalVisitAction} deleteAction={deleteBabyMedicalVisitAction} locale={locale} timeZone={user.timezone} />;
}
