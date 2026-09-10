import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";

const calloutPrefixes = [
  "Lưu ý:",
  "Quan trọng:",
  "Nguy hiểm:",
  "Không tự",
  "Đi khám",
  "Đừng ở",
  "Thay thế an toàn:",
  "Cho ăn đáp ứng:",
  "Sau tiêm:",
];

export function ArticleContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line) continue;

    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={index} className="mb-2 mt-6 text-lg font-semibold first:mt-0">
          {line.slice(3)}
        </h2>,
      );
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      let cursor = index;
      while (cursor < lines.length && lines[cursor].trim().startsWith("- ")) {
        items.push(lines[cursor].trim().slice(2));
        cursor += 1;
      }
      blocks.push(
        <ul key={index} className="mb-4 space-y-2 pl-5 text-muted-foreground">
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`} className="list-disc pl-1 marker:text-primary">
              {item}
            </li>
          ))}
        </ul>,
      );
      index = cursor - 1;
      continue;
    }

    const isCallout = calloutPrefixes.some((prefix) => line.startsWith(prefix));
    blocks.push(
      isCallout ? (
        <div
          key={index}
          className="my-4 flex gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100"
        >
          <CircleAlert className="mt-1 size-4 shrink-0" />
          <p>{line}</p>
        </div>
      ) : (
        <p key={index} className="mb-4 leading-7 text-muted-foreground">
          {line}
        </p>
      ),
    );
  }

  return <>{blocks}</>;
}
