"use client";

const SUBSCRIPTION_URL = "/api/push/subscription";
const REQUEST_TIMEOUT_MS = 5000;

export function applicationServerKey(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
}

function timeoutSignal() {
  return typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
    ? AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    : undefined;
}

/** Upserts this device's subscription on the server (idempotent by endpoint). */
export function saveSubscriptionOnServer(subscription: PushSubscription) {
  return fetch(SUBSCRIPTION_URL, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription.toJSON()),
    signal: timeoutSignal(),
  });
}

export function deleteSubscriptionOnServer(endpoint: string) {
  return fetch(SUBSCRIPTION_URL, {
    method: "DELETE",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint }),
    signal: timeoutSignal(),
  });
}

/** True when the browser subscription was created with a different VAPID key. */
export function subscriptionUsesOtherKey(subscription: PushSubscription, publicKey: string) {
  const current = subscription.options?.applicationServerKey;
  if (!current) return false;
  const expected = applicationServerKey(publicKey);
  const actual = new Uint8Array(current);
  return actual.length !== expected.length || actual.some((byte, index) => byte !== expected[index]);
}

async function currentRegistration() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return undefined;
  // getRegistration() resolves immediately; `ready` could hang if no worker was ever installed.
  return navigator.serviceWorker.getRegistration().catch(() => undefined);
}

/**
 * Removes only THIS device's push subscription (server row + browser
 * subscription). The other parent's phone keeps its own subscription.
 */
export async function removeThisDevicePushSubscription() {
  const registration = await currentRegistration();
  const subscription = await registration?.pushManager?.getSubscription().catch(() => null);
  if (!subscription) return;
  // Delete on the server first, while the session cookie is still valid.
  await deleteSubscriptionOnServer(subscription.endpoint).catch(() => undefined);
  await subscription.unsubscribe().catch(() => false);
}
