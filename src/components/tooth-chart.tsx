"use client";

import type { ToothPosition } from "@prisma/client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { deleteToothAction, saveToothAction } from "@/app/actions";
import { FormActionBar } from "@/components/form-action-bar";
import { LocalizedDateField } from "@/components/localized-date-field";
import { Textarea } from "@/components/ui/textarea";
import { ARCH_LAYOUT, ARCH_VIEWBOX, gumPath, type ArchTooth, type ToothShape } from "@/features/teeth/arch-layout";
import {
  monthsBetween,
  TOOTH_ERUPTION_INFO,
  toothSide,
  toothStatus,
  toothTypeLabelKey,
  type ToothStatus,
} from "@/features/teeth/teeth";
import { formatDateInputDisplay } from "@/lib/date";
import { asFormAction } from "@/lib/form-action";
import { cn } from "@/lib/utils";

export type ToothLabels = {
  centralIncisor: string;
  lateralIncisor: string;
  canine: string;
  firstMolar: string;
  secondMolar: string;
  upperJaw: string;
  lowerJaw: string;
  babyRight: string;
  babyLeft: string;
  primaryTooth: string;
  expectedEruption: string;
  monthShort: string;
  erupted: string;
  notErupted: string;
  eruptedAt: string;
  clearTooth: string;
  notes: string;
  close: string;
};

export type ToothRecordView = {
  id: string;
  position: ToothPosition;
  /** yyyy-mm-dd */
  eruptedAt: string;
  notes: string;
};

const { width: VIEW_W, height: VIEW_H } = ARCH_VIEWBOX;
/** Square hit area of each tooth, in viewBox units. */
const HIT_SIZE = 40;
/** Distance between a tooth's centre and the bubble edge, in viewBox units. */
const BUBBLE_OFFSET = 24;
const BUBBLE_WIDTH = 304;
const TOOTH_PATH = "/tracking/teeth";

// Rounded so the server and browser serialise identical style strings.
const pct = (value: number, total: number) => `${Math.round((value / total) * 100_000) / 1000}%`;

// ─── Tooth drawing (seen from above, local +y points to the tongue) ──────────

function toothOutline(shape: ToothShape, w: number, d: number) {
  const hw = w / 2;
  const hd = d / 2;
  if (shape === "molar") {
    return `M ${-hw} ${-hd * 0.2}
      C ${-hw} ${-hd * 0.95} ${-hw * 0.6} ${-hd * 1.05} 0 ${-hd}
      C ${hw * 0.6} ${-hd * 1.05} ${hw} ${-hd * 0.95} ${hw} ${-hd * 0.2}
      C ${hw} ${hd * 0.75} ${hw * 0.65} ${hd} 0 ${hd}
      C ${-hw * 0.65} ${hd} ${-hw} ${hd * 0.75} ${-hw} ${-hd * 0.2} Z`;
  }
  if (shape === "canine") {
    return `M 0 ${-hd * 1.05}
      C ${hw * 0.45} ${-hd * 1.02} ${hw} ${-hd * 0.45} ${hw} ${hd * 0.05}
      C ${hw} ${hd * 0.7} ${hw * 0.45} ${hd} 0 ${hd}
      C ${-hw * 0.45} ${hd} ${-hw} ${hd * 0.7} ${-hw} ${hd * 0.05}
      C ${-hw} ${-hd * 0.45} ${-hw * 0.45} ${-hd * 1.02} 0 ${-hd * 1.05} Z`;
  }
  return `M ${-hw} ${hd * 0.05}
    C ${-hw} ${-hd * 1.25} ${hw} ${-hd * 1.25} ${hw} ${hd * 0.05}
    C ${hw} ${hd * 0.85} ${hw * 0.3} ${hd} 0 ${hd}
    C ${-hw * 0.3} ${hd} ${-hw} ${hd * 0.85} ${-hw} ${hd * 0.05} Z`;
}

function toothGrooves(shape: ToothShape, w: number, d: number) {
  const hw = w / 2;
  const hd = d / 2;
  if (shape === "molar") {
    return `M ${-hw * 0.55} ${-hd * 0.05} Q 0 ${hd * 0.35} ${hw * 0.55} ${-hd * 0.05}
      M ${-hw * 0.12} ${-hd * 0.62} Q ${-hw * 0.05} ${-hd * 0.2} ${-hw * 0.12} ${hd * 0.15}
      M ${hw * 0.2} ${hd * 0.12} Q ${hw * 0.12} ${hd * 0.45} ${hw * 0.2} ${hd * 0.68}`;
  }
  if (shape === "canine") {
    return `M 0 ${-hd * 0.55} L 0 ${hd * 0.35}`;
  }
  return `M ${-hw * 0.55} ${-hd * 0.25} Q 0 ${-hd * 0.55} ${hw * 0.55} ${-hd * 0.25}`;
}

