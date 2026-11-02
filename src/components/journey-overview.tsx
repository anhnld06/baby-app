import Link from "next/link";
import { MilestoneBadge } from "@/components/milestone-badge";
import { db } from "@/lib/db";
import {
  developmentContext,
  stageContent,
} from "@/features/journey/development";
import { milestoneCollection } from "@/features/journey/milestones";
import { toDateTimeLocal } from "@/lib/date";
export async function JourneyOverview({
  baby,
  timeZone,
}: {
  baby: { id: string; name: string; dateOfBirth: Date };
  timeZone: string;
}) {
  const now = new Date();
  const context = developmentContext(baby.dateOfBirth, now, timeZone);
  const stage = stageContent(context.ageDays);
  const [memories, active] = await Promise.all([
    db.babyCareEntry.findMany({
      where: {
        babyId: baby.id,
        kind: "MILESTONE",
        milestoneKey: { not: null },
      },
      select: { id: true, milestoneKey: true, occurredAt: true },
    }),
    db.babyCareEntry.findFirst({
      where: { babyId: baby.id, kind: "EPISODE", endedAt: null },
      select: { title: true },
      orderBy: { occurredAt: "desc" },
    }),
  ]);
  const collection = milestoneCollection(
    baby.dateOfBirth,
    toDateTimeLocal(now, timeZone).slice(0, 10),
    memories,
  );
  return (
    <section className="mt-6 space-y-3" aria-label="Hành trình của bé">
      <Link
        href="/baby/development"
        className="block rounded-3xl bg-secondary/50 p-5"
      >
        <p className="text-xs font-medium text-primary">
          Tháng này có gì · {baby.name}
        </p>
        <h2 className="mt-2 font-semibold">{stage.title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {stage.body}
        </p>
        <span className="mt-2 inline-flex min-h-11 items-center text-xs text-primary">
          Khám phá theo giai đoạn →
        </span>
      </Link>
      <Link
        href="/assistant"
        className="flex items-center gap-3 rounded-3xl border border-primary/20 bg-card p-5"
      >
        <span aria-hidden="true" className="text-3xl">
          ✨
        </span>
        <span>
          <strong className="block">Bé đang cần gì?</strong>
          <span className="mt-1 block text-xs leading-5 text-muted-foreground">
            Tra cứu cẩm nang về quấy khóc, giấc ngủ và bú ăn cùng trợ lý.
          </span>
        </span>
      </Link>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/baby/milestones"
          className="rounded-3xl border bg-card p-5"
        >
          <MilestoneBadge
            item={collection[0]}
            achieved={collection[0].achieved}
            small
            idPrefix="journey"
          />
          <strong className="mt-2 block text-sm">Mốc phát triển</strong>
          <span className="mt-1 block text-xs text-muted-foreground">
            {collection.filter((m) => m.achieved).length}/{collection.length}{" "}
            huy hiệu
          </span>
        </Link>
        <Link
          href="/baby/development"
          className="rounded-3xl border bg-card p-5"
        >
          <span aria-hidden="true" className="text-2xl">
            🌦️
          </span>
          <strong className="mt-2 block text-sm">Tuần khủng hoảng</strong>
          <span className="mt-1 block text-xs text-muted-foreground">
            Tuần tuổi {context.week} ·{" "}
            {active
              ? `Đang ghi: ${active.title}`
              : "Thư viện tham khảo & theo dõi"}
          </span>
        </Link>
      </div>
      {(active || context.sleepChange) && (
        <Link
          href="/baby/development"
          className="block rounded-3xl border bg-secondary/25 p-5"
        >
          <p className="text-xs text-primary">Cần lưu ý</p>
          <h3 className="mt-2 text-sm font-semibold">
            {active ? active.title : "Tìm hiểu thay đổi giấc ngủ 3–6 tháng"}
          </h3>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {active
              ? "Đợt gia đình đang theo dõi · xem và cập nhật diễn biến."
              : "Thông tin theo giai đoạn; không khẳng định bé đang có khủng hoảng giấc ngủ."}
          </p>
        </Link>
      )}
    </section>
  );
}
