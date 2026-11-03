"use client";
import { PumpingIcon, RoutineIcon, MoodIcon, MilestoneIcon } from "@/components/app-icons";
import { useState, useTransition } from "react";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { wakeBabyAction } from "@/app/journey-actions";
import { Sun, Pencil } from "lucide-react";
import { TemperatureIcon as Thermometer, MedicineIcon as Pill, BreastfeedingIcon as Baby, SleepIcon as BedDouble, DiaperIcon as Shell, BottleIcon as Milk, MealIcon as Utensils, GrowthIcon as Ruler, AssistantIcon as Bot } from "@/components/app-icons";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
const actions = [
  ["Nhiệt độ", "/tracking/temperature?new=1", Thermometer, "bg-rose-100 text-rose-700"],
  ["Thuốc", "/tracking/medication", Pill, "bg-violet-100 text-violet-700"],
  [
    "Bú mẹ",
    "/tracking/feeding?new=1&type=BREASTFEEDING",
    Baby,
    "bg-orange-100 text-orange-700",
  ],
  [
    "Giấc ngủ",
    "/tracking/sleep?new=1",
    BedDouble,
    "bg-violet-100 text-violet-700",
  ],
  [
    "Bú bình",
    "/tracking/feeding?new=1&type=BOTTLE_BREAST_MILK",
    Milk,
    "bg-teal-100 text-teal-700",
  ],
  ["Thay tã", "/tracking/diaper?new=1", Shell, "bg-teal-100 text-teal-700"],
  ["Hút sữa", "/mother/pumping", PumpingIcon, "bg-pink-100 text-pink-700"],
  ["Ăn dặm", "/baby/meals?new=1", Utensils, "bg-amber-100 text-amber-700"],
  ["Số đo", "/tracking/growth?new=1", Ruler, "bg-blue-100 text-blue-700"],
  ["Dấu hiệu", "/baby/wellbeing?new=1", MoodIcon, "bg-rose-100 text-rose-700"],
  ["Kỷ niệm", "/baby/milestones?new=1", MilestoneIcon, "bg-yellow-100 text-yellow-700"],
  ["Nếp ngày", "/baby/routine?new=1", RoutineIcon, "bg-indigo-100 text-indigo-700"],
] as const;
export function QuickLogSheet({ babyId }: { babyId?: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        aria-label="Ghi nhanh"
        className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground shadow-lg shadow-primary/25 lg:bottom-6 lg:right-8"
      >
        <Pencil className="size-4" />
        <span className="hidden sm:inline">Ghi nhanh</span>
      </DialogTrigger>
      <DialogContent className="top-auto! bottom-0! left-1/2! max-h-[85dvh] w-full! max-w-lg! translate-y-0! overflow-y-auto rounded-t-[2rem]! rounded-b-none! p-6!">
        <DialogTitle className="text-2xl font-semibold">Ghi nhanh</DialogTitle>
        <DialogDescription>
          Chọn hoạt động muốn ghi lại cho gia đình.
        </DialogDescription>
        {babyId ? (
          <div className="grid grid-cols-3 gap-3">
            <button
              disabled={pending}
              onClick={() => {
                setError("");
                startTransition(async () => {
                  try {
                    const form = new FormData();
                    form.set("babyId", babyId);
                    await wakeBabyAction(form);
                    setOpen(false);
                  } catch (error) {
                    unstable_rethrow(error);
                    setError(
                      "Chưa thể ghi thức giấc. Hãy kiểm tra kết nối và thử lại.",
                    );
                  }
                });
              }}
              className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border bg-card p-2 text-xs font-medium disabled:opacity-50"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-amber-100 text-amber-700">
                <Sun className="size-5" />
              </span>
              {pending ? "Đang lưu…" : "Thức giấc"}
            </button>
            {actions.map(([title, href, Icon, tone]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border bg-card p-2 text-center text-xs font-medium"
              >
                <span
                  className={`grid size-11 place-items-center rounded-2xl bg-secondary/70 ${tone.split(" ").filter(value => !value.startsWith("bg-")).join(" ")}`}
                >
                  <Icon aria-hidden="true" className="size-8" />
                </span>
                {title}
              </Link>
            ))}
          </div>
        ) : (
          <Link
            href="/profile/baby/new"
            onClick={() => setOpen(false)}
            className="min-h-12 text-primary"
          >
            Thêm hồ sơ bé
          </Link>
        )}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Link
          href="/assistant"
          onClick={() => setOpen(false)}
          className="flex min-h-12 items-center gap-2 rounded-2xl bg-secondary p-3 text-primary"
        >
          <Bot className="size-5" />
          Tra cứu cùng trợ lý
        </Link>
        <DialogClose className="min-h-11 text-sm text-muted-foreground">
          Đóng
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
