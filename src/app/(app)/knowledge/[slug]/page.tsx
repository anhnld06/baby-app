import { ExternalLink, ShieldAlert, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/article-content";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  evidenceLabels,
  knowledgeTypeLabels,
  stageLabels,
} from "@/features/knowledge/labels";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, t] = await Promise.all([params, getDictionary()]);
  const article = await db.knowledgeArticle.findUnique({
    where: { slug },
    include: { sources: true },
  });
  if (!article) notFound();
  const warning = article.knowledgeType === "POTENTIALLY_HARMFUL";
  const folk = article.knowledgeType === "TRADITIONAL_PRACTICE";
  return (
    <>
      <PageHeader
        title={article.title}
        subtitle={article.category}
        backHref="/knowledge"
      />
      <div className="mb-5 flex flex-wrap gap-2">
        <Badge variant={warning ? "destructive" : "default"}>
          {knowledgeTypeLabels[article.knowledgeType]}
        </Badge>
        <Badge variant="secondary">
          {evidenceLabels[article.evidenceLevel]}
        </Badge>
        <Badge variant="outline">{stageLabels[article.stage]}</Badge>
      </div>
      {(warning || folk) && (
        <div className="mb-5 flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
          <ShieldAlert className="size-5 shrink-0" />
          <div>
            <strong className="block">
              {warning ? "Mẹo có thể gây hại" : "Mẹo dân gian đã được đối chiếu"}
            </strong>
            <span>
              {warning
                ? "Không áp dụng các cách này cho mẹ hoặc bé. Xem lựa chọn thay thế an toàn trong bài."
                : "Giữ lại điều an toàn để hỗ trợ, nhưng không thay thế khám và điều trị khi có dấu hiệu bệnh."}
            </span>
          </div>
        </div>
      )}
      <article className="rounded-3xl bg-card p-5 text-[15px] leading-7 shadow-sm">
        <p className="text-base font-medium leading-7">{article.summary}</p>
        <hr className="my-5 border-border/70" />
        <ArticleContent content={article.content} />
      </article>
      <div className="mt-4 flex gap-2 rounded-2xl bg-secondary/60 p-3 text-xs leading-5 text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        Nội dung giáo dục sức khỏe, không dùng để tự chẩn đoán hoặc thay đổi
        thuốc và chỉ định chuyên môn.
      </div>
      <h2 className="mb-3 mt-7 text-lg font-semibold">{t.knowledge.sources}</h2>
      <div className="space-y-2">
        {article.sources.map((source) => (
          <Card key={source.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3"
              >
                <span className="flex-1">
                  <strong className="block text-sm">{source.title}</strong>
                  <span className="text-xs text-muted-foreground">
                    {source.organization} · {source.evidenceTier}
                  </span>
                </span>
                <ExternalLink className="size-4" />
              </a>
            </CardContent>
          </Card>
        ))}
        {article.sources.length === 0 && (
          <p className="text-sm text-muted-foreground">{t.common.noData}</p>
        )}
      </div>
    </>
  );
}
