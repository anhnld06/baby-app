"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, useTransition } from "react";
import { useRouter, unstable_rethrow } from "next/navigation";
import { Footprints, Activity, RotateCcw, Download, Trash2 } from "lucide-react";
import { saveTrackingSession } from "@/features/mother/tracking-actions";
import { durationLabel, sessionSummary, trackingDraftSchema, type TrackingDraft, type TrackingEvent } from "@/features/mother/tracking-validation";
import styles from "./pregnancy.module.css";

const memory = new Map<string, string>();
const eventName = "vani-pregnancy-draft";
function subscribe(listener: () => void) {
  window.addEventListener(eventName, listener);
  return () => window.removeEventListener(eventName, listener);
}
function snapshot(key: string) {
  try { return sessionStorage.getItem(key) ?? memory.get(key) ?? null; } catch { return memory.get(key) ?? null; }
}
function persist(key: string, draft: TrackingDraft | null) {
  const value = draft ? JSON.stringify(draft) : null;
  if (value) memory.set(key, value); else memory.delete(key);
  try { if (value) sessionStorage.setItem(key, value); else sessionStorage.removeItem(key); } catch { /* Keep this tab's in-memory draft if storage is unavailable. */ }
  window.dispatchEvent(new Event(eventName));
}
const serverSnapshot = () => null;

