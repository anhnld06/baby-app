/**
 * Web Push endpoints are URLs the server later POSTs to, so accepting any URL
 * would let a client make the server call arbitrary hosts (SSRF). Only the
 * push services used by real browsers are accepted.
 */
const EXACT_HOSTS = new Set([
  "fcm.googleapis.com",
  "updates.push.services.mozilla.com",
]);

const HOST_SUFFIXES = [
  ".push.apple.com",
  ".notify.windows.com",
  ".push.services.mozilla.com",
];

export function isAllowedPushEndpoint(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  if (url.username || url.password || url.port) return false;
  const host = url.hostname.toLowerCase();
  if (EXACT_HOSTS.has(host)) return true;
  return HOST_SUFFIXES.some(
    (suffix) => host.endsWith(suffix) && host.length > suffix.length,
  );
}
