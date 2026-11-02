"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export function VaccinationViewSwitch() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="flex gap-2" aria-label="Cách xem lịch tiêm">
      {[
        ["age", "Theo tuổi"],
        ["vaccine", "Theo vắc-xin"],
      ].map(([value, label]) => (
        <button
          key={value}
          type="button"
          aria-pressed={
            (params.get("view") === "vaccine" ? "vaccine" : "age") === value
          }
          onClick={() => {
            const next = new URLSearchParams(params.toString());
            next.set("view", value);
            router.replace(`${pathname}?${next}`, { scroll: false });
          }}
          className={`min-h-11 rounded-full px-4 text-sm ${(params.get("view") === "vaccine" ? "vaccine" : "age") === value ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
