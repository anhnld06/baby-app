import { afterEach, describe, expect, it, vi } from "vitest";
import {
  compressImageFile,
  decodeImage,
  HEIC_UNSUPPORTED_MESSAGE,
  IMAGE_SOURCE_TOO_LARGE_MESSAGE,
  IMAGE_TOO_LARGE_AFTER_COMPRESSION_MESSAGE,
  IMAGE_UNREADABLE_MESSAGE,
  ImageCompressionError,
  targetEdges,
  type DecodedImage,
  type ImageCanvas,
} from "./image-compress";

type Encoded = { width: number; height: number; type: string; quality: number };

/** Fake canvas: the encoded size is computed from pixels × quality so the step-down logic can be exercised. */
function fakeCanvas(options: { bytesPerPixel?: number; encodes?: Encoded[]; outputType?: (type: string) => string } = {}) {
  const draws: unknown[][] = [];
  const fills: string[] = [];
  const createCanvas = (width: number, height: number): ImageCanvas => {
    const context = {
      fillStyle: "" as string | CanvasGradient | CanvasPattern,
      fillRect: () => { fills.push(String(context.fillStyle)); },
      drawImage: (...args: unknown[]) => { draws.push(args); },
    };
    return {
      width,
      height,
      getContext: () => context as unknown as CanvasRenderingContext2D,
      toBlob: (callback, type = "image/png", quality = 1) => {
        options.encodes?.push({ width, height, type, quality });
        const size = Math.round(width * height * quality * (options.bytesPerPixel ?? 0.5));
        callback(new Blob([new Uint8Array(size)], { type: options.outputType?.(type) ?? type }));
      },
    };
  };
  return { createCanvas, draws, fills };
}

function decoded(width: number, height: number) {
  const close = vi.fn();
  const image: DecodedImage = { source: {} as CanvasImageSource, width, height, close };
  return { image, close, decode: vi.fn(async () => image) };
}

function photo(size: number, name = "IMG_0001.JPG", type = "image/jpeg") {
  return new File([new Uint8Array(size)], name, { type });
}

afterEach(() => vi.unstubAllGlobals());

describe("compressImageFile", () => {
  it("uploads a small JPEG/PNG/WebP untouched", async () => {
    const { decode } = decoded(800, 600);
    const file = photo(200_000, "small.png", "image/png");
    expect(await compressImageFile(file, { deps: { decode } })).toBe(file);
    expect(decode).not.toHaveBeenCalled();
  });

  it("downscales a large phone photo to 1920px on the long edge and re-encodes it as JPEG", async () => {
    const { image, close, decode } = decoded(4032, 3024);
    const encodes: Encoded[] = [];
    const canvas = fakeCanvas({ encodes, bytesPerPixel: 0.3 });
    const out = await compressImageFile(photo(6_500_000), { deps: { decode, createCanvas: canvas.createCanvas } });
    expect(out.type).toBe("image/jpeg");
    expect(out.name).toBe("IMG_0001.jpg");
    expect(out.size).toBeLessThanOrEqual(1_500_000);
    expect(encodes[0]).toEqual({ width: 1920, height: 1440, type: "image/jpeg", quality: 0.85 });
    expect(canvas.draws[0]).toEqual([image.source, 0, 0, 1920, 1440]);
    expect(canvas.fills[0]).toBe("#ffffff");
    expect(close).toHaveBeenCalledOnce();
  });

  it("steps quality down first, then the size, until the photo fits", async () => {
    const { decode } = decoded(3000, 4000);
    const encodes: Encoded[] = [];
    const canvas = fakeCanvas({ encodes, bytesPerPixel: 1 });
    const out = await compressImageFile(photo(9_000_000), { deps: { decode, createCanvas: canvas.createCanvas } });
    expect(out.size).toBeLessThanOrEqual(1_500_000);
    expect(encodes.slice(0, 4).map(e => e.quality)).toEqual([0.85, 0.75, 0.65, 0.55]);
    expect(encodes[0]).toMatchObject({ width: 1440, height: 1920 });
    expect(encodes[4]).toMatchObject({ width: 1200, height: 1600, quality: 0.85 });
    const last = encodes.at(-1)!;
    expect(last.width * last.height * last.quality).toBeLessThanOrEqual(1_500_000);
  });

  it("never upscales a small but heavy image", async () => {
    const { decode } = decoded(1000, 800);
    const encodes: Encoded[] = [];
    const canvas = fakeCanvas({ encodes, bytesPerPixel: 0.5 });
    await compressImageFile(photo(2_000_000, "scan.png", "image/png"), { deps: { decode, createCanvas: canvas.createCanvas } });
    expect(encodes[0]).toMatchObject({ width: 1000, height: 800 });
  });

  it("converts a HEIC photo the browser can decode, even when it is small", async () => {
    const { decode } = decoded(4032, 3024);
    const canvas = fakeCanvas({ bytesPerPixel: 0.2 });
    const out = await compressImageFile(photo(900_000, "IMG_0002.HEIC", "image/heic"), { deps: { decode, createCanvas: canvas.createCanvas } });
    expect(decode).toHaveBeenCalledOnce();
    expect(out).toMatchObject({ type: "image/jpeg", name: "IMG_0002.jpg" });
  });

  it("explains HEIC and unreadable images in Vietnamese", async () => {
    const decode = vi.fn(async () => { throw new Error("decode failed"); });
    await expect(compressImageFile(photo(3_000_000, "IMG_0003.heic", ""), { deps: { decode } })).rejects.toThrow(HEIC_UNSUPPORTED_MESSAGE);
    await expect(compressImageFile(photo(3_000_000, "broken.jpg"), { deps: { decode } })).rejects.toThrow(IMAGE_UNREADABLE_MESSAGE);
    await expect(compressImageFile(photo(3_000_000, "notes.txt", "text/plain"), { deps: { decode } })).rejects.toBeInstanceOf(ImageCompressionError);
    await expect(compressImageFile(photo(41 * 1024 * 1024), { deps: { decode } })).rejects.toThrow(IMAGE_SOURCE_TOO_LARGE_MESSAGE);
  });

  it("falls back to JPEG when the browser cannot encode WebP (Safari returns PNG)", async () => {
    const { decode } = decoded(4000, 3000);
    const encodes: Encoded[] = [];
    const canvas = fakeCanvas({ encodes, bytesPerPixel: 0.3, outputType: type => type === "image/webp" ? "image/png" : type });
    const out = await compressImageFile(photo(5_000_000), { mimeTypes: ["image/webp", "image/jpeg"], deps: { decode, createCanvas: canvas.createCanvas } });
    expect(out.type).toBe("image/jpeg");
    expect(encodes.filter(e => e.type === "image/webp")).toHaveLength(1);
  });

  it("uses WebP when it is supported and requested", async () => {
    const { decode } = decoded(4000, 3000);
    const canvas = fakeCanvas({ bytesPerPixel: 0.3 });
    const out = await compressImageFile(photo(5_000_000), { mimeTypes: ["image/webp", "image/jpeg"], deps: { decode, createCanvas: canvas.createCanvas } });
    expect(out).toMatchObject({ type: "image/webp", name: "IMG_0001.webp" });
  });

  it("gives up with a clear message and releases the bitmap when nothing fits", async () => {
    const { decode, close } = decoded(4000, 3000);
    const canvas = fakeCanvas({ bytesPerPixel: 50 });
    await expect(compressImageFile(photo(5_000_000), { deps: { decode, createCanvas: canvas.createCanvas } })).rejects.toThrow(IMAGE_TOO_LARGE_AFTER_COMPRESSION_MESSAGE);
    expect(close).toHaveBeenCalledOnce();
  });
});

