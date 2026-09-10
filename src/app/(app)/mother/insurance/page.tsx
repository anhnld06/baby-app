import { deleteMotherInsuranceAction, saveMotherInsuranceAction } from "@/app/actions";
import { InsuranceBook } from "@/components/insurance-book";
import { PageHeader } from "@/components/page-header";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/i18n";

export default async function MotherInsurancePage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const [user, locale, params] = await Promise.all([requireUser(), getLocale(), searchParams]);
  const mother = await db.mother.findUnique({ where: { userId: user.id } });
  if (!mother) return <><PageHeader title="Bảo hiểm của mẹ" backHref="/mother" /><p>Hãy tạo hồ sơ mẹ trước.</p></>;
  const [items, editing] = await Promise.all([db.motherInsurancePolicy.findMany({ where: { motherId: mother.id }, orderBy: { validUntil: "desc" }, take: 20 }), params.edit ? db.motherInsurancePolicy.findFirst({ where: { id: params.edit, motherId: mother.id } }) : null]);
  return <InsuranceBook title="Bảo hiểm của mẹ" subtitle={mother.name} backHref="/mother" basePath="/mother/insurance" ownerField="motherId" ownerId={mother.id} items={items} editing={editing} saveAction={saveMotherInsuranceAction} deleteAction={deleteMotherInsuranceAction} locale={locale} />;
}

