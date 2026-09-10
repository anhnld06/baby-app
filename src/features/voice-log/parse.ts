import type {
  FeedingType,
  VoiceLogDraft,
  VoiceLogParseResult,
} from "@/features/voice-log/types";

function fold(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  const numberToken = "khong|mot|hai|ba|bon|nam|lam|sau|bay|tam|chin|muoi|tram|linh|le";
  return normalized.replace(
    new RegExp(`\\b(?:${numberToken})(?:\\s+(?:${numberToken}))*\\b`, "g"),
    (numberWords) => String(parseVietnameseNumber(numberWords)),
  );
}

function parseVietnameseNumber(value: string) {
  const units: Record<string, number> = {
    khong: 0,
    mot: 1,
    hai: 2,
    ba: 3,
    bon: 4,
    nam: 5,
    lam: 5,
    sau: 6,
    bay: 7,
    tam: 8,
    chin: 9,
  };
  let total = 0;
  let current = 0;
  for (const token of value.split(" ")) {
    if (token in units) current += units[token];
    else if (token === "tram") {
      total += (current || 1) * 100;
      current = 0;
    } else if (token === "muoi") {
      total += (current || 1) * 10;
      current = 0;
    }
  }
  return total + current;
}

function toDateTimeLocal(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function localTime(now: Date, hour: number, minute = 0) {
  const result = new Date(now);
  result.setHours(hour, minute, 0, 0);
  if (result.getTime() > now.getTime() + 5 * 60_000) {
    result.setDate(result.getDate() - 1);
  }
  return result;
}

function parsedClock(hourText: string, minuteText?: string, half?: string) {
  const hour = Number(hourText);
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return null;
  const minute = half ? 30 : Number(minuteText ?? 0);
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

function explicitTime(text: string, now: Date) {
  const relative = text.match(/cach day\s+(\d+)\s*(phut|gio|tieng)/);
  if (relative) {
    const amount = Number(relative[1]);
    const unit = relative[2] === "phut" ? 60_000 : 3_600_000;
    return new Date(now.getTime() - amount * unit);
  }

  const match = text.match(
    /(?:luc|vao|at|tu)\s+(\d{1,2})(?:(?:\s*[:h]\s*|\s+gio\s+)(\d{1,2}))?\s*(?:gio|o'clock)?\s*(ruoi|half)?/,
  );
  if (!match) return null;
  const clock = parsedClock(match[1], match[2], match[3]);
  return clock ? localTime(now, clock.hour, clock.minute) : null;
}

function timeRange(text: string, now: Date) {
  const match = text.match(
    /(?:tu|from)\s+(\d{1,2})(?:(?:\s*[:h]\s*|\s+gio\s+)(\d{1,2}))?\s*(?:gio|o'clock)?\s*(ruoi|half)?\s+(?:den|toi|to)\s+(\d{1,2})(?:(?:\s*[:h]\s*|\s+gio\s+)(\d{1,2}))?\s*(?:gio|o'clock)?\s*(ruoi|half)?/,
  );
  if (!match) return null;
  const startClock = parsedClock(match[1], match[2], match[3]);
  const endClock = parsedClock(match[4], match[5], match[6]);
  if (!startClock || !endClock) return null;

  const end = localTime(now, endClock.hour, endClock.minute);
  const start = new Date(end);
  start.setHours(startClock.hour, startClock.minute, 0, 0);
  if (start > end) start.setDate(start.getDate() - 1);
  return { start, end };
}

function minuteDuration(text: string) {
  const match = text.match(/(\d+)\s*(?:phut|ph\b|p\b|minutes?|mins?)/);
  return match ? Number(match[1]) : null;
}

function sleepDuration(text: string) {
  if (/\b(nua tieng|half an hour)\b/.test(text)) return 30;
  const hours = text.match(/(\d+(?:[.,]\d+)?)\s*(?:gio|tieng|hours?|hrs?)/);
  if (hours) {
    const halfHour = /\b(ruoi|and a half)\b/.test(text) ? 30 : 0;
    return Math.round(Number(hours[1].replace(",", ".")) * 60) + halfHour;
  }
  return minuteDuration(text);
}

function milkAmount(text: string) {
  const match = text.match(/(\d+(?:[.,]\d+)?)\s*(?:ml|mi\s*li\s*lit)/);
  return match ? Number(match[1].replace(",", ".")) : null;
}

function isNight(date: Date, text: string) {
  const hour = date.getHours();
  return /\b(dem|night)\b/.test(text) || hour >= 18 || hour < 6;
}

function parseSleep(text: string, now: Date): VoiceLogDraft {
  const range = timeRange(text, now);
  if (range) {
    return {
      kind: "sleep",
      operation: "complete",
      startTime: toDateTimeLocal(range.start),
      endTime: toDateTimeLocal(range.end),
      type: isNight(range.start, text) ? "NIGHT" : "NAP",
    };
  }

  const spokenTime = explicitTime(text, now);
  const finish = /\b(thuc|day roi|thuc day|wake|woke)\b/.test(text);
  if (finish) {
    return {
      kind: "sleep",
      operation: "finish",
      startTime: "",
      endTime: toDateTimeLocal(spokenTime ?? now),
      type: "NAP",
    };
  }

  const duration =
    spokenTime && !/\b(duoc|trong|khoang|for)\b/.test(text)
      ? null
      : sleepDuration(text);
  const explicitlyStarting = /\b(bat dau|di ngu|vua ngu|dang ngu|start)\b/.test(text);
  if (duration && !explicitlyStarting) {
    const end = spokenTime ?? now;
    const start = new Date(end.getTime() - duration * 60_000);
    return {
      kind: "sleep",
      operation: "complete",
      startTime: toDateTimeLocal(start),
      endTime: toDateTimeLocal(end),
      type: isNight(start, text) ? "NIGHT" : "NAP",
    };
  }

  const start = spokenTime ?? now;
  return {
    kind: "sleep",
    operation: "start",
    startTime: toDateTimeLocal(start),
    endTime: "",
    type: isNight(start, text) ? "NIGHT" : "NAP",
  };
}

function parseFeeding(text: string, now: Date): VoiceLogDraft {
  const amountMl = milkAmount(text);
  const duration = minuteDuration(text);
  const hasLeft = /\b(trai|left)\b/.test(text);
  const hasRight = /\b(phai|right)\b/.test(text);
  const bothSides = /\b(moi ben|hai ben|ca hai ben|both sides)\b/.test(text);
  const leftDuration = Number(
    text.match(/(?:ben\s+)?(?:trai|left)\s+(\d+)\s*(?:phut|ph\b|p\b|minutes?|mins?)/)?.[1] ??
      (duration && (hasLeft || bothSides) ? duration : 0),
  ) || null;
  const rightDuration = Number(
    text.match(/(?:ben\s+)?(?:phai|right)\s+(\d+)\s*(?:phut|ph\b|p\b|minutes?|mins?)/)?.[1] ??
      (duration && (hasRight || bothSides) ? duration : 0),
  ) || null;
  const totalDuration =
    (leftDuration ?? 0) + (rightDuration ?? 0) || duration;
  const explicitlyStarting = /\b(bat dau|dang bu|start)\b/.test(text);
  const spokenStart = explicitTime(text, now);

  let type: FeedingType = "BREASTFEEDING";
  if (/\b(hon hop|mixed)\b/.test(text)) type = "MIXED";
  else if (/\b(cong thuc|formula)\b/.test(text)) type = "FORMULA";
  else if (/\b(sua me)\b/.test(text) && /\b(binh|uong|bottle)\b/.test(text))
    type = "BOTTLE_BREAST_MILK";
  else if (amountMl !== null && !/\b(bu me|trai|phai)\b/.test(text)) type = "FORMULA";

  if (/\b(bu xong|xong cu bu|ngung bu|ket thuc bu|finished feeding|done feeding)\b/.test(text)) {
    return {
      kind: "feeding",
      operation: "finish",
      type,
      startTime: "",
      endTime: toDateTimeLocal(spokenStart ?? now),
      leftBreastDuration: null,
      rightBreastDuration: null,
      firstSide: null,
      amountMl: null,
      milkType: "",
    };
  }

  let start = spokenStart ?? now;
  let end: Date | null = null;
  if (totalDuration && !explicitlyStarting) {
    if (spokenStart) end = new Date(spokenStart.getTime() + totalDuration * 60_000);
    else {
      end = now;
      start = new Date(now.getTime() - totalDuration * 60_000);
    }
  } else if (amountMl !== null && !explicitlyStarting) {
    end = spokenStart ?? now;
  }

  return {
    kind: "feeding",
    operation: end ? "complete" : "start",
    type,
    startTime: toDateTimeLocal(start),
    endTime: end ? toDateTimeLocal(end) : "",
    leftBreastDuration: leftDuration,
    rightBreastDuration: rightDuration,
    firstSide: hasLeft ? "LEFT" : hasRight ? "RIGHT" : null,
    amountMl,
    milkType: type === "FORMULA" ? "Sữa công thức" : "",
  };
}

function parseDiaper(text: string, now: Date): VoiceLogDraft {
  const wet = /\b(uot|tieu|di te|pee|wet)\b/.test(text);
  const stool = /\b(di ngoai|di ị|di i|phan|poop|stool)\b/.test(text);
  const type = wet && stool ? "BOTH" : stool ? "STOOL" : "WET";
  return {
    kind: "diaper",
    type,
    changedAt: toDateTimeLocal(explicitTime(text, now) ?? now),
  };
}

export function parseVoiceLog(
  transcript: string,
  now = new Date(),
): VoiceLogParseResult {
  const text = fold(transcript);
  if (!text) return { ok: false, message: "Chưa có nội dung để nhận diện." };

  if (/\b(ta|bim|diaper|thay ta|thay bim)\b/.test(text)) {
    return { ok: true, draft: parseDiaper(text, now) };
  }
  if (/\b(ngu|thuc day|day roi|sleep|asleep|slept|nap|wake|woke)\b/.test(text)) {
    return { ok: true, draft: parseSleep(text, now) };
  }
  if (/\b(bu|sua|uong binh|feeding|feed|bottle|formula|drank|drink|nursed)\b/.test(text)) {
    return { ok: true, draft: parseFeeding(text, now) };
  }

  return {
    ok: false,
    message: "Mình chưa nhận ra hoạt động bú, ngủ hay thay tã trong câu này.",
  };
}
