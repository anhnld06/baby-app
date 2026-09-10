import Link from "next/link";
import { Save, Trash2, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeleteAction = (formData: FormData) => void | Promise<void>;

export function FormActionBar({
  formId,
  saveLabel,
  cancelHref,
  cancelLabel,
  deleteAction,
  deleteId,
  deleteLabel,
}: {
  formId: string;
  saveLabel: string;
  cancelHref?: string;
  cancelLabel?: string;
  deleteAction?: DeleteAction;
  deleteId?: string;
  deleteLabel?: string;
}) {
  return (
    <div
      className="fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-30 mx-auto w-full max-w-2xl border-t border-border/70 bg-card/95 px-4 py-3 shadow-[0_-10px_30px_-18px_rgba(0,0,0,.35)] backdrop-blur-xl lg:inset-x-auto lg:bottom-0 lg:left-[calc(50%+8rem)] lg:-translate-x-1/2"
    >
      <div className="flex items-center gap-2">
        {cancelHref && (
          <Link
            href={cancelHref}
            aria-label={cancelLabel}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-lg" }),
              "size-12 rounded-xl",
            )}
          >
            <X className="size-5" />
          </Link>
        )}
        {deleteAction && deleteId && (
          <form action={deleteAction}>
            <input type="hidden" name="id" value={deleteId} />
            <Button
              type="submit"
              variant="destructive"
              className="h-12 rounded-xl px-3"
              aria-label={deleteLabel}
            >
              <Trash2 className="size-4" />
              <span>{deleteLabel}</span>
            </Button>
          </form>
        )}
        <Button
          type="submit"
          form={formId}
          className="h-12 flex-1 rounded-xl text-base"
        >
          <Save className="size-4" />
          {saveLabel}
        </Button>
      </div>
    </div>
  );
}
