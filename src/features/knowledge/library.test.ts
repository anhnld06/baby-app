import { describe, it, expect } from "vitest";
import {
  buildLibraryIndex,
  queryLibrary,
  parseLibraryQuery,
  normalizeLibraryText,
  type LibraryArticle,
} from "./library";
const rows: LibraryArticle[] = Array.from({ length: 53 }, (_, i) => ({
  id: String(i),
  title: i === 0 ? "Đủ sữa cho bé" : `Bài ${i}`,
  slug: `bai-${i}`,
  summary: i === 1 ? "Giấc ngủ qua đêm" : "Ghi chép",
  category: "Dinh dưỡng",
  stage: i % 2 === 0 ? "PREGNANCY" : "TODDLER",
  evidenceLevel: "STRONG",
  knowledgeType: "SCIENTIFIC_GUIDELINE",
  sourceCount: 2,
}));
const index = buildLibraryIndex(rows);
describe("knowledge library pagination", () => {
  it("only returns a bounded page and keeps all matches accessible", () => {
    const first = queryLibrary(index, parseLibraryQuery({ stage: "ALL" }));
    const second = queryLibrary(
      index,
      parseLibraryQuery({ stage: "ALL", page: "2" }),
    );
    const third = queryLibrary(
      index,
      parseLibraryQuery({ stage: "ALL", page: "3" }),
    );
    expect(first.items).toHaveLength(24);
    expect(first.total).toBe(53);
    expect(first.totalPages).toBe(3);
    expect(
      new Set(
        [...first.items, ...second.items, ...third.items].map((i) => i.id),
      ).size,
    ).toBe(53);
  });
  it("supports unaccented Vietnamese, upper-case Đ, summaries and stage labels", () => {
    expect(normalizeLibraryText("ĐỦ SỮA")).toBe("du sua");
    expect(
      queryLibrary(index, parseLibraryQuery({ q: "DU SUA" })).items.map(
        (i) => i.id,
      ),
    ).toEqual(["0"]);
    expect(
      queryLibrary(index, parseLibraryQuery({ q: "giac ngu" })).items.map(
        (i) => i.id,
      ),
    ).toEqual(["1"]);
    expect(
      queryLibrary(index, parseLibraryQuery({ q: "mang thai" })).total,
    ).toBe(27);
  });
  it("combines stage and search and handles empty or out-of-range pages", () => {
    expect(
      queryLibrary(index, parseLibraryQuery({ q: "du sua", stage: "TODDLER" }))
        .total,
    ).toBe(0);
    expect(
      queryLibrary(index, parseLibraryQuery({ stage: "ALL", page: "999" }))
        .page,
    ).toBe(3);
    expect(queryLibrary([], parseLibraryQuery({}))).toMatchObject({
      page: 1,
      total: 0,
      totalPages: 1,
      items: [],
    });
  });
  it("validates URL input and caps the query length", () => {
    expect(
      parseLibraryQuery({ stage: "__proto__", page: "1.5", q: " x " }),
    ).toEqual({ stage: null, page: 1, q: "x" });
    expect(parseLibraryQuery({ page: "-2" }).page).toBe(1);
    expect(parseLibraryQuery({ q: "a".repeat(999) }).q.length).toBe(120);
  });
});
