import { describe, expect, it } from "vitest";
import { questionTerms, rankKnowledge } from "./rank";

const articles = [
  { id: "sleep", title: "Giấc ngủ ban đêm", summary: "Bé khó ngủ và cách ghi nhật ký", content: "Theo dõi giấc ngủ", stage: "INFANT_1_3_MONTHS" as const },
  { id: "feed", title: "Nuôi con bằng sữa mẹ", summary: "Cữ bú và sữa công thức", content: "Theo dõi lượng sữa", stage: "NEWBORN_0_28_DAYS" as const },
  { id: "pregnancy", title: "Lịch khám thai", summary: "Theo dõi thai kỳ", content: "Lịch khám", stage: "PREGNANCY" as const },
];

describe("Vietnamese knowledge retrieval", () => {
  it("matches Vietnamese questions with or without diacritics", () => {
    expect(questionTerms("Bé khó ngủ ban đêm phải làm sao?")).toEqual(questionTerms("be kho ngu ban dem phai lam sao?"));
    expect(rankKnowledge(articles, questionTerms("bé khó ngủ ban đêm"))[0].id).toBe("sleep");
  });
  it("does not retrieve arbitrary articles for generic or unrelated questions", () => {
    expect(rankKnowledge(articles, questionTerms("cho mình hỏi với"))).toEqual([]);
    expect(rankKnowledge(articles, questionTerms("bảo hiểm ô tô"), "PREGNANCY")).toEqual([]);
  });
  it("does not truncate the meaningful part after a conversational introduction", () => {
    const question = "Xin cho mình hỏi với, mình muốn hỏi về lịch khám thai";
    expect(rankKnowledge(articles, questionTerms(question))[0].id).toBe("pregnancy");
  });
  it("prefers topic relevance over the profile's stage", () => {
    expect(rankKnowledge(articles, questionTerms("giấc ngủ"), "PREGNANCY")[0].id).toBe("sleep");
  });
});
