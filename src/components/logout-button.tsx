"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { clearOfflineData, unsyncedCountAfterSync } from "@/lib/offline-db";
import { removeThisDevicePushSubscription } from "@/lib/push-client";

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
          // Sync first so records saved offline are not wiped by logout.
          const unsynced = await unsyncedCountAfterSync().catch(() => 0);
          if (
            unsynced > 0 &&
            !window.confirm(
              `Còn ${unsynced} bản ghi chưa đồng bộ lên máy chủ. Đăng xuất sẽ xóa vĩnh viễn ${unsynced} bản ghi này khỏi thiết bị. Vẫn đăng xuất?`,
            )
          ) {
            return;
          }
          // Only this phone stops receiving reminders; the other parent's device is untouched.
          await removeThisDevicePushSubscription().catch(() => undefined);
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
