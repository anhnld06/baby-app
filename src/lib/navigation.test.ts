import { describe, expect, it } from "vitest";
import { isRouteActive, NavigationLedger, parentRoute } from "./navigation";

describe("navigation", () => {
  it("uses segment boundaries for the active tab", () => {
    expect(isRouteActive("/mother/pregnancy", "/mother")).toBe(true);
    expect(isRouteActive("/motherhood", "/mother")).toBe(false);
    expect(isRouteActive("/baby", "/")).toBe(false);
  });

  it("provides parents when a page is opened directly", () => {
    expect(parentRoute("/tracking/feeding")).toBe("/baby");
    expect(parentRoute("/mother/pregnancy")).toBe("/mother");
    expect(parentRoute("/knowledge/an-article")).toBe("/knowledge");
    expect(parentRoute("/stories/a-story")).toBe("/stories");
    expect(new NavigationLedger("/tracking/feeding").previous()).toBeUndefined();
  });

  it("returns to the actual entry point and preserves its filters", () => {
    const ledger = new NavigationLedger("/knowledge?stage=PREGNANCY");
    ledger.push("/knowledge/an-article");
    expect(ledger.previous()).toEqual({ href: "/knowledge?stage=PREGNANCY", delta: -1 });
  });

  it("does not add edit/save replacements to history", () => {
    const ledger = new NavigationLedger("/baby");
    ledger.push("/tracking/feeding");
    ledger.replace("/tracking/feeding?edit=record");
    ledger.replace("/tracking/feeding");
    expect(ledger.previous()).toEqual({ href: "/baby", delta: -1 });
  });

  it("tracks cross-page redirects as replacements, not imagined visits", () => {
    const ledger = new NavigationLedger("/");
    ledger.push("/profile/mother?next=pregnancy");
    ledger.replace("/profile/pregnancy");
    expect(ledger.previous()).toEqual({ href: "/", delta: -1 });
  });

  it("supports native back, forward, and a new branch after back", () => {
    const ledger = new NavigationLedger("/");
    ledger.push("/baby");
    ledger.push("/tracking/sleep");
    expect(ledger.traverse(1)).toBe(true);
    expect(ledger.previous()?.href).toBe("/");
    expect(ledger.traverse(2)).toBe(true);
    expect(ledger.previous()?.href).toBe("/baby");
    ledger.traverse(1);
    ledger.push("/tracking/diaper");
    expect(ledger.traverse(3)).toBe(false);
    expect(ledger.previous()?.href).toBe("/baby");
  });

  it("skips same-page search and hash entries without leaving the app", () => {
    const ledger = new NavigationLedger("/baby");
    ledger.push("/tracking/growth");
    ledger.push("/tracking/growth?limit=60");
    ledger.push("/tracking/growth?limit=60#history");
    expect(ledger.previous()).toEqual({ href: "/baby", delta: -3 });
    expect(ledger.traverse(-1)).toBe(false);
    expect(ledger.traverse(Number.NaN)).toBe(false);
  });
});
