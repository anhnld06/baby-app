"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { clearOfflineData } from "@/lib/offline-db";

export function LogoutButton({
  action,
  label,
}: {
  action: () => Promise<void>;
  label: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 rounded-xl"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await clearOfflineData().catch(() => undefined);
          await action();
        });
      }}
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : <LogOut className="size-4" />}
      {label}
    </Button>
  );
}
