"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RecordActions({
  editHref,
  id,
  deleteAction,
  editLabel,
  deleteLabel,
}: {
  editHref: string;
  id: string;
  deleteAction: (formData: FormData) => void | Promise<void>;
  editLabel: string;
  deleteLabel: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <Link
        href={editHref}
        aria-label={editLabel}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-11",
        )}
      >
        <Pencil className="size-4" />
      </Link>
      <form
        action={deleteAction}
        onSubmit={(event) => {
          if (!window.confirm(`${deleteLabel}? Hành động này không thể hoàn tác.`)) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="size-11 text-destructive"
          aria-label={deleteLabel}
        >
          <Trash2 className="size-4" />
        </Button>
      </form>
    </div>
  );
}
