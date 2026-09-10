import type { ToothPosition } from "@prisma/client";
import { deleteToothAction, saveToothAction } from "@/app/actions";
import { Field, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { PageHeader } from "@/components/page-header";
import { ToothChart } from "@/components/tooth-chart";
import { Card, CardContent } from "@/components/ui/card";
import {
  LOWER_TOOTH_ORDER,
  toothTypeLabelKey,
  UPPER_TOOTH_ORDER,
} from "@/features/teeth/teeth";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { toDateInputValue } from "@/lib/date";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";

const ALL_POSITIONS: ToothPosition[] = [...UPPER_TOOTH_ORDER, ...LOWER_TOOTH_ORDER];

export default async function TeethPage({
  searchParams,
}: {
  searchParams: Promise<{ position?: string }>;
}) {
  const [user, t, params] = await Promise.all([
    requireUser(),
    getDictionary(),
    searchParams,
  ]);
  const baby = await getSelectedBaby(user.id);
  if (!baby)
    return (
      <>
        <PageHeader title={t.tracking.teethTitle} backHref="/" />
        <p>{t.common.noData}</p>
      </>
    );
  const records = await db.toothRecord.findMany({ where: { babyId: baby.id } });
  const byPosition = new Map(records.map((record) => [record.position, record]));
  const eruptedPositions = new Set(records.map((record) => record.position));
  const selectedPosition = ALL_POSITIONS.includes(params.position as ToothPosition)
    ? (params.position as ToothPosition)
    : undefined;
  const selectedRecord = selectedPosition ? byPosition.get(selectedPosition) : undefined;

  return (
    <>
      <PageHeader
        title={t.tracking.teethTitle}
        subtitle={baby.name}
        backHref="/"
      />
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <p className="mb-3 text-center text-xs font-medium text-muted-foreground">
            {t.tracking.upperJaw}
          </p>
          <ToothChart
            href={(position) => `/tracking/teeth?position=${position}`}
            eruptedPositions={eruptedPositions}
            selectedPosition={selectedPosition}
            labels={t.tracking}
          />
          <p className="mt-3 text-center text-xs font-medium text-muted-foreground">
            {t.tracking.lowerJaw}
          </p>
        </CardContent>
      </Card>
      {selectedPosition ? (
        <Card className="mt-4 border-0 shadow-sm">
          <CardContent className="space-y-4 p-5">
            <p className="text-sm font-medium">
              {t.tracking[toothTypeLabelKey(selectedPosition)]}
            </p>
            <form id="tooth-form" action={saveToothAction} className="space-y-4">
              <input type="hidden" name="babyId" value={baby.id} />
              <input type="hidden" name="position" value={selectedPosition} />
              <Field
                name="eruptedAt"
                type="date"
                required
                label={t.tracking.eruptedAt}
                defaultValue={
                  selectedRecord
                    ? toDateInputValue(selectedRecord.eruptedAt)
                    : toDateInputValue()
                }
              />
              <TextAreaField
                name="notes"
                label={t.common.notes}
                defaultValue={selectedRecord?.notes ?? ""}
              />
            </form>
          </CardContent>
        </Card>
      ) : (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t.tracking.selectTooth}
        </p>
      )}
      {selectedPosition && (
        <FormActionBar
          formId="tooth-form"
          saveLabel={t.common.save}
          cancelHref="/tracking/teeth"
          cancelLabel={t.common.cancel}
          deleteAction={selectedRecord ? deleteToothAction : undefined}
          deleteId={selectedRecord?.id}
          deleteLabel={t.tracking.clearTooth}
        />
      )}
    </>
  );
}
