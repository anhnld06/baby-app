"use client";
import { useEffect, useRef, useState, type ReactNode, type SyntheticEvent } from "react";
import { CareIllustration, type CareIllustrationKind } from "@/components/care-illustration";
import { formatDuration, zonedDateTimeToUtc } from "@/lib/date";
export function RecordScene({kind,initialValues={},timeZone,children,caption,enabled=true}:{enabled?:boolean;kind:CareIllustrationKind;initialValues?:Record<string,string>;timeZone?:string;children:ReactNode;caption?:string}) {
  const host=useRef<HTMLDivElement>(null);
  const frame=useRef<number|null>(null);
  const [values,setValues]=useState(initialValues);
  const [changed,setChanged]=useState(false);
  useEffect(()=>()=>{if(frame.current!=null)cancelAnimationFrame(frame.current);},[]);
  const pendingAmount = useRef<string | null>(null);
  const fullRefresh = useRef(false);
  function refresh(event: SyntheticEvent) {
    const target = event.target;
    const amountOnly = target instanceof HTMLInputElement && (target.name === "amountMl" || target.hasAttribute("data-volume-control"));
    if (amountOnly) pendingAmount.current = target.value;
    else fullRefresh.current = true;
    // Coalesce input/change events once per frame without restarting the scheduled work.
    if (frame.current != null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const form = host.current?.querySelector("form");
      if (!form) return;
      const data: Record<string, string> = {};
      if (fullRefresh.current) for (const [key, value] of new FormData(form)) if (typeof value === "string") data[key] = value;
      if (pendingAmount.current != null) data.amountMl = pendingAmount.current;
      const replace = fullRefresh.current;
      pendingAmount.current = null;
      fullRefresh.current = false;
      setValues(previous => {
        const next = replace ? data : { ...previous, ...data };
        return Object.keys(next).length === Object.keys(previous).length && Object.keys(next).every(key => next[key] === previous[key]) ? previous : next;
      });
      setChanged(true);
    });
  }
  const actualKind=(kind==="bottle"||kind==="breast") && values.type ? values.type==="BREASTFEEDING" ? "breast" : "bottle" : kind;
  const parse=(value:string)=>timeZone ? zonedDateTimeToUtc(value,timeZone) : new Date(value);
  const minutes=(actualKind === "sleep" || actualKind === "breast") && values.startTime && values.endTime ? Math.max(0,Math.round((parse(values.endTime).getTime()-parse(values.startTime).getTime())/60000)) : null;
  const measured=(value:string|undefined)=>value!=null && value!=="" && Number.isFinite(Number(value)) ? Number(value) : null;
  const amount=measured(values.amountMl);
  const left=measured(values.leftAmountMl),right=measured(values.rightAmountMl);
  const breastMinutes=measured(values.leftBreastDuration)!=null || measured(values.rightBreastDuration)!=null ? (measured(values.leftBreastDuration)??0)+(measured(values.rightBreastDuration)??0) : minutes;
  const value=actualKind==="bottle" ? amount??"—" : actualKind==="pumping" ? left!=null||right!=null ? (left??0)+(right??0) : "—" : actualKind==="sleep" ? minutes!=null && Number.isFinite(minutes) ? formatDuration(minutes) : "—" : actualKind==="breast" ? breastMinutes!=null && Number.isFinite(breastMinutes) ? formatDuration(breastMinutes) : "—" : actualKind==="diaper" ? ({WET:"Tã ướt",STOOL:"Đi ngoài",BOTH:"Cả hai"}[values.type]??"Thay tã") : values.title || "Bữa ăn của con";
  const titles={bottle:"Bình sữa",breast:"Bú mẹ",sleep:"Giấc ngủ",pumping:"Hút sữa",diaper:"Thay tã",meal:"Ăn dặm"};
  const note=actualKind==="bottle" ? ({BOTTLE_BREAST_MILK:"Sữa mẹ",FORMULA:"Sữa công thức",MIXED:"Kết hợp"}[values.type]??"Lượng bé thực tế uống") : actualKind==="sleep" ? values.endTime ? "Thời lượng đã nhập" : "Chọn thời điểm bắt đầu và kết thúc" : actualKind==="pumping" ? "Tổng lượng đã nhập hai bên" : actualKind==="breast" ? "Thời gian bú đã nhập" : actualKind==="diaper" ? "Một lần chăm sóc, một điều nhỏ bên con" : "Ghi món ăn và quan sát sau bữa";
  if (!enabled) return <>{children}</>;
  return <div ref={host} className={`record-scene record-scene-${actualKind}`} data-record-scene={actualKind} onInputCapture={refresh} onChangeCapture={refresh} onClickCapture={refresh} onResetCapture={refresh}>
    <section className="record-scene-hero" aria-label={`Tóm tắt ${titles[actualKind].toLowerCase()}`}><p className="text-center text-sm font-semibold text-foreground/80">{titles[actualKind]}</p><div className="mx-auto mt-5 flex max-w-md items-center justify-center gap-5 py-4"><span className="record-scene-art"><CareIllustration kind={actualKind} amountMl={actualKind==="bottle" ? amount : undefined} /></span><div className="min-w-0"><p className={`font-semibold tracking-tight tabular-nums ${actualKind==="diaper"||actualKind==="meal" ? "text-2xl sm:text-3xl" : "text-5xl sm:text-6xl"}`}><span data-record-hero-value>{value}</span>{(actualKind==="bottle"||actualKind==="pumping") && <span className="ml-2 text-base font-medium">ml</span>}</p><p className="mt-4 inline-block rounded-full bg-white/75 px-3 py-1.5 text-xs font-medium text-slate-700">{note}</p>{caption&&!changed&&<p className="mt-2 text-xs text-white">{caption}</p>}</div></div><p className="care-reduced-notice text-center text-xs text-slate-700">Chế độ Giảm chuyển động của thiết bị đang tắt hiệu ứng động.</p></section>
    <div className="record-scene-body">{children}</div>
  </div>;
}
