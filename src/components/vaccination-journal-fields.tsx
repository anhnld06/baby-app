import { Field, SelectField, TextAreaField } from "@/components/form-fields";

export type VaccinationOwner = { value: string; label: string };
export function VaccinationJournalFields({
  prefix,
  owners,
  owner,
  today,
  appointment = false,
  editing,
  fixedOwner = false,
}: {
  prefix: string;
  owners: VaccinationOwner[];
  owner: string;
  today: string;
  appointment?: boolean;
  fixedOwner?: boolean;
  editing?: {
    vaccineName: string;
    doseNumber: number | null;
    scheduledAt?: Date;
    administeredAt?: Date;
    notes: string | null;
    facility?: string | null;
  };
}) {
  const dateInput = (date?: Date) => date?.toISOString().slice(0, 10) ?? "";
  return (
    <>
      {fixedOwner || owners.length === 1 ? (
        <>
          <input type="hidden" name="owner" value={owner} />
          <p className="text-sm text-muted-foreground">
            {owners.find((item) => item.value === owner)?.label}
          </p>
        </>
      ) : (
        <SelectField
          name="owner"
          id={`${prefix}-owner`}
          label="Cho ai?"
          defaultValue={owner}
        >
          {owners.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </SelectField>
      )}
      <Field
        id={`${prefix}-name`}
        name="vaccineName"
        label="Tên vắc-xin / mũi tiêm"
        required
        maxLength={200}
        defaultValue={editing?.vaccineName ?? ""}
      />
      {appointment && (
        <Field
          id={`${prefix}-scheduled`}
          name="scheduledAt"
          type="date"
          label="Ngày hẹn"
          required
          defaultValue={dateInput(editing?.scheduledAt)}
        />
      )}
      {(!appointment || editing?.administeredAt) && (
        <Field
          id={`${prefix}-actual`}
          name="administeredAt"
          type="date"
          label="Ngày tiêm thực tế"
          required
          max={today}
          defaultValue={
            editing?.administeredAt ? dateInput(editing.administeredAt) : today
          }
        />
      )}
      <details className="rounded-2xl bg-muted/50 p-3">
        <summary className="min-h-8 cursor-pointer text-sm font-medium text-muted-foreground">
          Thêm chi tiết (không bắt buộc)
        </summary>
        <div className="mt-3 space-y-3">
          <Field
            id={`${prefix}-dose`}
            name="doseNumber"
            type="number"
            inputMode="numeric"
            min="1"
            max="100"
            label="Mũi số"
            defaultValue={editing?.doseNumber ?? ""}
          />
          {(!appointment || editing?.administeredAt) && (
            <Field
              id={`${prefix}-facility`}
              name="facility"
              label="Nơi tiêm"
              defaultValue={editing?.facility ?? ""}
            />
          )}
          <TextAreaField
            id={`${prefix}-notes`}
            name="notes"
            label="Ghi chú"
            defaultValue={editing?.notes ?? ""}
            maxLength={1000}
          />
        </div>
      </details>
    </>
  );
}
