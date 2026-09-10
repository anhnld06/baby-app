import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, t] = await Promise.all([params, getDictionary()]);
  const story = await db.story.findUnique({ where: { slug } });
  if (!story) notFound();
  return (
    <>
      <PageHeader
        title={story.title}
        subtitle={story.category}
        backHref="/stories"
      />
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{story.category}</Badge>
        {story.durationMinutes && (
          <span className="text-xs text-muted-foreground">
            {story.durationMinutes} {t.stories.durationSuffix}
          </span>
        )}
      </div>
      <article className="rounded-3xl bg-card p-5 text-[15px] leading-7 shadow-sm">
        <p className="font-medium">{story.summary}</p>
        <hr className="my-5" />
        <p className="whitespace-pre-wrap text-muted-foreground">
          {story.content}
        </p>
      </article>
    </>
  );
}
