import { deleteMotherMedicalVisitAction, saveMotherMedicalVisitAction } from "@/app/actions";
import { FeatureLink } from "@/components/feature-link";
import { MedicalBook } from "@/components/medical-book";
import { UserRound } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/i18n";

export default async function MotherMedicalPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const [user, locale, params] = await Promise.all([requireUser(), getLocale(), searchParams]);
  const mother = await db.mother.findUnique({ where: { userId: user.id } });
  if (!mother) return <FeatureLink href="/profile/mother" icon={UserRound} title="Tạo hồ sơ mẹ" description="Cần hồ sơ mẹ trước khi lưu sổ khám." />;
  const [items, editing] = await Promise.all([db.motherMedicalVisit.findMany({ where: { motherId: mother.id }, orderBy: { visitedAt: "desc" }, take: 50 }), params.edit ? db.motherMedicalVisit.findFirst({ where: { id: params.edit, motherId: mother.id } }) : null]);
  return <MedicalBook title="Sổ khám bệnh của mẹ" subtitle={mother.name} backHref="/mother" basePath="/mother/medical" ownerField="motherId" ownerId={mother.id} items={items} editing={editing} saveAction={saveMotherMedicalVisitAction} deleteAction={deleteMotherMedicalVisitAction} locale={locale} timeZone={user.timezone} />;
}
