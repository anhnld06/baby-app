import { afterEach, describe, expect, it, vi } from "vitest";
import { actionErrorMessage, failureKind } from "@/lib/form-action-errors";

describe("form action errors", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reads an error returned by a server action", () => {
    expect(actionErrorMessage({ error: "Giờ kết thúc phải sau giờ bắt đầu." })).toBe(
      "Giờ kết thúc phải sau giờ bắt đầu.",
    );
    expect(actionErrorMessage(undefined)).toBeUndefined();
    expect(actionErrorMessage({ error: "  " })).toBeUndefined();
    expect(actionErrorMessage({ ok: true })).toBeUndefined();
  });

  it("recognises fetch failures from each browser as network errors", () => {
    vi.stubGlobal("navigator", { onLine: true });
    for (const message of [
      "Failed to fetch",
      "Load failed",
      "NetworkError when attempting to fetch resource.",
      "The network connection was lost.",
    ]) {
      expect(failureKind(new TypeError(message))).toBe("network");
    }
  });

  it("does not treat programming errors or server failures as network or input errors", () => {
    vi.stubGlobal("navigator", { onLine: true });
    expect(failureKind(new TypeError("Cannot read properties of undefined"))).toBe("generic");
    expect(failureKind(new Error("An unexpected response was received from the server."))).toBe("generic");
  });

  it("flags aborted requests as uncertain, since they may have reached the server", () => {
    expect(failureKind(new DOMException("aborted", "AbortError"))).toBe("uncertain");
    expect(failureKind(new DOMException("timeout", "TimeoutError"))).toBe("uncertain");
  });

  it("treats any failure while the browser is offline as a network error", () => {
    vi.stubGlobal("navigator", { onLine: false });
    expect(failureKind(new Error("boom"))).toBe("network");
  });

  it("reports stale deployments separately", () => {
    expect(failureKind(new Error("not found"), true)).toBe("outdated");
  });
});