function ToothGlyph({
  shape,
  width,
  depth,
  status,
  active,
}: {
  shape: ToothShape;
  width: number;
  depth: number;
  status: ToothStatus;
  active: boolean;
}) {
  const outline = toothOutline(shape, width, depth);
  if (status === "erupted") {
    return (
      <>
        <path d={outline} transform="translate(0 2)" className="fill-rose-900/15 dark:fill-black/40" />
        <path
          d={outline}
          fill="url(#tooth-enamel)"
          strokeWidth={active ? 2.6 : 1.2}
          className={active ? "stroke-sky-500" : "stroke-[#dccdae] dark:stroke-[#c9b896]"}
        />
        <path
          d={toothGrooves(shape, width, depth)}
          fill="none"
          strokeWidth={1.1}
          strokeLinecap="round"
          className="stroke-[#e2d5bb]"
        />
        <ellipse cx={-width * 0.18} cy={-depth * 0.2} rx={width * 0.14} ry={depth * 0.1} className="fill-white" opacity={0.95} />
      </>
    );
  }
  return (
    <path
      d={outline}
      strokeWidth={active ? 2.4 : 1.4}
      strokeDasharray={active ? undefined : "3.5 2.5"}
      strokeLinecap="round"
      className={cn(
        active
          ? "fill-sky-50/90 stroke-sky-500 dark:fill-sky-950/70"
          : status === "due"
            ? "fill-amber-50/80 stroke-amber-400 dark:fill-amber-950/40 dark:stroke-amber-500"
            : "fill-white/45 stroke-rose-300 dark:fill-white/5 dark:stroke-rose-800",
      )}
    />
  );
}

/** Rendered once by the backdrop; every tooth glyph on the page references it. */
function SharedDefs() {
  return (
    <defs>
      <radialGradient id="tooth-enamel" cx="38%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="55%" stopColor="#fdf9f0" />
        <stop offset="100%" stopColor="#eee3cb" />
      </radialGradient>
    </defs>
  );
}

// ─── Gum arches ──────────────────────────────────────────────────────────────

function MouthBackdrop({ upperCount, lowerCount, labels }: { upperCount: number; lowerCount: number; labels: ToothLabels }) {
  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="absolute inset-0 size-full" aria-hidden="true">
      <SharedDefs />
      {(["upper", "lower"] as const).map((jaw) => (
        <g key={jaw} fill="none" strokeLinecap="round">
          <path d={gumPath(jaw)} strokeWidth={58} className="stroke-pink-200/90 dark:stroke-[#4a2034]" />
          <path d={gumPath(jaw)} strokeWidth={40} className="stroke-pink-100 dark:stroke-[#5a2840]" />
        </g>
      ))}
      <g textAnchor="middle">
        <text x={VIEW_W / 2} y={112} className="fill-pink-400 text-[11px] font-semibold dark:fill-pink-300/80">
          {labels.upperJaw}
        </text>
        <text x={VIEW_W / 2} y={140} className="fill-foreground text-[24px] font-bold tabular-nums">
          {upperCount}
          <tspan className="fill-muted-foreground text-[13px] font-medium">/10</tspan>
        </text>
        <text x={VIEW_W / 2} y={302} className="fill-foreground text-[24px] font-bold tabular-nums">
          {lowerCount}
          <tspan className="fill-muted-foreground text-[13px] font-medium">/10</tspan>
        </text>
        <text x={VIEW_W / 2} y={322} className="fill-pink-400 text-[11px] font-semibold dark:fill-pink-300/80">
          {labels.lowerJaw}
        </text>
      </g>
    </svg>
  );
}

// ─── Clickable tooth ─────────────────────────────────────────────────────────

