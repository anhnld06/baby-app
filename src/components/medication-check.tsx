"use client";
import { useOptimistic, useState, useSyncExternalStore, useTransition } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { unstable_rethrow } from "next/navigation";
import { setMedicationTakenAction } from "@/app/health-actions";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function MedicationCheck({ scheduleId, day, time, name, taken, disabled }: { scheduleId:string; day:string; time:string; name:string; taken:boolean; disabled?:boolean }) {
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [pending,startTransition] = useTransition();
  const [checked,setChecked] = useOptimistic(taken, (_previous, next:boolean) => next);
  const [error,setError] = useState("");
  return <div className="shrink-0"><button type="button" role="checkbox" aria-checked={checked} aria-label={`${name} lúc ${time}: ${checked ? "đã dùng" : "chưa dùng"}`} disabled={!hydrated || pending || disabled} onClick={()=>{
    setError(""); startTransition(async()=>{
      setChecked(!checked);
      const form = new FormData();
      Object.entries({scheduleId,day,time,taken:String(!checked)}).forEach(([key,value])=>form.set(key,value));
      try { await setMedicationTakenAction(form); } catch (error) { unstable_rethrow(error); setError("Chưa lưu được. Thử lại."); }
    });
  }} className={`grid size-12 place-items-center rounded-[14px] border-2 transition-colors disabled:opacity-50 ${checked ? "border-violet-600 bg-violet-600 text-white" : "border-violet-200 bg-card text-violet-600 dark:border-violet-700"}`}>{pending ? <LoaderCircle className="size-5 animate-spin"/> : checked ? <Check className="size-6" strokeWidth={3}/> : <span className="sr-only">Đánh dấu đã dùng</span>}</button>{error && <p role="alert" className="mt-1 max-w-28 text-xs text-destructive">{error}</p>}</div>;
}
