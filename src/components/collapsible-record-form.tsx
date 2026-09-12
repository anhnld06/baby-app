"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

export function CollapsibleRecordForm({
  defaultOpen,
  addLabel,
  closeLabel,
  children,
}: {
  defaultOpen: boolean;
  addLabel: string;
  closeLabel: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-sm font-medium text-primary transition-colors active:scale-[.99]"
      >
        <Plus className="size-4" />
        {addLabel}
      </button>
    );
  }

  return (
    <div className="relative">
      {!defaultOpen && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={closeLabel}
          className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-card/90 text-muted-foreground shadow-sm"
        >
          <X className="size-4" />
        </button>
      )}
      {children}
    </div>
  );
}
