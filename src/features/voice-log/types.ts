export type FeedingType =
  | "BREASTFEEDING"
  | "BOTTLE_BREAST_MILK"
  | "FORMULA"
  | "MIXED";

export type VoiceLogDraft =
  | {
      kind: "feeding";
      operation: "start" | "finish" | "complete";
      type: FeedingType;
      startTime: string;
      endTime: string;
      leftBreastDuration: number | null;
      rightBreastDuration: number | null;
      firstSide: "LEFT" | "RIGHT" | null;
      amountMl: number | null;
      milkType: string;
    }
  | {
      kind: "sleep";
      operation: "start" | "finish" | "complete";
      startTime: string;
      endTime: string;
      type: "NAP" | "NIGHT";
    }
  | {
      kind: "diaper";
      type: "WET" | "STOOL" | "BOTH";
      changedAt: string;
    };

export type VoiceLogParseResult =
  | { ok: true; draft: VoiceLogDraft }
  | { ok: false; message: string };
