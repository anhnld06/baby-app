import { HistoryTimelineItem } from "@/components/history-timeline-item";
import { RecordScene } from "@/components/record-scene";
import Link from "next/link";
import { MilestoneBadge } from "@/components/milestone-badge";
import { MilestoneCollection } from "@/components/milestone-collection";
import { MILESTONES } from "@/features/journey/milestones";
import { monthDate } from "@/features/journey/dates";
import { RoutineStatus } from "@/components/routine-status";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { CareSummary } from "@/components/care-summary";
import { BabySwitcher } from "@/components/baby-switcher";
import { Field, SelectField, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import {
  saveCareAction,
  deleteCareAction,
  toggleRoutineAction,
} from "@/app/care-actions";
import { careSections, isCareSection } from "@/features/care/config";
import { requireUser } from "@/lib/auth";
import { getSelectedBabyId, listBabies, pickSelectedBaby } from "@/lib/data";
import { parseHistoryLimit } from "@/lib/pagination";
import { db } from "@/lib/db";
import {
  formatDateTime,
  toDateTimeLocal,
  getLocalDayRange,
  zonedDateTimeToUtc,
} from "@/lib/date";

export default async function CarePage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{
    milestone?: string;
    group?: string;
    edit?: string;
    saved?: string;
    limit?: string;
    day?: string;
    new?: string;
  }>;
}) {
  const { section } = await params;
  if (!isCareSection(section)) notFound();
  const config = careSections[section];
  const user = await requireUser();
  const [babies, selected, query] = await Promise.all([
    listBabies(user.id),
    getSelectedBabyId(),
    searchParams,
  ]);
  const baby = pickSelectedBaby(babies, selected);
  if (!baby)
    return (
      <>
        <PageHeader compact title={config.title} backHref="/baby" />
        <Link href="/profile/baby/new">Thêm hồ sơ bé để bắt đầu</Link>
      </>
    );
  const limit = parseHistoryLimit(query.limit);
  const day =
    /^\d{4}-\d{2}-\d{2}$/.test(query.day ?? "") &&
    Number.isFinite(new Date(query.day!).getTime()) &&
    new Date(query.day!).toISOString().slice(0, 10) === query.day
      ? query.day!
      : toDateTimeLocal(new Date(), user.timezone).slice(0, 10);
  const range = getLocalDayRange(
    zonedDateTimeToUtc(`${day}T12:00`, user.timezone),
    user.timezone,
  );
  const routineWhere =
    section === "routine"
      ? { occurredAt: { gte: range.start, lt: range.end } }
      : {};
  const select = {
    id: true,
    milestoneKey: true,
    title: true,
    occurredAt: true,
    details: true,
    amount: true,
    mood: true,
    symptoms: true,
    durationMinutes: true,
    completed: true,
    photoMime: true,
  };
  const [entries, edit, count] = await Promise.all([
    db.babyCareEntry.findMany({
      where: { babyId: baby.id, kind: config.kind, ...routineWhere },
      select,
      orderBy: { occurredAt: section === "routine" ? "asc" : "desc" },
      take: limit + 1,
    }),
    query.edit
      ? db.babyCareEntry.findFirst({
          where: { id: query.edit, babyId: baby.id, kind: config.kind },
          select,
        })
      : null,
    db.babyCareEntry.count({
      where: { babyId: baby.id, kind: config.kind, ...routineWhere },
    }),
  ]);
  if (query.edit && !edit) notFound();
  const selectedMilestone =
    section === "milestones"
      ? MILESTONES.find(
          (m) => m.key === (edit?.milestoneKey ?? query.milestone),
        )
      : undefined;
  const anniversary =
    selectedMilestone?.month != null
      ? monthDate(baby.dateOfBirth, selectedMilestone.month)
      : null;
  const defaultMoment =
    anniversary && anniversary <= new Date()
      ? zonedDateTimeToUtc(
          `${anniversary.toISOString().slice(0, 10)}T12:00`,
          user.timezone,
        )
      : new Date();
  const scope = (
    <>
      <input type="hidden" name="babyId" value={baby.id} />
      <input type="hidden" name="section" value={section} />
    </>
  );
  return (
    <>
      <PageHeader compact
        title={config.title}
        subtitle={config.subtitle}
        backHref="/baby"
      />
      {!query.edit && query.new !== "1" && !query.milestone && (
        <CareSummary kind={section === "milestones" ? "milestone" : section === "meals" ? "meal" : section === "routine" ? "routine" : "wellbeing"} title={`${config.title} · ${count} bản ghi`}>
          {count ? `${baby.name} · ${config.subtitle}` : "Thêm ghi chép đầu tiên để lưu lại những quan sát về con."}
          {section === "wellbeing" && <Link href="/assistant" className="mt-1 flex min-h-11 items-center font-medium text-primary">Tra cứu cẩm nang cùng trợ lý →</Link>}
        </CareSummary>
      )}
      <BabySwitcher
        babies={babies}
        selectedBabyId={baby.id}
        addLabel="Thêm bé"
      />
      {section === "routine" && (
        <form className="mb-5 flex flex-wrap items-end gap-3">
          <Field
            label="Xem lịch ngày"
            name="day"
            type="date"
            required
            defaultValue={day}
          />
          <button className="min-h-11 rounded-full bg-secondary px-5 text-primary">
            Xem lịch
          </button>
        </form>
      )}
      {section === "milestones" && (
        <MilestoneCollection
          babyId={baby.id}
          birth={baby.dateOfBirth}
          today={toDateTimeLocal(new Date(), user.timezone).slice(0, 10)}
          group={query.group}
        />
      )}
      {query.saved && (
        <p
          role="status"
          className="mb-4 text-sm text-emerald-700 dark:text-emerald-300"
        >
          Đã lưu bản ghi.
        </p>
      )}
      <details
        open={Boolean(edit) || query.new === "1" || entries.length === 0}
        className="mb-6 rounded-3xl border bg-card p-5"
        key={
          edit?.id ??
          `${baby.id}-${section}-${day}-${query.milestone ?? ""}-new`
        }
      >
        <summary className="min-h-11 cursor-pointer font-semibold">
          {edit ? "Sửa bản ghi" : "+ Thêm bản ghi"}
        </summary>
        <RecordScene enabled={section === "meals"} kind="meal" initialValues={{title: edit?.title ?? ""}} timeZone={user.timezone}>
        <form
          id="care-form"
          action={saveCareAction}
          className="mt-4 grid gap-4"
        >
          {scope}
          <input
            type="hidden"
            name="milestoneKey"
            value={selectedMilestone?.key ?? ""}
          />
          <input type="hidden" name="id" value={edit?.id ?? ""} />
          <Field
            label={
              section === "meals"
                ? "Món ăn & nguyên liệu"
                : "Tên hoạt động / kỷ niệm"
            }
            name="title"
            required
            maxLength={160}
            placeholder={config.placeholder}
            list={section === "milestones" ? "milestone-ideas" : undefined}
            defaultValue={edit?.title ?? selectedMilestone?.title}
          />
          {section === "milestones" && (
            <datalist id="milestone-ideas">
              {[
                "Chào đời",
                "Nụ cười đầu tiên",
                "Lần đầu ngẩng đầu",
                "Lần đầu lẫy",
                "Chiếc răng đầu tiên",
                "Lần đầu ngồi",
                "Lần đầu bò",
                "Bước đi đầu tiên",
                "Tiếng gọi đầu tiên",
                "Sinh nhật đầu tiên",
              ].map((title) => (
                <option key={title} value={title} />
              ))}
            </datalist>
          )}
          <Field
            label={
              section === "routine" ? "Thời điểm dự kiến" : "Thời điểm ghi nhận"
            }
            type="datetime-local"
            name="occurredAt"
            required
            defaultValue={
              edit
                ? toDateTimeLocal(edit.occurredAt, user.timezone)
                : section === "routine"
                  ? `${day}T${toDateTimeLocal(new Date(), user.timezone).slice(11)}`
                  : toDateTimeLocal(
                      defaultMoment > new Date() ? new Date() : defaultMoment,
                      user.timezone,
                    )
            }
          />
          {section === "meals" && (
            <Field
              label="Lượng ăn (tùy chọn)"
              name="amount"
              maxLength={160}
              placeholder="Ví dụ: 3 thìa, khoảng 30 g"
              defaultValue={edit?.amount ?? ""}
            />
          )}
          {section === "wellbeing" && (
            <>
              <SelectField
                label="Tâm trạng"
                name="mood"
                defaultValue={edit?.mood ?? ""}
              >
                <option value="">Chưa ghi</option>
                {[
                  "Vui vẻ",
                  "Bình thường",
                  "Khó chịu",
                  "Quấy khóc",
                  "Buồn ngủ",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </SelectField>
              <TextAreaField
                label="Dấu hiệu quan sát được"
                name="symptoms"
                maxLength={1000}
                defaultValue={edit?.symptoms ?? ""}
              />
            </>
          )}
          {section === "routine" && (
            <Field
              label="Thời lượng dự kiến (phút, tùy chọn)"
              name="durationMinutes"
              type="number"
              min={1}
              max={1440}
              defaultValue={edit?.durationMinutes ?? ""}
            />
          )}
          <TextAreaField
            label={
              section === "meals" ? "Quan sát sau bữa ăn & ghi chú" : "Ghi chú"
            }
            name="details"
            maxLength={4000}
            defaultValue={edit?.details ?? ""}
          />
          {section === "milestones" && (
            <>
              <Field
                label="Ảnh kỷ niệm (JPG/PNG/WebP, tối đa 500 KB)"
                name="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
              />
              {edit?.photoMime && (
                <label className="flex min-h-11 items-center gap-2">
                  <input type="checkbox" name="removePhoto" />
                  Xóa ảnh hiện tại
                </label>
              )}
            </>
          )}
        </form>
        <FormActionBar
          formId="care-form"
          saveAction={saveCareAction}
          saveLabel="Lưu bản ghi"
          cancelHref={`/baby/${section}`}
          cancelLabel="Hủy"
          deleteAction={
            edit
              ? async (form) => {
                  "use server";
                  form.set("babyId", baby.id);
                  form.set("section", section);
                  await deleteCareAction(form);
                }
              : undefined
          }
          deleteId={edit?.id}
          deleteLabel="Xóa bản ghi"
        />
        </RecordScene>
      </details>
      <div className="space-y-1">
        {entries.slice(0, limit).map((entry) => (
          <HistoryTimelineItem key={entry.id} at={entry.occurredAt} timeZone={user.timezone} showDate planned={section === "routine" && !entry.completed}>
          <article
            key={entry.id}
            className={`rounded-3xl border bg-card p-5 ${section === "routine" && entry.completed ? "border-emerald-500/30" : "border-border/60"}`}
          >
            {entry.photoMime && (
              <Link href={`/api/care-photo/${entry.id}`} target="_blank">
                <div
                  role="img"
                  aria-label={entry.title}
                  className="mb-4 aspect-video rounded-2xl bg-muted bg-cover bg-center"
                  style={{
                    backgroundImage: `url(/api/care-photo/${entry.id})`,
                  }}
                />
              </Link>
            )}
            {section === "milestones" && (
              <MilestoneBadge
                item={
                  MILESTONES.find((m) => m.key === entry.milestoneKey) ?? {
                    key: `custom-${entry.id}`,
                    group: "Khoảnh khắc",
                  }
                }
                achieved
                small
                idPrefix={`journal-${entry.id}`}
              />
            )}
            <time
              className="block text-xs text-muted-foreground"
              dateTime={entry.occurredAt.toISOString()}
            >
              {formatDateTime(
                entry.occurredAt,
                user.timezone,
                user.locale === "en" ? "en" : "vi",
              )}
            </time>
            <h3 className="mt-2 font-semibold">{entry.title}</h3>
            {section === "routine" && (
              <RoutineStatus
                at={entry.occurredAt.toISOString()}
                minutes={entry.durationMinutes}
                completed={entry.completed}
              />
            )}
            {[
              entry.amount,
              entry.mood,
              entry.symptoms,
              entry.durationMinutes
                ? `${entry.durationMinutes} phút dự kiến`
                : null,
              entry.details,
            ]
              .filter(Boolean)
              .map((text, i) => (
                <p
                  key={i}
                  className="mt-2 whitespace-pre-wrap break-words text-sm text-muted-foreground"
                >
                  {text}
                </p>
              ))}
            <div className="mt-3 flex items-center justify-between gap-3">
              <Link
                href={`/baby/${section}?edit=${entry.id}&day=${day}`}
                className="inline-flex min-h-11 items-center text-sm text-primary"
              >
                Sửa / xóa
              </Link>
              {section === "routine" && (
                <form action={toggleRoutineAction}>
                  {scope}

                  <input type="hidden" name="id" value={entry.id} />
                  <input
                    type="hidden"
                    name="completed"
                    value={String(!entry.completed)}
                  />
                  <button className="min-h-11 rounded-full bg-secondary px-4 text-sm text-primary">
                    {entry.completed
                      ? "✓ Đã hoàn thành · Bỏ đánh dấu"
                      : "Đánh dấu hoàn thành"}
                  </button>
                </form>
              )}
            </div>
          </article>
          </HistoryTimelineItem>
        ))}
      </div>
      {!entries.length && (
        <p className="rounded-3xl border border-dashed p-7 text-center text-sm text-muted-foreground">
          Chưa có bản ghi. Thêm điều đầu tiên ở biểu mẫu phía trên.
        </p>
      )}
      {entries.length > limit && limit < 300 && (
        <Link
          replace
          href={`/baby/${section}?limit=${limit + 30}&day=${day}`}
          className="mt-4 inline-flex min-h-12 items-center text-primary"
        >
          Xem thêm bản ghi
        </Link>
      )}
    </>
  );
}
