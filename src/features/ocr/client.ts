"use client";

import {
  createWorker,
  OEM,
  PSM,
  type LoggerMessage,
  type Worker,
} from "tesseract.js";
import { parseHealthDocument, type HealthDocumentType } from "@/features/ocr/parse";

const MAX_SOURCE_BYTES = 25 * 1024 * 1024;
const MAX_IMAGE_EDGE = 2600;

type ProgressListener = (progress: number) => void;
type DrawableImage = ImageBitmap | HTMLImageElement;

const progressListeners = new Set<ProgressListener>();
let workerPromise: Promise<Worker> | undefined;

export class LocalOcrError extends Error {
  constructor(
    public readonly code: "unsupported" | "too-large" | "no-text" | "unavailable",
    message: string,
  ) {
    super(message);
    this.name = "LocalOcrError";
  }
}

function reportWorkerProgress(message: LoggerMessage) {
  const progress = message.status === "recognizing text"
    ? 0.35 + message.progress * 0.6
    : 0.1 + message.progress * 0.25;
  for (const listener of progressListeners) listener(Math.min(0.95, progress));
}

async function getWorker() {
  if (!workerPromise) {
    workerPromise = createWorker(["vie", "eng"], OEM.LSTM_ONLY, {
      logger: reportWorkerProgress,
    })
      .then(async (worker) => {
        await worker.setParameters({
          tessedit_pageseg_mode: PSM.AUTO,
          preserve_interword_spaces: "1",
          user_defined_dpi: "300",
        });
        return worker;
      })
      .catch((error: unknown) => {
        workerPromise = undefined;
        throw error;
      });
  }
  return workerPromise;
}

async function decodeImage(file: File): Promise<DrawableImage> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // Some mobile browsers decode camera formats through an image element only.
    }
  }

  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new LocalOcrError("unsupported", "Unsupported image"));
      image.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function dimensions(image: DrawableImage) {
  return "naturalWidth" in image
    ? { width: image.naturalWidth, height: image.naturalHeight }
    : { width: image.width, height: image.height };
}

async function prepareDocumentImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new LocalOcrError("unsupported", "Unsupported image");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new LocalOcrError("too-large", "Image is too large");
  }

  const image = await decodeImage(file);
  try {
    const source = dimensions(image);
    if (!source.width || !source.height) {
      throw new LocalOcrError("unsupported", "Unsupported image");
    }
    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(source.width, source.height));
    const width = Math.max(1, Math.round(source.width * scale));
    const height = Math.max(1, Math.round(source.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new LocalOcrError("unavailable", "Canvas is unavailable");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    const pixels = context.getImageData(0, 0, width, height);
    const data = pixels.data;
    for (let index = 0; index < data.length; index += 4) {
      const grey = data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
      const contrasted = Math.max(0, Math.min(255, (grey - 128) * 1.2 + 128));
      data[index] = contrasted;
      data[index + 1] = contrasted;
      data[index + 2] = contrasted;
    }
    context.putImageData(pixels, 0, 0);
    return canvas;
  } finally {
    if ("close" in image) image.close();
  }
}

export async function scanHealthDocument(
  file: File,
  recordType: HealthDocumentType,
  onProgress?: ProgressListener,
) {
  let latestProgress = 0;
  const updateProgress: ProgressListener = (nextProgress) => {
    latestProgress = Math.max(latestProgress, nextProgress);
    onProgress?.(latestProgress);
  };
  progressListeners.add(updateProgress);

  try {
    updateProgress(0.03);
    const canvas = await prepareDocumentImage(file);
    updateProgress(0.1);
    const worker = await getWorker();
    updateProgress(0.35);
    const result = await worker.recognize(canvas, { rotateAuto: true });
    const text = result.data.text.replace(/\r/g, "").trim();
    if (text.replace(/\s/g, "").length < 8) {
      throw new LocalOcrError("no-text", "No readable text");
    }
    updateProgress(1);
    return {
      fields: parseHealthDocument(text, recordType),
      text,
      confidence: result.data.confidence,
    };
  } catch (error) {
    if (error instanceof LocalOcrError) throw error;
    throw new LocalOcrError("unavailable", "Local OCR is unavailable");
  } finally {
    progressListeners.delete(updateProgress);
  }
}
