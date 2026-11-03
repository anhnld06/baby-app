"use client";
import Link from "next/link";
import { MILESTONES } from "@/features/journey/milestones";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Mail, Sparkles } from "lucide-react";
import { MemoryStamp } from "@/components/memory-stamp";
import { memoryAge } from "@/features/mailbox/memories";
import { deleteMemoryAction, updateMemoryMilestoneAction } from "@/app/memory-actions";

type Memory = { milestoneKey: string | null; id: string; title: string; letter: string; frame: string; occurredAt: string; mediaMime: string | null; localDay: string };
export function MemoryGallery({ memories, birth, babyName }: { memories: Memory[]; birth: string; babyName: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const groups = new Map<number, { range: string; items: Memory[] }>();
  for (const memory of memories) {
    const age = memoryAge(birth, memory.localDay);
    const group = groups.get(age.month) ?? { range: age.range, items: [] };
    group.items.push(memory); groups.set(age.month, group);
  }
  const current = selected === null ? undefined : groups.get(selected);
  const monthTitle = (month: number) => month < 0 ? "Chờ ngày gặp con" : month === 0 ? "Tháng đầu đời" : `${month} tháng tuổi`;
  return <section aria-label="Hành trình kỷ niệm" className="mt-7">
    {current ? <>
      <button onClick={() => setSelected(null)} className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm text-primary"><ArrowLeft className="size-4" />Tất cả phong bì</button>
      <div className="mb-6 flex items-center justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-widest text-primary">Hành trình của {babyName}</p><h2 className="mt-2 text-2xl font-semibold">{monthTitle(selected!)}</h2><p className="mt-2 text-xs text-muted-foreground">{current.range} · {current.items.length} thư</p></div><Sparkles aria-hidden="true" className="size-8 text-primary/40" /></div>
      <div className="memory-journey">{current.items.map(memory => { const age = memoryAge(birth, memory.localDay); const milestone = MILESTONES.find(m => m.key === memory.milestoneKey); return <article key={memory.id} className="memory-journey-item">
        <div className="memory-journey-stamp"><MemoryStamp frame={memory.frame} title={memory.title} caption={`${babyName} · ${age.label}`} src={memory.mediaMime ? `/api/memories/${memory.id}` : undefined} mime={memory.mediaMime ?? undefined} />{milestone && <Link href={`/baby/milestones#milestone-${milestone.key}`} className="mx-auto mt-3 flex w-fit max-w-full items-center gap-1 rounded-full border border-primary/15 bg-card px-3 py-2 text-center text-[10px] font-medium text-primary">{milestone.icon} {milestone.title} ↗</Link>}</div>
        <div className="memory-journey-copy"><time className="text-sm font-semibold" dateTime={memory.localDay}>{memory.localDay.split("-").reverse().join("/")}</time><p className="mt-1 text-xs text-muted-foreground">{age.label}</p>
          {memory.letter && <details className="mt-3 rounded-2xl border border-primary/10 bg-card/90 p-3 text-left"><summary className="cursor-pointer py-1 text-xs font-medium text-primary">Đọc thư gửi con ♡</summary><p className="mt-3 whitespace-pre-wrap break-words font-serif text-sm leading-7">{memory.letter}</p></details>}
          <details className="mt-2 text-left text-xs"><summary className="cursor-pointer py-3 text-muted-foreground">Quản lý kỷ niệm</summary><form action={updateMemoryMilestoneAction} className="my-3 space-y-2"><input type="hidden" name="id" value={memory.id} /><label className="block">Gắn mốc phát triển<select name="milestoneKey" defaultValue={memory.milestoneKey ?? ""} className="mt-2 w-full rounded-xl border bg-card p-2"><option value="">Không gắn mốc</option>{MILESTONES.map(m => <option key={m.key} value={m.key}>{m.icon} {m.title}</option>)}</select></label><p className="leading-5 text-muted-foreground">Không tự đánh dấu đã đạt mốc.</p><button className="min-h-11 text-primary underline">Lưu tag</button></form><p className="my-2 leading-5">Xóa kỷ niệm này? Không thể khôi phục sau khi xóa.</p><form action={deleteMemoryAction}><input type="hidden" name="id" value={memory.id} /><button className="min-h-11 text-destructive underline">Xác nhận xóa kỷ niệm</button></form></details>
        </div>
      </article>; })}</div>
    </> : <>
      <div className="mb-5 flex items-end justify-between"><div><h2 className="text-xl font-semibold">Những phong bì yêu thương</h2><p className="mt-2 text-sm text-muted-foreground">Mỗi tháng con lớn, thêm một miền ký ức.</p></div><span className="hidden text-xs text-primary sm:block">{groups.size} phong bì</span></div>
      {!memories.length && <div className="memory-empty"><div className="memory-empty-envelope"><Mail className="size-12" strokeWidth={1} /><HeartMark /></div><h3 className="mt-6 font-semibold">Có một phong bì đang chờ con</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">Một bức ảnh, một nụ cười hay đôi dòng của mẹ. Cất yêu thương đầu tiên vào đây nhé.</p></div>}
      <div className="grid gap-5 sm:grid-cols-2">{[...groups].map(([month, group], index) => <button key={month} onClick={() => setSelected(month)} aria-label={`Mở phong bì ${monthTitle(month)}, ${group.items.length} thư`} className="memory-envelope group" data-color={index % 3}>
        <div className="memory-envelope-preview" aria-hidden="true">{group.items.slice(0,4).map(memory => <div key={memory.id} className="memory-envelope-stamp"><MemoryStamp compact frame={memory.frame} title={memory.title} src={memory.mediaMime ? `/api/memories/${memory.id}` : undefined} mime={memory.mediaMime ?? undefined} /></div>)}<div className="memory-envelope-pocket"><span className="memory-envelope-seal"><Mail className="size-5" strokeWidth={1.5} /></span></div></div>
        <div className="flex items-center justify-between gap-2 px-1 pb-1 pt-4 text-left"><div><h3 className="font-semibold">{monthTitle(month)}</h3><p className="mt-1 text-xs text-muted-foreground">{group.range}</p></div><span className="flex shrink-0 items-center gap-2 text-xs text-primary">{group.items.length} thư<ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span></div>
      </button>)}</div>
    </>}
  </section>;
}
function HeartMark() { return <span aria-hidden="true" className="absolute -right-2 -top-2 rotate-12 text-2xl">💌</span>; }
