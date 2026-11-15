import { describe, expect, it } from "vitest";
import { isAllowedPushEndpoint } from "@/lib/push-endpoint";

describe("push endpoint allowlist", () => {
  it.each([
    "https://fcm.googleapis.com/fcm/send/abc:APA91b",
    "https://fcm.googleapis.com/wp/abc",
    "https://web.push.apple.com/QGuQyavXutnMH",
    "https://wns2-par02p.notify.windows.com/w/?token=BQYAAA",
    "https://updates.push.services.mozilla.com/wpush/v2/gAAAAA",
    "https://updates-autopush.push.services.mozilla.com/wpush/v2/gAAAAA",
    "https://FCM.GoogleAPIs.com/fcm/send/abc",
  ])("accepts %s", (endpoint) => {
    expect(isAllowedPushEndpoint(endpoint)).toBe(true);
  });

  it.each([
    ["plain http", "http://fcm.googleapis.com/fcm/send/abc"],
    ["internal host", "https://localhost/fcm/send"],
    ["metadata IP", "https://169.254.169.254/latest/meta-data"],
    ["lookalike suffix", "https://evilpush.apple.com/abc"],
    ["bare apex suffix", "https://push.apple.com/abc"],
    ["attacker domain ending", "https://fcm.googleapis.com.evil.example/abc"],
    ["custom port", "https://fcm.googleapis.com:8443/fcm/send/abc"],
    ["credentials", "https://user:pass@fcm.googleapis.com/fcm/send/abc"],
    ["not a URL", "fcm.googleapis.com/fcm/send/abc"],
    ["other scheme", "javascript:alert(1)"],
  ])("rejects %s", (_label, endpoint) => {
    expect(isAllowedPushEndpoint(endpoint)).toBe(false);
  });
});
