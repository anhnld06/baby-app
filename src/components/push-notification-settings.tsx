"use client";

import { Bell, BellOff, LoaderCircle } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  applicationServerKey,
  deleteSubscriptionOnServer,
  saveSubscriptionOnServer,
  subscriptionUsesOtherKey,
} from "@/lib/push-client";

function pushSupported() {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

async function subscribe(registration: ServiceWorkerRegistration, publicKey: string) {
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey(publicKey),
  });
}

/**
 * The server prunes subscriptions that the push service reports as gone, and
 * VAPID keys may be rotated. Re-register the browser subscription on every
 * visit so "Bật" in the UI matches what the server can actually deliver to.
 */
async function renewSubscription(publicKey?: string) {
  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) return { enabled: false, synced: true };
  if (publicKey && subscriptionUsesOtherKey(subscription, publicKey)) {
    const oldEndpoint = subscription.endpoint;
    await subscription.unsubscribe();
    await deleteSubscriptionOnServer(oldEndpoint).catch(() => undefined);
    if (Notification.permission !== "granted") return { enabled: false, synced: true };
    // Some browsers only allow subscribe() after a tap; the user can then press "Bật" again.
    const renewed = await subscribe(registration, publicKey).catch(() => null);
    if (!renewed) return { enabled: false, synced: true };
    subscription = renewed;
  }
  const response = await saveSubscriptionOnServer(subscription).catch(() => null);
  return { enabled: true, synced: Boolean(response?.ok) || response === null };
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
    let cancelled = false;
    renewSubscription(publicKey)
      .then(({ enabled: active, synced }) => {
        if (cancelled) return;
        setEnabled(active);
        if (!synced) {
          setMessage("Máy chủ chưa nhận đăng ký thông báo của thiết bị này. Hãy tắt rồi bật lại.");
        }
      })
      .catch(() => {
        if (!cancelled) setMessage("Chưa thể đọc trạng thái thông báo.");
      });
    return () => {
      cancelled = true;
    };
  }, [supported, publicKey]);

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
        (await subscribe(registration, publicKey));
      const response = await saveSubscriptionOnServer(subscription);
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
        const response = await deleteSubscriptionOnServer(subscription.endpoint);
        if (!response.ok) throw new Error("delete failed");
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
              Nhắc lịch tiêm, tái khám, hành trình thai kỳ và giờ dùng thuốc kể cả khi ứng dụng đã đóng. Dùng chung cài đặt cho thiết bị này.
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
