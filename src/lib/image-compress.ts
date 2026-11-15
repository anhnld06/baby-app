// Client-side photo shrinking before upload (browser only: uses canvas / createImageBitmap).
// Phone photos are 3–8 MB, above what a Server Action can carry on Vercel (4.5 MB request
// bodies), so they are decoded, downscaled and re-encoded on the device first.

/** Default target: a sharp phone-screen photo that leaves plenty of room in a 4 MB upload. */
export const COMPRESSED_IMAGE_MAX_BYTES = 1_500_000;
export const COMPRESSED_IMAGE_MAX_EDGE = 1920;
/** Refuse absurd sources before decoding (a 48 MP HEIC/JPEG is ~10–25 MB). */
export const MAX_IMAGE_SOURCE_BYTES = 40 * 1024 * 1024;

const DEFAULT_EDGES = [1920, 1600, 1280, 1024, 800];
const DEFAULT_QUALITIES = [0.85, 0.75, 0.65, 0.55];
const PASS_THROUGH_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const IMAGE_UNREADABLE_MESSAGE = "Không đọc được ảnh này. Hãy chọn ảnh JPG, PNG hoặc WebP khác.";
export const HEIC_UNSUPPORTED_MESSAGE =
  "Trình duyệt này chưa đọc được ảnh HEIC. Hãy mở bằng Safari trên iPhone, hoặc chọn ảnh JPG/PNG (Cài đặt › Camera › Định dạng › Tương thích nhất).";
export const IMAGE_SOURCE_TOO_LARGE_MESSAGE = "Ảnh gốc lớn hơn 40 MB. Hãy chọn ảnh khác.";
export const IMAGE_TOO_LARGE_AFTER_COMPRESSION_MESSAGE = "Không thể nén ảnh đủ nhỏ. Hãy chọn ảnh khác.";
export const CANVAS_UNSUPPORTED_MESSAGE = "Trình duyệt chưa hỗ trợ xử lý ảnh. Hãy thử trình duyệt khác.";

export class ImageCompressionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageCompressionError";
  }
}

type NamedBlob = Blob & { name?: string };

export function isHeicLike(file: NamedBlob) {
  return /^image\/hei[cf](-sequence)?$/i.test(file.type) || /\.hei[cf]$/i.test(file.name ?? "");
}

/** True for files the browser labels as images, plus unlabeled files with an image extension. */
export function looksLikeImage(file: NamedBlob) {
  if (file.type) return file.type.toLowerCase().startsWith("image/");
  return /\.(jpe?g|png|webp|gif|bmp|hei[cf]|avif)$/i.test(file.name ?? "");
}

export type DecodedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  close?: () => void;
};

export type ImageCanvas = {
  width: number;
  height: number;
  getContext(type: "2d"): Pick<CanvasRenderingContext2D, "fillStyle" | "fillRect" | "drawImage"> | null;
  toBlob(callback: (blob: Blob | null) => void, type?: string, quality?: number): void;
};

export type ImageCompressDeps = {
  decode: (file: Blob) => Promise<DecodedImage>;
  createCanvas: (width: number, height: number) => ImageCanvas;
};

export type CompressImageOptions = {
  /** Longest edge of the output, in pixels. */
  maxEdge?: number;
  /** Output must not exceed this many bytes. */
  maxBytes?: number;
  /** Encoders to try, in order; the first one the browser really supports is used. */
  mimeTypes?: readonly ("image/jpeg" | "image/webp")[];
  qualities?: readonly number[];
  maxSourceBytes?: number;
  /** Re-encode even a small JPEG/PNG/WebP (default: small files are uploaded untouched). */
  alwaysReencode?: boolean;
  /** Painted under transparent pixels (JPEG has no alpha). */
  background?: string;
  deps?: Partial<ImageCompressDeps>;
};

function loadWithImageElement(file: Blob) {
  const url = URL.createObjectURL(file);
  return new Promise<DecodedImage>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve({ source: image, width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("decode failed"));
    image.src = url;
  }).finally(() => URL.revokeObjectURL(url));
}

/** Decodes with EXIF orientation applied; falls back to <img> (Safari decodes some camera formats only there). */
export async function decodeImage(file: Blob): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
    } catch {
      // Not decodable this way (or the option is unsupported): <img> also applies EXIF orientation.
    }
  }
  return loadWithImageElement(file);
}

