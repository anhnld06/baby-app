import type { KnowledgeStage } from "@prisma/client";

const stopWords = new Set("toi minh con be me em anh chi cho cua va la co khong can nen lam sao nao nhu the khi bi hay rat qua duoc phai voi mot nhung gi xin hoi ve tre nho what how should baby my the is a an to of and in do does can please".split(" "));

export function normalizeSearch(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/đ/g, "d");
}

export function questionTerms(question: string) {
  return [...new Set(normalizeSearch(question).match(/[a-z]+/g) ?? [])]
    .filter((word) => word.length >= 2 && !stopWords.has(word))
    .slice(0, 30);
}

type Candidate = {
  id: string;
  title: string;
  summary: string;
  content: string;
  stage: KnowledgeStage;
};

export function rankKnowledge<T extends Candidate>(articles: T[], terms: string[], stage?: KnowledgeStage) {
  if (!terms.length) return [];
  return articles.map((article) => {
    const title = new Set(normalizeSearch(article.title).match(/[a-z]+/g));
    const summary = new Set(normalizeSearch(article.summary).match(/[a-z]+/g));
    const content = new Set(normalizeSearch(article.content).match(/[a-z]+/g));
    const hits = terms.filter((word) => title.has(word) || summary.has(word) || content.has(word)).length;
    const score = terms.reduce((total, word) => total + (title.has(word) ? 6 : summary.has(word) ? 3 : content.has(word) ? 1 : 0), 0);
    return { article, hits, score: score + (article.stage === stage ? 2 : 0) };
  })
    // A stage match alone must never make an unrelated article look relevant.
    .filter(({ hits }) => hits >= Math.ceil(terms.length * 0.6))
    .sort((left, right) => right.score - left.score || left.article.id.localeCompare(right.article.id))
    .slice(0, 5)
    .map(({ article }) => article);
}
