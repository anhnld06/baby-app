import { forwardRef } from "react";
import type { LucideIcon, LucideProps } from "lucide-react";

/**
 * Shared SVG assets from the approved pastel sticker collection.
 * The artwork is a fixed-colour external file rendered through <image>, so
 * stroke/colour props (and `text-*` classes) cannot restyle it; they are accepted
 * only for drop-in compatibility with lucide icons and are discarded here.
 * In dark mode `.dark .app-icon` (globals.css) adds a soft die-cut rim for legibility.
 */
function createAppIcon(name: string): LucideIcon {
  const Icon = forwardRef<SVGSVGElement, LucideProps>(function AppIcon(
    { size = 24, className, absoluteStrokeWidth: _absoluteStrokeWidth, strokeWidth: _strokeWidth, color: _color, ...props }, ref,
  ) {
    void _absoluteStrokeWidth;
    void _strokeWidth;
    void _color;
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 128 128"
        fill="none"
        aria-hidden="true"
        focusable="false"
        {...props}
        className={`app-icon${className ? ` ${className}` : ""}`}
      >
        <image href={`/icons/custom/pastel-sticker/${name}.svg`} width="128" height="128" />
      </svg>
    );
  });
  Icon.displayName = `AppIcon(${name})`;
  return Icon;
}

export const BottleIcon = createAppIcon("bottle");
export const SleepIcon = createAppIcon("sleep");
export const DiaperIcon = createAppIcon("diaper");
export const MealIcon = createAppIcon("meal");
export const TemperatureIcon = createAppIcon("temperature");
export const GrowthIcon = createAppIcon("growth");
export const MedicineIcon = createAppIcon("medicine");
export const VaccineIcon = createAppIcon("vaccine");
export const PumpingIcon = createAppIcon("pumping");
export const BreastfeedingIcon = createAppIcon("breastfeeding");
export const ToothIcon = createAppIcon("tooth");
export const MilestoneIcon = createAppIcon("milestone");
export const RoutineIcon = createAppIcon("routine");
export const MedicalIcon = createAppIcon("medical");
export const ShieldIcon = createAppIcon("shield");
export const PregnancyIcon = createAppIcon("pregnancy");
export const CycleIcon = createAppIcon("cycle");
export const WellbeingIcon = createAppIcon("wellbeing");
export const HomeIcon = createAppIcon("home");
export const BabyIcon = createAppIcon("baby");
export const HandbookIcon = createAppIcon("handbook");
export const ProfileIcon = createAppIcon("profile");
export const StatisticsIcon = createAppIcon("statistics");
export const MailboxIcon = createAppIcon("mailbox");
export const AssistantIcon = createAppIcon("assistant");

export const MotherIcon = createAppIcon("mother");
export const DevelopmentIcon = createAppIcon("development");
export const MoodIcon = createAppIcon("mood");
export const PrescriptionIcon = createAppIcon("prescription");
export const BabyMedicalIcon = createAppIcon("baby-medical");
export const MotherMedicalIcon = createAppIcon("mother-medical");
export const BabyInsuranceIcon = createAppIcon("baby-insurance");
export const MotherInsuranceIcon = createAppIcon("mother-insurance");
export const MotherVaccineIcon = createAppIcon("mother-vaccine");
export const BabyStatisticsIcon = createAppIcon("baby-statistics");
export const LullabyIcon = createAppIcon("lullaby");
export const BabyNewIcon = createAppIcon("baby-new");
