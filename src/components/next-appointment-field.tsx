"use client";

import { useState } from "react";
import { Field } from "@/components/form-fields";
import { Button } from "@/components/ui/button";

/**
 * "Ngày hẹn tiếp theo" in the "Đã tiêm" form. It always starts empty: a
 * computed date is only offered as a suggestion the parent applies with one
 * tap, so no appointment (and no reminder) is created unless they choose it.
 */
export function NextAppointmentField({ id, suggestion }: {
  id: string;
  /** `date` is "YYYY-MM-DD"; `text` is the ready-made Vietnamese hint. */
  suggestion?: { date: string; text: string };
}) {
  const [value, setValue] = useState("");
  return (
    <div className="space-y-2">
      <Field
        id={id}
        name="nextScheduledAt"
        type="date"
        label="Ngày hẹn tiếp theo (nếu có)"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {suggestion && (
        <div className="flex flex-wrap items-center gap-2">
          <p className="min-w-0 flex-1 text-xs leading-5 text-muted-foreground">{suggestion.text}</p>
          <Button type="button" variant="secondary" className="min-h-11 rounded-xl px-3 text-xs" onClick={() => setValue(suggestion.date)}>
            Dùng ngày dự kiến
          </Button>
        </div>
      )}
    </div>
  );
}
