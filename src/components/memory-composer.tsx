"use client";
import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { unstable_rethrow } from "next/navigation";
import { Camera, Images, Repeat2, X, MailPlus, Heart } from "lucide-react";
import { MILESTONES } from "@/features/journey/milestones";
import { MemoryStamp } from "@/components/memory-stamp";
import { saveMemoryAction } from "@/app/memory-actions";
import { MEMORY_FRAMES, MAX_MEMORY_MEDIA, MEMORY_MEDIA_UNSUPPORTED, MEMORY_SAVE_FAILED, MEMORY_VIDEO_TOO_LARGE, memoryAge, memoryMediaKind, memoryVideoType } from "@/features/mailbox/memories";
import { compressImageFile, ImageCompressionError } from "@/lib/image-compress";
import { toDateTimeLocal } from "@/lib/date";

type SaveState = { error?: string; saved?: boolean };

const FUTURE_GRACE_MS = 5 * 60_000;
const OFFLINE_MESSAGE = "Thiết bị đang ngoại tuyến nên thư chưa được gửi. Có mạng lại hãy bấm cất thư lần nữa nhé.";

/** Current wall-clock time in the family's timezone, as a datetime-local value. */
function localNow(timeZone?: string, offsetMs = 0) {
  const date = new Date(Date.now() + offsetMs);
  try { return toDateTimeLocal(date, timeZone); } catch { return toDateTimeLocal(date); }
}

