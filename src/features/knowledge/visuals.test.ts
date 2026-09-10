import { describe, expect, it } from "vitest";

import { curatedArticles } from "@/features/knowledge/articles";
import {
  getArticleSectionGuide,
  getKnowledgeVisual,
  getSectionVisual,
} from "@/features/knowledge/visuals";

describe("knowledge visuals", () => {
  it("maps every journey stage to an image", () => {
    const stages = [
      "PRECONCEPTION",
      "PREGNANCY",
      "POSTPARTUM",
      "NEWBORN_0_28_DAYS",
      "INFANT_1_3_MONTHS",
      "INFANT_3_6_MONTHS",
      "INFANT_6_12_MONTHS",
      "TODDLER",
    ];

    expect(stages.map(getKnowledgeVisual)).not.toContain("/images/knowledge/family.webp");
  });

  it("maps every curated article category to a section image", () => {
    const visuals = curatedArticles.map((article) => getSectionVisual(article.category));

    expect(visuals).toHaveLength(curatedArticles.length);
    expect(visuals.every((visual) => visual.src.endsWith(".webp"))).toBe(true);
  });

  it("puts detailed guides in their matching content sections", () => {
    expect(getArticleSectionGuide("ngu-an-toan-cho-be", "Mỗi lần bé ngủ")?.src).toBe(
      "/images/knowledge/safe-sleep.webp",
    );
    expect(
      getArticleSectionGuide(
        "so-cuu-hoc-nghen-cho-tre-duoi-va-tren-1-tuoi",
        "Trẻ DƯỚI 1 tuổi",
      )?.src,
    ).toBe("/images/knowledge/choking-infant.webp");
    expect(getArticleSectionGuide("an-article-without-a-guide", "Bất kỳ")).toBeNull();
  });
});
