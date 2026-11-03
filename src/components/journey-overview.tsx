import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookHeart, Mail, Sparkles } from "lucide-react";
import styles from "./journey-overview.module.css";
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
  baby: { id: string; name: string; nickname?: string | null; dateOfBirth: Date };
  timeZone: string;
}) {
  const now = new Date();
  const context = developmentContext(baby.dateOfBirth, now, timeZone);
  const stage = stageContent(context.ageDays);
  const [memories, active, letterCount] = await Promise.all([
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
    db.babyMemory.count({ where: { babyId: baby.id } }),
  ]);
  const collection = milestoneCollection(
    baby.dateOfBirth,
    toDateTimeLocal(now, timeZone).slice(0, 10),
    memories,
  );
  const achieved = collection.filter(item => item.achieved).length;
  return (
    <section className={styles.journey} aria-labelledby="journey-heading">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}><span />Dành riêng cho {baby.nickname || baby.name}</p>
          <h2 id="journey-heading">Cùng con <em>lớn lên.</em></h2>
        </div>
      </div>

      <Link href="/baby/development" className={styles.feature}>
        <svg viewBox="0 0 160 180" className={styles.botanical} fill="none" aria-hidden="true">
          <circle cx="106" cy="65" r="44" fill="currentColor" opacity=".09" />
          <path d="M84 162c-8-39 4-71 27-111M89 133c-34 0-49-22-43-43 26 0 42 20 43 43ZM99 102c31-1 49-22 43-45-28 4-41 21-43 45ZM104 79c-27-5-39-23-32-41 23 4 34 20 32 41Z" stroke="currentColor" strokeWidth="1.4" />
          <path d="m53 100 33 28m49-60-33 29M78 47l24 27" stroke="currentColor" strokeWidth=".75" opacity=".5" />
          <circle cx="44" cy="45" r="2.5" fill="currentColor" opacity=".5" />
          <path d="M33 63v9m-4-4h9" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <span className={styles.featureMeta}><span className={styles.week}>TUẦN {String(context.week).padStart(2, "0")}</span><span>Những ngày con lớn</span></span>
        <h3>{stage.title}</h3>
        <p className={styles.featureBody}>{stage.body}</p>
        {(active || context.sleepChange) && <span className={styles.note}>{active ? `Đang theo dõi: ${active.title}` : "Tìm hiểu thay đổi giấc ngủ 3–6 tháng"}</span>}
        <span className={styles.featureFooter}><span>Khám phá giai đoạn này</span><span className={styles.roundArrow}><ArrowUpRight className="size-4" /></span></span>
      </Link>

      <Link href="/assistant" className={styles.assistant}>
        <span className={styles.assistantIcon}><Sparkles className="size-5" strokeWidth={1.5} /></span>
        <span className="min-w-0 flex-1"><strong>Bé đang cần gì?</strong><span className={styles.assistantBody}>Một chút gợi ý cho điều bạn đang băn khoăn.</span></span>
        <ArrowUpRight className="size-4 shrink-0" />
      </Link>

      <div className={styles.keepsakes}>
        <Link href="/baby/mailbox" className={styles.mailbox}>
          <span aria-hidden="true" className={styles.postmark}>GỬI CON · VỚI YÊU THƯƠNG</span>
          <span aria-hidden="true" className={styles.stamp}><Mail className="size-7" strokeWidth={1.2} /><span>GỬI CON ♡</span></span>
          <strong>Hộp thư <em>cho bé</em></strong>
          <span className={styles.cardCaption}>{letterCount ? `${letterCount} lá thư đã cất giữ` : "Viết lá thư đầu tiên"}</span>
          <ArrowUpRight className={styles.cardArrow} />
        </Link>
        <Link href="/baby/milestones" className={styles.milestones}>
          <span className={styles.medallion}>
            <MilestoneBadge item={collection[0]} achieved={collection[0].achieved} small idPrefix="journey" />
          </span>
          <strong>Mốc phát triển</strong>
          <span className={styles.milestoneHint}>Những lần đầu của con</span>
          <span className={styles.cardCaption}>{achieved}/{collection.length} huy hiệu đã ghi</span>
          <span role="progressbar" aria-label="Huy hiệu đã ghi" aria-valuenow={achieved} aria-valuemin={0} aria-valuemax={collection.length} className={styles.progress}><span style={{ width: `${achieved / collection.length * 100}%` }} /></span>
          <ArrowUpRight className={styles.cardArrow} />
        </Link>
      </div>
      <Link href="/knowledge" className="flex min-h-12 items-center justify-between gap-2 px-2 text-xs font-medium text-muted-foreground hover:text-primary"><span className="flex items-center gap-2"><BookHeart className="size-4" />Mở cẩm nang chăm mẹ & bé</span><ArrowRight className="size-3.5" /></Link>
    </section>
  );
}
