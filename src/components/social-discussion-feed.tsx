import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  MessageCircleQuestion,
  MessagesSquare,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  prioritizeSocialDiscussions,
  type SocialDiscussionTone,
  type SocialPlatform,
} from "@/features/knowledge/social-discussions";
import { cn } from "@/lib/utils";

const platformStyles: Record<SocialPlatform, string> = {
  Facebook: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200",
  TikTok: "border-zinc-300 bg-zinc-50 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
  Threads: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-200",
};

const toneStyles: Record<
  SocialDiscussionTone,
  { label: string; className: string }
> = {
  CAUTION: {
    label: "Cần cảnh giác",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
  },
  DEBATE: {
    label: "Đang tranh luận",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
  },
  PRACTICAL: {
    label: "Câu hỏi thực tế",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  },
};

export function SocialDiscussionFeed({
  currentStage,
}: {
  currentStage?: string;
}) {
  const discussions = prioritizeSocialDiscussions(currentStage);

  return (
    <>
      <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-fuchsia-600 to-rose-500 p-5 text-white shadow-lg shadow-fuchsia-500/15">
        <div className="absolute -right-10 -top-12 size-40 rounded-full border-[22px] border-white/10" />
        <div className="absolute -bottom-20 right-16 size-44 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-white/80">
            <Radar className="size-4" />
            Social listening · 10/09/2026
          </div>
          <h2 className="mt-3 max-w-md text-2xl font-semibold leading-tight">
            Điều cha mẹ hỏi, thông tin được kiểm chứng
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/85">
            Gom những câu hỏi và lời truyền miệng về mẹ &amp; bé từ Facebook,
            TikTok và Threads, sau đó nối về nội dung sức khỏe đã đối chiếu nguồn.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/15 px-3 py-1.5">
              {discussions.length} chủ đề
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1.5">
              3 nền tảng
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1.5">
              Không chép dữ liệu cá nhân
            </span>
          </div>
        </div>
      </section>

      <div className="mb-4 flex items-start gap-3 rounded-2xl border bg-card p-4 text-sm leading-6 shadow-sm">
        <MessagesSquare className="mt-0.5 size-5 shrink-0 text-primary" />
        <p>
          <strong className="block">Social cho biết mọi người đang hỏi gì</strong>
          <span className="text-muted-foreground">
            Không dùng lượt thích hay bình luận để kết luận đúng sai. Mỗi thẻ đều
            có đường dẫn sang bài cẩm nang và các tìm kiếm công khai để bạn tự xem
            ngữ cảnh.
          </span>
        </p>
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[.14em] text-muted-foreground">
          Chủ đề nổi bật
        </h2>
        {currentStage && (
          <span className="flex items-center gap-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" /> Ưu tiên cho gia đình bạn
          </span>
        )}
      </div>

      <div className="space-y-4">
        {discussions.map((discussion) => {
          const tone = toneStyles[discussion.tone];
          const isCurrent = currentStage
            ? discussion.stages.includes(currentStage)
            : false;

          return (
            <article
              key={discussion.id}
              className={cn(
                "overflow-hidden rounded-3xl border bg-card shadow-sm",
                discussion.tone === "CAUTION" &&
                  "border-red-200/80 dark:border-red-900/80",
              )}
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{discussion.category}</Badge>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-medium",
                      tone.className,
                    )}
                  >
                    {tone.label}
                  </span>
                  {isCurrent && <Badge variant="outline">Phù hợp lúc này</Badge>}
                </div>

                <h3 className="mt-3 text-lg font-semibold leading-6">
                  {discussion.question}
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-muted/55 p-3.5">
                    <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      <MessageCircleQuestion className="size-4" /> Trên mạng đang
                      nói gì
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {discussion.socialContext}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-3.5 dark:bg-emerald-950/55">
                    <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="size-4" /> Điểm đã kiểm chứng
                    </div>
                    <p className="text-sm leading-6 text-emerald-950 dark:text-emerald-100">
                      {discussion.checkedAnswer}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t bg-muted/25 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <Link
                  href={`/knowledge/${discussion.relatedArticle.slug}`}
                  className="group flex items-center gap-1.5 text-sm font-semibold text-primary"
                >
                  {discussion.relatedArticle.title}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <div className="flex flex-wrap gap-1.5">
                  {discussion.searches.map((source) => (
                    <a
                      key={source.platform}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Xem chủ đề “${discussion.question}” trên ${source.platform}`}
                      className={cn(
                        "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                        platformStyles[source.platform],
                      )}
                    >
                      {source.platform}
                      <ExternalLink className="size-3" />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex gap-3 rounded-2xl bg-secondary/60 p-4 text-xs leading-5 text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          Kết quả mạng xã hội có thể thay đổi theo tài khoản, vị trí và thời điểm.
          Radar không truy cập nhóm kín, không lưu tên người đăng và không xem mức
          độ lan truyền là bằng chứng y khoa.
        </p>
      </div>
    </>
  );
}
