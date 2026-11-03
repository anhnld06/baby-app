import Link from "next/link";
import { Award, Sparkles } from "lucide-react";
import { MilestoneBadge } from "@/components/milestone-badge";
import { db } from "@/lib/db";
import { milestoneCollection } from "@/features/journey/milestones";
export async function MilestoneCollection({
  babyId,
  birth,
  today,
  group,
}: {
  babyId: string;
  birth: Date;
  today: string;
  group?: string;
}) {
  const records = await db.babyCareEntry.findMany({
    where: { babyId, kind: "MILESTONE", milestoneKey: { not: null } },
    select: { id: true, milestoneKey: true, occurredAt: true },
  });
  const tagged = await db.babyMemory.groupBy({ by: ["milestoneKey"], where: { babyId, milestoneKey: { not: null } }, _count: { _all: true } });
  const letterCounts = new Map(tagged.map(row => [row.milestoneKey, row._count._all]));
  const rows = milestoneCollection(birth, today, records);
  const groups = ["Cột mốc", "Khoảnh khắc", "Thai kỳ"];
  const visible = rows.filter(
    (r) => !groups.includes(group ?? "") || r.group === group,
  );
  return (
    <section className="my-5" aria-label="Bộ sưu tập huy hiệu">
      <div className="rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-50 p-5 dark:from-amber-950 dark:to-card">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Award className="size-5" /> Bộ sưu tập của con{" "}
          <Sparkles className="ml-auto size-4 opacity-60" />
        </p>
        <p className="mt-3 text-3xl font-semibold">
          {rows.filter((r) => r.achieved).length}/{rows.length} huy hiệu
        </p>
        <div
          role="progressbar"
          aria-label="Tiến độ bộ sưu tập"
          aria-valuemin={0}
          aria-valuemax={rows.length}
          aria-valuenow={rows.filter((r) => r.achieved).length}
          className="mt-4 h-2 overflow-hidden rounded-full bg-white/60 dark:bg-white/10"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
            style={{
              width: `${(rows.filter((r) => r.achieved).length / rows.length) * 100}%`,
            }}
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          {groups.map((g) => (
            <p key={g}>
              {g}
              <strong className="mt-1 block text-lg">
                {rows.filter((r) => r.group === g && r.achieved).length}/
                {rows.filter((r) => r.group === g).length}
              </strong>
            </p>
          ))}
        </div>
      </div>
      <nav
        className="my-4 flex gap-2 overflow-x-auto"
        aria-label="Nhóm huy hiệu"
      >
        {["Tất cả", ...groups].map((g) => (
          <Link
            key={g}
            replace
            href={`/baby/milestones?group=${encodeURIComponent(g)}`}
            aria-current={(group ?? "Tất cả") === g ? "page" : undefined}
            className={`shrink-0 rounded-full px-4 py-3 text-xs ${(group ?? "Tất cả") === g ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
          >
            {g}
          </Link>
        ))}
      </nav>
      <div className="grid grid-cols-3 gap-x-2 gap-y-3 rounded-3xl border bg-card p-2 sm:gap-4 sm:p-4">
        {visible.map((item) => (
          <div key={item.key} id={`milestone-${item.key}`} className="min-w-0 scroll-mt-8">
          <Link
            href={
              item.record
                ? `/baby/milestones?edit=${item.record.id}#care-form`
                : `/baby/milestones?new=1&milestone=${item.key}#care-form`
            }
            className="milestone-tile group relative flex min-w-0 flex-col items-center rounded-2xl px-1 py-3 text-center transition-colors hover:bg-secondary/50 focus-visible:bg-secondary/50"
          >
            <MilestoneBadge item={item} achieved={item.achieved} />
            <span
              className={`mt-1 rounded-full px-2 py-1 text-[9px] font-semibold ${item.achieved ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}
            >
              {item.achieved ? "Đã lưu dấu mốc" : "Chưa ghi nhận"}
            </span>
            <span className="mt-2 text-xs font-semibold leading-5">
              {item.title}
            </span>
            <span className="mt-1 text-[10px] leading-4 text-muted-foreground">
              {item.date
                ? item.date
                    .toISOString()
                    .slice(0, 10)
                    .split("-")
                    .reverse()
                    .join("/")
                : item.referenceMonth
                  ? `Tham khảo CDC: ${item.referenceMonth} tháng`
                  : "Chạm để lưu kỷ niệm"}
            </span>
            {item.referenceMonth && (
              <span className="mt-1 text-[10px] text-primary">
                {item.achieved
                  ? "Đã ghi nhận"
                  : "Ghi khi gia đình quan sát thấy"}
              </span>
            )}
          </Link>
          <div className="flex flex-col items-center pb-3 text-center text-[10px]">
            <Link href={`/baby/mailbox?milestone=${item.key}`} className="flex min-h-11 items-center text-primary">💌 {letterCounts.get(item.key) ?? 0} thư kỷ niệm</Link>
            <Link href={`/baby/mailbox?milestone=${item.key}&new=1`} className="flex min-h-11 items-center text-muted-foreground underline">Viết thư cho mốc này</Link>
          </div>
          </div>
        ))}
      </div>
      <details className="mt-3">
        <summary className="min-h-11 cursor-pointer text-xs text-primary">
          Nguồn & cách đọc mốc phát triển
        </summary>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Chào đời và tròn tháng tính theo ngày sinh. Kỹ năng, khoảnh khắc và
          thai kỳ do gia đình xác nhận; chưa ghi không có nghĩa là chưa đạt. Các
          tuổi tham khảo CDC không thay thế sàng lọc phát triển.
        </p>
        <p className="text-xs leading-5 text-muted-foreground">
          CDC mô tả các kỹ năng đa số trẻ có thể làm ở mốc tuổi, không phải ngày
          phải đạt. Nếu bé mất kỹ năng đã có hoặc gia đình lo lắng, hãy trao đổi
          với người chăm sóc sức khỏe.
        </p>
        {[2, 4, 6, 9, 15].map((month) => (
          <a
            key={month}
            href={`https://www.cdc.gov/act-early/milestones/${month}-months.html`}
            target="_blank"
            rel="noreferrer"
            className="mr-3 inline-flex min-h-11 items-center text-xs text-primary"
          >
            CDC {month} tháng ↗
          </a>
        ))}
      </details>
    </section>
  );
}
