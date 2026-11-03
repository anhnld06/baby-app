import {
  BottleIcon, BreastfeedingIcon, SleepIcon, DiaperIcon, MealIcon, TemperatureIcon,
  GrowthIcon, MedicineIcon, VaccineIcon, PumpingIcon, ToothIcon, MilestoneIcon,
  RoutineIcon, PregnancyIcon, CycleIcon,
  BabyIcon, HandbookIcon, ProfileIcon, StatisticsIcon, MailboxIcon, AssistantIcon,
  MotherIcon, DevelopmentIcon, MoodIcon, PrescriptionIcon, BabyMedicalIcon, MotherMedicalIcon,
  BabyInsuranceIcon, MotherInsuranceIcon, MotherVaccineIcon, BabyStatisticsIcon, LullabyIcon, BabyNewIcon,
} from "@/components/app-icons";
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeatureLink({
  href,
  icon: Icon,
  title,
  description,
  meta,
  tone = "rose",
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  meta?: string;
  tone?: "rose" | "blue" | "amber" | "emerald" | "violet";
}) {
  const [pathname, query] = href.split("?");
  const owner = new URLSearchParams(query).get("owner");
  const featureIcons: Partial<Record<string, LucideIcon>> = {
    "/tracking/feeding": href.includes("BREASTFEEDING") ? BreastfeedingIcon : BottleIcon,
    "/tracking/sleep": SleepIcon, "/tracking/diaper": DiaperIcon,
    "/baby/meals": MealIcon, "/tracking/temperature": TemperatureIcon,
    "/tracking/growth": GrowthIcon, "/tracking/medication": MedicineIcon,
    "/tracking/prescription": PrescriptionIcon, "/vaccination-schedule": owner === "mother" ? MotherVaccineIcon : VaccineIcon,
    "/mother/pumping": PumpingIcon, "/tracking/teeth": ToothIcon,
    "/baby/milestones": MilestoneIcon, "/baby/routine": RoutineIcon,
    "/baby/medical": BabyMedicalIcon, "/mother/medical": MotherMedicalIcon,
    "/baby/insurance": BabyInsuranceIcon, "/mother/insurance": MotherInsuranceIcon,
    "/mother/pregnancy": PregnancyIcon, "/mother/cycle": CycleIcon,
    "/baby/wellbeing": MoodIcon, "/baby/development": DevelopmentIcon,
    "/baby": BabyIcon, "/profile/baby/new": BabyNewIcon,
    "/profile/mother": ProfileIcon, "/profile": ProfileIcon,
    "/knowledge": HandbookIcon, "/statistics": owner === "baby" ? BabyStatisticsIcon : StatisticsIcon,
    "/mother": MotherIcon, "/baby/lullabies": LullabyIcon,
    "/baby/mailbox": MailboxIcon, "/assistant": AssistantIcon,
  };
  const Artwork = featureIcons[pathname];
  const tones = {
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
    blue: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  };
  return (
    <Link
      href={href}
      className="surface-panel group flex min-w-0 items-center gap-3 p-4 transition-[border-color,transform] hover:border-primary/25 active:scale-[.99]"
    >
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl", Artwork ? "bg-secondary/70" : tones[tone])}>
        {Artwork ? <Artwork className="size-9" /> : <Icon className="size-5" />}
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block font-medium">{title}</strong>
        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
          {description}
        </span>
        {meta && <span className="mt-1 block text-xs font-medium text-primary">{meta}</span>}
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

