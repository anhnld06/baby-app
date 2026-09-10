import { AssistantForm } from "@/components/assistant-form";
import { PageHeader } from "@/components/page-header";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { getDictionary, getLocale } from "@/lib/i18n";

export default async function AssistantPage() {
  const [user, t, locale] = await Promise.all([
    requireUser(),
    getDictionary(),
    getLocale(),
  ]);
  const baby = await getSelectedBaby(user.id);
  return (
    <>
      <PageHeader title={t.assistant.title} subtitle={t.assistant.context} />
      <AssistantForm babyId={baby?.id} labels={t.assistant} locale={locale} />
    </>
  );
}
