"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  LoaderCircle,
  Mic,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  saveVoiceLogAction,
  type VoiceLogActionState,
} from "@/app/voice-log-actions";
import { Field, SelectField } from "@/components/form-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { parseVoiceLog } from "@/features/voice-log/parse";
import type { VoiceLogDraft } from "@/features/voice-log/types";
import type { Locale } from "@/lib/i18n";

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionErrorLike = { error: string };

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

const initialActionState: VoiceLogActionState = { status: "idle", message: "" };

const copy = {
  vi: {
    title: "Ghi nhanh bằng giọng nói",
    description: "Nói một câu, kiểm tra lại rồi lưu vào nhật ký.",
    listening: "Đang nghe… Chạm để dừng",
    start: "Chạm để nói",
    livePlaceholder: "Hãy nói về cữ bú, giấc ngủ hoặc lần thay tã…",
    placeholder: "Ví dụ: Bé bú mẹ bên trái 10 phút",
    interpret: "Hiểu câu này",
    examples: "Thử nói: “Bé vừa ngủ” · “Thay tã ướt” · “Bé uống 90 ml sữa công thức”",
    privacy: "Trình duyệt có thể dùng dịch vụ nhận dạng giọng nói của nhà cung cấp thiết bị.",
    unsupported: "Trình duyệt này chưa hỗ trợ nhận giọng nói. Bạn vẫn có thể nhập câu bên dưới.",
    denied: "Chưa được cấp quyền dùng micro. Hãy cho phép micro trong cài đặt trình duyệt.",
    noSpeech: "Mình chưa nghe rõ. Hãy thử nói lại hoặc nhập câu bên dưới.",
    understood: "Mình đã hiểu như sau",
    feeding: "Cữ bú",
    sleep: "Giấc ngủ",
    diaper: "Thay tã",
    type: "Loại",
    startTime: "Bắt đầu",
    endTime: "Kết thúc",
    changedAt: "Thời điểm thay",
    leftMinutes: "Bên trái (phút)",
    rightMinutes: "Bên phải (phút)",
    amountMl: "Lượng sữa (ml)",
    milkType: "Loại / nhãn sữa",
    firstSide: "Bên bú trước",
    left: "Trái",
    right: "Phải",
    breastfeeding: "Bú mẹ",
    breastMilkBottle: "Sữa mẹ bằng bình",
    formula: "Sữa công thức",
    mixed: "Kết hợp",
    nap: "Ngủ ngày",
    night: "Ngủ đêm",
    wet: "Tã ướt",
    stool: "Đi ngoài",
    both: "Cả hai",
    finishFeeding: "Kết thúc cữ bú đang mở",
    finishSleep: "Kết thúc giấc ngủ đang mở",
    confirm: "Xác nhận và lưu",
    retry: "Nói lại",
    open: "Ghi nhật ký bằng giọng nói",
  },
  en: {
    title: "Quick log by voice",
    description: "Say one sentence, review it, then save it to the journal.",
    listening: "Listening… Tap to stop",
    start: "Tap to speak",
    livePlaceholder: "Say something about feeding, sleep, or a diaper change…",
    placeholder: "Example: Baby drank 90 ml of formula",
    interpret: "Interpret this",
    examples: "Try: “Baby just fell asleep” · “Wet diaper” · “Baby drank 90 ml of formula”",
    privacy: "Your browser may use the device provider's speech recognition service.",
    unsupported: "Voice recognition is not supported in this browser. You can still type below.",
    denied: "Microphone permission was not granted. Allow it in your browser settings.",
    noSpeech: "I couldn't hear that clearly. Try again or type below.",
    understood: "Here's what I understood",
    feeding: "Feeding",
    sleep: "Sleep",
    diaper: "Diaper",
    type: "Type",
    startTime: "Start",
    endTime: "End",
    changedAt: "Changed at",
    leftMinutes: "Left (minutes)",
    rightMinutes: "Right (minutes)",
    amountMl: "Milk amount (ml)",
    milkType: "Milk type / brand",
    firstSide: "First side",
    left: "Left",
    right: "Right",
    breastfeeding: "Breastfeeding",
    breastMilkBottle: "Breast milk bottle",
    formula: "Formula",
    mixed: "Mixed",
    nap: "Nap",
    night: "Night sleep",
    wet: "Wet",
    stool: "Stool",
    both: "Both",
    finishFeeding: "Finish the active feeding session",
    finishSleep: "Finish the active sleep session",
    confirm: "Confirm and save",
    retry: "Try again",
    open: "Log by voice",
  },
} as const;

