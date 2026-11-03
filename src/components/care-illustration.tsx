"use client";
import { useEffect, useId, useRef, useState } from "react";
import {
  BreastfeedingIcon, BottleIcon, SleepIcon, DiaperIcon, PumpingIcon, MealIcon,
  TemperatureIcon, GrowthIcon, MedicineIcon, VaccineIcon, MoodIcon,
  DevelopmentIcon, PrescriptionIcon, BabyMedicalIcon, MotherMedicalIcon, BabyInsuranceIcon, MotherInsuranceIcon, MotherVaccineIcon,
  MilestoneIcon, RoutineIcon, ToothIcon, MedicalIcon, ShieldIcon, PregnancyIcon, CycleIcon,
} from "@/components/app-icons";
export type CareIllustrationKind =
  "breast" | "bottle" | "sleep" | "diaper" | "pumping" | "meal" | "temperature" | "growth" | "medicine" | "vaccine" | "wellbeing" | "milestone" | "routine" | "tooth" | "medical" | "shield" | "pregnancy" | "cycle" | "development" | "prescription" | "babyMedical" | "motherMedical" | "babyInsurance" | "motherInsurance" | "motherVaccine";
const illustrations = {
  breast: BreastfeedingIcon, bottle: BottleIcon, sleep: SleepIcon, diaper: DiaperIcon,
  pumping: PumpingIcon, meal: MealIcon, temperature: TemperatureIcon, growth: GrowthIcon,
  medicine: MedicineIcon, vaccine: VaccineIcon, wellbeing: MoodIcon,
  milestone: MilestoneIcon, routine: RoutineIcon, tooth: ToothIcon, medical: MedicalIcon,
  development: DevelopmentIcon, prescription: PrescriptionIcon,
  babyMedical: BabyMedicalIcon, motherMedical: MotherMedicalIcon,
  babyInsurance: BabyInsuranceIcon, motherInsurance: MotherInsuranceIcon, motherVaccine: MotherVaccineIcon,
  shield: ShieldIcon, pregnancy: PregnancyIcon, cycle: CycleIcon,
} satisfies Record<CareIllustrationKind, typeof BottleIcon>;

export function CareIllustration({
  kind,
  small = false,
  amountMl,
}: {
  kind: CareIllustrationKind;
  small?: boolean;
  amountMl?: number | null;
}) {
  const id = useId().replace(/:/g, "");
  const node = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (small || !node.current) return;
    let inView = true;
    const update = () =>
      setPlaying(inView && document.visibilityState === "visible");
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting;
        update();
      },
      { threshold: 0.15 },
    );
    observer?.observe(node.current);
    const frame = requestAnimationFrame(update);
    window.addEventListener("pageshow", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("pageshow", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [small]);
  const Icon = illustrations[kind];
  const milkY = 109 - Math.max(0, Math.min(1, (amountMl ?? 0) / 300)) * 52;
  return (
    <span
      ref={node}
      aria-hidden="true"
      data-care-kind={kind}
      data-playing={playing}
      className={`care-illustration relative inline-grid shrink-0 place-items-center ${small ? "size-12" : "care-animated size-20 sm:size-24"}`}
    >
      {kind === "bottle" && amountMl !== undefined ? (
        <svg viewBox="0 0 128 128" className="app-icon size-full" fill="none" focusable="false">
          <defs><clipPath id={`${id}-bottle`}><path d="M48 51c-6 5-10 12-10 21v27a14 14 0 0 0 14 14h24a14 14 0 0 0 14-14V72c0-9-4-16-10-21Z" /></clipPath></defs>
          <g stroke="#92543C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M55 31v-8a9 9 0 0 1 18 0v8" fill="#FFDCC5"/><path d="M50 31h28l4 13H46l4-13Z" fill="#FFE8D3"/><path d="M48 51c-6 5-10 12-10 21v27a14 14 0 0 0 14 14h24a14 14 0 0 0 14-14V72c0-9-4-16-10-21" fill="#FFF8F0"/><g clipPath={`url(#${id}-bottle)`}><path d={`M34 ${milkY}q15-5 30 0t30 0v40H34Z`} fill="#FFD8B8" stroke="none" /></g><rect x="43" y="43" width="42" height="12" rx="6" fill="#EFB184"/><path d="M49 65h7m-7 9h4" strokeWidth="3"/><circle cx="55" cy="89" r="2" fill="#92543C" stroke="none"/><circle cx="74" cy="89" r="2" fill="#92543C" stroke="none"/><path d="M60 96q4 5 9 0" strokeWidth="3"/><ellipse cx="48" cy="95" rx="5" ry="3" fill="#EEA3AE" stroke="none"/><ellipse cx="81" cy="95" rx="5" ry="3" fill="#EEA3AE" stroke="none"/><path d="m97 38 4-8m-3 17 8-2" stroke="#EFB184" strokeWidth="3"/></g>
        </svg>
      ) : <Icon className="size-full" />}
    </span>
  );
}
