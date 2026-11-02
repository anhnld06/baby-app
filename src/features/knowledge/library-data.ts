import "server-only";
import { db } from "@/lib/db";
import { buildLibraryIndex, queryLibrary, type LibraryQuery } from "./library";
// Only the shared editorial catalog is cached here. Never cache profiles, sessions,
// the personalized stage or response HTML. Refresh at most once per minute per worker.
let catalog:
  | { expiresAt: number; index: ReturnType<typeof buildLibraryIndex> }
  | undefined;
let pending: Promise<ReturnType<typeof buildLibraryIndex>> | undefined;
export async function getLibraryIndex() {
  if (catalog && Date.now() < catalog.expiresAt) return catalog.index;
  if (!pending)
    pending = db.knowledgeArticle
      .findMany({
        where: { NOT: { slug: { startsWith: "demo-" } } },
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          category: true,
          stage: true,
          evidenceLevel: true,
          knowledgeType: true,
          _count: { select: { sources: true } },
        },
        orderBy: [{ stage: "asc" }, { title: "asc" }, { id: "asc" }],
      })
      .then((rows) => {
        const index = buildLibraryIndex(
          rows.map(({ _count, ...article }) => ({
            ...article,
            sourceCount: _count.sources,
          })),
        );
        catalog = { index, expiresAt: Date.now() + 60000 };
        return index;
      })
      .finally(() => {
        pending = undefined;
      });
  return pending;
}
export async function getLibraryPage(query: LibraryQuery) {
  return queryLibrary(await getLibraryIndex(), query);
}
