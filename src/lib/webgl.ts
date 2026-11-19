/**
 * Quietly checks whether the browser can create a WebGL rendering context
 * before instantiating `THREE.WebGLRenderer`, avoiding noisy console errors
 * in headless browsers or restricted WebViews.
 */
let cachedSupport: boolean | null = null;

export function supportsWebGL(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  if (cachedSupport !== null) {
    return cachedSupport;
  }
  try {
    const probe = document.createElement("canvas");
    const gl =
      probe.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ||
      probe.getContext("webgl", { failIfMajorPerformanceCaveat: false });
    cachedSupport = Boolean(gl);
  } catch {
    cachedSupport = false;
  }
  return cachedSupport;
}

export function resetWebGLSupportCacheForTest() {
  cachedSupport = null;
}

export function isReducedMotionPreferred(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isDarkDocument(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  return document.documentElement.classList.contains("dark");
}
