import type { ReactNode } from "react";
import { Heart, ImagePlus } from "lucide-react";
import { MEMORY_FRAMES } from "@/features/mailbox/memories";

export function MemoryStamp({ frame, title, caption, src, mime, compact = false, children }: {
  frame: string; title: string; caption?: string; src?: string; mime?: string; compact?: boolean; children?: ReactNode;
}) {
  const design = MEMORY_FRAMES.find(f => f.key === frame) ?? MEMORY_FRAMES[0];
  return <div className={`memory-stamp ${compact ? "memory-stamp-compact" : ""}`} data-frame={design.key}>
    <div className="memory-stamp-paper">
      <span aria-hidden="true" className="memory-sticker">{design.emoji}</span>
      <div className="relative aspect-square overflow-hidden rounded-sm bg-secondary/70">
        {children ?? (src ? mime?.startsWith("video/") ? <video src={src} controls={!compact} muted={compact} playsInline loop preload="metadata" className="size-full object-cover" /> : /* eslint-disable-next-line @next/next/no-img-element */
          <img src={src} loading="lazy" alt={compact ? "" : title} className="size-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center gap-3 text-primary/60"><ImagePlus className={compact ? "size-6" : "size-12"} strokeWidth={1} />{!compact && <span className="text-xs">Một khoảnh khắc, ngàn yêu thương</span>}</div>)}
        {compact && mime?.startsWith("video/") && <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 text-[9px] text-white">▶</span>}
      </div>
      <p className="memory-stamp-title">{title || "Gửi con, với tất cả yêu thương"}</p>
      {caption && <p className="memory-stamp-caption">{caption}</p>}
      {!compact && <Heart aria-hidden="true" className="absolute bottom-3 right-3 size-3 opacity-35" />}
    </div>
  </div>;
}
