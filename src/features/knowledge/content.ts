export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "steps"; items: string[] };

export type ArticleSection = {
  heading: string;
  blocks: ArticleBlock[];
};

const CALLOUT_PREFIXES = [
  "Lưu ý:",
  "Quan trọng:",
  "Nguy hiểm:",
  "Không tự",
  "KHÔNG tự",
  "Đi khám",
  "Cần khám",
  "Gọi cấp cứu",
  "Đừng ở",
  "Thay thế an toàn:",
  "Cho ăn đáp ứng:",
  "Sau tiêm:",
];

export function isCalloutText(text: string) {
  return (
    CALLOUT_PREFIXES.some((prefix) => text.startsWith(prefix)) ||
    /gọi (?:ngay )?(?:cấp cứu )?115|cấp cứu ngay|đi cấp cứu|đi khám ngay/i.test(text)
  );
}

export function parseArticleContent(content: string): ArticleSection[] {
  const lines = content.split("\n");
  const sections: ArticleSection[] = [];
  let current: ArticleSection = { heading: "", blocks: [] };

  const commit = () => {
    if (current.heading || current.blocks.length > 0) sections.push(current);
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line) continue;

    if (line.startsWith("## ")) {
      commit();
      current = { heading: line.slice(3), blocks: [] };
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      let cursor = index;
      while (cursor < lines.length && lines[cursor].trim().startsWith("- ")) {
        items.push(lines[cursor].trim().slice(2));
        cursor += 1;
      }
      current.blocks.push({ type: "bullets", items });
      index = cursor - 1;
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      let cursor = index;
      while (cursor < lines.length && /^\d+\.\s+/.test(lines[cursor].trim())) {
        items.push(lines[cursor].trim().replace(/^\d+\.\s+/, ""));
        cursor += 1;
      }
      current.blocks.push({ type: "steps", items });
      index = cursor - 1;
      continue;
    }

    current.blocks.push({ type: "paragraph", text: line });
  }

  commit();
  return sections;
}
