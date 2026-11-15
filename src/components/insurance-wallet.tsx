"use client";

import { Check, Copy, Maximize2, Pencil, Phone, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ShieldIcon } from "@/components/app-icons";
import { EditRecordLink } from "@/components/edit-record-navigation";
import {
  formatPolicyNumber,
  insuranceDateKey,
  insuranceStatus,
  insuranceStatusLabel,
  insuranceTypeLabels,
  type InsuranceStatus,
  type InsuranceView,
} from "@/features/insurance/insurance-status";
import { formatDateInputDisplay } from "@/lib/date";
import { cn } from "@/lib/utils";

const themes: Record<string, string> = {
  BHYT: "from-blue-800 via-blue-700 to-sky-700",
  PRIVATE: "from-teal-800 via-teal-700 to-emerald-700",
  OTHER: "from-indigo-800 via-indigo-700 to-violet-700",
};
const expiredTheme = "from-zinc-700 via-zinc-600 to-zinc-600";

const pillStyles: Record<InsuranceStatus["kind"], string> = {
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  upcoming: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  expiring: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
  expired: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

const showDate = (date: Date | null) => (date ? formatDateInputDisplay(insuranceDateKey(date)) : null);
const typeLabel = (item: InsuranceView) => insuranceTypeLabels[item.insuranceType] ?? item.insuranceType;
const codeLabel = (item: InsuranceView) => (item.insuranceType === "BHYT" ? "Mã số BHYT" : "Số thẻ / hợp đồng");
function validityText(item: InsuranceView) {
  const from = showDate(item.validFrom);
  const until = showDate(item.validUntil);
  return from && until ? `${from} – ${until}` : until ? `Đến ${until}` : from ? `Từ ${from}` : "Chưa ghi";
}
function telHref(contact: string | null) {
  if (!contact) return null;
  const number = contact.replace(/[^\d+]/g, "");
  return number.replace(/\D/g, "").length >= 3 ? `tel:${number}` : null;
}

function StatusPill({ status }: { status: InsuranceStatus }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", pillStyles[status.kind])}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {insuranceStatusLabel(status)}
    </span>
  );
}

const cardLabel = "text-[11px] font-medium uppercase tracking-wider text-white/90";

function CardFace({ item, holderName, expired, large = false, action }: {
  item: InsuranceView; holderName: string; expired: boolean; large?: boolean; action?: ReactNode;
}) {
  const until = showDate(item.validUntil);
  const from = showDate(item.validFrom);
  const code = formatPolicyNumber(item.policyNumber);
  return (
    <div className={cn(
      "relative isolate flex aspect-[1.586/1] w-full flex-col justify-between gap-3 rounded-3xl bg-linear-to-br p-5 text-white shadow-lg",
      large && "sm:p-7",
      expired ? expiredTheme : themes[item.insuranceType] ?? themes.OTHER,
    )}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
        <span className="absolute -right-16 -top-24 size-60 rounded-full border-32 border-white/10" />
        <span className="absolute -bottom-28 right-6 size-52 rounded-full bg-white/5" />
      </div>

      <div className={cn("flex min-w-0 items-center gap-3", action && "pr-12")}>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15"><ShieldIcon className="size-6" /></span>
        <div className="min-w-0">
          {item.provider && <p className="truncate text-[11px] font-medium uppercase tracking-[0.14em] text-white/90">{item.provider}</p>}
          <p className="truncate text-base font-bold uppercase tracking-wide">{typeLabel(item)}</p>
        </div>
      </div>
      {action && <div className="absolute right-3 top-3">{action}</div>}

      <div className="min-w-0">
        <p className={cardLabel}>{codeLabel(item)}</p>
        <p className={cn(
          "mt-1 break-all font-mono font-semibold leading-tight tracking-[0.08em]",
          code.length > 20 ? "text-lg" : large ? "text-2xl sm:text-3xl" : "text-xl min-[380px]:text-2xl",
        )}>{code}</p>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className={cardLabel}>Họ và tên</p>
          <p className="truncate text-base font-bold uppercase tracking-wide">{holderName}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className={cardLabel}>{until ? "Hạn dùng" : "Hiệu lực từ"}</p>
          <p className="text-sm font-semibold">{until ?? from ?? "Chưa ghi"}</p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, children, stacked = false }: { label: string; children: ReactNode; stacked?: boolean }) {
  return (
    <div className={cn("py-3.5", stacked ? "space-y-1" : "flex items-start justify-between gap-4")}>
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className={cn("min-w-0 wrap-break-word text-sm", stacked ? "whitespace-pre-line leading-6" : "text-right font-semibold")}>{children}</dd>
    </div>
  );
}

