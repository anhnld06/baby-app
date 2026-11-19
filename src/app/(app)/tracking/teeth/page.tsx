import Link from "next/link";
import { HistoryTimelineItem } from "@/components/history-timeline-item";
import { CareBentoHero } from "@/components/care-bento-hero";
import type { ToothPosition } from "@prisma/client";
import { PageHeader } from "@/components/page-header";
import { ToothChart } from "@/components/tooth-chart";
import { Card, CardContent } from "@/components/ui/card";
import {
  LOWER_TOOTH_ORDER,
  TOOTH_ERUPTION_INFO,
  toothJaw,
  toothSide,
  toothTypeLabelKey,
  UPPER_TOOTH_ORDER,
} from "@/features/teeth/teeth";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { toDateInputValue } from "@/lib/date";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";

const ALL_POSITIONS: ToothPosition[] = [...UPPER_TOOTH_ORDER, ...LOWER_TOOTH_ORDER];

// Tooth type badge colors
const TYPE_COLORS: Record<
  "centralIncisor" | "lateralIncisor" | "canine" | "firstMolar" | "secondMolar",
  string
> = {
  centralIncisor: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  lateralIncisor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  canine: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
  firstMolar: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200",
  secondMolar: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
};

export default async function TeethPage() {
  const [user, t] = await Promise.all([requireUser(), getDictionary()]);
  const baby = await getSelectedBaby(user.id);
  if (!baby)
    return (
      <>
        <PageHeader compact title={t.tracking.teethTitle} backHref="/baby" />
        <p>{t.common.noData}</p>
      </>
    );

  const records = await db.toothRecord.findMany({ where: { babyId: baby.id } });
  const eruptedPositions = new Set(records.map((record) => record.position));
  const today = toDateInputValue(new Date(), user.timezone);
  const yesterday = new Date(Date.parse(`${today}T00:00:00Z`) - 86_400_000).toISOString().slice(0, 10);

  // Stats
  const total = ALL_POSITIONS.length;
  const eruptedCount = eruptedPositions.size;
  const remaining = total - eruptedCount;

  // Hero title & description
  const heroTitle =
    eruptedCount === 0
      ? "Chưa ghi nhận răng nào"
      : eruptedCount === total
        ? "Đủ 20 chiếc răng sữa! 🎉"
        : `${eruptedCount} răng đã mọc`;

  const heroDescription =
    eruptedCount === 0
      ? "Chạm vào một chiếc răng trên sơ đồ để mở bong bóng ghi nhận"
      : remaining > 0
        ? `Còn ${remaining} chiếc chưa mọc · Chạm vào từng răng để cập nhật`
        : "Bé đã hoàn thành hành trình mọc đủ 20 chiếc răng sữa";

  return (
    <>
      <PageHeader
        compact
        title={t.tracking.teethTitle}
        subtitle={baby.name}
        backHref="/baby"
      />

      {/* ── Bento Hero ── */}
      <CareBentoHero
        kind="tooth"
        tone="sky"
        eyebrow="Sơ đồ răng sữa"
        title={heroTitle}
        description={heroDescription}
        badge={
          eruptedCount > 0 && eruptedCount < total ? (
            <span className="inline-flex items-center rounded-full bg-sky-100/90 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700 dark:bg-sky-950/80 dark:text-sky-300">
              {Math.round((eruptedCount / total) * 100)}%
            </span>
          ) : undefined
        }
        footer={
          <div className="grid grid-cols-3 divide-x divide-border/60 text-center text-xs">
            <div className="pr-3">
              <p className="text-[11px] text-muted-foreground">Đã mọc</p>
              <p className="mt-0.5 text-lg font-bold text-sky-600 dark:text-sky-400">
                {eruptedCount}
              </p>
            </div>
            <div className="px-3">
              <p className="text-[11px] text-muted-foreground">Còn lại</p>
              <p className="mt-0.5 text-lg font-bold text-muted-foreground">
                {remaining}
              </p>
            </div>
            <div className="pl-3">
              <p className="text-[11px] text-muted-foreground">Tổng số</p>
              <p className="mt-0.5 text-lg font-bold">{total}</p>
            </div>
          </div>
        }
      />

      {/* ── Mouth chart; tapping a tooth opens its bubble ── */}
      {/* overflow-visible lets the bubble float past the card edges */}
      <Card className="mb-5 overflow-visible border-0 shadow-sm">
        <CardContent className="p-3 sm:p-5">
          <div className="mb-2 text-center">
            <h2 className="text-sm font-semibold text-foreground">
              {t.tracking.toothDiagram}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{t.tracking.selectTooth}</p>
          </div>

          <ToothChart
            babyId={baby.id}
            birthDate={toDateInputValue(baby.dateOfBirth, "UTC")}
            today={today}
            yesterday={yesterday}
            records={records.map((record) => ({
              id: record.id,
              position: record.position,
              eruptedAt: toDateInputValue(record.eruptedAt, "UTC"),
              notes: record.notes ?? "",
            }))}
            labels={{
              centralIncisor: t.tracking.centralIncisor,
              lateralIncisor: t.tracking.lateralIncisor,
              canine: t.tracking.canine,
              firstMolar: t.tracking.firstMolar,
              secondMolar: t.tracking.secondMolar,
              upperJaw: t.tracking.upperJaw,
              lowerJaw: t.tracking.lowerJaw,
              babyRight: t.tracking.babyRight,
              babyLeft: t.tracking.babyLeft,
              primaryTooth: t.tracking.primaryTooth,
              expectedEruption: t.tracking.expectedEruption,
              monthShort: t.tracking.monthShort,
              erupted: t.tracking.erupted,
              notErupted: t.tracking.notErupted,
              eruptedAt: t.tracking.eruptedAt,
              clearTooth: t.tracking.clearTooth,
              notes: t.common.notes,
              close: "Đóng",
            }}
          />

          <div className="mt-5 rounded-2xl bg-muted/50 px-3 py-2.5 text-center text-xs leading-relaxed text-muted-foreground">
            <p>{t.tracking.timingVaries}</p>
            <a
              href="https://www.mouthhealthy.org/all-topics-a-z/eruption-charts/"
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block font-medium text-primary underline-offset-2 hover:underline"
            >
              {t.tracking.eruptionSource}
            </a>
          </div>
        </CardContent>
      </Card>

      {/* ── History Timeline ── */}
      {records.length > 0 && (
        <>
          <h2 className="mb-3 mt-7 text-base font-semibold">Lịch sử mọc răng</h2>
          <div>
            {[...records]
              .sort((a, b) => b.eruptedAt.getTime() - a.eruptedAt.getTime())
              .map((record) => {
                const typeKey = toothTypeLabelKey(record.position);
                return (
                  <HistoryTimelineItem
                    key={record.id}
                    at={record.eruptedAt}
                    timeZone="UTC"
                    showDate
                    dateOnly
                    tone="sky"
                  >
                    <Link
                      href={`/tracking/teeth?position=${record.position}`}
                      className="block rounded-3xl border bg-card p-4 transition-shadow hover:shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_COLORS[typeKey]}`}
                        >
                          {t.tracking[typeKey]}
                        </span>
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {TOOTH_ERUPTION_INFO[record.position].fdiNumber}
                        </span>
                      </div>
                      <p className="mt-1.5 font-semibold leading-tight">
                        {t.tracking[typeKey]}
                        {" · "}
                        {toothJaw(record.position) === "upper"
                          ? t.tracking.upperJaw
                          : t.tracking.lowerJaw}{" "}
                        {toothSide(record.position) === "right"
                          ? t.tracking.right
                          : t.tracking.left}
                      </p>
                      {record.notes && (
                        <p className="mt-1.5 break-words text-xs text-muted-foreground">
                          {record.notes}
                        </p>
                      )}
                    </Link>
                  </HistoryTimelineItem>
                );
              })}
          </div>
        </>
      )}

      {records.length === 0 && (
        <div className="mt-2 rounded-3xl border border-dashed border-sky-200/70 bg-sky-50/50 px-5 py-8 text-center dark:border-sky-900/40 dark:bg-sky-950/20">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-sky-100 dark:bg-sky-900/50">
            <svg
              viewBox="0 0 32 32"
              className="size-9 text-sky-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M16 6 Q20 4 22 10 Q24 14 20 18 Q17 21 14 18 Q10 14 12 10 Q14 4 16 6Z" />
              <path
                d="M14 18 Q13 24 12 28 M18 18 Q19 24 20 28"
                strokeOpacity="0.5"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold">Chưa ghi nhận răng nào</p>
          <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
            Chạm vào từng chiếc răng trên sơ đồ để mở bong bóng ghi nhận ngày mọc
            của bé
          </p>
        </div>
      )}
    </>
  );
}
