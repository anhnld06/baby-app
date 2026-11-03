export type CheckupLevel = "GOOD" | "WATCH" | "URGENT" | "UNKNOWN";

export type CheckupInput = {
  gestationalWeek?: number | null;
  bloodPressure?: string | null;
  fetalHeartRate?: number | null;
};

export type CheckupAssessmentResult = {
  level: CheckupLevel;
  flags: string[];
};

const LEVEL_ORDER: CheckupLevel[] = ["GOOD", "WATCH", "URGENT"];

function raise(current: CheckupLevel, next: CheckupLevel) {
  return LEVEL_ORDER.indexOf(next) > LEVEL_ORDER.indexOf(current) ? next : current;
}

function parseBloodPressure(value?: string | null) {
  const match = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/.exec(value ?? "");
  if (!match) return undefined;
  return { systolic: Number(match[1]), diastolic: Number(match[2]) };
}

// Screening thresholds are standard obstetric reference ranges (not a diagnosis):
// - Blood pressure >=140/90 is the standard pre-eclampsia screening threshold; >=130/85 warrants watching.
// - Fetal heart rate 110-160 bpm is the normal range; outside 100-180 bpm is an urgent flag.
export function assessCheckup(checkup: CheckupInput): CheckupAssessmentResult {
  let level: CheckupLevel = "GOOD";
  const flags: string[] = [];
  if (!parseBloodPressure(checkup.bloodPressure) && checkup.fetalHeartRate == null) {
    return { level: "UNKNOWN", flags: ["Chưa đủ dữ liệu: cần huyết áp hoặc tim thai hợp lệ để kiểm tra."] };
  }

  const bp = parseBloodPressure(checkup.bloodPressure);
  if (bp) {
    if (bp.systolic >= 140 || bp.diastolic >= 90) {
      level = raise(level, "URGENT");
      flags.push("Huyết áp cao (≥140/90) — có nguy cơ tiền sản giật, cần khám sớm");
    } else if (bp.systolic >= 130 || bp.diastolic >= 85) {
      level = raise(level, "WATCH");
      flags.push("Huyết áp hơi cao, nên theo dõi thêm");
    }
  }

  if (checkup.fetalHeartRate !== undefined && checkup.fetalHeartRate !== null) {
    const fhr = checkup.fetalHeartRate;
    if (fhr < 100 || fhr > 180) {
      level = raise(level, "URGENT");
      flags.push("Tim thai ngoài ngưỡng an toàn (100-180 lần/phút) — cần khám ngay");
    } else if (fhr < 110 || fhr > 160) {
      level = raise(level, "WATCH");
      flags.push("Tim thai hơi lệch khỏi mức thông thường (110-160 lần/phút)");
    }
  }


  if (flags.length === 0) flags.push("Chưa phát hiện vượt ngưỡng ở huyết áp / tim thai đã kiểm tra");
  return { level, flags };
}
