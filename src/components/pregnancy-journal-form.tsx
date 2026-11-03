"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import styles from "./pregnancy.module.css";
import { savePregnancyJournal } from "@/features/mother/journal-actions";

export function PregnancyJournalForm({ pregnancyId, kind, today, editing }: {
  pregnancyId: string;
  kind: "HEALTH" | "MEMORY";
  today: string;
  editing?: { id: string; title: string; content: string; occurredOn: string };
}) {
  const [state, action, pending] = useActionState(savePregnancyJournal, { error: "" });
  const health = kind === "HEALTH";
  const field = styles.field;
  const [title, setTitle] = useState(editing?.title ?? "");
  const [content, setContent] = useState(editing?.content ?? "");
  const [feeling, setFeeling] = useState("");
  return <form action={action} className="space-y-4">
    <input type="hidden" name="pregnancyId" value={pregnancyId} />
    <input type="hidden" name="kind" value={kind} />
    {editing && <input type="hidden" name="id" value={editing.id} />}
    {health && <div><p className="mb-2 text-xs text-muted-foreground">Hôm nay mẹ cảm thấy</p><div className="flex flex-wrap gap-2">{["Dễ chịu", "Mệt mỏi", "Khó ngủ", "Buồn nôn", "Lo lắng"].map((item) => <button key={item} type="button" aria-pressed={feeling === item} className={`min-h-10 rounded-full border px-3 text-xs ${feeling === item ? "border-rose-300 bg-rose-50 text-rose-700" : "text-muted-foreground"}`} onClick={() => { setFeeling(item); if (!title || title.startsWith("Hôm nay mẹ thấy")) setTitle(`Hôm nay mẹ thấy ${item.toLowerCase()}`); }}>{item}</button>)}</div></div>}
    <input type="hidden" name="content" value={[feeling ? `Cảm nhận: ${feeling}` : "", content].filter(Boolean).join("\n")} />
    <label className="block text-sm">Ngày ghi nhận<input className={field} type="date" name="occurredOn" required defaultValue={editing?.occurredOn ?? today} /></label>
    <label className="block text-sm">{health ? "Hôm nay mẹ thế nào?" : "Tên kỷ niệm"}<input className={field} name="title" required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} placeholder={health ? "Giấc ngủ, tâm trạng, điều muốn hỏi bác sĩ…" : "Lần đầu nghe nhịp tim con…"} /></label>
    <label className="block text-sm">{health ? "Triệu chứng, cảm nhận và ghi chú" : "Lời mẹ muốn giữ lại"}<textarea className={field} name="journalBody" rows={4} required={!feeling} maxLength={9900} value={content} onChange={(event) => setContent(event.target.value)} /></label>
    {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
    <div className="flex items-center gap-4"><button disabled={pending} className={styles.button}>{pending ? "Đang lưu…" : editing ? "Cập nhật" : health ? "Lưu nhật ký" : "Lưu kỷ niệm"}</button>{editing && <Link className="text-sm underline" href={`/mother/pregnancy/${health ? "health/journal" : "memories"}`}>Hủy chỉnh sửa</Link>}</div>
  </form>;
}
