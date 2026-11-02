import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { BabySwitcher } from "@/components/baby-switcher";
import { Field, SelectField, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSelectedBabyId, listBabies, pickSelectedBaby } from "@/lib/data";
import { toDateTimeLocal, formatDateTime } from "@/lib/date";
import {
  developmentContext,
  LEAP_WEEKS,
  LEAP_TOPICS,
  DEVELOPMENT_SOURCES,
  stageContent,
} from "@/features/journey/development";
import {
  saveEpisodeAction,
  endEpisodeAction,
  deleteEpisodeAction,
} from "@/app/journey-actions";
export default async function DevelopmentPage({
  searchParams,
}: {
  searchParams: Promise<{
    week?: string;
    corrected?: string;
    edit?: string;
    saved?: string;
  }>;
}) {
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
        <PageHeader title="Tuần khủng hoảng" backHref="/baby" />
        <Link href="/profile/baby/new">Thêm hồ sơ bé</Link>
      </>
    );
  const now = new Date();
  const context = developmentContext(
    baby.dateOfBirth,
    now,
    user.timezone,
    baby.gestationalAgeAtBirth,
    query.corrected === "1",
  );
  const week =
    query.week != null && Number.isInteger(Number(query.week))
      ? Math.min(104, Math.max(0, Number(query.week)))
      : context.week;
  const stage = stageContent(context.ageDays);
  const [episodes, edit] = await Promise.all([
    db.babyCareEntry.findMany({
      where: { babyId: baby.id, kind: "EPISODE" },
      select: {
        id: true,
        title: true,
        occurredAt: true,
        endedAt: true,
        expectedEndAt: true,
        details: true,
      },
      orderBy: { occurredAt: "desc" },
      take: 50,
    }),
    query.edit
      ? db.babyCareEntry.findFirst({
          where: { id: query.edit, babyId: baby.id, kind: "EPISODE" },
        })
      : null,
  ]);
  if (query.edit && !edit) notFound();
  const active = episodes.find((e) => !e.endedAt);
  const locale = user.locale === "en" ? "en" : "vi";
  const date = (d: Date) => formatDateTime(d, user.timezone, locale);
  const nearest = LEAP_WEEKS.map((value, index) => ({ value, index })).sort(
    (a, b) => Math.abs(a.value - week) - Math.abs(b.value - week),
  )[0];
  return (
    <>
      <PageHeader
        title="Tuần khủng hoảng"
        subtitle="Giai đoạn phát triển & thay đổi giấc ngủ"
        backHref="/baby"
      />
      <BabySwitcher
        babies={babies}
        selectedBabyId={baby.id}
        addLabel="Thêm bé"
      />
      <section className="my-5 overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-200 via-violet-100 to-card p-6 dark:from-violet-900 dark:via-violet-950">
        <p className="text-xs text-primary">
          {baby.name} ·{" "}
          {query.corrected === "1"
            ? "Theo tuổi hiệu chỉnh về 40 tuần"
            : "Theo ngày sinh"}
        </p>
        <div aria-hidden="true" className="py-8 text-center text-8xl">
          {active ? "🌦️" : "🌤️"}
        </div>
        <p className="text-sm text-primary">Tuần tuổi {context.week}</p>
        <h2 className="mt-2 text-2xl font-semibold">
          {active ? active.title : "Theo dõi nhịp riêng của con"}
        </h2>
        <p className="mt-3 text-sm leading-6">
          {active
            ? `Gia đình ghi nhận từ ${date(active.occurredAt)} · ngày thứ ${Math.floor((now.getTime() - active.occurredAt.getTime()) / 86400000) + 1}.`
            : "Chưa có đợt khó chịu đang theo dõi. Tuổi của bé không xác nhận bé đang trong một đợt khủng hoảng."}
        </p>
        {active?.expectedEndAt && (
          <p className="mt-3 rounded-2xl bg-card/50 p-3 text-sm">
            Ước tính của gia đình: {date(active.expectedEndAt)} ·{" "}
            {active.expectedEndAt > now
              ? `còn khoảng ${Math.ceil((active.expectedEndAt.getTime() - now.getTime()) / 86400000)} ngày`
              : "đã qua ngày dự kiến"}
            . Có thể sửa khi tình hình thay đổi.
          </p>
        )}
        {active && (
          <form action={endEpisodeAction}>
            <input type="hidden" name="id" value={active.id} />
            <button className="mt-4 min-h-11 rounded-full bg-primary px-4 text-sm text-primary-foreground">
              Đợt này đã kết thúc
            </button>
          </form>
        )}
      </section>
      <form className="mb-4 flex flex-wrap items-end gap-3">
        <Field
          name="week"
          label="Xem tuần tuổi"
          type="number"
          min={0}
          max={104}
          defaultValue={week}
        />
        <label className="flex min-h-11 items-center gap-2">
          <input
            type="checkbox"
            name="corrected"
            value="1"
            defaultChecked={query.corrected === "1"}
            disabled={
              !baby.gestationalAgeAtBirth || baby.gestationalAgeAtBirth >= 40
            }
          />
          Hiệu chỉnh theo tuần thai lúc sinh
        </label>
        <button className="min-h-11 rounded-full bg-secondary px-5 text-primary">
          Xem
        </button>
      </form>
      <nav
        aria-label="Dòng thời gian theo tuần"
        className="mb-5 flex gap-3 overflow-x-auto rounded-3xl border bg-card p-4"
      >
        {Array.from(
          { length: 7 },
          (_, i) => Math.min(98, Math.max(0, week - 3)) + i,
        ).map((w) => (
          <Link
            key={w}
            href={`/baby/development?week=${w}&corrected=${query.corrected ?? "0"}`}
            aria-current={w === week ? "page" : undefined}
            className={`flex min-w-20 flex-col items-center gap-2 rounded-2xl p-3 text-xs ${w === week ? "bg-secondary ring-2 ring-primary" : "bg-muted/40"}`}
          >
            <span>Tuần {w}</span>
            <span aria-hidden="true" className="text-3xl">
              {LEAP_WEEKS.some((l) => l === w) ? "📖" : "🌱"}
            </span>
            <span>
              {w === context.week
                ? "Tuần hiện tại"
                : LEAP_WEEKS.some((l) => l === w)
                  ? "Mốc mô hình"
                  : "Theo dõi"}
            </span>
          </Link>
        ))}
      </nav>
      <section className="mb-5 rounded-3xl border bg-card p-5">
        <h2 className="font-semibold">
          Mô hình tham khảo · mốc {nearest.index + 1}, tuần {nearest.value}
        </h2>
        <p className="mt-2 text-lg text-primary">
          {LEAP_TOPICS[nearest.index]}
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Các mốc tuần 5, 8, 12, 19, 26, 37, 46, 55, 64, 75 thuộc mô hình Wonder
          Weeks của tác giả. Không dùng chúng để dự báo chắc chắn ngày bắt đầu,
          thời lượng khó chịu hoặc giải thích mọi triệu chứng của bé.
        </p>
        <p className="mt-3 text-sm">
          {context.daysToNext != null
            ? `Còn ${context.daysToNext} ngày đến mốc tuần ${context.next} trong mô hình, không phải đếm ngược đến một đợt bệnh hay quấy khóc.`
            : "Đã qua các mốc tuần trong mô hình. Tiếp tục ghi những thay đổi thực tế của bé."}
        </p>
        <a
          href={DEVELOPMENT_SOURCES.leaps}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex min-h-11 items-center text-xs text-primary"
        >
          Nguồn mô hình từ tác giả ↗
        </a>
      </section>
      <section className="mb-5 rounded-3xl border bg-card p-5">
        <h2 className="font-semibold">
          Thay đổi giấc ngủ ·{" "}
          {context.sleepChange ? "Giai đoạn 3–6 tháng" : "Theo nhịp của bé"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Giấc ngủ thay đổi khi bé lớn lên. Nếu bạn đang tìm “khủng hoảng giấc
          ngủ 4 tháng”, hãy đối chiếu nhật ký thực tế; app không mặc định mọi bé
          đều trải qua một đợt ở cùng ngày hay kéo dài cùng số tuần.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/statistics?owner=baby"
            className="inline-flex min-h-11 items-center text-sm text-primary"
          >
            Xem xu hướng ngủ →
          </Link>
          <a
            href={DEVELOPMENT_SOURCES.sleep}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center text-xs text-primary"
          >
            NHS: giấc ngủ của bé ↗
          </a>
        </div>
      </section>
      <section className="mb-5 rounded-3xl bg-secondary/50 p-5">
        <h2 className="font-semibold">{stage.title}</h2>
        <p className="mt-2 text-sm leading-6">{stage.body}</p>
        <p className="mt-2 text-sm text-muted-foreground">{stage.activity}</p>
        <Link
          href="/baby/milestones"
          className="mt-3 inline-flex min-h-11 items-center text-primary"
        >
          Bộ sưu tập mốc phát triển →
        </Link>
      </section>
      {query.saved && (
        <p role="status" className="mb-4 text-sm text-primary">
          Đã lưu đợt theo dõi.
        </p>
      )}
      <details
        open={Boolean(edit)}
        className="mb-5 rounded-3xl border bg-card p-5"
        key={edit?.id ?? baby.id}
      >
        <summary className="min-h-11 cursor-pointer font-semibold">
          {edit ? "Sửa đợt theo dõi" : "+ Ghi đợt khó chịu / thay đổi giấc ngủ"}
        </summary>
        <form
          id="episode-form"
          action={saveEpisodeAction}
          className="mt-4 grid gap-4"
        >
          <input name="babyId" type="hidden" value={baby.id} />
          <input name="id" type="hidden" value={edit?.id ?? ""} />
          <SelectField
            name="title"
            label="Loại đợt theo dõi"
            defaultValue={edit?.title ?? "Đợt quấy khóc"}
          >
            <option>Đợt quấy khóc</option>
            <option>Thay đổi giấc ngủ</option>
          </SelectField>
          <Field
            name="occurredAt"
            label="Bắt đầu thực tế"
            type="datetime-local"
            required
            defaultValue={toDateTimeLocal(
              edit?.occurredAt ?? now,
              user.timezone,
            )}
          />
          <Field
            name="endedAt"
            label="Kết thúc thực tế (để trống nếu đang theo dõi)"
            type="datetime-local"
            defaultValue={
              edit?.endedAt ? toDateTimeLocal(edit.endedAt, user.timezone) : ""
            }
          />
          <Field
            name="expectedEndAt"
            label="Ngày dự kiến của gia đình (tùy chọn)"
            type="datetime-local"
            defaultValue={
              edit?.expectedEndAt
                ? toDateTimeLocal(edit.expectedEndAt, user.timezone)
                : ""
            }
          />
          <TextAreaField
            name="details"
            label="Bé thế nào, gia đình đã làm gì?"
            maxLength={4000}
            defaultValue={edit?.details ?? ""}
          />
        </form>
        <FormActionBar
          formId="episode-form"
          saveAction={saveEpisodeAction}
          saveLabel="Lưu đợt theo dõi"
          cancelHref="/baby/development"
          cancelLabel="Hủy"
          deleteAction={edit ? deleteEpisodeAction : undefined}
          deleteId={edit?.id}
          deleteLabel="Xóa đợt theo dõi"
        />
      </details>
      <h2 className="mb-3 font-semibold">Các đợt gia đình đã ghi</h2>
      <div className="space-y-3">
        {episodes.map((e) => (
          <article key={e.id} className="rounded-2xl border bg-card p-4">
            <h3 className="font-medium">
              {e.title} · {e.endedAt ? "Đã kết thúc" : "Đang theo dõi"}
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              {date(e.occurredAt)} → {e.endedAt ? date(e.endedAt) : "hiện tại"}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm">{e.details}</p>
            <Link
              href={`/baby/development?edit=${e.id}`}
              className="mt-2 inline-flex min-h-11 items-center text-sm text-primary"
            >
              Sửa / xóa
            </Link>
          </article>
        ))}
      </div>
      <Link
        href="/baby/wellbeing?new=1"
        className="mt-4 inline-flex min-h-12 items-center text-primary"
      >
        Ghi thêm dấu hiệu & tâm trạng →
      </Link>
    </>
  );
}
