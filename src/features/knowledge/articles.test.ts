import { describe, expect, it } from "vitest";
import { curatedArticles } from "@/features/knowledge/articles";

describe("curated mother and baby handbook", () => {
  it("covers every journey stage", () => {
    const stages = new Set(curatedArticles.map((article) => article.stage));
    expect(stages).toEqual(
      new Set([
        "PRECONCEPTION",
        "PREGNANCY",
        "POSTPARTUM",
        "NEWBORN_0_28_DAYS",
        "INFANT_1_3_MONTHS",
        "INFANT_3_6_MONTHS",
        "INFANT_6_12_MONTHS",
        "TODDLER",
      ]),
    );
  });

  it("has unique slugs and at least one source per article", () => {
    const slugs = curatedArticles.map((article) => article.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(curatedArticles.every((article) => article.sources.length > 0)).toBe(true);
  });

  it("labels folk practices and harmful advice explicitly", () => {
    expect(
      curatedArticles.some(
        (article) => article.knowledgeType === "TRADITIONAL_PRACTICE",
      ),
    ).toBe(true);
    expect(
      curatedArticles.some(
        (article) => article.knowledgeType === "POTENTIALLY_HARMFUL",
      ),
    ).toBe(true);
  });
});
