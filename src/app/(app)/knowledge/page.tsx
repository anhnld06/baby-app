import Link from "next/link";
import { Bot, ChevronRight, ShieldCheck } from "lucide-react";
import { KnowledgeLibrary } from "@/components/knowledge-library";
import { PageHeader } from "@/components/page-header";
import { stageForAge } from "@/features/knowledge/stage";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { ageInDays } from "@/lib/date";
import { getLibraryIndex } from "@/features/knowledge/library-data";
import { parseLibraryQuery, queryLibrary } from "@/features/knowledge/library";
import { getDictionary } from "@/lib/i18n";

export default async function KnowledgePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; stage?: string; page?: string }>;
}) {
  const [user, t] = await Promise.all([requireUser(), getDictionary()]);
  const [baby, index, params] = await Promise.all([
    getSelectedBaby(user.id),
    getLibraryIndex(),
    searchParams,
  ]);
  const ageDays = baby ? ageInDays(baby.dateOfBirth) : undefined;
  const stage = stageForAge(ageDays);
  const query = parseLibraryQuery(params);
  const initialPage =
    query.stage !== null || query.q.length > 0
      ? queryLibrary(index, query)
      : undefined;
  return (
    <>
      <PageHeader title={t.knowledge.title} subtitle={t.knowledge.subtitle} />
      <KnowledgeLibrary
        currentStage={stage}
        totalArticles={index.length}
        initialPage={initialPage}
      />
      <Link
        href="/assistant"
        className="mt-5 flex items-center gap-3 rounded-3xl border bg-card p-4 shadow-sm"
      >
        <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary">
          <Bot className="size-5" />
        </span>
        <span className="flex-1">
          <strong className="block">{t.assistant.title}</strong>
          <span className="text-xs text-muted-foreground">
            Trợ lý trả lời dựa trên kho nội dung có nguồn này
          </span>
        </span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
      <div className="mt-3 flex gap-2 rounded-2xl bg-secondary/60 p-3 text-xs leading-5 text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        Nội dung để tham khảo và chuẩn bị câu hỏi khi đi khám, không thay thế
        chẩn đoán hay chỉ định của nhân viên y tế.
      </div>
    </>
  );
}
