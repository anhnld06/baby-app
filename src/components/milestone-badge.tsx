import {
  Baby,
  Smile,
  Footprints,
  Armchair,
  Sparkles,
  Heart,
  Utensils,
  Flower2,
  Camera,
  Users,
  Shirt,
  ToyBrick,
  MessageCircle,
  Hand,
  BookOpen,
  Plane,
  PartyPopper,
  Sun,
  TestTubeDiagonal,
  Stethoscope,
  ScanHeart,
  HeartPulse,
  Tag,
  NotebookPen,
  Activity,
  House,
  Gift,
  Mail,
  ShoppingBag,
  CalendarHeart,
  Check,
  Plus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Milestone } from "@/features/journey/milestones";
const memoryIcons: LucideIcon[] = [
  Smile,
  Utensils,
  Flower2,
  Camera,
  Users,
  Shirt,
  ToyBrick,
  MessageCircle,
  Hand,
  Hand,
  BookOpen,
  Plane,
  PartyPopper,
  Sun,
];
const pregnancyIcons: LucideIcon[] = [
  Heart,
  TestTubeDiagonal,
  Stethoscope,
  ScanHeart,
  HeartPulse,
  Tag,
  Users,
  NotebookPen,
  Activity,
  Camera,
  House,
  Gift,
  Mail,
  ShoppingBag,
  CalendarHeart,
];
const colors = {
  amber: {
    light: "#ffe9a9",
    base: "#f6b94b",
    deep: "#cf7a21",
    ink: "#824710",
    pale: "#fff5d6",
  },
  rose: {
    light: "#ffe0e9",
    base: "#ef93b4",
    deep: "#ce5486",
    ink: "#922c5b",
    pale: "#fff0f6",
  },
  violet: {
    light: "#e8deff",
    base: "#b39aee",
    deep: "#8061c5",
    ink: "#5b3c95",
    pale: "#f4efff",
  },
  teal: {
    light: "#cbf4ea",
    base: "#79cfc1",
    deep: "#279a90",
    ink: "#14675e",
    pale: "#eafaf5",
  },
  blue: {
    light: "#d8efff",
    base: "#90c9f0",
    deep: "#4b91c6",
    ink: "#285d8c",
    pale: "#edf7ff",
  },
};
export function MilestoneBadge({
  item,
  achieved,
  small = false,
  idPrefix = "collection",
}: {
  item: Pick<Milestone, "key" | "group" | "month">;
  achieved: boolean;
  small?: boolean;
  idPrefix?: string;
}) {
  const month = item.month;
  const palette =
    item.group === "Thai kỳ"
      ? colors.rose
      : item.group === "Khoảnh khắc"
        ? colors.teal
        : [colors.amber, colors.rose, colors.violet, colors.teal, colors.blue][
            (month ?? 0) % 5
          ];
  const Icon = item.key.startsWith("pregnancy-")
    ? pregnancyIcons[Number(item.key.split("-")[1])]
    : item.key.startsWith("memory-")
      ? memoryIcons[Number(item.key.split("-")[1])]
      : ((
          {
            born: Baby,
            smile: Smile,
            head: Baby,
            roll: Sparkles,
            sit: Armchair,
            walk: Footprints,
          } as Record<string, LucideIcon>
        )[item.key] ?? Heart);
  const id = `${idPrefix}-${item.key}`;
  return (
    <span
      aria-hidden="true"
      className={`milestone-medallion relative inline-block shrink-0 ${small ? "h-20 w-[4.5rem]" : "aspect-[7/8] w-full max-w-28 sm:max-w-32"} ${achieved ? "milestone-medallion-earned" : "milestone-medallion-unrecorded"}`}
    >
      <svg
        viewBox="0 0 128 144"
        className="size-full overflow-visible"
        fill="none"
      >
        <defs>
          <linearGradient
            id={`${id}-rim`}
            x1="24"
            y1="5"
            x2="104"
            y2="121"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={palette.light} />
            <stop
              offset=".45"
              stopColor={achieved ? palette.base : palette.pale}
            />
            <stop offset="1" stopColor={achieved ? palette.deep : "#b7c7d5"} />
          </linearGradient>
          <linearGradient
            id={`${id}-face`}
            x1="40"
            y1="18"
            x2="92"
            y2="105"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={achieved ? palette.pale : "#f7fafc"} />
            <stop
              offset="1"
              stopColor={achieved ? palette.light : palette.pale}
            />
          </linearGradient>
          <linearGradient
            id={`${id}-ribbon`}
            x1="44"
            y1="95"
            x2="81"
            y2="143"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={achieved ? palette.deep : "#b4c4d2"} />
            <stop offset="1" stopColor={achieved ? palette.base : "#d4dfe8"} />
          </linearGradient>
        </defs>
        <path
          d="M37 96 28 137 48 130 59 143 68 107M91 96 100 137 80 130 69 143 60 107"
          fill={`url(#${id}-ribbon)`}
        />
        <path
          d="m40 105-5 24 13-5 8 10 5-24m27-5 5 24-13-5-8 10-5-24"
          stroke="white"
          strokeOpacity=".3"
          strokeWidth="2"
        />
        <path
          d="M57 5a14 14 0 0 1 14 0l41 24a14 14 0 0 1 7 12v48a14 14 0 0 1-7 12l-41 24a14 14 0 0 1-14 0l-41-24a14 14 0 0 1-7-12V41a14 14 0 0 1 7-12Z"
          fill={`url(#${id}-rim)`}
          stroke={achieved ? palette.light : "#eaf0f5"}
          strokeWidth="3"
        />
        <path
          d="m59 14-38 22a9 9 0 0 0-4 8v42a9 9 0 0 0 4 8l38 22a10 10 0 0 0 10 0l38-22a9 9 0 0 0 4-8V44a9 9 0 0 0-4-8L69 14a10 10 0 0 0-10 0Z"
          fill={`url(#${id}-face)`}
          stroke="white"
          strokeOpacity=".8"
          strokeWidth="2"
        />
        <path
          d="M27 39 57 21a14 14 0 0 1 14 0l26 15"
          stroke="white"
          strokeOpacity=".7"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle
          cx="64"
          cy="64"
          r="34"
          fill="white"
          fillOpacity=".3"
          stroke={achieved ? palette.base : "#c9d6e1"}
          strokeOpacity=".45"
          strokeDasharray="2 5"
        />
        {month != null && month > 0 ? (
          <>
            <text
              x="64"
              y="80"
              textAnchor="middle"
              fill={achieved ? palette.deep : "#8197a9"}
              stroke="white"
              strokeWidth="4"
              paintOrder="stroke"
              fontSize={month > 9 ? "47" : "55"}
              fontWeight="850"
              fontFamily="var(--font-geist-sans), sans-serif"
            >
              {month}
            </text>
            <text
              x="64"
              y="99"
              textAnchor="middle"
              fill={achieved ? palette.ink : "#60788c"}
              fontSize="8"
              fontWeight="750"
              letterSpacing="2"
            >
              THÁNG
            </text>
            <Heart
              x="86"
              y="76"
              width="15"
              height="15"
              fill={achieved ? palette.base : "#cad5df"}
              stroke="white"
              strokeWidth="2"
            />
          </>
        ) : (
          <>
            {item.key === "memory-0" ? (
              <path
                d="M64 45C56 39 43 40 43 53C43 62 48 66 49 78C50 91 56 89 59 76L62 67Q64 63 66 67L69 76C72 89 78 91 79 78C80 66 85 62 85 53C85 40 72 39 64 45Z"
                fill={achieved ? palette.pale : "#eef3f7"}
                stroke={achieved ? palette.deep : palette.ink}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            ) : (
              <Icon
                x="41"
                y="40"
                width="46"
                height="46"
                stroke={achieved ? palette.deep : palette.ink}
                strokeWidth="1.65"
                fill={achieved ? palette.pale : "#eef3f7"}
              />
            )}
            <path
              d="m47 94 4 3 5-3m16 0 4 3 5-3"
              stroke={achieved ? palette.base : "#c1ced9"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
        <path
          d="m29 63 2-4 2 4 4 2-4 2-2 4-2-4-4-2Z"
          fill={achieved ? palette.base : "#c5d3df"}
        />
        <path
          d="m96 27 2-5 2 5 5 2-5 2-2 5-2-5-5-2Z"
          fill={achieved ? palette.deep : "#b0c2d0"}
        />
        {achieved ? (
          <>
            <circle
              cx="105"
              cy="105"
              r="12"
              fill={palette.deep}
              stroke="white"
              strokeWidth="3"
            />
            <Check
              x="98"
              y="98"
              width="14"
              height="14"
              stroke="white"
              strokeWidth="3"
            />
          </>
        ) : (
          <>
            <circle
              cx="105"
              cy="105"
              r="11"
              fill="#f4f8fb"
              stroke="#c0cfdc"
              strokeWidth="2"
            />
            <Plus
              x="99"
              y="99"
              width="12"
              height="12"
              stroke="#71889c"
              strokeWidth="2"
            />
          </>
        )}
      </svg>
    </span>
  );
}
