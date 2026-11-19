import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isReducedMotionPreferred,
  resetWebGLSupportCacheForTest,
  supportsWebGL,
} from "./webgl";

describe("webgl helpers", () => {
  afterEach(() => {
    resetWebGLSupportCacheForTest();
    vi.restoreAllMocks();
  });

  it("returns false cleanly when document is unavailable or context creation throws", () => {
    const originalDocument = globalThis.document;
    vi.stubGlobal("window", {});
    vi.stubGlobal("document", {
      createElement: () => ({
        getContext: () => {
          throw new Error("WebGL disabled");
        },
      }),
    });
    expect(supportsWebGL()).toBe(false);
    vi.stubGlobal("document", originalDocument);
  });

  it("caches positive WebGL2 detection", () => {
    const getContext = vi.fn().mockReturnValue({});
    vi.stubGlobal("window", {});
    vi.stubGlobal("document", {
      createElement: () => ({ getContext }),
    });
    expect(supportsWebGL()).toBe(true);
    expect(supportsWebGL()).toBe(true);
    expect(getContext).toHaveBeenCalledTimes(1);
  });

  it("detects prefers-reduced-motion media query", () => {
    vi.stubGlobal("window", {
      matchMedia: (query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
      }),
    });
    expect(isReducedMotionPreferred()).toBe(true);
  });
});