function DraftFields({ draft, locale }: { draft: VoiceLogDraft; locale: Locale }) {
  const t = copy[locale];
  if (draft.kind === "feeding") {
    return (
      <>
        <input type="hidden" name="kind" value="feeding" />
        <input type="hidden" name="operation" value={draft.operation} />
        {draft.operation === "finish" ? (
          <>
            <input type="hidden" name="type" value={draft.type} />
            <div className="rounded-xl bg-orange-50 p-3 text-sm text-orange-800 dark:bg-orange-950 dark:text-orange-200">
              {t.finishFeeding}
            </div>
            <Field name="endTime" type="datetime-local" required label={t.endTime} defaultValue={draft.endTime} />
          </>
        ) : (
          <>
        <SelectField name="type" label={t.type} defaultValue={draft.type}>
          <option value="BREASTFEEDING">{t.breastfeeding}</option>
          <option value="BOTTLE_BREAST_MILK">{t.breastMilkBottle}</option>
          <option value="FORMULA">{t.formula}</option>
          <option value="MIXED">{t.mixed}</option>
        </SelectField>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="startTime" type="datetime-local" required label={t.startTime} defaultValue={draft.startTime} />
          <Field name="endTime" type="datetime-local" label={t.endTime} defaultValue={draft.endTime} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field name="leftBreastDuration" type="number" min="0" label={t.leftMinutes} defaultValue={draft.leftBreastDuration ?? ""} />
          <Field name="rightBreastDuration" type="number" min="0" label={t.rightMinutes} defaultValue={draft.rightBreastDuration ?? ""} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="amountMl" type="number" min="0" step="0.1" label={t.amountMl} defaultValue={draft.amountMl ?? ""} />
          <SelectField name="firstSide" label={t.firstSide} defaultValue={draft.firstSide ?? ""}>
            <option value="">—</option>
            <option value="LEFT">{t.left}</option>
            <option value="RIGHT">{t.right}</option>
          </SelectField>
        </div>
        <Field name="milkType" label={t.milkType} defaultValue={draft.milkType} />
          </>
        )}
      </>
    );
  }

  if (draft.kind === "sleep") {
    return (
      <>
        <input type="hidden" name="kind" value="sleep" />
        <input type="hidden" name="operation" value={draft.operation} />
        {draft.operation === "finish" ? (
          <div className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200">
            {t.finishSleep}
          </div>
        ) : (
          <>
            <SelectField name="type" label={t.type} defaultValue={draft.type}>
              <option value="NAP">{t.nap}</option>
              <option value="NIGHT">{t.night}</option>
            </SelectField>
            <Field name="startTime" type="datetime-local" required label={t.startTime} defaultValue={draft.startTime} />
          </>
        )}
        {draft.operation === "finish" && <input type="hidden" name="type" value={draft.type} />}
        {(draft.operation === "finish" || draft.operation === "complete") && (
          <Field name="endTime" type="datetime-local" required label={t.endTime} defaultValue={draft.endTime} />
        )}
      </>
    );
  }

  return (
    <>
      <input type="hidden" name="kind" value="diaper" />
      <SelectField name="type" label={t.type} defaultValue={draft.type}>
        <option value="WET">{t.wet}</option>
        <option value="STOOL">{t.stool}</option>
        <option value="BOTH">{t.both}</option>
      </SelectField>
      <Field name="changedAt" type="datetime-local" required label={t.changedAt} defaultValue={draft.changedAt} />
    </>
  );
}

