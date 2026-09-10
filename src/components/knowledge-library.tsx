"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Baby,
  BookHeart,
  ChevronLeft,
  ChevronRight,
  Footprints,
  Heart,
  HeartPulse,
  MessagesSquare,
  Puzzle,
  Search,
  Smile,
  Sparkles,
  Utensils,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  evidenceLabels,
  knowledgeTypeLabels,
  stageLabels,
} from "@/features/knowledge/labels";
import { getKnowledgeVisual } from "@/features/knowledge/visuals";
import { cn } from "@/lib/utils";

type LibraryArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  stage: string;
  evidenceLevel: string;
  knowledgeType: string;
  sourceCount: number;
};

const STAGE_TILES = [
  { value: "ALL", icon: BookHeart, className: "bg-secondary text-primary" },
  { value: "PRECONCEPTION", icon: Heart, className: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
  { value: "PREGNANCY", icon: HeartPulse, className: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
  { value: "POSTPARTUM", icon: Sparkles, className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  { value: "NEWBORN_0_28_DAYS", icon: Baby, className: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
  { value: "INFANT_1_3_MONTHS", icon: Smile, className: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
  { value: "INFANT_3_6_MONTHS", icon: Puzzle, className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  { value: "INFANT_6_12_MONTHS", icon: Utensils, className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" },
  { value: "TODDLER", icon: Footprints, className: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300" },
] as const;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d")
    .toLowerCase();
}

export function KnowledgeLibrary({
  articles,
  currentStage,
}: {
  articles: LibraryArticle[];
  currentStage?: string;
}) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = normalize(query.trim());
    return articles.filter((article) => {
      if (stage && stage !== "ALL" && article.stage !== stage) return false;
      if (!needle) return true;
      return normalize(
        `${article.title} ${article.summary} ${article.category} ${stageLabels[article.stage] ?? ""}`,
      ).includes(needle);
    });
  }, [articles, query, stage]);

  const showList = stage !== null || query.trim().length > 0;

  return (
    <>
      <section className="relative mb-5 min-h-52 overflow-hidden rounded-3xl bg-primary p-5 text-primary-foreground shadow-lg shadow-primary/15">
        <Image
          alt=""
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 672px"
          src={getKnowledgeVisual("ALL")}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/10" />
        <div className="relative flex max-w-sm items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/15">
            <BookHeart className="size-5" />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] opacity-80">
              Sổ tay mẹ & bé
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              Đồng hành từ khi chuẩn bị mang thai
            </h2>
            <p className="mt-2 text-sm leading-6 opacity-85">
              {articles.length} bài thực hành, có nguồn và phân loại rõ mẹo dân
              gian.
            </p>
          </div>
        </div>
      </section>

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm: quấy khóc, ăn dặm, giấc ngủ..."
          aria-label="Tìm trong sổ tay"
          className="h-11 rounded-2xl bg-card pl-10 shadow-sm"
        />
      </div>

      {!showList && (
        <>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[.14em] text-muted-foreground">
            Chọn giai đoạn để xem bài liên quan
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {STAGE_TILES.map(({ value, icon: Icon, className }) => {
              const visual = getKnowledgeVisual(value);
              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => setStage(value)}
                  className="group min-w-0 overflow-hidden rounded-2xl bg-card text-xs font-medium shadow-sm transition-transform active:scale-95"
                >
                  <span className="relative block h-16 overflow-hidden bg-muted">
                    <Image
                      alt=""
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      fill
                      sizes="(max-width: 768px) 33vw, 210px"
                      src={visual}
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                    <span
                      className={cn(
                        "absolute bottom-1.5 left-1.5 grid size-8 place-items-center rounded-xl shadow-sm",
                        className,
                      )}
                    >
                      <Icon className="size-4" />
                      {currentStage === value && (
                        <Sparkles className="absolute -right-1 -top-1 size-4 rounded-full bg-card p-0.5 text-primary" />
                      )}
                    </span>
                  </span>
                  <span className="block truncate px-1.5 py-2">
                    {value === "ALL" ? "Tất cả" : stageLabels[value]}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {showList && (
        <>
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setStage(null)}
              className="flex min-w-0 items-center gap-1 text-sm font-medium text-primary"
            >
              <ChevronLeft className="size-4 shrink-0" />
              <span className="truncate">
                {stage && stage !== "ALL" ? stageLabels[stage] : "Toàn bộ sổ tay"}
              </span>
            </button>
            <span className="shrink-0 text-xs text-muted-foreground">
              {filtered.length} bài
            </span>
          </div>

          <div className="space-y-3">
            {filtered.map((article) => {
              const warning = article.knowledgeType === "POTENTIALLY_HARMFUL";
              const folk = article.knowledgeType === "TRADITIONAL_PRACTICE";
              return (
                <Link
                  href={`/knowledge/${article.slug}`}
                  key={article.id}
                  className={cn(
                    "group flex gap-3 rounded-3xl border bg-card p-4 shadow-sm transition-transform active:scale-[.99]",
                    warning && "border-red-200 dark:border-red-900",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap gap-1.5">
                      <Badge variant={warning ? "destructive" : "secondary"}>
                        {article.category}
                      </Badge>
                      {currentStage === article.stage && (
                        <Badge variant="outline">Phù hợp lúc này</Badge>
                      )}
                    </span>
                    <strong className="mt-2 block leading-5">{article.title}</strong>
                    <span className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                      {article.summary}
                    </span>
                    <span className="mt-2 flex flex-wrap gap-x-2 text-[11px] text-muted-foreground">
                      <span>{stageLabels[article.stage]}</span>
                      <span>·</span>
                      <span>{evidenceLabels[article.evidenceLevel]}</span>
                      <span>·</span>
                      <span>{article.sourceCount} nguồn</span>
                    </span>
                    {(folk || warning) && (
                      <span
                        className={cn(
                          "mt-2 block text-xs font-medium",
                          warning ? "text-red-600" : "text-amber-700 dark:text-amber-300",
                        )}
                      >
                        {knowledgeTypeLabels[article.knowledgeType]}
                      </span>
                    )}
                  </span>
                  <ChevronRight className="mt-2 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
            {filtered.length === 0 && (
              <div className="rounded-3xl border border-dashed p-8 text-center">
                <Search className="mx-auto mb-3 size-6 text-muted-foreground" />
                <p className="text-sm font-medium">Không tìm thấy bài phù hợp</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Thử từ khóa ngắn hơn hoặc chọn giai đoạn khác.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <Link
        href="/knowledge/social"
        className="group mt-5 flex items-center gap-3 overflow-hidden rounded-3xl border border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 to-violet-50 p-4 shadow-sm transition-transform active:scale-[.99] dark:border-fuchsia-900 dark:from-fuchsia-950/60 dark:to-violet-950/60"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-600 to-violet-600 text-white shadow-md shadow-fuchsia-500/20">
          <MessagesSquare className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.12em] text-fuchsia-700 dark:text-fuchsia-300">
            15 chủ đề · Facebook · TikTok · Threads
          </span>
          <strong className="mt-1 block leading-5">Cha mẹ đang quan tâm</strong>
          <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-muted-foreground">
            Xem câu hỏi đang được chia sẻ và câu trả lời đã đối chiếu nguồn.
          </span>
        </span>
        <ChevronRight className="size-5 shrink-0 text-fuchsia-600 transition-transform group-hover:translate-x-0.5 dark:text-fuchsia-300" />
      </Link>
    </>
  );
}
