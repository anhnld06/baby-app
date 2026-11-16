// Browser-only: sends a memory photo/video straight to object storage with a presigned PUT link.
// XMLHttpRequest (not fetch) because it reports upload progress on every browser, including iOS Safari.

export class DirectUploadError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "DirectUploadError";
  }
}

export function uploadToPresignedUrl(
  url: string,
  file: Blob,
  headers: Record<string, string>,
  onProgress?: (fraction: number) => void,
  signal?: AbortSignal,
) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url);
    for (const [name, value] of Object.entries(headers)) request.setRequestHeader(name, value);
    request.upload.onprogress = event => {
      if (event.lengthComputable && event.total > 0) onProgress?.(Math.min(1, event.loaded / event.total));
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) { onProgress?.(1); resolve(); }
      else reject(new DirectUploadError(`Upload failed with HTTP ${request.status}`, request.status));
    };
    request.onerror = () => reject(new DirectUploadError("Network error during upload"));
    request.ontimeout = () => reject(new DirectUploadError("Upload timed out"));
    request.onabort = () => reject(new DirectUploadError("Upload aborted"));
    signal?.addEventListener("abort", () => request.abort(), { once: true });
    request.send(file);
  });
}