function ToothButton({
  tooth,
  status,
  active,
  labels,
  onSelect,
}: {
  tooth: ArchTooth;
  status: ToothStatus;
  active: boolean;
  labels: ToothLabels;
  onSelect: (event: MouseEvent<HTMLAnchorElement>, position: ToothPosition) => void;
}) {
  const info = TOOTH_ERUPTION_INFO[tooth.position];
  const typeLabel = labels[toothTypeLabelKey(tooth.position)];
  const stateLabel = status === "erupted" ? labels.erupted : labels.notErupted;
  return (
    <Link
      href={`${TOOTH_PATH}?position=${tooth.position}#record-edit-form`}
      replace
      scroll={false}
      data-tooth={tooth.position}
      aria-current={active ? "true" : undefined}
      aria-label={`${labels.primaryTooth} ${info.fdiNumber}, ${typeLabel}, ${labels.expectedEruption} ${info.expectedMonths[0]}–${info.expectedMonths[1]} ${labels.monthShort}, ${stateLabel}`}
      onClick={(event) => onSelect(event, tooth.position)}
      className={cn(
        "group absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none",
        "focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-pink-100",
        active && "z-20",
      )}
      style={{
        left: pct(tooth.x, VIEW_W),
        top: pct(tooth.y, VIEW_H),
        width: pct(HIT_SIZE, VIEW_W),
        height: pct(HIT_SIZE, VIEW_H),
      }}
    >
      <svg
        viewBox={`${-HIT_SIZE / 2} ${-HIT_SIZE / 2} ${HIT_SIZE} ${HIT_SIZE}`}
        className={cn(
          "size-full overflow-visible transition-transform duration-200 ease-out motion-reduce:transition-none",
          "group-hover:scale-110 group-active:scale-95",
          active && "scale-115 drop-shadow-[0_0_8px_rgba(14,165,233,0.55)]",
        )}
        aria-hidden="true"
      >
        <g transform={`rotate(${tooth.angle})`}>
          <ToothGlyph shape={tooth.shape} width={tooth.width} depth={tooth.depth} status={status} active={active} />
        </g>
      </svg>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 grid place-items-center text-[9px] font-bold tabular-nums",
          status === "erupted"
            ? "text-stone-500 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            : status === "due"
              ? "text-amber-600 dark:text-amber-400"
              : "text-rose-400 dark:text-rose-500",
          active && "text-sky-600 opacity-100 dark:text-sky-300",
        )}
      >
        {info.fdiNumber}
      </span>
      {status === "due" && !active && (
        <span aria-hidden="true" className="pointer-events-none absolute right-0.5 top-0.5 flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-70 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-amber-400" />
        </span>
      )}
    </Link>
  );
}

// ─── Bubble ──────────────────────────────────────────────────────────────────

function formatDay(iso: string) {
  return formatDateInputDisplay(iso);
}

