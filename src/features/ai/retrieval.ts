import { db } from "@/lib/db";
import { stageForAge } from "@/features/knowledge/stage";

export async function retrieveKnowledge(question: string, ageDays?: number) {
  const terms = question.toLowerCase().split(/\s+/).filter((term) => term.length >= 3).slice(0, 6);
  const stage = stageForAge(ageDays);
  const articles = await db.knowledgeArticle.findMany({
    where: {
      ...(terms.length ? { OR: terms.flatMap((term) => [{ title: { contains: term, mode: "insensitive" as const } }, { summary: { contains: term, mode: "insensitive" as const } }, { content: { contains: term, mode: "insensitive" as const } }]) } : {}),
      NOT: { summary: { startsWith: "DEMO CONTENT" } },
    },
    include: { sources: true, chunks: { take: 3 } },
    take: 40,
  });
  const ranked = articles
    .sort((left, right) => Number(right.stage === stage) - Number(left.stage === stage))
    .slice(0, 5);
  return {
    excerpts: ranked.flatMap((article) => article.chunks.map((chunk) => chunk.content)),
    sources: ranked.flatMap((article) => article.sources.map((source) => ({ title: source.title, organization: source.organization, url: source.url, evidenceLevel: article.evidenceLevel }))),
  };
}
