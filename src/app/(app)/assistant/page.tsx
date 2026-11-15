import { AssistantForm } from "@/components/assistant-form";
import { PageHeader } from "@/components/page-header";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";

export default async function AssistantPage() {
  const [user, t] = await Promise.all([
    requireUser(),
    getDictionary(),
  ]);
  const baby = await getSelectedBaby(user.id);
  return (
    <>
      <PageHeader backHref="/knowledge" title={t.assistant.title} subtitle={t.assistant.context} />
      <AssistantForm babyId={baby?.id} labels={t.assistant} />
    </>
  );
}