function ToothBubble({
  tooth,
  record,
  status,
  babyId,
  birthDate,
  today,
  yesterday,
  ageMonths,
  labels,
  revealKey,
  onClose,
}: {
  tooth: ArchTooth;
  record?: ToothRecordView;
  status: ToothStatus;
  babyId: string;
  birthDate: string;
  today: string;
  yesterday: string;
  ageMonths: number;
  labels: ToothLabels;
  revealKey: number;
  onClose: () => void;
}) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [date, setDate] = useState(record?.eruptedAt ?? today);
  const info = TOOTH_ERUPTION_INFO[tooth.position];
  const typeLabel = labels[toothTypeLabelKey(tooth.position)];
  const [from, to] = info.expectedMonths;
  const opensBelow = tooth.jaw === "upper";
  const xPct = pct(tooth.x, VIEW_W);

  // Bring the bubble into view without jumping when it is already visible.
  useEffect(() => {
    const element = bubbleRef.current;
    if (!element) return;
    const frame = requestAnimationFrame(() => {
      element.focus({ preventScroll: true });
      const rect = element.getBoundingClientRect();
      const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
      const top = Math.max(header, 0) + 12;
      const bottom = window.innerHeight - 96;
      if (rect.top >= top && rect.bottom <= bottom) return;
      const room = bottom - top;
      const target = rect.height >= room ? top : top + (room - rect.height) / 2;
      window.scrollBy({
        top: rect.top - target,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [revealKey]);

  const anchor = opensBelow
    ? { top: pct(tooth.y + BUBBLE_OFFSET, VIEW_H) }
    : { bottom: pct(VIEW_H - tooth.y + BUBBLE_OFFSET, VIEW_H) };

  let statusLine;
  if (record) {
    statusLine = (
      <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-500 text-[11px] font-bold text-white">✓</span>
        <span>
          Mọc ngày <strong>{formatDay(record.eruptedAt)}</strong>
          {" · lúc bé "}
          <strong className="whitespace-nowrap">{monthsBetween(birthDate, record.eruptedAt)} {labels.monthShort}</strong>
        </span>
      </div>
    );
  } else if (status === "due") {
    statusLine = (
      <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/50 dark:text-amber-100">
        <span className="relative flex size-2.5 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-70 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2.5 rounded-full bg-amber-400" />
        </span>
        <span>
          {ageMonths <= to ? "Đang trong độ tuổi mọc" : "Đã qua mốc thường gặp, mỗi bé một khác"}
          {" · bé "}
          <strong className="whitespace-nowrap">{ageMonths} {labels.monthShort}</strong>
        </span>
      </div>
    );
  } else {
    statusLine = (
      <div className="flex items-center gap-2 rounded-2xl bg-muted/70 px-3 py-2 text-xs text-muted-foreground">
        <span className="size-2.5 shrink-0 rounded-full bg-rose-300 dark:bg-rose-700" />
        <span>
          Chưa đến tuổi mọc · còn khoảng <strong className="whitespace-nowrap text-foreground">{from - ageMonths} {labels.monthShort}</strong>
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Tail pointing at the tooth */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute z-40 size-4 -translate-x-1/2 rotate-45 border-sky-200 bg-card dark:border-sky-800",
          opensBelow ? "border-l border-t" : "border-b border-r",
        )}
        style={
          opensBelow
            ? { left: xPct, top: `calc(${pct(tooth.y + BUBBLE_OFFSET, VIEW_H)} - 7px)` }
            : { left: xPct, bottom: `calc(${pct(VIEW_H - tooth.y + BUBBLE_OFFSET, VIEW_H)} - 7px)` }
        }
      />
      <div
        ref={bubbleRef}
        id="record-edit-form"
        data-edit-record={tooth.position}
        data-tooth-bubble
        tabIndex={-1}
        role="dialog"
        aria-label={`${labels.primaryTooth} ${info.fdiNumber} · ${typeLabel}`}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            onClose();
          }
        }}
        className={cn(
          "absolute z-30 rounded-[28px] border border-sky-200 bg-card p-4 text-card-foreground outline-none",
          "shadow-[0_24px_60px_-18px_rgba(14,116,144,0.45),0_8px_20px_-10px_rgba(15,23,42,0.18)] dark:border-sky-800",
          "animate-in fade-in-0 zoom-in-95 duration-200 motion-reduce:animate-none",
          opensBelow ? "origin-top" : "origin-bottom",
        )}
        style={{
          ...anchor,
          width: `min(${BUBBLE_WIDTH}px, 100%)`,
          left: `clamp(0px, calc(${xPct} - ${BUBBLE_WIDTH / 2}px), calc(100% - ${BUBBLE_WIDTH}px))`,
        }}
      >
        <div className="flex items-start gap-3">
          <div className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-50 ring-1 ring-pink-200/80 dark:from-[#4a2034] dark:to-[#3a1828] dark:ring-pink-900/60">
            <svg viewBox="-22 -22 44 44" className="size-9 overflow-visible" aria-hidden="true">
              <ToothGlyph shape={tooth.shape} width={tooth.width * 0.9} depth={tooth.depth * 0.9} status={status} active={status !== "erupted"} />
            </svg>
            <span className="absolute -bottom-1.5 -right-1.5 rounded-full bg-sky-700 px-1.5 py-px text-[10px] font-bold tabular-nums text-white shadow-sm">
              {info.fdiNumber}
            </span>
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-base font-semibold leading-tight">{typeLabel}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {tooth.jaw === "upper" ? labels.upperJaw : labels.lowerJaw}
              {" · "}
              {toothSide(tooth.position) === "right" ? labels.babyRight.toLowerCase() : labels.babyLeft.toLowerCase()}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Thường mọc: <strong className="whitespace-nowrap text-foreground">{from}–{to} {labels.monthShort}</strong>
              <span className="mx-1 text-border">•</span><span className="whitespace-nowrap">thứ tự #{info.eruptionOrder}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="-mr-1 -mt-1 grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-3">{statusLine}</div>

        <form id="tooth-form" action={asFormAction(saveToothAction)} className="mt-3 space-y-2.5">
          <input type="hidden" name="babyId" value={babyId} />
          <input type="hidden" name="position" value={tooth.position} />
          <div className="relative">
            <LocalizedDateField
              type="date"
              name="eruptedAt"
              label={labels.eruptedAt}
              required
              max={today}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <div className="absolute right-0 top-0 flex gap-1">
              {[
                { label: "Hôm nay", value: today },
                { label: "Hôm qua", value: yesterday },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={date === option.value}
                  onClick={() => setDate(option.value)}
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                    date === option.value
                      ? "bg-sky-700 text-white"
                      : "bg-muted text-muted-foreground hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-950 dark:hover:text-sky-300",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <Textarea
            name="notes"
            aria-label={labels.notes}
            placeholder={`${labels.notes} (không bắt buộc)`}
            defaultValue={record?.notes ?? ""}
            rows={1}
            className="min-h-11 w-full resize-none rounded-xl bg-background text-sm"
          />
        </form>

        <FormActionBar
          formId="tooth-form"
          saveAction={saveToothAction}
          saveLabel={record ? "Cập nhật" : "Đánh dấu đã mọc"}
          deleteAction={record ? deleteToothAction : undefined}
          deleteId={record?.id}
          deleteLabel={labels.clearTooth}
          className="mt-3 border-0 bg-transparent p-0 shadow-none"
        />
      </div>
    </>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function ToothChart({
  babyId,
  birthDate,
  today,
  yesterday,
  records,
  labels,
}: {
  babyId: string;
  /** yyyy-mm-dd */
  birthDate: string;
  /** yyyy-mm-dd in the user's timezone */
  today: string;
  yesterday: string;
  records: ToothRecordView[];
  labels: ToothLabels;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = searchParams.get("position");
  const selected = ARCH_LAYOUT.find((tooth) => tooth.position === requested);
  const [revealKey, setRevealKey] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);

  const byPosition = new Map(records.map((record) => [record.position, record]));
  const ageMonths = monthsBetween(birthDate, today);
  const statusOf = (position: ToothPosition) => toothStatus(position, byPosition.has(position), ageMonths);
  const upperCount = records.filter((record) => record.position.startsWith("UPPER_")).length;
  const lowerCount = records.length - upperCount;

  function close() {
    const tooth = selected?.position;
    window.history.replaceState(null, "", pathname);
    if (tooth) chartRef.current?.querySelector<HTMLElement>(`[data-tooth="${tooth}"]`)?.focus({ preventScroll: true });
  }

  function select(event: MouseEvent<HTMLAnchorElement>, position: ToothPosition) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (position === selected?.position) {
      close();
      return;
    }
    window.history.replaceState(null, "", `${pathname}?position=${position}`);
    setRevealKey((key) => key + 1);
  }

  // Tapping anywhere outside the bubble (other than another tooth) closes it.
  useEffect(() => {
    if (!selected) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Element | null;
      if (!target?.closest || target.closest("[data-tooth-bubble],[data-tooth]")) return;
      window.history.replaceState(null, "", pathname);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") window.history.replaceState(null, "", pathname);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selected, pathname]);

  return (
    <div className="select-none">
      <div className="mx-auto mb-1 flex max-w-[420px] justify-between px-1 text-[10px] font-medium text-muted-foreground">
        <span>← {labels.babyRight}</span>
        <span>{labels.babyLeft} →</span>
      </div>

      <div
        ref={chartRef}
        className="relative mx-auto w-full max-w-[420px]"
        style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
      >
        <MouthBackdrop upperCount={upperCount} lowerCount={lowerCount} labels={labels} />
        {ARCH_LAYOUT.map((tooth) => (
          <ToothButton
            key={tooth.position}
            tooth={tooth}
            status={statusOf(tooth.position)}
            active={tooth.position === selected?.position}
            labels={labels}
            onSelect={select}
          />
        ))}
        {selected && (
          <ToothBubble
            key={selected.position}
            tooth={selected}
            record={byPosition.get(selected.position)}
            status={statusOf(selected.position)}
            babyId={babyId}
            birthDate={birthDate}
            today={today}
            yesterday={yesterday}
            ageMonths={ageMonths}
            labels={labels}
            revealKey={revealKey}
            onClose={close}
          />
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
        <LegendItem status="erupted" label={labels.erupted} />
        <LegendItem status="due" label="Đến tuổi mọc" />
        <LegendItem status="waiting" label="Chưa đến tuổi" />
      </div>
    </div>
  );
}

function LegendItem({ status, label }: { status: ToothStatus; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <svg viewBox="-13 -11 26 22" className="h-4 w-5 overflow-visible" aria-hidden="true">
        <ToothGlyph shape="incisor" width={22} depth={16} status={status} active={false} />
      </svg>
      {label}
    </span>
  );
}
