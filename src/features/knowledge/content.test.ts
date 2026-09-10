import { describe, expect, it } from "vitest";

import { isCalloutText, parseArticleContent } from "@/features/knowledge/content";

describe("article content", () => {
  it("parses headings, paragraphs, bullets and numbered steps", () => {
    const sections = parseArticleContent(`## Chuẩn bị
Đoạn mở đầu.
- Việc một
- Việc hai

## Thực hiện
1. Bước một
2. Bước hai`);

    expect(sections).toEqual([
      {
        heading: "Chuẩn bị",
        blocks: [
          { type: "paragraph", text: "Đoạn mở đầu." },
          { type: "bullets", items: ["Việc một", "Việc hai"] },
        ],
      },
      {
        heading: "Thực hiện",
        blocks: [{ type: "steps", items: ["Bước một", "Bước hai"] }],
      },
    ]);
  });

  it("recognizes safety text that must remain visible", () => {
    expect(isCalloutText("Nguy hiểm: không làm việc này.")).toBe(true);
    expect(isCalloutText("Đi khám ngay nếu bé khó thở.")).toBe(true);
    expect(isCalloutText("Nhờ người khác gọi cấp cứu 115.")).toBe(true);
    expect(isCalloutText("Một đoạn giải thích thông thường.")).toBe(false);
  });
});
