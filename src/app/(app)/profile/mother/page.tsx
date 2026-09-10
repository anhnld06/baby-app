import { deleteMotherAction, saveMotherAction } from "@/app/actions";
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

export default async function MotherProfilePage() {
  const [user, t] = await Promise.all([requireUser(), getDictionary()]);
  const mother = await db.mother.findUnique({
    where: { userId: user.id },
    include: { coverImage: { select: { updatedAt: true } } },
  });
  return (
    <>
      <PageHeader
        title={t.profile.editMother}
        subtitle={t.profile.mother}
        backHref="/profile"
      />
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <form
            id="mother-form"
            action={saveMotherAction}
            className="space-y-5"
          >
            {mother && <input type="hidden" name="id" value={mother.id} />}
            <ProfileCoverUpload
              currentImageUrl={mother?.coverImage
                ? profileCoverUrl("mother", mother.id, mother.coverImage.updatedAt)
                : undefined}
            />
            <Field
              name="name"
              required
              label={t.profile.name}
              defaultValue={mother?.name ?? ""}
            />
            <div className="grid min-w-0 gap-4 min-[430px]:grid-cols-2">
              <Field
                name="dateOfBirth"
                type="date"
                label={t.profile.dateOfBirth}
                defaultValue={dateInput(mother?.dateOfBirth)}
              />
              <SelectField
                name="bloodType"
                label={t.profile.bloodType}
                defaultValue={mother?.bloodType ?? ""}
              >
                <option value="">{t.common.unknown}</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (bloodType) => (
                    <option value={bloodType} key={bloodType}>
                      {bloodType}
                    </option>
                  ),
                )}
              </SelectField>
            </div>
            <div className="grid min-w-0 gap-4 min-[430px]:grid-cols-2">
              <Field
                name="heightCm"
                type="number"
                step="0.1"
                min="0"
                inputMode="decimal"
                label={t.profile.height}
                defaultValue={mother?.heightCm ?? ""}
              />
              <Field
                name="prePregnancyWeightKg"
                type="number"
                step="0.1"
                min="0"
                inputMode="decimal"
                label={t.profile.preWeight}
                defaultValue={mother?.prePregnancyWeightKg ?? ""}
              />
            </div>
            <TextAreaField
              name="notes"
              label={t.common.notes}
              defaultValue={mother?.notes ?? ""}
            />
          </form>
        </CardContent>
      </Card>
      <FormActionBar
        formId="mother-form"
        saveLabel={t.common.save}
        cancelHref="/profile"
        cancelLabel={t.common.cancel}
        deleteAction={mother ? deleteMotherAction : undefined}
        deleteId={mother?.id}
        deleteLabel={t.common.delete}
      />
    </>
  );
}
