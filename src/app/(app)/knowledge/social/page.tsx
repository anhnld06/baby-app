import { PageHeader } from "@/components/page-header";
import { SocialDiscussionFeed } from "@/components/social-discussion-feed";
import { stageForAge } from "@/features/knowledge/stage";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { ageInDays } from "@/lib/date";

export default async function SocialDiscussionsPage() {
  const user = await requireUser();
  const baby = await getSelectedBaby(user.id);
  const currentStage = baby
    ? stageForAge(ageInDays(baby.dateOfBirth))
    : undefined;

  return (
    <>
      <PageHeader
        title="Cha mẹ đang quan tâm"
        subtitle="Facebook · TikTok · Threads"
        backHref="/knowledge"
      />
      <SocialDiscussionFeed currentStage={currentStage} />
    </>
  );
}