export function PregnancySessionTool({ pregnancyId, kind, active, history }: {
  pregnancyId: string; kind: "KICKS" | "CONTRACTIONS"; active: boolean;
  history: { id: string; startedAt: string; endedAt: string; events: TrackingEvent[] }[];
}) {
  const kicks = kind === "KICKS";
  const key = `vani:pregnancy-draft:${pregnancyId}:${kind}`;
  const raw = useSyncExternalStore(subscribe, () => snapshot(key), serverSnapshot);
  const draft = useMemo(() => {
    try { const parsed = trackingDraftSchema.safeParse(raw ? JSON.parse(raw) : null); return parsed.success ? parsed.data : null; } catch { return null; }
  }, [raw]);
  const [now, setNow] = useState(0);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  useEffect(() => {
    if (!draft || !active) return;
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [draft, active]);
  const stats = sessionSummary(draft?.events ?? [], kind);
  function update(next: TrackingDraft | null) { persist(key, next); setSaved(false); setError(""); }
  function begin() { update({ clientId: crypto.randomUUID(), startedAt: Date.now(), events: [] }); }
  function record() {
    if (!draft) return;
    if (draft.events.length >= 500) { setError("Phiên đã đủ 500 lần ghi. Lưu phiên trước khi bắt đầu phiên mới."); return; }
    const at = Date.now();
    if (kicks) update({ ...draft, events: [...draft.events, { start: at }] });
    else if (draft.activeStart != null) update({ ...draft, activeStart: undefined, events: [...draft.events, { start: draft.activeStart, end: at }] });
    else update({ ...draft, activeStart: at });
  }
  function save() {
    if (!draft) return;
    startTransition(async () => {
      setError("");
      try {
        const result = await saveTrackingSession({ pregnancyId, kind, clientId: draft.clientId, startedAt: draft.startedAt, endedAt: Date.now(), events: draft.events });
        if (result.error) setError(result.error);
        else { persist(key, null); setSaved(true); router.refresh(); }
      } catch (err) { unstable_rethrow(err); setError("Chưa lưu được phiên. Bản nháp vẫn còn, hãy kiểm tra kết nối và thử lại."); }
    });
  }
  function exportCsv() {
    const rows = ["Loai,Phien_bat_dau,Thoi_diem,Thoi_luong_giay"];
    for (const session of history) for (const event of session.events) rows.push(`${kind},${session.startedAt},${new Date(event.start).toISOString()},${event.end == null ? "" : Math.round((event.end - event.start) / 1000)}`);
    const url = URL.createObjectURL(new Blob(["\uFEFF", rows.join("\r\n")], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `${kicks ? "cu-dong-thai" : "con-co"}.csv`; link.click(); URL.revokeObjectURL(url);
  }
  const elapsed = draft ? Math.max(0, now - (draft.activeStart ?? draft.startedAt)) : 0;
  return <>
    {!active && <div className={styles.archive}>Thai kỳ này đã được lưu vào hồ sơ. Bạn có thể xem và xuất các phiên đã ghi; phiên mới chỉ dành cho thai kỳ đang mang thai.</div>}
    <section className={styles.panel} aria-label={kicks ? "Bộ đếm cử động" : "Đồng hồ cơn co"}>
      <div className={styles.timer}>
        <span className={styles.eyebrow}>{kicks ? "Lắng nghe từng chuyển động" : "Ghi nhận từng nhịp cơ thể"}</span>
        <div className={styles.timerFace}><strong aria-live="polite">{kicks ? stats.count : durationLabel(elapsed)}</strong><span>{kicks ? "cử động đã ghi" : draft?.activeStart != null ? "cơn co đang diễn ra" : "thời gian phiên"}</span>{kicks && draft && <small className="mt-2 text-xs">{durationLabel(elapsed)}</small>}</div>
        {active && (!draft ? <button className={styles.button} onClick={begin}>{kicks ? <Footprints size={17} /> : <Activity size={17} />}Bắt đầu phiên</button> : <>
          <button className={styles.button} disabled={pending} onClick={record}>{kicks ? "Ghi một cử động" : draft.activeStart != null ? "Kết thúc cơn co" : "Bắt đầu cơn co"}</button>
          <div className={styles.actions}>
            <button className={`${styles.button} ${styles.secondary}`} disabled={pending || draft.activeStart != null || !draft.events.length} onClick={() => update({ ...draft, events: draft.events.slice(0, -1) })}><RotateCcw size={14} />Hoàn tác</button>
            <button className={styles.button} disabled={pending || draft.activeStart != null || !draft.events.length} onClick={save}>{pending ? "Đang lưu…" : "Lưu phiên"}</button>
            <button aria-label="Hủy phiên nháp" className={styles.iconButton} disabled={pending} onClick={() => { if (window.confirm("Xóa phiên nháp chưa lưu?")) update(null); }}><Trash2 size={16} /></button>
          </div>
          <p className={styles.muted}>Bản nháp được giữ trong tab này khi chuyển trang hoặc tải lại. Lưu phiên để giữ lâu dài.</p>
        </>)}
        {saved && <p role="status" className="mt-3 text-sm text-emerald-700">Đã lưu phiên theo dõi.</p>}
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      </div>
      {!kicks && <dl className={styles.numbers}><div className={styles.number}><dt className={styles.muted}>Số cơn</dt><dd><strong>{stats.count}</strong></dd></div><div className={styles.number}><dt className={styles.muted}>Dài trung bình</dt><dd><strong>{stats.averageDurationMs == null ? "—" : durationLabel(stats.averageDurationMs)}</strong></dd></div><div className={styles.number}><dt className={styles.muted}>Cách nhau TB</dt><dd><strong>{stats.averageIntervalMs == null ? "—" : durationLabel(stats.averageIntervalMs)}</strong></dd></div></dl>}
      {draft && draft.events.length > 0 && <details className="mt-5 text-sm"><summary className="cursor-pointer">Các lần vừa ghi ({draft.events.length})</summary><ol>{draft.events.map((event, index) => <li className={styles.historyRow} key={`${event.start}-${index}`}><span>#{index + 1} · {new Intl.DateTimeFormat("vi-VN", { timeStyle: "medium" }).format(event.start)}</span><strong>{event.end == null ? "Cử động" : durationLabel(event.end - event.start)}</strong></li>)}</ol></details>}
    </section>
    {history.length > 0 && <button onClick={exportCsv} className={`${styles.button} ${styles.secondary}`}><Download size={15} />Xuất lịch sử đã tải (CSV)</button>}
  </>;
}
