"use client";

import { Bell, BellOff, LoaderCircle } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

function applicationServerKey(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
}

function pushSupported() {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function PushNotificationSettings({ publicKey }: { publicKey?: string }) {
  const [enabled, setEnabled] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const supported = useSyncExternalStore(
    () => () => undefined,
    pushSupported,
    () => false,
  );

  useEffect(() => {
    if (!supported) return;
    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setEnabled(Boolean(subscription)))
      .catch(() => setMessage("Chưa thể đọc trạng thái thông báo."));
  }, [supported]);

  async function enable() {
    if (!supported || !publicKey) return;
    setPending(true);
    setMessage("");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setMessage("Bạn chưa cho phép Vani Family gửi thông báo.");
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey(publicKey),
        }));
      const response = await fetch("/api/push/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });
      if (!response.ok) throw new Error("save failed");
      setEnabled(true);
      setMessage("Đã bật nhắc lịch trên thiết bị này.");
    } catch {
      setMessage("Chưa thể bật thông báo. Hãy kiểm tra kết nối và thử lại.");
    } finally {
      setPending(false);
    }
  }

  async function disable() {
    setPending(true);
    setMessage("");
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await fetch("/api/push/subscription", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }
      setEnabled(false);
      setMessage("Đã tắt nhắc lịch trên thiết bị này.");
    } catch {
      setMessage("Chưa thể tắt thông báo. Vui lòng thử lại.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mt-3 rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
            {enabled ? <Bell className="size-5" /> : <BellOff className="size-5" />}
          </span>
          <div>
            <p className="font-medium">Nhắc lịch trên thiết bị</p>
            <p className="text-xs text-muted-foreground">
              Nhắc lịch tiêm, tái khám và khám thai kể cả khi ứng dụng đã đóng.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant={enabled ? "outline" : "secondary"}
          className="h-11 shrink-0 rounded-xl"
          disabled={pending || !supported || !publicKey}
          onClick={enabled ? disable : enable}
        >
          {pending && <LoaderCircle className="size-4 animate-spin" />}
          {enabled ? "Tắt" : "Bật"}
        </Button>
      </div>
      {!publicKey && (
        <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">
          Quản trị viên chưa cấu hình VAPID cho môi trường này.
        </p>
      )}
      {!supported && (
        <p className="mt-3 text-xs text-muted-foreground">
          Trình duyệt này chưa hỗ trợ Web Push.
        </p>
      )}
      {message && <p role="status" className="mt-3 text-xs text-muted-foreground">{message}</p>}
    </section>
  );
}
