import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { BabySwitcher } from "@/components/baby-switcher";
import { MemoryComposer } from "@/components/memory-composer";
import { MemoryGallery } from "@/components/memory-gallery";
import { Mail, Heart, Sparkles } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getSelectedBabyId, listBabies, pickSelectedBaby } from "@/lib/data";
import { db } from "@/lib/db";
import { toDateTimeLocal } from "@/lib/date";


export default async function MailboxPage() {
  const user = await requireUser();
  const [babies, selectedId] = await Promise.all([listBabies(user.id), getSelectedBabyId()]);
  const baby = pickSelectedBaby(babies, selectedId);
  if (!baby) return <><PageHeader title="Hộp thư cho bé" backHref="/baby" /><Link href="/profile/baby/new">Thêm hồ sơ bé để cất những kỷ niệm đầu tiên →</Link></>;
  const memories = await db.babyMemory.findMany({ where: { babyId: baby.id }, orderBy: [{ occurredAt: "desc" }, { id: "desc" }], select: { id: true, title: true, letter: true, frame: true, occurredAt: true, mediaMime: true } });
  const birth = baby.dateOfBirth.toISOString().slice(0,10);
  const now = toDateTimeLocal(new Date(), user.timezone);
  return <>
    <PageHeader title="Hộp thư cho bé" subtitle="Những ngày bé lớn, những điều mình thương." backHref="/baby" />
    <BabySwitcher babies={babies} selectedBabyId={baby.id} addLabel="Thêm bé" />
    <section className="memory-welcome">
      <div className="relative z-10 max-w-sm"><p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.2em] text-primary"><span className="size-1.5 rounded-full bg-primary" />Dành riêng cho {baby.name}</p><h2 className="mt-4 text-[1.85rem] font-semibold leading-tight tracking-tight sm:text-4xl">Cất một chút hôm nay,<br /><span className="font-serif italic text-primary">thương đến tận mai sau.</span></h2><p className="mt-4 max-w-[260px] text-sm leading-6 text-muted-foreground">Từng chiếc tem nhỏ giữ lại một khoảnh khắc con lớn khôn.</p><div className="mt-6 flex flex-wrap gap-2"><span className="memory-stat"><Mail className="size-3.5" />{memories.length} thư gửi con</span><span className="memory-stat"><Heart className="size-3.5" />Một trời yêu thương</span></div></div>
      <div aria-hidden="true" className="memory-welcome-art"><div className="memory-art-stamp"><Sparkles className="size-8" strokeWidth={1} /><span>GỬI CON ♡</span></div><div className="memory-art-envelope"><Heart className="size-6" fill="currentColor" /></div><span className="memory-art-sparkle">✧</span></div>
    </section>
    <MemoryComposer key={baby.id} babyId={baby.id} babyName={baby.name} birth={birth} now={now} />
    <MemoryGallery key={baby.id} babyName={baby.name} birth={birth} memories={memories.map(memory => ({ ...memory, occurredAt: memory.occurredAt.toISOString(), localDay: toDateTimeLocal(memory.occurredAt, user.timezone).slice(0,10) }))} />
  </>;
}
