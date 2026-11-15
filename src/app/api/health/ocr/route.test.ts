import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ user: vi.fn(), extract: vi.fn() }));
vi.mock("@/lib/auth", () => ({ getCurrentUser: mocks.user }));
vi.mock("@/features/ai/provider", () => ({ getAIProvider: () => ({ extractFromImage: mocks.extract }) }));
import { POST } from "./route";

function upload(bytes: number[] | string, type: string) {
  const form = new FormData();
  const part = typeof bytes === "string" ? bytes : new Uint8Array(bytes);
  form.set("image", new File([part], "scan", { type }));
  form.set("recordType", "prescription");
  return new Request("http://localhost/api/health/ocr", { method: "POST", body: form });
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.user.mockResolvedValue({ id: "user-1" });
  mocks.extract.mockResolvedValue({ fields: {} });
});

describe("OCR upload route", () => {
  it("rejects a declared oversized body before reading it", async () => {
    const formData = vi.fn();
    const request = {
      headers: new Headers({ "content-length": String(5 * 1024 * 1024) }),
      formData,
    } as unknown as Request;
    const response = await POST(request);
    expect(response.status).toBe(413);
    expect(formData).not.toHaveBeenCalled();
  });

  it("verifies magic bytes instead of trusting the browser MIME type", async () => {
    const response = await POST(upload("<svg onload=alert(1)>", "image/png"));
    expect(response.status).toBe(400);
    expect(mocks.extract).not.toHaveBeenCalled();
  });

  it("passes valid images to the provider", async () => {
    const response = await POST(upload([0xff, 0xd8, 0xff, 0xe0, 0, 0], "image/jpeg"));
    expect(response.status).toBe(200);
    expect(mocks.extract).toHaveBeenCalledWith(
      expect.objectContaining({ imageDataUrl: expect.stringMatching(/^data:image\/jpeg;base64,/) }),
    );
  });

  it("requires a session", async () => {
    mocks.user.mockResolvedValue(null);
    expect((await POST(upload([0xff, 0xd8, 0xff], "image/jpeg"))).status).toBe(401);
  });
});
