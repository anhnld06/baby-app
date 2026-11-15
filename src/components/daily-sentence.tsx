import Link from "next/link";
import { ArrowUpRight, Clock3, Sparkles } from "lucide-react";
import { formatAge, formatDuration } from "@/lib/date";
export function DailySentence({
  baby,
  now,
  feedCount,
  bottleMl,
  sleepMinutes,
  hasSleep,
  diaperCount,
  lastFeedAt,
  timeZone,
  activeSleep,
  activeFeeding,
  takenMedications = [],
  temperatureCelsius,
  meals = [],
}: {
  baby: {
    id: string;
    name: string;
    nickname: string | null;
    dateOfBirth: Date;
  };
  now: Date;
  feedCount: number;
  bottleMl: number | null;
  sleepMinutes: number;
  hasSleep: boolean;
  diaperCount: number;
  lastFeedAt?: Date;
  timeZone: string;
  activeSleep: boolean;
  activeFeeding: boolean;
  takenMedications?: string[];
  temperatureCelsius?: number;
  meals?: { id: string; title: string }[];
}) {
  const name = baby.nickname || baby.name;
  const hasData = feedCount > 0 || hasSleep || diaperCount > 0;
  return (
    <section
      className="surface-panel overflow-hidden"
      aria-label="Tóm tắt hôm nay"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-secondary text-primary">
            <Sparkles className="size-5" />
          </span>
          <div>
            <h2 className="text-sm font-semibold">
              {"Một ngày của"} {name}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatAge(baby.dateOfBirth, now, timeZone)}
            </p>
          </div>
        </div>
        <Link
          href={`/profile/baby/${baby.id}`}
          aria-label={`Hồ sơ của ${baby.name}`}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-secondary hover:text-primary"
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
      <div className="relative p-5 sm:p-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">
          Theo nhật ký hôm nay
        </p>
        <p className="text-xl font-medium leading-[1.9] tracking-tight sm:text-2xl">
          {hasData || takenMedications.length > 0 || meals.length > 0 || temperatureCelsius != null ? (
            <>
              {name}
              {hasData ? " đã có " : ""}
              {feedCount > 0 && (
                <>
                  <span className="summary-chip summary-chip-feed">
                    {feedCount} {"cữ bú"}
                  </span>
                  {bottleMl != null ? (
                    <>
                      {", uống "}
                      <span className="summary-chip summary-chip-bottle">
                        {bottleMl} ml
                      </span>
                      {" từ bình"}
                    </>
                  ) : null}
                </>
              )}
              {hasSleep && (
                <>
                  {feedCount
                    ? ", ngủ "
                    : "ngủ "}
                  <span className="summary-chip summary-chip-sleep">
                    {formatDuration(sleepMinutes)}
                  </span>
                </>
              )}
              {diaperCount > 0 && (
                <>
                  {feedCount || hasSleep
                    ? " và thay "
                    : "thay "}
                  <span className="summary-chip summary-chip-diaper">
                    {diaperCount} {"lần tã"}
                  </span>
                </>
              )}
              {takenMedications.length > 0 && (
                <>
                  {hasData
                    ? ". Bé đã uống "
                    : " đã uống "}
                  {takenMedications.map((medication, index) => (
                    <span key={medication}>
                      {index > 0 ? (index === takenMedications.length - 1 ? " và " : ", ") : ""}
                      <span className="summary-chip summary-chip-sleep whitespace-normal break-words">
                        {medication}
                      </span>
                    </span>
                  ))}
                </>
              )}
              {meals.length > 0 && (
                <>
                  {hasData || takenMedications.length > 0
                    ? ". Bé đã ăn dặm "
                    : " đã ăn dặm "}
                  <span className="summary-chip summary-chip-feed">
                    {meals.length} {"bữa"}
                  </span>
                  {" với "}
                  {meals.map((meal, index) => (
                    <span key={meal.id}>
                      {index > 0 ? (index === meals.length - 1 ? " và " : ", ") : ""}
                      <span className="summary-chip summary-chip-feed whitespace-normal break-words">
                        {meal.title}
                      </span>
                    </span>
                  ))}
                </>
              )}
              {temperatureCelsius != null && (
                <>
                  {hasData || takenMedications.length > 0 || meals.length > 0
                    ? ". Nhiệt độ đo gần nhất là "
                    : " có nhiệt độ đo gần nhất là "}
                  <span className="summary-chip summary-chip-bottle">
                    {temperatureCelsius} °C
                  </span>
                </>
              )}
              .
              {activeSleep
                ? " Đang bấm giờ ngủ."
                : activeFeeding
                  ? " Bé đang trong cữ bú."
                  : ""}
            </>
          ) : (
            <>
              {"Một ngày mới bên "}
              <span className="text-primary">{name}</span>.{" "}
              Ghi lại những điều nhỏ, cùng hiểu con hơn.
            </>
          )}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Clock3 className="size-3.5" />
          <p>
            {lastFeedAt
              ? `Cữ bú gần nhất: ${new Intl.DateTimeFormat("vi-VN", { timeZone, hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }).format(lastFeedAt)}`
              : "Chưa ghi cữ bú. Bắt đầu từ một chạm bên dưới."}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border/60 bg-muted/35 px-5 py-3">
        <span className="text-xs text-muted-foreground">
          Nhật ký có thể chưa đầy đủ
        </span>
        <Link
          href="/statistics?owner=baby"
          className="inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-primary"
        >
          Xem thống kê
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
