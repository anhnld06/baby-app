import Link from "next/link";
import { ArrowUpRight, Clock3, Sparkles } from "lucide-react";
import { formatAge, formatDuration } from "@/lib/date";
export function DailySentence({
  baby,
  now,
  locale,
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
  locale: "vi" | "en";
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
  const vi = locale === "vi";
  const name = baby.nickname || baby.name;
  const hasData = feedCount > 0 || hasSleep || diaperCount > 0;
  return (
    <section
      className="surface-panel overflow-hidden"
      aria-label={vi ? "Tóm tắt hôm nay" : "Today's summary"}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-secondary text-primary">
            <Sparkles className="size-5" />
          </span>
          <div>
            <h2 className="text-sm font-semibold">
              {vi ? "Một ngày của" : "A day with"} {name}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatAge(baby.dateOfBirth, now, locale)}
            </p>
          </div>
        </div>
        <Link
          href={`/profile/baby/${baby.id}`}
          aria-label={vi ? `Hồ sơ của ${baby.name}` : `${baby.name}'s profile`}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-secondary hover:text-primary"
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
      <div className="relative p-5 sm:p-6">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[.14em] text-muted-foreground">
          {vi ? "Theo nhật ký hôm nay" : "From today's journal"}
        </p>
        <p className="text-xl font-medium leading-[1.9] tracking-tight sm:text-2xl">
          {hasData || takenMedications.length > 0 || meals.length > 0 || temperatureCelsius != null ? (
            <>
              {name}
              {hasData ? (vi ? " đã có " : " has logged ") : ""}
              {feedCount > 0 && (
                <>
                  <span className="summary-chip summary-chip-feed">
                    {feedCount} {vi ? "cữ bú" : "feeds"}
                  </span>
                  {bottleMl != null ? (
                    <>
                      {vi ? ", uống " : ", consumed "}
                      <span className="summary-chip summary-chip-bottle">
                        {bottleMl} ml
                      </span>
                      {vi ? " từ bình" : " by bottle"}
                    </>
                  ) : null}
                </>
              )}
              {hasSleep && (
                <>
                  {feedCount
                    ? vi
                      ? ", ngủ "
                      : ", slept "
                    : vi
                      ? "ngủ "
                      : "slept "}
                  <span className="summary-chip summary-chip-sleep">
                    {formatDuration(sleepMinutes, locale)}
                  </span>
                </>
              )}
              {diaperCount > 0 && (
                <>
                  {feedCount || hasSleep
                    ? vi
                      ? " và thay "
                      : " and had "
                    : vi
                      ? "thay "
                      : "had "}
                  <span className="summary-chip summary-chip-diaper">
                    {diaperCount} {vi ? "lần tã" : "diaper changes"}
                  </span>
                </>
              )}
              {takenMedications.length > 0 && (
                <>
                  {hasData
                    ? vi ? ". Bé đã uống " : ". Baby has taken "
                    : vi ? " đã uống " : " has taken "}
                  {takenMedications.map((medication, index) => (
                    <span key={medication}>
                      {index > 0 ? (index === takenMedications.length - 1 ? (vi ? " và " : " and ") : ", ") : ""}
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
                    ? vi ? ". Bé đã ăn dặm " : ". Baby has had "
                    : vi ? " đã ăn dặm " : " has had "}
                  <span className="summary-chip summary-chip-feed">
                    {meals.length} {vi ? "bữa" : "solid meals"}
                  </span>
                  {vi ? " với " : " with "}
                  {meals.map((meal, index) => (
                    <span key={meal.id}>
                      {index > 0 ? (index === meals.length - 1 ? (vi ? " và " : " and ") : ", ") : ""}
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
                    ? vi ? ". Nhiệt độ đo gần nhất là " : ". The latest temperature was "
                    : vi ? " có nhiệt độ đo gần nhất là " : " had a latest temperature of "}
                  <span className="summary-chip summary-chip-bottle">
                    {temperatureCelsius} °C
                  </span>
                </>
              )}
              .
              {activeSleep
                ? vi
                  ? " Đang bấm giờ ngủ."
                  : " A sleep timer is running."
                : activeFeeding
                  ? vi
                    ? " Bé đang trong cữ bú."
                    : " A feed is in progress."
                  : ""}
            </>
          ) : (
            <>
              {vi ? "Một ngày mới bên " : "A new day with "}
              <span className="text-primary">{name}</span>.{" "}
              {vi
                ? "Ghi lại những điều nhỏ, cùng hiểu con hơn."
                : "Capture the little things along the way."}
            </>
          )}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Clock3 className="size-3.5" />
          <p>
            {lastFeedAt
              ? `${vi ? "Cữ bú gần nhất" : "Last feed"}: ${new Intl.DateTimeFormat(locale, { timeZone, hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }).format(lastFeedAt)}`
              : vi
                ? "Chưa ghi cữ bú. Bắt đầu từ một chạm bên dưới."
                : "No feed logged yet. Start below."}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border/60 bg-muted/35 px-5 py-3">
        <span className="text-[11px] text-muted-foreground">
          {vi ? "Nhật ký có thể chưa đầy đủ" : "Logs may be incomplete"}
        </span>
        <Link
          href="/statistics?owner=baby"
          className="inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-primary"
        >
          {vi ? "Xem thống kê" : "View statistics"}
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
