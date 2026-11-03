"use client";

import { EditFormTarget } from "@/components/edit-record-navigation";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export function CollapsibleRecordForm({
  defaultOpen,
  editingId,
  addLabel,
  closeLabel,
  children,
  prominent = false,
}: {
  defaultOpen: boolean;
  editingId?: string;
  addLabel: string;
  closeLabel: string;
  children: React.ReactNode;
  prominent?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  if (!open && !defaultOpen) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`mb-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[.99] ${prominent ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-dashed border-border text-primary"}`}
      >
        <Plus className="size-4" />
        {addLabel}
      </button>
    );
  }

  return (
    <EditFormTarget recordId={editingId}>
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
    </EditFormTarget>
  );
}