const tileClass = "flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl bg-card px-2 py-3 text-center text-sm font-medium leading-tight shadow-sm ring-1 ring-border/50 transition-colors hover:bg-secondary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[.98]";

export function InsuranceWallet({ items, holderName, today, basePath, editingId }: {
  items: InsuranceView[]; holderName: string; today: string; basePath: string; editingId?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const initialIndex = Math.max(0, items.findIndex((item) => item.id === editingId));
  const [index, setIndex] = useState(initialIndex);
  const [copy, setCopy] = useState<{ id: string; ok: boolean } | null>(null);
  const current = items[Math.min(index, items.length - 1)];
  const status = insuranceStatus(current.validFrom, current.validUntil, today);
  const phone = telHref(current.contact);
  const copyState = copy?.id === current.id ? copy : null;

  useEffect(() => {
    const element = scroller.current;
    if (element && initialIndex > 0) element.scrollTo({ left: initialIndex * element.clientWidth, behavior: "instant" });
  }, [initialIndex]);

  const goTo = (next: number) => {
    const element = scroller.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollTo({ left: next * element.clientWidth, behavior: reduce ? "instant" : "smooth" });
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(current.policyNumber);
      setCopy({ id: current.id, ok: true });
    } catch {
      setCopy({ id: current.id, ok: false });
    }
  };

  return (
    <section aria-labelledby="insurance-wallet-title" className="mt-7 lg:grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start lg:gap-8">
      <div className="mx-auto w-full max-w-md lg:mx-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="insurance-wallet-title" className="text-lg font-semibold">Thẻ bảo hiểm</h2>
        <StatusPill status={status} />
      </div>

      <div
        ref={scroller}
        tabIndex={0}
        role="region"
        aria-label={items.length > 1 ? `${items.length} thẻ, vuốt ngang để xem thẻ khác` : "Thẻ bảo hiểm"}
        onScroll={(event) => {
          const element = event.currentTarget;
          const next = Math.min(items.length - 1, Math.round(element.scrollLeft / element.clientWidth));
          if (next !== index) setIndex(next);
        }}
        className="-mx-1 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-3xl outline-none scrollbar-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <div key={item.id} className="w-full shrink-0 snap-center px-1 pb-3 pt-1" aria-roledescription="thẻ" aria-label={`Thẻ ${i + 1}/${items.length}: ${typeLabel(item)}`}>
            <CardFace
              item={item}
              holderName={holderName}
              expired={insuranceStatus(item.validFrom, item.validUntil, today).kind === "expired"}
              action={
                <EditRecordLink href={`${basePath}?edit=${item.id}`} aria-label={`Sửa ${typeLabel(item)}`}
                  className="grid size-11 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  <Pencil className="size-4" />
                </EditRecordLink>
              }
            />
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="flex justify-center gap-1">
          {items.map((item, i) => (
            <button key={item.id} type="button" onClick={() => goTo(i)} aria-label={`Xem thẻ ${i + 1}`} aria-current={i === index ? "true" : undefined}
              className="grid h-6 place-items-center px-1 focus-visible:outline-2 focus-visible:outline-ring">
              <span className={cn("block h-1.5 rounded-full transition-all", i === index ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/40")} />
            </button>
          ))}
        </div>
      )}

      <div className={cn("mt-4 grid gap-3", phone ? "grid-cols-3" : "grid-cols-2")}>
        <button type="button" className={tileClass} onClick={() => dialog.current?.showModal()}>
          <Maximize2 className="size-5 text-primary" />Xuất trình thẻ
        </button>
        <button type="button" className={tileClass} onClick={copyCode}>
          {copyState?.ok ? <Check className="size-5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="size-5 text-primary" />}
          {copyState ? (copyState.ok ? "Đã sao chép" : "Chưa sao chép được") : "Sao chép mã"}
        </button>
        {phone && <a href={phone} className={tileClass}><Phone className="size-5 text-primary" />Gọi hotline</a>}
      </div>
      <p role="status" className="sr-only">{copyState ? (copyState.ok ? "Đã sao chép mã thẻ" : "Chưa sao chép được, hãy chọn và sao chép mã thủ công") : ""}</p>
      </div>

      <div className="mx-auto w-full min-w-0 max-w-md lg:max-w-none">
      <div className="mb-3 mt-7 flex items-baseline justify-between gap-3 lg:mt-0">
        <h3 className="text-lg font-semibold">Thông tin bảo hiểm</h3>
        {items.length > 1 && <span className="text-sm text-muted-foreground">Thẻ {index + 1}/{items.length}</span>}
      </div>
      <dl className="divide-y divide-border/70 rounded-3xl bg-card px-5 py-1 shadow-sm ring-1 ring-border/50">
        <InfoRow label="Loại bảo hiểm">{typeLabel(current)}</InfoRow>
        <InfoRow label="Giá trị sử dụng">{validityText(current)}</InfoRow>
        {current.insuranceType === "BHYT" && current.registeredCare && <InfoRow label="Nơi ĐK KCB ban đầu">{current.registeredCare}</InfoRow>}
        {current.provider && <InfoRow label="Đơn vị bảo hiểm">{current.provider}</InfoRow>}
        {current.contact && (
          <InfoRow label="Hotline / liên hệ">
            {phone ? <a href={phone} className="text-primary underline-offset-4 hover:underline">{current.contact}</a> : current.contact}
          </InfoRow>
        )}
        {current.benefits && <InfoRow stacked label="Quyền lợi chính">{current.benefits}</InfoRow>}
        {current.notes && <InfoRow stacked label="Ghi chú">{current.notes}</InfoRow>}
      </dl>
      </div>

      <dialog
        ref={dialog}
        aria-label="Xuất trình thẻ bảo hiểm"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-background p-0 text-foreground backdrop:bg-black/60"
      >
        <div className="mx-auto flex min-h-full max-w-lg flex-col gap-5 px-4 pb-6 pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-semibold">Xuất trình thẻ</p>
            <button type="button" aria-label="Đóng" autoFocus onClick={() => dialog.current?.close()}
              className="grid size-11 place-items-center rounded-full bg-secondary text-foreground focus-visible:outline-2 focus-visible:outline-ring">
              <X className="size-5" />
            </button>
          </div>
          <div><StatusPill status={status} /></div>
          <CardFace item={current} holderName={holderName} expired={status.kind === "expired"} large />
          <dl className="space-y-4 rounded-3xl bg-card p-5 shadow-sm ring-1 ring-border/50">
            <div>
              <dt className="text-sm text-muted-foreground">{codeLabel(current)}</dt>
              <dd className="mt-1 break-all font-mono text-3xl font-bold tracking-wider">{formatPolicyNumber(current.policyNumber)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Họ và tên</dt>
              <dd className="mt-1 text-xl font-semibold uppercase">{holderName}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Giá trị sử dụng</dt>
              <dd className="mt-1 text-xl font-semibold">{validityText(current)}</dd>
            </div>
            {current.insuranceType === "BHYT" && current.registeredCare && (
              <div>
                <dt className="text-sm text-muted-foreground">Nơi ĐK KCB ban đầu</dt>
                <dd className="mt-1 text-xl font-semibold">{current.registeredCare}</dd>
              </div>
            )}
          </dl>
          <p className="text-center text-sm leading-6 text-muted-foreground">Đưa màn hình này cho nhân viên y tế. Mang theo thẻ hoặc giấy tờ gốc khi được yêu cầu.</p>
        </div>
      </dialog>
    </section>
  );
}
