export type ByteRange = { start: number; end: number };

/**
 * Parses a single-range `Range: bytes=...` header (RFC 9110 §14.1.2) against a known size.
 *
 * - `null`: no usable Range (absent, malformed, other unit or multiple ranges) → serve 200 in full.
 * - `"unsatisfiable"`: syntactically valid but outside the representation → 416.
 * - `{ start, end }`: inclusive byte offsets to serve with 206.
 */
export function parseByteRange(header: string | null, size: number): ByteRange | "unsatisfiable" | null {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null;
  const [, first, last] = match;
  if (!first && !last) return null;
  if (!first) {
    // Suffix range: the final N bytes.
    const suffix = Number(last);
    if (!Number.isSafeInteger(suffix)) return null;
    if (suffix === 0 || size === 0) return "unsatisfiable";
    return { start: Math.max(0, size - suffix), end: size - 1 };
  }
  const start = Number(first);
  const requestedEnd = last ? Number(last) : size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(requestedEnd)) return null;
  if (last && requestedEnd < start) return null; // invalid range-spec: ignore the header
  if (start >= size) return "unsatisfiable";
  return { start, end: Math.min(requestedEnd, size - 1) };
}

/** Reads `length` bytes starting at zero-based `offset`. */
export type ByteReader = (offset: number, length: number) => Promise<Uint8Array>;

/** Size of each database read while streaming media, so a request never buffers a whole video. */
export const MEDIA_CHUNK_BYTES = 1024 * 1024;

/** Streams bytes `start..end` (inclusive) by pulling bounded slices from `read`. */
export function byteRangeStream(read: ByteReader, start: number, end: number, chunkBytes = MEDIA_CHUNK_BYTES) {
  let offset = start;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (offset > end) {
        controller.close();
        return;
      }
      const length = Math.min(chunkBytes, end - offset + 1);
      const bytes = await read(offset, length);
      if (bytes.length !== length) {
        // The row changed or vanished mid-stream; never send fewer bytes than Content-Length promises silently.
        controller.error(new Error("Media changed while streaming"));
        return;
      }
      offset += length;
      controller.enqueue(bytes);
      if (offset > end) controller.close();
    },
  });
}
