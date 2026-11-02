import type { KnowledgeStage } from "@prisma/client";
import { stageLabels } from "./labels";
export type LibraryArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  stage: string;
  evidenceLevel: string;
  knowledgeType: string;
  sourceCount: number;
};
export type LibraryQuery = { q: string; stage: string | null; page: number };
export type LibraryPage = LibraryQuery & {
  items: LibraryArticle[];
  total: number;
  totalPages: number;
};
export const LIBRARY_PAGE_SIZE = 24;
export function normalizeLibraryText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/gi, "d")
    .toLowerCase();
}
export function parseLibraryQuery(params: {
  q?: string | null;
  stage?: string | null;
  page?: string | null;
}): LibraryQuery {
  const stage =
    params.stage === "ALL" || Object.hasOwn(stageLabels, params.stage ?? "")
      ? params.stage!
      : null;
  const page = Number(params.page ?? "1");
  return {
    q: (params.q ?? "").slice(0, 120).trim(),
    stage,
    page: Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10000) : 1,
  };
}
export function libraryQueryKey(query: LibraryQuery) {
  return JSON.stringify([query.q, query.stage, query.page]);
}
export function buildLibraryIndex(articles: LibraryArticle[]) {
  return articles.map((article) => ({
    article,
    text: normalizeLibraryText(
      `${article.title} ${article.summary} ${article.category} ${stageLabels[article.stage as KnowledgeStage] ?? ""}`,
    ),
  }));
}
export function queryLibrary(
  index: ReturnType<typeof buildLibraryIndex>,
  query: LibraryQuery,
): LibraryPage {
  const needle = normalizeLibraryText(query.q);
  const filtered = index.filter(
    (row) =>
      (!query.stage ||
        query.stage === "ALL" ||
        row.article.stage === query.stage) &&
      (!needle || row.text.includes(needle)),
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / LIBRARY_PAGE_SIZE),
  );
  const page = Math.min(query.page, totalPages);
  return {
    ...query,
    page,
    total: filtered.length,
    totalPages,
    items: filtered
      .slice((page - 1) * LIBRARY_PAGE_SIZE, page * LIBRARY_PAGE_SIZE)
      .map((row) => row.article),
  };
}