function createDomCanvas(width: number, height: number): ImageCanvas {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function canvasToBlob(canvas: ImageCanvas, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => {
    try {
      canvas.toBlob(resolve, type, quality);
    } catch {
      resolve(null);
    }
  });
}

function outputName(name: string | undefined, type: string) {
  const base = (name ?? "").replace(/\.[^./\\]*$/, "").trim() || "anh";
  return `${base}.${type === "image/webp" ? "webp" : "jpg"}`;
}

/** Long-edge sizes to try, largest first, never upscaling. */
export function targetEdges(longEdge: number, maxEdge: number) {
  const edges = [maxEdge, ...DEFAULT_EDGES.filter((edge) => edge < maxEdge)]
    .map((edge) => Math.min(edge, longEdge));
  return [...new Set(edges)].filter((edge) => edge > 0);
}

/**
 * Returns a File no larger than `maxBytes`: small JPEG/PNG/WebP files are returned as-is,
 * anything else (large photos, HEIC, GIF, unlabeled images) is downscaled and re-encoded.
 * Throws ImageCompressionError with a Vietnamese message that can be shown to the user.
 */
export async function compressImageFile(file: File, options: CompressImageOptions = {}): Promise<File> {
  const maxBytes = options.maxBytes ?? COMPRESSED_IMAGE_MAX_BYTES;
  const maxEdge = options.maxEdge ?? COMPRESSED_IMAGE_MAX_EDGE;
  const mimeTypes = options.mimeTypes ?? ["image/jpeg"];
  const qualities = options.qualities ?? DEFAULT_QUALITIES;
  const deps: ImageCompressDeps = { decode: decodeImage, createCanvas: createDomCanvas, ...options.deps };

  if (!looksLikeImage(file)) throw new ImageCompressionError(IMAGE_UNREADABLE_MESSAGE);
  if (file.size > (options.maxSourceBytes ?? MAX_IMAGE_SOURCE_BYTES)) throw new ImageCompressionError(IMAGE_SOURCE_TOO_LARGE_MESSAGE);
  const type = file.type.toLowerCase();
  if (!options.alwaysReencode && file.size <= maxBytes && PASS_THROUGH_TYPES.includes(type)) return file;

  let image: DecodedImage;
  try {
    image = await deps.decode(file);
  } catch {
    throw new ImageCompressionError(isHeicLike(file) ? HEIC_UNSUPPORTED_MESSAGE : IMAGE_UNREADABLE_MESSAGE);
  }
  try {
    if (!(image.width > 0 && image.height > 0)) throw new ImageCompressionError(IMAGE_UNREADABLE_MESSAGE);
    const supported = new Set<string>();
    const unsupported = new Set<string>();
    for (const edge of targetEdges(Math.max(image.width, image.height), maxEdge)) {
      const scale = edge / Math.max(image.width, image.height);
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = deps.createCanvas(width, height);
      const context = canvas.getContext("2d");
      if (!context) throw new ImageCompressionError(CANVAS_UNSUPPORTED_MESSAGE);
      context.fillStyle = options.background ?? "#ffffff";
      context.fillRect(0, 0, width, height);
      context.drawImage(image.source, 0, 0, width, height);
      for (const mime of mimeTypes) {
        if (unsupported.has(mime)) continue;
        for (const quality of qualities) {
          const blob = await canvasToBlob(canvas, mime, quality);
          if (!blob) break;
          // Browsers silently fall back to PNG for encoders they lack (e.g. WebP on Safari).
          if (blob.type && blob.type !== mime && !supported.has(mime)) { unsupported.add(mime); break; }
          supported.add(mime);
          if (blob.size > 0 && blob.size <= maxBytes) {
            return new File([blob], outputName(file.name, mime), { type: mime, lastModified: file.lastModified || Date.now() });
          }
        }
      }
      if (mimeTypes.every((mime) => unsupported.has(mime))) throw new ImageCompressionError(CANVAS_UNSUPPORTED_MESSAGE);
    }
    throw new ImageCompressionError(IMAGE_TOO_LARGE_AFTER_COMPRESSION_MESSAGE);
  } finally {
    image.close?.();
  }
}
