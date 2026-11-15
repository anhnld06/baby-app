import { createHash, timingSafeEqual } from "node:crypto";

// Compares fixed-length SHA-256 digests so neither the content nor the length of the secret
// leaks through response timing.
export function equalSecret(actual: string, expected: string) {
  const actualHash = createHash("sha256").update(actual).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(actualHash, expectedHash);
}
