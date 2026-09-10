import type { ToothPosition } from "@prisma/client";
import { deleteToothAction, saveToothAction } from "@/app/actions";
import { Field, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { PageHeader } from "@/components/page-header";
import { ToothChart } from "@/components/tooth-chart";
import { Card, CardContent } from "@/components/ui/card";
import {
  LOWER_TOOTH_ORDER,
  TOOTH_ERUPTION_INFO,
  toothJaw,
  toothSide,
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
  const selectedInfo = selectedPosition ? TOOTH_ERUPTION_INFO[selectedPosition] : undefined;

  return (
    <>
      <PageHeader
        title={t.tracking.teethTitle}
        subtitle={baby.name}
        backHref="/"
      />
      <Card className="border-0 shadow-sm">
        <CardContent className="p-3 sm:p-5">
          <div className="mb-5 text-center">
            <h2 className="text-base font-semibold">{t.tracking.toothDiagram}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{t.tracking.selectTooth}</p>
          </div>
          <ToothChart
            href={(position) => `/tracking/teeth?position=${position}`}
            eruptedPositions={eruptedPositions}
            selectedPosition={selectedPosition}
            labels={t.tracking}
          />
          <div className="mt-5 rounded-2xl bg-muted/60 px-3 py-2.5 text-center text-[11px] leading-relaxed text-muted-foreground">
            <p>{t.tracking.timingVaries}</p>
            <a
              href="https://www.mouthhealthy.org/all-topics-a-z/eruption-charts/"
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block font-medium text-primary underline-offset-2 hover:underline"
            >
              {t.tracking.eruptionSource}
            </a>
          </div>
        </CardContent>
      </Card>
      {selectedPosition && selectedInfo ? (
        <Card className="mt-4 border-0 shadow-sm">
          <CardContent className="space-y-4 p-5">
            <div>
              <h2 className="font-semibold">
                {t.tracking.primaryTooth} {selectedInfo.fdiNumber}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.tracking[toothTypeLabelKey(selectedPosition)]} · {toothJaw(selectedPosition) === "upper" ? t.tracking.upperJaw : t.tracking.lowerJaw} · {toothSide(selectedPosition) === "right" ? t.tracking.right : t.tracking.left}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-secondary px-3 py-2.5">
                <span className="block text-[11px] text-muted-foreground">{t.tracking.expectedEruption}</span>
                <strong className="mt-0.5 block text-sm">{selectedInfo.expectedMonths[0]}–{selectedInfo.expectedMonths[1]} {t.tracking.monthShort}</strong>
              </div>
              <div className="rounded-2xl bg-secondary px-3 py-2.5">
                <span className="block text-[11px] text-muted-foreground">{t.tracking.eruptionOrder}</span>
                <strong className="mt-0.5 block text-sm">#{selectedInfo.eruptionOrder}</strong>
              </div>
            </div>
            <form
              key={selectedPosition}
              id="tooth-form"
              action={saveToothAction}
              className="space-y-4"
            >
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
          saveAction={saveToothAction}
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
