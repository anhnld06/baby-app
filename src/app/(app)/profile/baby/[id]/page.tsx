import { notFound } from "next/navigation";
import { deleteBabyAction, saveBabyAction } from "@/app/actions";
import { Field, SelectField, TextAreaField } from "@/components/form-fields";
import { FormActionBar } from "@/components/form-action-bar";
import { PageHeader } from "@/components/page-header";
import { ProfileCoverUpload } from "@/components/profile-cover-upload";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";
import { profileCoverUrl } from "@/lib/profile-cover";

function dateInput(date?: Date | null) {
  return date?.toISOString().slice(0, 10) ?? "";
}

export default async function BabyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [user, t, { id }] = await Promise.all([
    requireUser(),
    getDictionary(),
    params,
  ]);
  const baby =
    id === "new"
      ? null
      : await db.baby.findFirst({
          where: { id, userId: user.id },
          include: { coverImage: { select: { updatedAt: true } } },
        });
  if (id !== "new" && !baby) notFound();
  return (
    <>
      <PageHeader
        title={baby ? t.profile.editBaby : t.profile.newBaby}
        subtitle={baby?.nickname ?? baby?.name}
        backHref="/profile"
      />
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <form id="baby-form" action={saveBabyAction} className="space-y-5">
            {baby && <input type="hidden" name="id" value={baby.id} />}
            <ProfileCoverUpload
              currentImageUrl={baby?.coverImage
                ? profileCoverUrl("baby", baby.id, baby.coverImage.updatedAt)
                : undefined}
            />
            <Field
              name="name"
              required
              label={t.profile.babyName}
              defaultValue={baby?.name ?? ""}
            />
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <Field
                name="nickname"
                label={t.profile.nickname}
                defaultValue={baby?.nickname ?? ""}
              />
              <SelectField
                name="gender"
                label={t.profile.gender}
                defaultValue={baby?.gender ?? "UNDISCLOSED"}
              >
                <option value="FEMALE">{t.profile.female}</option>
                <option value="MALE">{t.profile.male}</option>
                <option value="OTHER">{t.profile.other}</option>
                <option value="UNDISCLOSED">{t.profile.undisclosed}</option>
              </SelectField>
            </div>
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <Field
                name="dateOfBirth"
                type="date"
                required
                label={t.profile.dateOfBirth}
                defaultValue={dateInput(baby?.dateOfBirth)}
              />
              <Field
                name="birthTime"
                type="time"
                label={t.profile.birthTime}
                defaultValue={baby?.birthTime ?? ""}
              />
            </div>
            <Field
              name="gestationalAgeAtBirth"
              type="number"
              min="0"
              inputMode="numeric"
              label={t.profile.gestationalAge}
              defaultValue={baby?.gestationalAgeAtBirth ?? ""}
            />
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <Field
                name="birthWeightKg"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                label={t.profile.birthWeight}
                defaultValue={baby?.birthWeightKg ?? ""}
              />
              <Field
                name="birthLengthCm"
                type="number"
                min="0"
                step="0.1"
                inputMode="decimal"
                label={t.profile.birthLength}
                defaultValue={baby?.birthLengthCm ?? ""}
              />
            </div>
            <Field
              name="birthHeadCircumferenceCm"
              type="number"
              min="0"
              step="0.1"
              inputMode="decimal"
              label={t.profile.birthHead}
              defaultValue={baby?.birthHeadCircumferenceCm ?? ""}
            />
            <TextAreaField
              name="notes"
              label={t.common.notes}
              defaultValue={baby?.notes ?? ""}
            />
          </form>
        </CardContent>
      </Card>
      <FormActionBar
        formId="baby-form"
        saveAction={saveBabyAction}
        saveLabel={baby ? t.common.update : t.common.save}
        cancelHref="/profile"
        cancelLabel={t.common.cancel}
        deleteAction={baby ? deleteBabyAction : undefined}
        deleteId={baby?.id}
        deleteLabel={t.common.delete}
      />
    </>
  );
}