describe("decodeImage", () => {
  it("applies EXIF orientation through createImageBitmap", async () => {
    const bitmap = { width: 3024, height: 4032, close: vi.fn() };
    const create = vi.fn(async () => bitmap);
    vi.stubGlobal("createImageBitmap", create);
    const result = await decodeImage(photo(10));
    expect(create).toHaveBeenCalledWith(expect.any(File), { imageOrientation: "from-image" });
    expect(result).toMatchObject({ width: 3024, height: 4032 });
    result.close?.();
    expect(bitmap.close).toHaveBeenCalled();
  });

  it("falls back to an <img> element (Safari decodes some camera formats only there)", async () => {
    vi.stubGlobal("createImageBitmap", vi.fn(async () => { throw new TypeError("unsupported"); }));
    const revoke = vi.fn();
    vi.stubGlobal("URL", Object.assign(class extends URL {}, { createObjectURL: () => "blob:photo", revokeObjectURL: revoke }));
    class FakeImage {
      naturalWidth = 3024; naturalHeight = 4032; decoding = ""; onload?: () => void; onerror?: () => void;
      set src(value: string) { expect(value).toBe("blob:photo"); queueMicrotask(() => this.onload?.()); }
    }
    vi.stubGlobal("Image", FakeImage);
    expect(await decodeImage(photo(10))).toMatchObject({ width: 3024, height: 4032 });
    expect(revoke).toHaveBeenCalledWith("blob:photo");
  });
});

describe("targetEdges", () => {
  it("lists decreasing edges without upscaling", () => {
    expect(targetEdges(4032, 1920)).toEqual([1920, 1600, 1280, 1024, 800]);
    expect(targetEdges(1000, 1920)).toEqual([1000, 800]);
    expect(targetEdges(600, 1280)).toEqual([600]);
  });
});

describe("profile cover compression options", () => {
  const coverOptions = { maxEdge: 1280, maxBytes: 450 * 1024, alwaysReencode: true, maxSourceBytes: 20 * 1024 * 1024 };

  it("re-encodes even a small JPEG to at most 1280px and 450 KB", async () => {
    const { decode } = decoded(4000, 3000);
    const encodes: Encoded[] = [];
    const canvas = fakeCanvas({ encodes, bytesPerPixel: 0.2 });
    const out = await compressImageFile(photo(300_000, "cover.jpg"), { ...coverOptions, deps: { decode, createCanvas: canvas.createCanvas } });
    expect(decode).toHaveBeenCalledOnce();
    expect(encodes[0]).toMatchObject({ width: 1280, height: 960, type: "image/jpeg" });
    expect(out.type).toBe("image/jpeg");
    expect(out.size).toBeLessThanOrEqual(450 * 1024);
  });

  it("rejects sources above the 20 MB cover limit before decoding", async () => {
    const { decode } = decoded(4000, 3000);
    await expect(compressImageFile(photo(21 * 1024 * 1024), { ...coverOptions, deps: { decode } })).rejects.toBeInstanceOf(ImageCompressionError);
    expect(decode).not.toHaveBeenCalled();
  });
});
