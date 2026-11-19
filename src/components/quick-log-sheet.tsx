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
// The pastel sticker artwork carries its own colours, so tiles share one neutral backdrop.
const actions = [
  ["Nhiệt độ", "/tracking/temperature?new=1", Thermometer],
  ["Thuốc", "/tracking/medication", Pill],
  ["Bú mẹ", "/tracking/feeding?new=1&type=BREASTFEEDING", Baby],
  ["Giấc ngủ", "/tracking/sleep?new=1", BedDouble],
  ["Bú bình", "/tracking/feeding?new=1&type=BOTTLE_BREAST_MILK", Milk],
  ["Thay tã", "/tracking/diaper?new=1", Shell],
  ["Hút sữa", "/mother/pumping", PumpingIcon],
  ["Ăn dặm", "/baby/meals?new=1", Utensils],
  ["Số đo", "/tracking/growth?new=1", Ruler],
  ["Dấu hiệu", "/baby/wellbeing?new=1", MoodIcon],
  ["Kỷ niệm", "/baby/milestones?new=1", MilestoneIcon],
  ["Nếp ngày", "/baby/routine?new=1", RoutineIcon],
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
      <DialogContent className="max-h-[85dvh] overflow-y-auto p-6 sm:max-w-lg sm:rounded-[2rem] max-sm:top-auto max-sm:bottom-0 max-sm:w-full max-sm:max-w-none max-sm:translate-y-0 max-sm:rounded-t-[2rem] max-sm:rounded-b-none">
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
            {actions.map(([title, href, Icon]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border bg-card p-2 text-center text-xs font-medium"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-secondary/70">
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
          className="flex min-h-12 items-center gap-2.5 rounded-2xl bg-secondary p-3 font-medium text-primary"
        >
          <Bot className="size-7" />
          Tra cứu cùng trợ lý
        </Link>
        <DialogClose className="min-h-11 text-sm text-muted-foreground">
          Đóng
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