export function VoiceQuickLog({ babyId, locale }: { babyId: string; locale: Locale }) {
  const t = copy[locale];
  const [open, setOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [draft, setDraft] = useState<VoiceLogDraft | null>(null);
  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [actionState, setActionState] = useState(initialActionState);
  const [pending, setPending] = useState(false);

  useEffect(
    () => () => {
      const recognition = recognitionRef.current;
      if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.stop();
      }
    },
    [],
  );

  function interpret(value = transcript) {
    setActionState(initialActionState);
    const result = parseVoiceLog(value);
    if (result.ok) {
      setDraft(result.draft);
      setMessage("");
    } else {
      setDraft(null);
      setMessage(result.message);
    }
  }

  function startListening() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setActionState(initialActionState);
      setMessage(t.unsupported);
      return;
    }

    const recognition = new Recognition();
    recognition.lang = locale === "vi" ? "vi-VN" : "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;
    let captured = "";
    let recognitionFailed = false;

    recognition.onresult = (event) => {
      captured = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();
      setTranscript(captured);
    };
    recognition.onerror = (event) => {
      recognitionFailed = true;
      setListening(false);
      setMessage(
        event.error === "not-allowed" || event.error === "service-not-allowed"
          ? t.denied
          : t.noSpeech,
      );
    };
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
      if (captured) interpret(captured);
      else if (!recognitionFailed) setMessage(t.noSpeech);
    };

    setDraft(null);
    setMessage("");
    setActionState(initialActionState);
    setTranscript("");
    setListening(true);
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setListening(false);
      setMessage(t.noSpeech);
    }
  }

  function reset() {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop();
    }
    setListening(false);
    setDraft(null);
    setTranscript("");
    setMessage("");
    setActionState(initialActionState);
  }

  async function submitVoiceLog(formData: FormData) {
    setPending(true);
    try {
      const result = await saveVoiceLogAction(initialActionState, formData);
      setActionState(result);
      if (result.status === "success") {
        setDraft(null);
        setTranscript("");
        setMessage(result.message);
      }
    } catch {
      setActionState({ status: "error", message: "Chưa thể lưu. Vui lòng thử lại." });
    } finally {
      setPending(false);
    }
  }

  const activityLabel = draft
    ? draft.kind === "feeding"
      ? t.feeding
      : draft.kind === "sleep"
        ? t.sleep
        : t.diaper
    : "";

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) reset();
      }}
    >
      <DialogTrigger
        render={
          <button
            type="button"
            className="fixed bottom-[calc(4rem+max(1rem,env(safe-area-inset-bottom)))] left-1/2 z-[45] grid h-10 w-20 -translate-x-1/2 place-items-center rounded-t-full border-x-4 border-t-4 border-background bg-primary pb-0.5 text-primary-foreground shadow-[0_-6px_18px_-8px_rgba(0,0,0,0.45)] lg:bottom-24 lg:left-[max(8rem,calc((100vw-80rem)/2+8rem))] lg:size-14 lg:rounded-full lg:border-4 lg:pb-0 lg:shadow-lg lg:shadow-primary/35"
            aria-label={t.open}
            onClick={startListening}
          />
        }
      >
        <Mic className="size-6" strokeWidth={2.5} />
        <span className="sr-only">{t.open}</span>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl p-5 sm:max-w-md">
        <DialogHeader className="pr-8">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </span>
            <div>
              <DialogTitle>{t.title}</DialogTitle>
              <DialogDescription className="mt-1">{t.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          {!draft ? (
            <>
              <div className="flex min-h-40 flex-col rounded-2xl bg-muted/45 p-4">
                <Textarea
                  value={transcript}
                  onChange={(event) => setTranscript(event.target.value)}
                  placeholder={listening ? t.livePlaceholder : t.placeholder}
                  className="min-h-24 flex-1 resize-none border-0 bg-transparent p-0 text-xl leading-relaxed shadow-none placeholder:text-muted-foreground/60 focus-visible:border-transparent focus-visible:ring-0"
                  rows={3}
                  readOnly={listening}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      interpret();
                    }
                  }}
                />
                {(message || actionState.status === "error") && (
                  <p
                    className={`mt-3 flex items-start gap-2 rounded-xl p-3 text-sm ${actionState.status === "success" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200"}`}
                    role="status"
                    aria-live="polite"
                  >
                    {actionState.status === "success" ? <Check className="mt-0.5 size-4 shrink-0" /> : <AlertCircle className="mt-0.5 size-4 shrink-0" />}
                    {message || actionState.message}
                  </p>
                )}
              </div>
              <div className="-mx-5 -mb-5 flex flex-col items-center rounded-b-3xl border-t border-border/60 bg-muted/35 px-5 pb-6 pt-5">
                <button
                  type="button"
                  onClick={startListening}
                  aria-pressed={listening}
                  aria-label={listening ? t.listening : t.start}
                  className="relative grid size-24 place-items-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
                >
                  {listening && (
                    <>
                      <span className="absolute size-24 animate-ping rounded-full bg-primary/15" />
                      <span className="absolute size-20 animate-pulse rounded-full bg-primary/20" />
                    </>
                  )}
                  <span className={`relative grid size-16 place-items-center rounded-full text-primary-foreground shadow-lg transition-colors ${listening ? "bg-primary" : "bg-primary/80"}`}>
                    <Mic className={`size-7 ${listening ? "animate-pulse" : ""}`} strokeWidth={2.4} />
                  </span>
                </button>
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  {listening ? t.listening : t.start}
                </p>
                {!listening && transcript.trim() && (
                  <Button type="button" variant="secondary" className="mt-3 rounded-xl" onClick={() => interpret()}>
                    {t.interpret}
                  </Button>
                )}
                <p className="mt-4 text-center text-xs text-muted-foreground">{t.examples}</p>
                <p className="mt-2 text-center text-[11px] text-muted-foreground/80">{t.privacy}</p>
              </div>
            </>
          ) : (
            <form action={submitVoiceLog} className="space-y-4">
              <input type="hidden" name="babyId" value={babyId} />
              <div className="flex items-center justify-between gap-3 rounded-xl bg-background/80 p-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">{t.understood}</p>
                  <p className="truncate font-semibold">{activityLabel}</p>
                  <p className="truncate text-xs text-muted-foreground">“{transcript}”</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    reset();
                    startListening();
                  }}
                >
                  <RotateCcw />
                  {t.retry}
                </Button>
              </div>
              <DraftFields draft={draft} locale={locale} />
              <Button type="submit" size="lg" className="h-12 w-full rounded-xl" disabled={pending}>
                {pending ? <LoaderCircle className="animate-spin" /> : <Check />}
                {t.confirm}
              </Button>
            </form>
          )}

          {draft && (message || actionState.status === "error") && (
            <p
              className={`flex items-start gap-2 rounded-xl p-3 text-sm ${actionState.status === "success" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200"}`}
              role="status"
              aria-live="polite"
            >
              {actionState.status === "success" ? <Check className="mt-0.5 size-4 shrink-0" /> : <AlertCircle className="mt-0.5 size-4 shrink-0" />}
              {message || actionState.message}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
