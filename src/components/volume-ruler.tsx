"use client";
export function VolumeRuler({value,onChange,label}:{value:string;onChange:(value:string)=>void;label:string}) {
  const max=Math.max(300,Math.ceil((Number(value)||0)/100)*100);
  return <div className="volume-ruler"><div className="mb-2 flex justify-between px-2 text-[10px] tabular-nums text-muted-foreground">{Array.from({length:7},(_,index)=><span key={index}>{Math.round(max*index/6)}</span>)}</div><div className="relative h-14"><div aria-hidden="true" className="volume-ruler-ticks absolute inset-x-2 bottom-2 h-6"/><input aria-label={label} type="range" min={0} max={max} step={5} value={value==="" ? 0 : Number(value)} onChange={event=>onChange(event.target.value)} className="volume-ruler-input absolute inset-x-0 top-0 h-14 w-full" /></div></div>;
}
