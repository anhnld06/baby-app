import Link from "next/link";
import { BookOpenText, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";

export default async function StoriesPage() {
  const t = await getDictionary();
  const stories = await db.story.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <>
      <PageHeader title={t.stories.title} subtitle={t.stories.subtitle} />
      <div className="space-y-3">
        {stories.map((story) => (
          <Link href={`/stories/${story.slug}`} key={story.id}>
            <Card className="mb-3 border-0 shadow-sm transition-transform active:scale-[.99]">
              <CardContent className="flex gap-3 p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                  <BookOpenText className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{story.category}</Badge>
                    {story.durationMinutes && (
                      <span className="text-xs text-muted-foreground">
                        {story.durationMinutes} {t.stories.durationSuffix}
                      </span>
                    )}
                  </span>
                  <strong className="mt-2 block">{story.title}</strong>
                  <span className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                    {story.summary}
                  </span>
                </span>
                <ChevronRight className="mt-2 size-4 shrink-0 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
        {stories.length === 0 && (
          <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            {t.common.noData}
          </p>
        )}
      </div>
    </>
  );
}
