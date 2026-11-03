import { ChoiceFields } from "@/components/choice-fields";
import { PregnancyDueDateField } from "@/components/pregnancy-due-date-field";
import Link from "next/link";
import { deletePregnancyAction, savePregnancyAction } from "@/app/actions";
import { Field, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { selectRelevantPregnancy } from "@/features/mother/pregnancy";
import { dueDateFromGestationalAge } from "@/features/mother/due-date";
import { toDateTimeLocal } from "@/lib/date";
import { getDictionary } from "@/lib/i18n";

function dateInput(date?: Date | null) {
  return date?.toISOString().slice(0, 10) ?? "";
}

export default async function PregnancyProfilePage() {
  const [user, t] = await Promise.all([requireUser(), getDictionary()]);
  const mother = await db.mother.findUnique({
    where: { userId: user.id },
    include: { pregnancies: { orderBy: { createdAt: "desc" } } },
  });
  if (!mother)
    return (
      <>
        <PageHeader title={t.profile.editPregnancy} backHref="/profile" />
        <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          {t.profile.notAdded}
          <Link
            href="/profile/mother"
            className="mt-3 block font-medium text-primary"
          >
            {t.profile.editMother}
          </Link>
        </div>
      </>
    );
  const pregnancy = selectRelevantPregnancy(mother.pregnancies);
  const earliestCheckup = pregnancy && !pregnancy.estimatedDueDate
    ? await db.pregnancyCheckup.findFirst({
        where: { pregnancyId: pregnancy.id, gestationalWeek: { not: null } },
        orderBy: { checkedAt: "asc" },
      })
    : null;
  const examinedOn = earliestCheckup
    ? earliestCheckup.checkedAtTimeKnown
      ? toDateTimeLocal(earliestCheckup.checkedAt, user.timezone).slice(0, 10)
      : dateInput(earliestCheckup.checkedAt)
    : undefined;
  const suggestedDate = examinedOn && earliestCheckup
    ? dueDateFromGestationalAge(examinedOn, earliestCheckup.gestationalWeek, earliestCheckup.gestationalDay)
    : undefined;
  return (
    <>
      <PageHeader
        title={t.profile.editPregnancy}
        subtitle={mother.name}
        backHref="/profile"
      />
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <form
            id="pregnancy-form"
            action={savePregnancyAction}
            className="space-y-5"
          >
            <input type="hidden" name="motherId" value={mother.id} />
            {pregnancy && (
              <input type="hidden" name="id" value={pregnancy.id} />
            )}
            <ChoiceFields name="pregnancyStatus" label={t.profile.status} initialValue={pregnancy?.pregnancyStatus ?? "PREGNANT"}
              options={[
                { value: "PLANNING", label: t.profile.planning }, { value: "PREGNANT", label: t.profile.pregnant },
                { value: "DELIVERED", label: t.profile.delivered }, { value: "ENDED", label: t.profile.ended },
              ]}
              groups={[
                { values: ["PREGNANT", "DELIVERED", "ENDED"], fields: <PregnancyDueDateField label={t.profile.dueDate} initialValue={dateInput(pregnancy?.estimatedDueDate)} suggestedDate={suggestedDate} examinedOn={examinedOn} /> },
                { values: ["DELIVERED"], fields: <Field name="actualDeliveryDate" type="date" label={t.profile.deliveryDate} defaultValue={dateInput(pregnancy?.actualDeliveryDate)} /> },
              ]}
            >
              <details open={Boolean(pregnancy?.lastMenstrualPeriod)} className="space-y-4">
                <summary className="cursor-pointer text-sm font-medium">{t.profile.lmp} (nếu biết)</summary>
                <Field name="lastMenstrualPeriod" type="date" label={t.profile.lmp} defaultValue={dateInput(pregnancy?.lastMenstrualPeriod)} />
              </details>
            </ChoiceFields>
            <details open={Boolean(pregnancy?.notes)} className="space-y-4">
              <summary className="cursor-pointer text-sm font-medium">{t.common.notes}</summary>
              <TextAreaField
                name="notes"
                label={t.common.notes}
                defaultValue={pregnancy?.notes ?? ""}
              />
            </details>
          </form>
        </CardContent>
      </Card>
      <FormActionBar
        formId="pregnancy-form"
        saveAction={savePregnancyAction}
        saveLabel={t.common.save}
        cancelHref="/profile"
        cancelLabel={t.common.cancel}
        deleteAction={pregnancy ? deletePregnancyAction : undefined}
        deleteId={pregnancy?.id}
        deleteLabel={t.common.delete}
      />
    </>
  );
}
