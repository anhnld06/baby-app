import { db } from "@/lib/db";
import { stageForAge } from "@/features/knowledge/stage";
import { questionTerms, rankKnowledge } from "./rank";
import type { KnowledgeStage } from "@prisma/client";

export async function retrieveKnowledge(question: string, ageDays?: number, motherStage?: KnowledgeStage) {
  const terms = questionTerms(question);
  if (!terms.length) return { excerpts: [], sources: [] };
  const stage = motherStage ?? stageForAge(ageDays);
  const candidates = await db.knowledgeArticle.findMany({
    where: {
      NOT: { summary: { startsWith: "DEMO CONTENT" } },
      sources: { some: {} },
    },
    select: { id: true, title: true, summary: true, content: true, stage: true },
    orderBy: { id: "asc" },
    take: 500,
  });
  const ranked = rankKnowledge(candidates, terms, stage);
  if (!ranked.length) return { excerpts: [], sources: [] };
  const articles = await db.knowledgeArticle.findMany({
    where: { id: { in: ranked.map((article) => article.id) } },
    include: { sources: true, chunks: { take: 3 } },
  });
  const usable = ranked.flatMap((candidate) => articles.filter((article) => article.id === candidate.id && article.chunks.length > 0));
  const sources = usable.flatMap((article) => article.sources.map((source) => ({ title: source.title, organization: source.organization, url: source.url, evidenceLevel: article.evidenceLevel })));
  return {
    excerpts: usable.flatMap((article) => article.chunks.map((chunk) => chunk.content)),
    sources: sources.filter((source, index) => sources.findIndex((other) => other.url === source.url) === index),
  };
}