export function MemoryComposer({ babyId, now, birth, babyName, timeZone, initialMilestone = "", openOnMount = false }: { initialMilestone?: string; openOnMount?: boolean; babyId: string; now: string; birth: string; babyName: string; timeZone?: string }) {
  const [milestone, setMilestone] = useState(initialMilestone);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [letter, setLetter] = useState("");
  const [day, setDay] = useState(now);
  const dayEdited = useRef(false);
  // Only a picker hint (the form is validated in code): the end of "today" never goes stale mid-day.
  const [maxDay, setMaxDay] = useState(`${now.slice(0, 10)}T23:59`);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [frame, setFrame] = useState("blossom");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const selection = useRef(0);
  const [recording, setRecording] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mounted = useRef(true);
  const [state, action, pending] = useActionState(async (previous: SaveState, data: FormData): Promise<SaveState> => {
    try {
      const result = await saveMemoryAction(previous, data);
      if (result.saved) {
        selection.current++;
        setFile(null); setPreview(""); setTitle(""); setLetter(""); setProcessing(false);
        dayEdited.current = false; setDay(localNow(timeZone));
        clearFileInputs();
        dialog.current?.close();
      }
      return result;
    } catch (reason) {
      // Let Next handle redirects (e.g. an expired session sends the user to /login).
      unstable_rethrow(reason);
      console.error("Could not save memory", reason);
      // A failed request (network, body too large, new deployment) must not crash the page or leave the dialog stuck.
      return { error: typeof navigator !== "undefined" && navigator.onLine === false ? OFFLINE_MESSAGE : MEMORY_SAVE_FAILED };
    }
  }, {});
  // An error from an earlier attempt is hidden once the dialog is reopened.
  const [dismissed, setDismissed] = useState<SaveState | null>(null);
  const serverError = state === dismissed ? undefined : state.error;
  useEffect(() => { if (openOnMount && !dialog.current?.open) dialog.current?.showModal(); }, [openOnMount]);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; streamRef.current?.getTracks().forEach(t => t.stop()); }; }, []);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function clearFileInputs() {
    if (fileInput.current) fileInput.current.value = "";
    if (cameraInput.current) cameraInput.current.value = "";
  }
  function openComposer() {
    const current = localNow(timeZone);
    setMaxDay(`${current.slice(0, 10)}T23:59`);
    // A page left open for hours would otherwise date the letter when the page was loaded.
    if (!dayEdited.current) setDay(current);
    setError("");
    setDismissed(state);
    if (!dialog.current?.open) dialog.current?.showModal();
  }
  function showFile(next: File) {
    setFile(next);
    setPreview(URL.createObjectURL(next));
  }
  async function selectFile(next: File | null) {
    const token = ++selection.current;
    setError("");
    setProcessing(false);
    if (!next) { setFile(null); setPreview(""); return; }
    const kind = memoryMediaKind(next);
    if (!kind) { setError(MEMORY_MEDIA_UNSUPPORTED); clearFileInputs(); return; }
    if (kind === "video") {
      if (next.size > MAX_MEMORY_MEDIA) { setError(MEMORY_VIDEO_TOO_LARGE); clearFileInputs(); return; }
      const type = memoryVideoType(next);
      showFile(type === next.type ? next : new File([next], next.name || "video", { type, lastModified: next.lastModified }));
      return;
    }
    // Phone photos (often 3–8 MB, sometimes HEIC) are shrunk on the device so they fit the upload limit.
    setProcessing(true);
    try {
      const compressed = await compressImageFile(next);
      if (token !== selection.current || !mounted.current) return;
      if (compressed.size > MAX_MEMORY_MEDIA) throw new ImageCompressionError("Không thể nén ảnh đủ nhỏ. Hãy chọn ảnh khác.");
      showFile(compressed);
    } catch (reason) {
      if (token !== selection.current || !mounted.current) return;
      setError(reason instanceof ImageCompressionError ? reason.message : "Không thể xử lý ảnh này. Hãy chọn ảnh khác.");
      clearFileInputs();
    } finally {
      if (token === selection.current && mounted.current) setProcessing(false);
    }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    // Validated in code (noValidate) so every problem shows inside the dialog, including on iOS.
    event.preventDefault();
    if (pending) return;
    setError("");
    setDismissed(null);
    if (processing) { setError("Ảnh đang được thu nhỏ, chờ một chút rồi cất thư nhé."); return; }
    if (!title.trim()) { setError("Hãy đặt tên cho khoảnh khắc này nhé."); titleInput.current?.focus(); return; }
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(day)) { setError("Hãy chọn ngày lưu dấu."); return; }
    if (day.slice(0, 16) > localNow(timeZone, FUTURE_GRACE_MS)) { setError("Ngày lưu dấu không thể ở tương lai."); return; }
    if (!letter.trim() && !file) { setError("Thêm ảnh/video hoặc viết một lời nhắn cho con nhé."); return; }
    if (file && file.size > MAX_MEMORY_MEDIA) { setError(MEMORY_VIDEO_TOO_LARGE); return; }
    const data = new FormData(event.currentTarget);
    if (file) data.set("media", file);
    startTransition(() => action(data));
  }
  async function boomerang() {
    setError(""); setRecording(true);
    let stream: MediaStream | undefined;
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) throw new Error("Trình duyệt chưa hỗ trợ quay. Bạn có thể chọn video từ máy.");
      stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 640, facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      if (!mounted.current) return;
      const player = video.current!; player.srcObject = stream; await player.play();
      const canvas = document.createElement("canvas"); canvas.width = 480; canvas.height = 480;
      const ctx = canvas.getContext("2d")!;
      const frames: ImageData[] = [];
      for (let i = 0; i < 20 && mounted.current; i++) {
        const side = Math.min(player.videoWidth, player.videoHeight);
        ctx.drawImage(player, (player.videoWidth-side)/2, (player.videoHeight-side)/2, side, side, 0, 0, 480, 480);
        frames.push(ctx.getImageData(0, 0, 480, 480));
        await new Promise(r => setTimeout(r, 75));
      }
      if (!mounted.current) return;
      const output = canvas.captureStream(14);
      try {
        const mime = ["video/webm", "video/mp4"].find(m => MediaRecorder.isTypeSupported(m));
        if (!mime) throw new Error("Không hỗ trợ định dạng quay. Hãy chọn video có sẵn.");
        const recorder = new MediaRecorder(output, { mimeType: mime, videoBitsPerSecond: 1500000 });
        const chunks: Blob[] = [];
        const done = new Promise<Blob>((resolve, reject) => { recorder.ondataavailable = e => { if(e.data.size) chunks.push(e.data); }; recorder.onstop = () => resolve(new Blob(chunks, { type: mime })); recorder.onerror = () => reject(new Error("Không thể lưu đoạn quay.")); });
        recorder.start();
        for (const image of [...frames, ...frames.slice(1,-1).reverse()]) { ctx.putImageData(image, 0, 0); await new Promise(r => setTimeout(r, 75)); }
        recorder.stop(); const blob = await done;
        if (mounted.current) await selectFile(new File([blob], `boomerang.${mime === "video/mp4" ? "mp4" : "webm"}`, { type: mime }));
      } finally { output.getTracks().forEach(t => t.stop()); }
    } catch (e) { if (mounted.current) setError(e instanceof Error && e.name !== "NotAllowedError" ? e.message : "Chưa có quyền camera. Hãy cấp quyền hoặc chọn ảnh/video từ máy."); }
    finally { stream?.getTracks().forEach(t => t.stop()); streamRef.current = null; if (mounted.current) setRecording(false); }
  }
  const busy = pending || recording || processing;
  const message = error || serverError;
  const field = "mt-2 block w-full rounded-2xl border bg-card p-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10";
  return <>
    <button type="button" onClick={openComposer} className="memory-create-button"><MailPlus className="size-5" />Tạo thư mới<span className="ml-auto text-lg font-normal opacity-70">＋</span></button>
    {state.saved && state !== dismissed && <p role="status" className="mt-3 text-center text-sm text-primary">Đã cất kỷ niệm vào phong bì của con.</p>}
    <dialog ref={dialog} aria-labelledby="memory-composer-title" className="memory-composer" onCancel={e => { if (pending || recording) e.preventDefault(); }}>
      <header className="memory-composer-header"><div><p className="text-xs font-medium uppercase tracking-widest text-primary">Hộp thư cho {babyName}</p><h2 id="memory-composer-title" className="mt-1 text-xl font-semibold">Một lá thư mới</h2></div><button type="button" disabled={pending || recording} onClick={() => dialog.current?.close()} aria-label="Đóng thư mới" className="flex size-11 items-center justify-center rounded-full border bg-card disabled:opacity-40"><X className="size-5" /></button></header>
      <form noValidate onSubmit={submit} className="memory-composer-form">
        <input type="hidden" name="babyId" value={babyId} />
        <div className="memory-composer-visual">
          <p className="mb-6 text-center text-sm text-muted-foreground">Mỗi ngày bên con, một chiếc tem thương nhớ.</p>
          <div className="mx-auto w-full max-w-[310px] -rotate-2"><MemoryStamp frame={frame} title={title} caption={`${babyName} · ${memoryAge(birth, day).label}`} src={file ? preview : undefined} mime={file?.type} /></div>
          <p className="mb-3 mt-7 text-center text-xs text-muted-foreground">Chọn khung yêu thích cho khoảnh khắc của con</p>
          <fieldset><legend className="sr-only">Chọn khung tem</legend><div className="memory-frame-options">{MEMORY_FRAMES.map(f => <label key={f.key} className={`memory-frame-option ${frame === f.key ? "is-selected" : ""}`}><input type="radio" name="frame" value={f.key} checked={frame === f.key} onChange={() => setFrame(f.key)} className="sr-only" /><span className="memory-frame-swatch" data-frame={f.key}>{f.emoji}</span><span className="mt-2 block text-xs leading-4">{f.name}</span></label>)}</div></fieldset>
          <div className="mt-5 grid grid-cols-3 items-start gap-3 text-center">
            <button type="button" disabled={busy} onClick={() => fileInput.current?.click()} className="memory-camera-option"><span><Images className="size-5" /></span>Thư viện</button>
            <label className="memory-camera-option cursor-pointer"><span className="memory-shutter"><Camera className="size-6" /></span>Chụp ảnh<input ref={cameraInput} type="file" aria-label="Chụp ảnh" accept="image/jpeg,image/png,image/webp" capture="environment" className="sr-only" disabled={busy} onChange={e => void selectFile(e.target.files?.[0] ?? null)} /></label>
            <button type="button" disabled={busy} onClick={boomerang} className="memory-camera-option"><span><Repeat2 className="size-5" /></span>{recording ? "Đang quay…" : "Boomerang"}</button>
          </div>
          <input ref={fileInput} aria-label="Chọn ảnh hoặc video kỷ niệm" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm" className="sr-only" onChange={e => void selectFile(e.target.files?.[0] ?? null)} />
          <video ref={video} muted playsInline className={recording ? "mx-auto mt-4 aspect-square w-full max-w-xs rounded-2xl object-cover" : "hidden"} />
          {processing && <p role="status" className="mt-3 text-center text-xs text-primary">Đang thu nhỏ ảnh…</p>}
          {file && !processing && <button type="button" disabled={pending} onClick={() => { void selectFile(null); clearFileInputs(); }} className="mt-3 min-h-11 w-full text-center text-xs text-muted-foreground underline">Bỏ ảnh/video đã chọn</button>}
          <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">Ảnh JPG, PNG, WebP được tự thu nhỏ trước khi gửi · Video MP4, MOV, WebM tối đa 4 MB<br />Boomerang quay 1,5 giây, tạo vòng lặp xuôi và ngược.</p>
        </div>
        <div className="memory-composer-letter">
          <div className="mb-6 flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary"><Heart className="size-4" /></span><div><h3 className="font-semibold">Đôi dòng gửi con</h3><p className="mt-1 text-xs text-muted-foreground">Để mai này, con biết mình được yêu thế nào.</p></div></div>
          <label className="block text-sm font-medium">Tên khoảnh khắc<input ref={titleInput} className={field} name="title" required maxLength={120} value={title} onChange={e => setTitle(e.target.value)} placeholder="Lần đầu con cười với mẹ…" /></label>
          <label className="mt-5 block text-sm font-medium">Gắn mốc phát triển <span className="font-normal text-muted-foreground">(tùy chọn)</span><select name="milestoneKey" value={milestone} onChange={e => setMilestone(e.target.value)} className={field}><option value="">Không gắn mốc</option>{["Cột mốc", "Khoảnh khắc", "Thai kỳ"].map(group => <optgroup key={group} label={group}>{MILESTONES.filter(m => m.group === group).map(m => <option key={m.key} value={m.key}>{m.icon} {m.title}</option>)}</optgroup>)}</select></label>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">Tag giúp tìm lại kỷ niệm; không tự đánh dấu con đã đạt mốc.</p>
          <label className="mt-5 block text-sm font-medium">Ngày lưu dấu<input className={field} type="datetime-local" name="occurredAt" required value={day} onChange={e => { dayEdited.current = true; setDay(e.target.value); }} max={maxDay} /></label>
          <label className="mt-5 block text-sm font-medium">Thư tay gửi con<textarea name="letter" maxLength={6000} rows={7} value={letter} onChange={e => setLetter(e.target.value)} className={`${field} memory-letter-paper font-serif leading-8`} placeholder="Con yêu, hôm nay…" /></label>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">Chỉ một lá thư cũng đủ làm nên kỷ niệm. Ảnh và video là tùy chọn.</p>
          {message && <p role="alert" className="mt-4 text-sm text-destructive">{message}</p>}
          <button type="submit" disabled={busy} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/15 disabled:opacity-50"><MailPlus className="size-4" />{pending ? "Đang cất kỷ niệm…" : processing ? "Đang thu nhỏ ảnh…" : "Cất vào hộp thư của con"}</button>
        </div>
      </form>
    </dialog>
  </>;
}
