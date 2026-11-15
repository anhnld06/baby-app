import { describe, expect, it, vi } from "vitest";
import { byteRangeStream, parseByteRange } from "./media-range";

describe("Range header parsing", () => {
  it("serves the whole file without a usable Range header", () => {
    for (const header of [null, "", "items=0-1", "bytes=-", "bytes=0-1,4-5", "bytes=5-2", "bytes=abc"]) {
      expect(parseByteRange(header, 100)).toBeNull();
    }
  });

  it("parses bounded, open-ended and suffix ranges", () => {
    expect(parseByteRange("bytes=0-1", 100)).toEqual({ start: 0, end: 1 });
    expect(parseByteRange("bytes=10-", 100)).toEqual({ start: 10, end: 99 });
    expect(parseByteRange("bytes=90-500", 100)).toEqual({ start: 90, end: 99 });
    expect(parseByteRange("bytes=-10", 100)).toEqual({ start: 90, end: 99 });
    expect(parseByteRange("bytes=-500", 100)).toEqual({ start: 0, end: 99 });
  });

  it("reports unsatisfiable ranges", () => {
    expect(parseByteRange("bytes=100-", 100)).toBe("unsatisfiable");
    expect(parseByteRange("bytes=150-200", 100)).toBe("unsatisfiable");
    expect(parseByteRange("bytes=-0", 100)).toBe("unsatisfiable");
    expect(parseByteRange("bytes=0-", 0)).toBe("unsatisfiable");
  });
});

describe("byteRangeStream", () => {
  const source = Uint8Array.from({ length: 10 }, (_, index) => index);
  async function collect(stream: ReadableStream<Uint8Array>) {
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  it("reads only the requested slice in bounded chunks", async () => {
    const read = vi.fn(async (offset: number, length: number) => source.slice(offset, offset + length));
    expect([...await collect(byteRangeStream(read, 2, 8, 3))]).toEqual([2, 3, 4, 5, 6, 7, 8]);
    expect(read.mock.calls).toEqual([[2, 3], [5, 3], [8, 1]]);
  });

  it("errors instead of sending a short body", async () => {
    const read = vi.fn(async () => new Uint8Array());
    await expect(collect(byteRangeStream(read, 0, 4))).rejects.toThrow();
  });
});
