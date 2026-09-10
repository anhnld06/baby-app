import { describe, expect, it } from "vitest";
import { curatedArticles } from "./articles";
import {
  SOCIAL_DISCUSSIONS,
  prioritizeSocialDiscussions,
} from "./social-discussions";

describe("social discussions", () => {
  it("keeps ids unique and links every topic to all supported platforms", () => {
    const articleSlugs = new Set(curatedArticles.map((article) => article.slug));

    expect(new Set(SOCIAL_DISCUSSIONS.map((item) => item.id)).size).toBe(
      SOCIAL_DISCUSSIONS.length,
    );

    for (const item of SOCIAL_DISCUSSIONS) {
      expect(item.relatedArticle.slug).toMatch(/^[a-z0-9-]+$/);
      expect(articleSlugs.has(item.relatedArticle.slug)).toBe(true);
      expect(item.searches.map((source) => source.platform)).toEqual([
        "Facebook",
        "TikTok",
        "Threads",
      ]);
      expect(item.searches.every((source) => source.url.startsWith("https://"))).toBe(
        true,
      );
    }
  });

  it("places discussions for the current stage first", () => {
    const prioritized = prioritizeSocialDiscussions("POSTPARTUM");
    const firstUnmatchedIndex = prioritized.findIndex(
      (item) => !item.stages.includes("POSTPARTUM"),
    );

    expect(firstUnmatchedIndex).toBeGreaterThan(0);
    expect(
      prioritized
        .slice(firstUnmatchedIndex)
        .some((item) => item.stages.includes("POSTPARTUM")),
    ).toBe(false);
  });
});
