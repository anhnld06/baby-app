import { HistoryTimelineItem } from "@/components/history-timeline-item";
import { EditFormTarget, EditRecordLink } from "@/components/edit-record-navigation";
import Link from "next/link";
import {
  CheckCircle2,
  CalendarDays,
  ChevronRight,
  Syringe,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { db } from "@/lib/db";
import { toDateTimeLocal } from "@/lib/date";
import { PageHeader } from "@/components/page-header";
import { CareSummary } from "@/components/care-summary";
import { VaccinationChecklist } from "@/components/vaccination-checklist";
import { BabySwitcher } from "@/components/baby-switcher";
import { VaccinationActionForm } from "@/components/vaccination-action-form";
import {
  VaccinationJournalFields,
  type VaccinationOwner,
} from "@/components/vaccination-journal-fields";
import { Field, TextAreaField } from "@/components/form-fields";
import { RecordActions } from "@/components/record-actions";
import { HistoryLoadMore } from "@/components/history-load-more";
import { parseHistoryLimit } from "@/lib/pagination";
import {
  deleteVaccinationAction,
  deleteMotherVaccinationAction,
} from "@/app/actions";
import {
  saveAppointment,
  savePastVaccination,
  completeAppointment,
  changeAppointment,
} from "@/app/vaccination-actions";
import { appointmentStatus } from "@/features/vaccination/journal";

export default async function VaccinationSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{
    owner?: string;
    baby?: string;
    view?: string;
    edit?: string;
    record?: string;
    limit?: string;
  }>;
}) {
  const [user, params] = await Promise.all([requireUser(), searchParams]);
  const [baby, babies, mother] = await Promise.all([
    params.baby ? db.baby.findFirst({ where: { id: params.baby, userId: user.id } }) : getSelectedBaby(user.id),
    db.baby.findMany({
      where: { userId: user.id },
      select: { id: true, name: true, nickname: true },
    }),
    db.mother.findUnique({ where: { userId: user.id } }),
  ]);
  const owners: VaccinationOwner[] = [
    ...(baby ? [{ value: `baby:${baby.id}`, label: baby.name }] : []),
    ...(mother
      ? [{ value: `mother:${mother.id}`, label: `Mẹ · ${mother.name}` }]
      : []),
  ];
  const defaultOwner =
    params.owner === "mother" && mother
      ? `mother:${mother.id}`
      : (owners[0]?.value ?? "");
  const limit = parseHistoryLimit(params.limit);
  const [appointments, babyHistory, motherHistory, babyChecklistRecords, motherChecklistRecords] = await Promise.all([
    db.vaccinationAppointment.findMany({
      where: {
        OR: [
          ...(baby ? [{ babyId: baby.id }] : []),
          ...(mother ? [{ motherId: mother.id }] : []),
        ],
      },
      include: { vaccinationRecord: true, motherVaccinationRecord: true },
      orderBy: { scheduledAt: "asc" },
    }),
    baby
      ? db.vaccinationRecord.findMany({
          where: { babyId: baby.id, appointment: null },
          orderBy: { administeredAt: "desc" },
          take: limit + 1,
        })
      : [],
    mother
      ? db.motherVaccinationRecord.findMany({
          where: { motherId: mother.id, appointment: null },
          orderBy: { administeredAt: "desc" },
          take: limit + 1,
        })
      : [],
    baby ? db.vaccinationRecord.findMany({ where: { babyId: baby.id }, include: { appointment: { select: { id: true } } }, orderBy: { administeredAt: "desc" } }) : [],
    mother ? db.motherVaccinationRecord.findMany({ where: { motherId: mother.id }, include: { appointment: { select: { id: true } } }, orderBy: { administeredAt: "desc" } }) : [],
  ]);
  const today = toDateTimeLocal(new Date(), user.timezone).slice(0, 10);
  const formatDay = (date: Date) =>
    new Intl.DateTimeFormat("vi", {
      timeZone: "UTC",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  const person = (babyId: string | null) =>
    babyId ? (baby?.name ?? "Bé") : `Mẹ · ${mother?.name ?? ""}`;
  const pending = appointments.filter(
    (item) => !item.vaccinationRecordId && !item.motherVaccinationRecordId,
  );
  const completed = appointments.filter(
    (item) => item.vaccinationRecordId || item.motherVaccinationRecordId,
  );
  const editing = appointments.find((item) => item.id === params.edit);
  const recordEditing = params.record
    ? params.owner === "mother" && mother
      ? await db.motherVaccinationRecord.findFirst({
          where: { id: params.record, motherId: mother.id, appointment: null },
        })
      : baby
        ? await db.vaccinationRecord.findFirst({
            where: { id: params.record, babyId: baby.id, appointment: null },
          })
        : null
    : null;
  const revision = [
    ...appointments.map((item) => `${item.id}-${item.updatedAt.toISOString()}`),
    ...babyHistory.map((item) => `${item.id}-${item.updatedAt.toISOString()}`),
    ...motherHistory.map(
      (item) => `${item.id}-${item.updatedAt.toISOString()}`,
    ),
  ].join();
  const history = [
    ...completed.map((item) => {
      const record = item.vaccinationRecord ?? item.motherVaccinationRecord!;
      return {
        id: item.id,
        appointment: true,
        vaccineName: item.vaccineName,
        doseNumber: item.doseNumber,
        at: record.administeredAt,
        scheduledAt: item.scheduledAt,
        person: person(item.babyId),
        notes: record.notes,
        facility: record.facility,
        mother: !item.babyId,
      };
    }),
    ...babyHistory.map((item) => ({
      id: item.id,
      appointment: false,
      vaccineName: item.vaccineName,
      doseNumber: item.doseNumber,
      at: item.administeredAt,
      scheduledAt: null,
      person: baby?.name,
      notes: item.notes,
      facility: item.facility,
      mother: false,
    })),
    ...motherHistory.map((item) => ({
      id: item.id,
      appointment: false,
      vaccineName: item.vaccineName,
      doseNumber: item.doseNumber,
      at: item.administeredAt,
      scheduledAt: null,
      person: `Mẹ · ${mother?.name}`,
      notes: item.notes,
      facility: item.facility,
      mother: true,
    })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());
  return (
    <>
      <PageHeader compact
        title="Tiêm chủng"
        subtitle="Xem các mũi sắp tới, tích ngay khi đã tiêm"
        backHref={params.owner === "mother" ? "/mother" : "/baby"}
      />
      {!!owners.length && !editing && !recordEditing && (
        <CareSummary kind="vaccine" title={defaultOwner.startsWith("mother:") ? "Lịch tiêm của mẹ" : "Lịch tiêm của bé"}>
          {pending.filter((item) => defaultOwner.startsWith("mother:") ? !!item.motherId : !!item.babyId).length} lịch hẹn chưa xác nhận · {defaultOwner.startsWith("mother:") ? motherChecklistRecords.length : babyChecklistRecords.length} lần tiêm đã lưu
        </CareSummary>
      )}
      <BabySwitcher
        babies={babies}
        selectedBabyId={baby?.id}
        addLabel="Thêm bé"
      />
      {!owners.length ? (
        <div className="rounded-3xl border border-dashed p-6 text-center">
          <p>Thêm hồ sơ mẹ hoặc bé để lưu lịch tiêm.</p>
          <Link
            href="/profile"
            className="mt-3 inline-block text-primary underline"
          >
            Mở hồ sơ
          </Link>
        </div>
      ) : (
        <>
          {baby && mother && <nav aria-label="Chọn lịch tiêm" className="mb-5 flex gap-2">
            <Link replace scroll={false} href="/vaccination-schedule?owner=baby" aria-current={params.owner !== "mother" ? "page" : undefined} className="rounded-full border px-4 py-3 text-sm aria-[current=page]:bg-secondary aria-[current=page]:text-primary">Của bé</Link>
            <Link replace scroll={false} href="/vaccination-schedule?owner=mother" aria-current={params.owner === "mother" ? "page" : undefined} className="rounded-full border px-4 py-3 text-sm aria-[current=page]:bg-secondary aria-[current=page]:text-primary">Của mẹ</Link>
          </nav>}
          {!editing && !recordEditing && baby && params.owner !== "mother" && <VaccinationChecklist view={params.view === "age" ? "age" : "vaccine"} kind="baby" ownerId={baby.id} name={baby.name} birth={baby.dateOfBirth} records={babyChecklistRecords} appointments={pending.filter((item) => item.babyId === baby.id)} today={today} />}
          {!editing && !recordEditing && mother && (params.owner === "mother" || !baby) && <VaccinationChecklist view={params.view === "age" ? "age" : "vaccine"} kind="mother" ownerId={mother.id} name={mother.name} records={motherChecklistRecords} appointments={pending.filter((item) => item.motherId === mother.id)} today={today} />}
          {editing || recordEditing ? (
            <EditFormTarget recordId={editing?.id ?? recordEditing?.id}>
            <section className="mb-6 rounded-3xl border bg-card p-5">
              <h2 className="mb-4 text-lg font-semibold">
                {editing ? "Sửa lịch / lần tiêm" : "Sửa lần tiêm"}
              </h2>
              <VaccinationActionForm
                action={
                  editing
                    ? saveAppointment.bind(null, editing.id)
                    : savePastVaccination.bind(null, recordEditing!.id)
                }
                label="Lưu thay đổi"
              >
                <VaccinationJournalFields
                  prefix="edit"
                  owners={owners}
                  owner={
                    editing
                      ? editing.babyId
                        ? `baby:${editing.babyId}`
                        : `mother:${editing.motherId}`
                      : defaultOwner
                  }
                  today={today}
                  appointment={Boolean(editing)}
                  fixedOwner
                  editing={
                    editing
                      ? {
                          ...editing,
                          administeredAt: (
                            editing.vaccinationRecord ??
                            editing.motherVaccinationRecord
                          )?.administeredAt,
                          facility: (
                            editing.vaccinationRecord ??
                            editing.motherVaccinationRecord
                          )?.facility,
                          notes:
                            (
                              editing.vaccinationRecord ??
                              editing.motherVaccinationRecord
                            )?.notes ?? editing.notes,
                        }
                      : (recordEditing ?? undefined)
                  }
                />
              </VaccinationActionForm>
              <Link
                replace
                href={`/vaccination-schedule?owner=${editing ? (editing.motherId ? "mother" : "baby") : params.owner === "mother" ? "mother" : "baby"}`}
                className="mt-3 inline-flex min-h-11 items-center text-sm text-muted-foreground"
              >
                Hủy chỉnh sửa
              </Link>
            </section>
            </EditFormTarget>
          ) : (
            <div className="mb-6 space-y-3" key={revision}>
              <details className="rounded-3xl border border-primary/20 bg-card p-4">
                <summary className="min-h-11 cursor-pointer content-center text-sm font-semibold text-primary">
                  + Thêm lịch hẹn tiêm
                </summary>
                <div className="mt-4">
                  <VaccinationActionForm
                    action={saveAppointment.bind(null, null)}
                    label="Lưu lịch hẹn"
                  >
                    <VaccinationJournalFields
                      prefix="new"
                      owners={owners}
                      owner={defaultOwner}
                      today={today}
                      appointment
                    />
                  </VaccinationActionForm>
                </div>
              </details>
              <details className="rounded-3xl border border-border/60 bg-card p-4">
                <summary className="min-h-11 cursor-pointer content-center text-sm font-medium">
                  Ghi lần tiêm trước đây
                </summary>
                <div className="mt-4">
                  <VaccinationActionForm
                    action={savePastVaccination.bind(null, null)}
                    label="Lưu lần tiêm"
                  >
                    <VaccinationJournalFields
                      prefix="past"
                      owners={owners}
                      owner={defaultOwner}
                      today={today}
                    />
                  </VaccinationActionForm>
                </div>
              </details>
            </div>
          )}
          <section aria-labelledby="appointments-title">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 id="appointments-title" className="text-lg font-semibold">
                Lịch hẹn ({pending.length})
              </h2>
              <a
                href="/api/calendar"
                download
                className="inline-flex min-h-11 items-center gap-1 text-xs font-medium text-primary"
              >
                <CalendarDays className="size-4" />
                Lưu vào lịch máy
              </a>
            </div>
            <p className="mb-3 text-xs leading-5 text-muted-foreground">
              Nếu đã lưu vào lịch điện thoại, bạn cần tự sửa hoặc xóa sự kiện ở đó khi đổi hẹn.
            </p>
            <div className="space-y-3">
              {pending.map((item) => (
                <article
                  data-appointment={item.id}
                  key={`${item.id}-${item.updatedAt.toISOString()}`}
                  className="rounded-3xl border border-border/60 bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                      <Syringe className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-semibold">
                        {item.vaccineName}
                        {item.doseNumber && !/(mũi|liều)\s*\d+/i.test(item.vaccineName) ? ` · mũi ${item.doseNumber}` : ""}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {person(item.babyId)} · Hẹn{" "}
                        {formatDay(item.scheduledAt)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-secondary px-2 py-1 text-[11px] text-primary">
                      {appointmentStatus(item.scheduledAt, today)}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                      {item.notes}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap items-start gap-3">
                    <details className="w-full min-w-0 rounded-2xl bg-secondary/40 p-3">
                      <summary className="min-h-11 cursor-pointer content-center text-sm font-semibold text-primary">
                        Đã tiêm
                      </summary>
                      <div className="mt-3">
                        <VaccinationActionForm
                          action={completeAppointment.bind(null, item.id)}
                          label="Xác nhận đã tiêm"
                        >
                          <Field
                            id={`actual-${item.id}`}
                            name="administeredAt"
                            type="date"
                            label="Ngày tiêm thực tế"
                            required
                            max={today}
                            defaultValue={today}
                          />
                          <details>
                            <summary className="min-h-11 cursor-pointer content-center text-xs text-muted-foreground">
                              Thêm hẹn tiếp theo / ghi chú
                            </summary>
                            <div className="space-y-3">
                              <Field
                                id={`next-${item.id}`}
                                name="nextScheduledAt"
                                type="date"
                                label="Ngày hẹn tiếp theo (nếu có)"
                              />
                              <Field
                                id={`facility-${item.id}`}
                                name="facility"
                                label="Nơi tiêm"
                              />
                              <TextAreaField
                                id={`notes-${item.id}`}
                                name="notes"
                                label="Ghi chú"
                                defaultValue={item.notes ?? ""}
                              />
                            </div>
                          </details>
                        </VaccinationActionForm>
                      </div>
                    </details>
                    <EditRecordLink
                      replace
                      href={`/vaccination-schedule?edit=${item.id}&owner=${item.babyId ? "baby" : "mother"}`}
                      className="inline-flex min-h-11 items-center px-2 text-sm text-muted-foreground"
                    >
                      Sửa hẹn
                    </EditRecordLink>
                    <VaccinationActionForm
                      action={changeAppointment.bind(null, item.id, "delete")}
                      label="Xóa hẹn"
                      confirm="Xóa lịch hẹn này?"
                      destructive
                    />
                  </div>
                </article>
              ))}
              {!pending.length && (
                <p className="rounded-3xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Chưa có ngày hẹn riêng. Bạn vẫn có thể xem và tích các mũi trong danh sách theo tuổi ở trên.
                </p>
              )}
            </div>
          </section>
          <section className="mt-7" aria-labelledby="history-title">
            <h2 id="history-title" className="mb-3 text-lg font-semibold">
              Đã tiêm
            </h2>
            <div className="space-y-3">
              {history.slice(0, limit).map((item) => (
                <HistoryTimelineItem key={`${item.appointment}-${item.id}`} at={item.at} timeZone="UTC" showDate>
                <article
                  data-vaccination={item.id}
                  key={`${item.appointment}-${item.id}`}
                  className="rounded-3xl border border-border/60 bg-card p-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 size-5 shrink-0 text-emerald-600" />
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-semibold">
                        {item.vaccineName}
                        {item.doseNumber && !/(mũi|liều)\s*\d+/i.test(item.vaccineName) ? ` · mũi ${item.doseNumber}` : ""}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.person} · Đã tiêm {formatDay(item.at)}
                      </p>
                      {item.scheduledAt && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Ngày hẹn ban đầu: {formatDay(item.scheduledAt)}
                        </p>
                      )}
                      {item.facility && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.facility}
                        </p>
                      )}
                      {item.notes && (
                        <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  {item.appointment ? (
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <EditRecordLink
                        replace
                        href={`/vaccination-schedule?edit=${item.id}&owner=${item.mother ? "mother" : "baby"}`}
                        className="inline-flex min-h-11 items-center text-sm text-primary"
                      >
                        Sửa lần tiêm
                        <ChevronRight className="size-4" />
                      </EditRecordLink>
                      <VaccinationActionForm
                        action={changeAppointment.bind(null, item.id, "undo")}
                        label="Bỏ đánh dấu đã tiêm"
                        confirm="Chuyển lần tiêm này về lịch hẹn? Bản ghi tiêm được tạo từ lịch này sẽ được bỏ. Lịch hẹn tiếp theo (nếu có) vẫn được giữ."
                      />
                    </div>
                  ) : (
                    <div className="mt-2 flex justify-end">
                      <RecordActions
                        id={item.id}
                        editHref={`/vaccination-schedule?record=${item.id}&owner=${item.mother ? "mother" : "baby"}`}
                        deleteAction={
                          item.mother
                            ? deleteMotherVaccinationAction
                            : deleteVaccinationAction
                        }
                        editLabel="Sửa"
                        deleteLabel="Xóa"
                      />
                    </div>
                  )}
                </article>
                </HistoryTimelineItem>
              ))}
              {!history.length && (
                <p className="rounded-3xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Chưa ghi lần tiêm nào.
                </p>
              )}
            </div>
            <HistoryLoadMore
              href="/vaccination-schedule"
              currentLimit={limit}
              hasMore={history.length > limit}
            />
          </section>
        </>
      )}
    </>
  );
}
