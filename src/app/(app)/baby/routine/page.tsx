import Link from "next/link";
import { DashboardRefresh } from "@/components/dashboard-refresh";
import { PageHeader } from "@/components/page-header";
import { BabySwitcher } from "@/components/baby-switcher";
import { RoutineStatus } from "@/components/routine-status";
import { Field, SelectField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSelectedBabyId, listBabies, pickSelectedBaby } from "@/lib/data";
import {
  getLocalDayRange,
  toDateTimeLocal,
  zonedDateTimeToUtc,
  formatDuration,
} from "@/lib/date";
import { calendarAgeDays, validDay } from "@/features/journey/dates";
import {
  buildRoutine,
  resolveRoutine,
  ROUTINE_PRESETS,
  type RoutineActual,
} from "@/features/journey/routine";
import {
  saveRoutineSettingsAction,
  wakeBabyAction,
} from "@/app/journey-actions";
import {
  startSleepTimerAction,
  startFeedingTimerAction,
} from "@/app/timer-actions";
import ManualPage from "../[section]/page";
export default async function RoutinePage({
  searchParams,
}: {
  searchParams: Promise<{
    day?: string;
    manual?: string;
    edit?: string;
    new?: string;
    saved?: string;
    limit?: string;
  }>;
}) {
  const query = await searchParams;
  if (query.manual === "1" || query.edit || query.new)
    return (
      <ManualPage
        params={Promise.resolve({ section: "routine" })}
        searchParams={searchParams}
      />
    );
  const user = await requireUser();
  const [babies, selected] = await Promise.all([
    listBabies(user.id),
    getSelectedBabyId(),
  ]);
  const baby = pickSelectedBaby(babies, selected);
  if (!baby)
    return (
      <>
        <PageHeader title="Nếp ngày EASY" backHref="/baby" />
        <Link href="/profile/baby/new">Thêm hồ sơ bé</Link>
      </>
    );
  const now = new Date();
  const today = toDateTimeLocal(now, user.timezone).slice(0, 10);
  const day = validDay(query.day, today);
  const range = getLocalDayRange(
    zonedDateTimeToUtc(`${day}T12:00`, user.timezone),
    user.timezone,
  );
  const [stored, feeds, sleeps, manual, wakes] = await Promise.all([
    db.babyRoutineSettings.findUnique({ where: { babyId: baby.id } }),
    db.feeding.findMany({
      where: {
        babyId: baby.id,
        startTime: { gte: range.start, lt: range.end, lte: now },
      },
      orderBy: { startTime: "asc" },
    }),
    db.sleepEntry.findMany({
      where: {
        babyId: baby.id,
        startTime: { lt: range.end, lte: now },
        OR: [{ endTime: null }, { endTime: { gte: range.start } }],
      },
      orderBy: { startTime: "asc" },
    }),
    db.babyCareEntry.findMany({
      where: {
        babyId: baby.id,
        kind: "ROUTINE",
        occurredAt: { gte: range.start, lt: range.end },
      },
      select: {
        id: true,
        title: true,
        occurredAt: true,
        durationMinutes: true,
        completed: true,
      },
      orderBy: { occurredAt: "asc" },
    }),
    db.babyCareEntry.findMany({
      where: {
        babyId: baby.id,
        kind: "WAKE",
        occurredAt: { gte: range.start, lt: range.end },
      },
      select: { id: true, occurredAt: true },
    }),
  ]);
  const { method, settings } = resolveRoutine(
    stored,
    calendarAgeDays(
      baby.dateOfBirth,
      zonedDateTimeToUtc(`${day}T12:00`, user.timezone),
      user.timezone,
    ),
  );
  const actuals: RoutineActual[] = [
    ...wakes.map((w) => ({
      id: w.id,
      kind: "wake" as const,
      start: w.occurredAt,
      end: w.occurredAt,
      active: false,
      detail: "Giờ thức giấc đã ghi",
      href: "/activity",
    })),
    ...feeds.map((f) => ({
      id: f.id,
      kind: "feed" as const,
      start: f.startTime,
      end: f.endTime,
      active:
        f.type === "BREASTFEEDING" &&
        !f.endTime &&
        f.amountMl == null &&
        f.leftBreastDuration == null &&
        f.rightBreastDuration == null,
      detail: `${f.type === "BREASTFEEDING" ? "Bú mẹ" : "Bú bình"}${f.amountMl != null ? ` · ${f.amountMl} ml` : ""}`,
      href: `/tracking/feeding?edit=${f.id}`,
    })),
    ...sleeps.flatMap((s) => [
      {
        id: s.id,
        kind: "sleep" as const,
        start: s.startTime,
        end: s.endTime,
        active: !s.endTime,
        detail: s.endTime
          ? formatDuration(
              (s.endTime.getTime() - s.startTime.getTime()) / 60000,
            )
          : "Đang bấm giờ ngủ",
        href: `/tracking/sleep?edit=${s.id}`,
      },
      ...(s.endTime && s.endTime >= range.start && s.endTime < range.end
        ? [
            {
              id: s.id,
              kind: "wake" as const,
              start: s.endTime,
              end: s.endTime,
              active: false,
              detail: "Theo giờ kết thúc giấc ngủ",
              href: `/tracking/sleep?edit=${s.id}`,
            },
          ]
        : []),
    ]),
  ];
  const rows = buildRoutine(
    day,
    user.timezone,
    { ...settings, method },
    actuals.filter(
      (a) => (a.start >= range.start && a.start < range.end) || a.active,
    ),
  );
  const clock = (date: Date) => toDateTimeLocal(date, user.timezone).slice(11);
  const titles = {
    wake: "Thức giấc",
    feed: "Cữ ăn",
    play: "Chơi / tương tác",
    sleep: "Ngủ",
  };
  const icons = { wake: "☀️", feed: "🍼", play: "🧸", sleep: "🌙" };
  const next = rows.find((r) => !r.actual && r.expectedEnd > now);
  return (
    <>
      <DashboardRefresh pauseSelector="[data-routine-settings][open]" />
      <PageHeader
        title="Nếp ngày EASY"
        subtitle="Ăn · hoạt động · ngủ · thời gian của bạn"
        backHref="/baby"
      />
      <BabySwitcher
        babies={babies}
        selectedBabyId={baby.id}
        addLabel="Thêm bé"
      />
      <section className="my-5 rounded-3xl bg-gradient-to-br from-violet-100 to-card p-5 dark:from-violet-950">
        <p className="text-xs font-medium text-primary">
          Phương pháp ·{" "}
          {method === "CUSTOM"
            ? "Gia đình tùy chỉnh"
            : ROUTINE_PRESETS[method as keyof typeof ROUTINE_PRESETS]?.title}
        </p>
        <h2 className="mt-3 text-xl font-semibold">
          {next && day === today
            ? `Tiếp theo: ${titles[next.kind]} · ${clock(next.planned)}`
            : `Nếp ngày ${day.split("-").reverse().join("/")}`}
        </h2>
        <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
          <p>
            🍼 Ăn
            <strong className="mt-1 block">
              {settings.feedingMinutes} phút
            </strong>
          </p>
          <p>
            ☀️ Chơi
            <strong className="mt-1 block">{settings.awakeMinutes} phút</strong>
          </p>
          <p>
            🌙 Ngủ
            <strong className="mt-1 block">
              {formatDuration(settings.sleepMinutes)}
            </strong>
          </p>
        </div>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Mẫu sắp xếp sinh hoạt, không phải lịch bú/ngủ bắt buộc. Luôn đáp ứng
          tín hiệu đói, buồn ngủ của bé.{" "}
          {settings.adaptToLogs
            ? "Các mốc phía sau điều chỉnh theo giờ thực tế đã ghi."
            : "Giữ nguyên các mốc dự kiến."}
        </p>
        <a
          className="mt-2 inline-flex min-h-11 items-center text-xs text-primary"
          href="https://www.nhs.uk/best-start-in-life/baby/feeding-your-baby/bottle-feeding/bottle-feeding-your-baby/feeding-on-demand/"
          target="_blank"
          rel="noreferrer"
        >
          NHS: cho ăn theo tín hiệu của bé ↗
        </a>
      </section>
      <form className="mb-5 flex items-end gap-2">
        <Field label="Chọn ngày" type="date" name="day" defaultValue={day} />
        <button className="min-h-12 rounded-xl bg-secondary px-4 text-primary">
          Xem
        </button>
      </form>
      {query.saved && (
        <p role="status" className="mb-4 text-sm text-primary">
          Đã lưu phương pháp.
        </p>
      )}
      <details
        data-routine-settings
        className="mb-6 rounded-3xl border bg-card p-5"
      >
        <summary className="min-h-11 cursor-pointer font-semibold">
          Phương pháp & giờ bắt đầu ngày
        </summary>
        <form
          id="routine-settings"
          action={saveRoutineSettingsAction}
          className="mt-4 grid gap-4"
        >
          <input type="hidden" name="babyId" value={baby.id} />
          <SelectField
            label="Phương pháp"
            name="method"
            defaultValue={stored?.method ?? "AUTO"}
          >
            <option value="AUTO">Tự chọn mẫu theo tuổi</option>
            {Object.entries(ROUTINE_PRESETS).map(([key, p]) => (
              <option key={key} value={key}>
                {p.title}
              </option>
            ))}
            <option value="CUSTOM">Gia đình tùy chỉnh thời lượng</option>
          </SelectField>
          <div className="grid grid-cols-2 gap-3">
            <Field
              name="dayStart"
              label="Bắt đầu ngày"
              type="time"
              required
              defaultValue={settings.dayStart}
            />
            <Field
              name="dayEnd"
              label="Kết thúc lịch ban ngày"
              type="time"
              required
              defaultValue={settings.dayEnd}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Các số dưới đây áp dụng khi chọn Gia đình tùy chỉnh. Mẫu theo tuổi
            dùng giá trị của mẫu.
          </p>
          <Field
            name="feedingMinutes"
            label="Ăn (phút)"
            type="number"
            min={5}
            max={120}
            defaultValue={settings.feedingMinutes}
            required
          />
          <Field
            name="awakeMinutes"
            label="Chơi sau ăn (phút)"
            type="number"
            min={5}
            max={360}
            defaultValue={settings.awakeMinutes}
            required
          />
          <Field
            name="sleepMinutes"
            label="Ngủ (phút)"
            type="number"
            min={10}
            max={360}
            defaultValue={settings.sleepMinutes}
            required
          />
          <label className="flex min-h-11 items-center gap-2">
            <input
              name="adaptToLogs"
              type="checkbox"
              defaultChecked={settings.adaptToLogs}
            />
            Điều chỉnh lịch theo nhật ký thực tế
          </label>
        </form>
        <FormActionBar
          formId="routine-settings"
          saveAction={saveRoutineSettingsAction}
          saveLabel="Lưu phương pháp"
        />
      </details>
      <div className="space-y-4">
        {rows.map((row) => (
          <article
            key={row.id}
            className={`relative ml-16 rounded-3xl border p-4 ${row.actual?.active ? "border-primary/30 bg-secondary" : row.actual ? "border-emerald-500/20 bg-card" : "border-dashed bg-card/50"}`}
          >
            <time className="absolute -left-16 top-5 text-xs font-semibold tabular-nums">
              {clock(row.actual?.start ?? row.planned)}
            </time>
            <p className="text-xs text-muted-foreground">
              {row.actual
                ? row.actual.active
                  ? "Đang diễn ra · đã ghi"
                  : "Đã ghi thực tế"
                : "Dự kiến"}
            </p>
            <h3 className="mt-1 font-semibold">
              {icons[row.kind]} {titles[row.kind]}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {row.actual?.detail ??
                `${Math.max(0, Math.round((row.expectedEnd.getTime() - row.planned.getTime()) / 60000))} phút dự kiến`}
            </p>
            {row.actual ? (
              <Link
                href={row.actual.href}
                className="mt-2 inline-flex min-h-11 items-center text-xs text-primary"
              >
                Xem / sửa bản ghi
              </Link>
            ) : (
              <RoutineStatus
                at={row.planned.toISOString()}
                minutes={Math.max(
                  1,
                  (row.expectedEnd.getTime() - row.planned.getTime()) / 60000,
                )}
                completed={false}
              />
            )}
            {row.kind === "sleep" && (
              <p className="mt-2 text-xs text-muted-foreground">
                ♡ Thời gian nghỉ của bạn
              </p>
            )}
          </article>
        ))}
      </div>
      {day === today && (
        <div className="my-5 flex flex-wrap gap-2">
          {[
            ["Bắt đầu bú", startFeedingTimerAction],
            ["Bắt đầu ngủ", startSleepTimerAction],
            ["Thức giấc", wakeBabyAction],
          ].map(([title, action]) => (
            <form
              key={title as string}
              action={action as (form: FormData) => Promise<void>}
            >
              <input type="hidden" name="babyId" value={baby.id} />
              <button className="min-h-12 rounded-full bg-primary px-4 text-sm text-primary-foreground">
                {title as string}
              </button>
            </form>
          ))}
        </div>
      )}
      <section className="mt-6">
        <h2 className="text-lg font-semibold">Lịch riêng của gia đình</h2>
        {manual.map((entry) => (
          <Link
            key={entry.id}
            href={`/baby/routine?manual=1&edit=${entry.id}&day=${day}`}
            className="mt-3 block rounded-2xl border p-4 text-sm"
          >
            {clock(entry.occurredAt)} · {entry.title} ·{" "}
            {entry.completed ? "Đã đánh dấu" : "Dự kiến"}
          </Link>
        ))}
        <Link
          href={`/baby/routine?manual=1&new=1&day=${day}`}
          className="mt-3 inline-flex min-h-12 items-center text-primary"
        >
          + Thêm hoạt động riêng
        </Link>
      </section>
    </>
  );
}
