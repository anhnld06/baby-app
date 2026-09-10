import { describe, expect, it } from "vitest";
import { parseVoiceLog } from "@/features/voice-log/parse";

const now = new Date(2026, 8, 10, 10, 0, 0);

describe("parseVoiceLog", () => {
  it("parses a completed breastfeeding session", () => {
    expect(parseVoiceLog("Bé bú mẹ bên trái 10 phút", now)).toEqual({
      ok: true,
      draft: {
        kind: "feeding",
        operation: "complete",
        type: "BREASTFEEDING",
        startTime: "2026-09-10T09:50",
        endTime: "2026-09-10T10:00",
        leftBreastDuration: 10,
        rightBreastDuration: null,
        firstSide: "LEFT",
        amountMl: null,
        milkType: "",
      },
    });
  });

  it("parses the Vietnamese minute abbreviation without a space", () => {
    expect(parseVoiceLog("bú mẹ bên trái 10p", now)).toMatchObject({
      ok: true,
      draft: {
        kind: "feeding",
        operation: "complete",
        startTime: "2026-09-10T09:50",
        endTime: "2026-09-10T10:00",
        leftBreastDuration: 10,
        firstSide: "LEFT",
      },
    });
  });

  it("parses formula amount and spoken time", () => {
    const result = parseVoiceLog("Bé uống 90 ml sữa công thức lúc 9 giờ", now);
    expect(result.ok && result.draft).toMatchObject({
      kind: "feeding",
      type: "FORMULA",
      amountMl: 90,
      startTime: "2026-09-10T09:00",
    });
  });

  it("parses finishing the active feeding session", () => {
    expect(parseVoiceLog("Bé bú xong rồi", now)).toMatchObject({
      ok: true,
      draft: {
        kind: "feeding",
        operation: "finish",
        endTime: "2026-09-10T10:00",
      },
    });
  });

  it("parses starting and finishing sleep", () => {
    expect(parseVoiceLog("Bé vừa ngủ", now)).toMatchObject({
      ok: true,
      draft: { kind: "sleep", operation: "start", startTime: "2026-09-10T10:00" },
    });
    expect(parseVoiceLog("Bé thức dậy rồi", now)).toMatchObject({
      ok: true,
      draft: { kind: "sleep", operation: "finish", endTime: "2026-09-10T10:00" },
    });
  });

  it("parses a completed sleep range", () => {
    expect(parseVoiceLog("Bé ngủ từ 8 giờ đến 9 giờ", now)).toMatchObject({
      ok: true,
      draft: {
        kind: "sleep",
        operation: "complete",
        startTime: "2026-09-10T08:00",
        endTime: "2026-09-10T09:00",
      },
    });
  });

  it("does not confuse a sleep start time with a duration", () => {
    expect(parseVoiceLog("Bé ngủ lúc 8 giờ", now)).toMatchObject({
      ok: true,
      draft: {
        kind: "sleep",
        operation: "start",
        startTime: "2026-09-10T08:00",
        endTime: "",
      },
    });
  });

  it("understands Vietnamese number words and both breast sides", () => {
    expect(parseVoiceLog("Bé bú mẹ mỗi bên mười phút", now)).toMatchObject({
      ok: true,
      draft: {
        kind: "feeding",
        startTime: "2026-09-10T09:40",
        endTime: "2026-09-10T10:00",
        leftBreastDuration: 10,
        rightBreastDuration: 10,
      },
    });
  });

  it("supports the English examples shown in the UI", () => {
    expect(parseVoiceLog("Baby just fell asleep", now)).toMatchObject({
      ok: true,
      draft: { kind: "sleep", operation: "start" },
    });
    expect(parseVoiceLog("Baby drank 90 ml of formula", now)).toMatchObject({
      ok: true,
      draft: { kind: "feeding", type: "FORMULA", amountMl: 90 },
    });
  });

  it("parses wet and stool diaper", () => {
    expect(parseVoiceLog("Thay tã ướt và bé đi ngoài", now)).toMatchObject({
      ok: true,
      draft: { kind: "diaper", type: "BOTH", changedAt: "2026-09-10T10:00" },
    });
  });

  it("rejects unsupported content", () => {
    expect(parseVoiceLog("Hôm nay trời đẹp", now)).toEqual({
      ok: false,
      message: "Mình chưa nhận ra hoạt động bú, ngủ hay thay tã trong câu này.",
    });
  });
});
