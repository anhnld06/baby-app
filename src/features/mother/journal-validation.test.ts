import { describe, expect, it } from "vitest";
import { pregnancyJournalSchema } from "./journal-validation";

const valid = { pregnancyId: "pregnancy", kind: "HEALTH", occurredOn: "2026-11-03", title: "Hôm nay", content: "Ngủ ngon" };
describe("pregnancy journal validation", () => {
  it("rejects normalized invalid dates and unrecognized journal kinds", () => {
    expect(pregnancyJournalSchema.safeParse({ ...valid, occurredOn: "2026-02-30" }).success).toBe(false);
    expect(pregnancyJournalSchema.safeParse({ ...valid, kind: "OTHER" }).success).toBe(false);
  });
  it("requires meaningful content and bounds its size", () => {
    expect(pregnancyJournalSchema.safeParse({ ...valid, content: "  " }).success).toBe(false);
    expect(pregnancyJournalSchema.safeParse({ ...valid, content: "a".repeat(10001) }).success).toBe(false);
    expect(pregnancyJournalSchema.parse({ ...valid, kind: "MEMORY", title: "  Gửi con  " }).title).toBe("Gửi con");
  });
});
