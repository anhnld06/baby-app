type ExtractedFields = Record<string, unknown>;

export type HealthDocumentType = "pregnancyCheckup" | "vaccination" | "prescription";

const DATE_PATTERNS = [
  /\b(\d{1,2})\s*[./-]\s*(\d{1,2})\s*[./-]\s*(\d{2,4})\b/g,
  /\bngay\s+(\d{1,2})\s+thang\s+(\d{1,2})\s+nam\s+(\d{4})\b/g,
];

function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function cleanLines(text: string) {
  return text
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function validIsoDate(dayValue: string, monthValue: string, yearValue: string) {
  const day = Number(dayValue);
  const month = Number(monthValue);
  const year = Number(yearValue.length === 2 ? `20${yearValue}` : yearValue);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    year < 2000 ||
    year > 2100 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return undefined;
  }
  return `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

function datesIn(value: string) {
  const normalized = fold(value);
  const dates: string[] = [];
  for (const pattern of DATE_PATTERNS) {
    pattern.lastIndex = 0;
    for (const match of normalized.matchAll(pattern)) {
      const date = validIsoDate(match[1], match[2], match[3]);
      if (date) dates.push(date);
    }
  }
  return dates;
}

function findDate(lines: string[], labels: RegExp[], fallback = true) {
  for (const line of lines) {
    const normalized = fold(line);
    if (!labels.some((label) => label.test(normalized))) continue;
    const date = datesIn(line)[0];
    if (date) return date;
  }
  return fallback ? datesIn(lines.join("\n")).at(-1) : undefined;
}

function findCheckupDate(lines: string[]) {
  const labeled = findDate(lines, [/ngay (kham|sieu am|thuc hien)/], false);
  if (labeled) return labeled;
  for (const line of [...lines].reverse()) {
    if (!/^ngay\b/.test(fold(line))) continue;
    const date = datesIn(line)[0];
    if (date) return date;
  }
  const candidates = lines.filter((line) => !/\b(sdd|du sinh)\b/.test(fold(line)));
  return datesIn(candidates.join("\n")).at(-1);
}

function valueAfterLabel(lines: string[], labels: string[]) {
  const foldedLabels = labels.map(fold);
  for (const line of lines) {
    const normalized = fold(line);
    for (const label of foldedLabels) {
      const index = normalized.indexOf(label);
      if (index < 0) continue;
      const value = line
        .slice(index + label.length)
        .replace(/^[\s:;,.–—-]+/, "")
        .trim();
      if (value) return value;
    }
  }
  return undefined;
}

function firstMatchingLine(lines: string[], pattern: RegExp) {
  return lines.find((line) => pattern.test(fold(line)));
}

function sectionAfter(lines: string[], heading: RegExp, stop: RegExp, limit = 6) {
  const start = lines.findIndex((line) => heading.test(fold(line)));
  if (start < 0) return [];
  const output: string[] = [];
  const headingValue = lines[start].split(/[:：]/, 2)[1]?.trim();
  if (headingValue) output.push(headingValue);
  for (let index = start + 1; index < lines.length && output.length < limit; index += 1) {
    if (stop.test(fold(lines[index]))) break;
    output.push(lines[index]);
  }
  return output;
}

function uniqueText(lines: Array<string | undefined>, maxLength = 1000) {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const line of lines) {
    if (!line) continue;
    const key = fold(line);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(line);
  }
  const text = output.join("\n").trim();
  return text ? text.slice(0, maxLength) : undefined;
}

function numberFrom(text: string, pattern: RegExp) {
  const match = pattern.exec(fold(text));
  if (!match) return undefined;
  const value = Number(match[1].replace(",", "."));
  return Number.isFinite(value) ? value : undefined;
}

function findFacility(lines: string[]) {
  return firstMatchingLine(
    lines,
    /\b(phong kham|benh vien|trung tam y te|tram y te|clinic|hospital)\b/,
  );
}

function findDoctor(lines: string[]) {
  const labels = ["bác sĩ chỉ định", "bác sĩ khám", "bác sĩ", "bs chỉ định", "bs khám"];
  for (const line of lines) {
    if (/phong kham/.test(fold(line))) continue;
    const labeled = valueAfterLabel([line], labels);
    if (labeled && !/^sieu am\b/.test(fold(labeled))) return labeled;
  }
  return [...lines]
    .reverse()
    .find((line) =>
      /\b(ths\.?\s*bs|bsnt|bsck|bac si sieu am|bs\.)\b/.test(fold(line)) &&
      !/phong kham/.test(fold(line)),
    );
}

function withRawTextFallback(fields: ExtractedFields, text: string) {
  if (Object.keys(fields).length > 0) return fields;
  const notes = text.replace(/\s+/g, " ").trim().slice(0, 1000);
  return notes ? { notes } : fields;
}

function parsePregnancyCheckup(text: string): ExtractedFields {
  const lines = cleanLines(text);
  const conclusion = sectionAfter(
    lines,
    /\bket luan\b/,
    /\b(tai kham|luu y|chu y|ngay \d+ thang|bac si|bs\.)\b/,
  );
  const diagnosisLines = lines.filter((line) => /\b(chan doan|tuan|weeks?)\b/.test(fold(line)));
  const gestationalText = [...conclusion, ...diagnosisLines, ...lines.filter((line) => /crl/.test(fold(line)))].join(" ");
  const gestationalMatch = /(?:thai\s*)?(?:khoang\s*)?(\d{1,2})\s*(?:tuan|weeks?|w)\s*(?:(\d)\s*ngay)?\b/.exec(
    fold(gestationalText),
  );
  const gestationalWeek = gestationalMatch ? Number(gestationalMatch[1]) : undefined;
  const gestationalDay = gestationalMatch?.[2] ? Number(gestationalMatch[2]) : undefined;
  const fetalHeartRate = numberFrom(
    lines.join("\n"),
    /(?:tim thai(?: deu)?|fhr)\s*[:;.-]?\s*(\d{2,3})\s*(?:lan\s*\/\s*phut|bpm)?/,
  );
  const bloodPressureMatch = /(?:huyet ap|\bha\b)\s*[:;.-]?\s*(\d{2,3}\s*\/\s*\d{2,3})/.exec(
    fold(lines.join("\n")),
  );
  const fundalHeightCm = numberFrom(
    lines.join("\n"),
    /(?:be cao tu cung|fundal height)\s*[:;.-]?\s*(\d+(?:[.,]\d+)?)/,
  );
  const fullText = lines.join("\n");
  const measurement = (label: string) => numberFrom(
    fullText,
    new RegExp(`\\b${label}\\s*[:=.-]?\\s*(\\d+(?:[.,]\\d+)?)\\s*mm\\b`),
  );
  const fetusCount = /\b(?:don thai|01\s*thai|1\s*thai)\b/.test(fold(fullText))
    ? 1
    : numberFrom(fullText, /(?:so luong thai)\s*[:;.-]?\s*(\d{1,2})/);
  const fetalPresentation = valueAfterLabel(lines, ["ngôi thai", "tư thế thai"]);
  const movementLine = firstMatchingLine(lines, /\bcu dong thai\b/);
  const fetalMovement = movementLine
    ? /(?:\(\s*\+\s*\)|\bco\b)/.test(fold(movementLine))
      ? "PRESENT"
      : /(?:\(\s*-\s*\)|\bkhong\b)/.test(fold(movementLine))
        ? "ABSENT"
        : undefined
    : undefined;
  const crlMm = measurement("crl");
  const ntMm = measurement("nt");
  const bpdMm = measurement("bpd");
  const hcMm = measurement("hc");
  const acMm = measurement("ac");
  const flMm = measurement("fl");
  const estimatedFetalWeightG = numberFrom(
    fullText,
    /(?:trong luong thai|efw)\s*[:;=.-]?\s*(\d+(?:[.,]\d+)?)\s*(?:gr|g|gram)?/,
  );
  const placentaLine = valueAfterLabel(lines, ["vị trí nhau bám", "nhau bám", "vị trí bánh nhau"]);
  const placentaGrade = placentaLine
    ? numberFrom(placentaLine, /(?:do|grade)\s*[:;.-]?\s*([0-3])\b/)
    : undefined;
  const placentaPosition = placentaLine
    ?.replace(/[,;]?\s*(?:độ|do|grade)\s*[:;.-]?\s*[0-3]\b.*$/i, "")
    .trim();
  const amnioticFluid = valueAfterLabel(lines, ["lượng nước ối", "nước ối"]);
  const cervicalLengthMm = numberFrom(
    fullText,
    /(?:do dai kenh co tu cung|chieu dai co tu cung|cervical length)\s*[:;=.-]?\s*(\d+(?:[.,]\d+)?)\s*mm/,
  );
  const ultrasoundDueDate = findDate(lines, [/\b(sdd|du sinh)\b/], false);
  const fetalAnatomy = uniqueText([
    ...sectionAfter(lines, /\bcau truc thai nhi\b/, /\b(cac dau hieu cua me|ket luan)\b/, 12),
    ...sectionAfter(lines, /\bcac co quan khac\b/, /\b(cac yeu to cua thai phu|chu y|ket luan)\b/, 8),
  ]);
  const otherFindings = uniqueText([
    ...sectionAfter(lines, /\bcac dau hieu cua me\b/, /\bket luan\b/, 8),
    ...sectionAfter(lines, /\bcac yeu to cua thai phu\b/, /\b(chu y|ket luan)\b/, 5),
    ...sectionAfter(lines, /^(?:\d+[.)]?\s*)?tu cung\b/, /\bphan phu\b/, 8),
    ...sectionAfter(lines, /^(?:\d+[.)]?\s*)?phan phu\b/, /\b(dich tui cung|ghi nhan khac|ket luan)\b/, 5),
    ...lines.filter((line) => /\b(tu cung|buong trung|dich tui cung|ghi nhan khac|yolk\s*sac)\b/.test(fold(line))),
  ]);
  const fields: ExtractedFields = {};
  const checkedAt = findCheckupDate(lines);
  const facility = findFacility(lines);
  const doctor = findDoctor(lines);
  const findings = uniqueText(conclusion);

  fields.visitType = "ULTRASOUND";
  if (checkedAt) fields.checkedAt = checkedAt;
  if (gestationalWeek !== undefined && gestationalWeek <= 45) fields.gestationalWeek = gestationalWeek;
  if (gestationalDay !== undefined && gestationalDay <= 6) fields.gestationalDay = gestationalDay;
  if (fetusCount !== undefined && fetusCount > 0 && fetusCount <= 10) fields.fetusCount = fetusCount;
  if (fetalPresentation) fields.fetalPresentation = fetalPresentation;
  if (fetalMovement) fields.fetalMovement = fetalMovement;
  if (fetalHeartRate !== undefined && fetalHeartRate >= 50 && fetalHeartRate <= 250) fields.fetalHeartRate = fetalHeartRate;
  if (bloodPressureMatch) fields.bloodPressure = bloodPressureMatch[1].replace(/\s/g, "");
  if (fundalHeightCm !== undefined && fundalHeightCm <= 60) fields.fundalHeightCm = fundalHeightCm;
  if (crlMm !== undefined) fields.crlMm = crlMm;
  if (ntMm !== undefined) fields.ntMm = ntMm;
  if (bpdMm !== undefined) fields.bpdMm = bpdMm;
  if (hcMm !== undefined) fields.hcMm = hcMm;
  if (acMm !== undefined) fields.acMm = acMm;
  if (flMm !== undefined) fields.flMm = flMm;
  if (estimatedFetalWeightG !== undefined) fields.estimatedFetalWeightG = estimatedFetalWeightG;
  if (placentaPosition) fields.placentaPosition = placentaPosition;
  if (placentaGrade !== undefined) fields.placentaGrade = placentaGrade;
  if (amnioticFluid) fields.amnioticFluid = amnioticFluid;
  if (cervicalLengthMm !== undefined) fields.cervicalLengthMm = cervicalLengthMm;
  if (ultrasoundDueDate) fields.ultrasoundDueDate = ultrasoundDueDate;
  if (fetalAnatomy) fields.fetalAnatomy = fetalAnatomy;
  if (otherFindings) fields.otherFindings = otherFindings;
  if (facility) fields.facility = facility;
  if (doctor) fields.doctor = doctor;
  if (findings) fields.findings = findings;
  return withRawTextFallback(fields, text);
}

function parseVaccination(text: string): ExtractedFields {
  const lines = cleanLines(text);
  const fields: ExtractedFields = {};
  const labeledVaccine = valueAfterLabel(lines, ["tên vắc xin", "vắc xin", "vaccine"]);
  const knownVaccine = firstMatchingLine(
    lines,
    /\b(bcg|viem gan|dpt|hib|ipv|opv|rota|phe cau|soi|rubella|mmr|cum|hpv|uon van|5 trong 1|6 trong 1)\b/,
  );
  const doseNumber = numberFrom(
    lines.join("\n"),
    /(?:mui\s*(?:so)?|dose)\s*[:;.-]?\s*(\d{1,2})\b/,
  );
  const administeredAt = findDate(lines, [/ngay tiem/, /ngay su dung/, /administered/]);
  const nextDueAt = findDate(lines, [/ngay hen/, /hen tiem/, /mui tiep/, /next/]);
  const facility = findFacility(lines);
  const batchNumber = valueAfterLabel(lines, ["số lô", "lô sản xuất", "batch", "lot"]);

  if (labeledVaccine || knownVaccine) fields.vaccineName = labeledVaccine ?? knownVaccine;
  if (doseNumber !== undefined && doseNumber > 0) fields.doseNumber = doseNumber;
  if (administeredAt) fields.administeredAt = administeredAt;
  if (facility) fields.facility = facility;
  if (batchNumber) fields.batchNumber = batchNumber;
  if (nextDueAt) fields.nextDueAt = nextDueAt;
  return withRawTextFallback(fields, text);
}

function prescriptionItems(lines: string[]) {
  const starts = lines
    .map((line, index) => ({ line, index, match: /^\s*(\d{1,2})\s*[.)/-]\s*(.+)$/.exec(line) }))
    .filter((item): item is { line: string; index: number; match: RegExpExecArray } => Boolean(item.match));

  return starts.flatMap((start, itemIndex) => {
    const end = starts[itemIndex + 1]?.index ?? Math.min(lines.length, start.index + 5);
    const following = lines.slice(start.index + 1, end);
    const combined = [start.match[2], ...following].join(" ");
    const normalized = fold(combined);
    if (
      /\b(chan doan|loi dan|tai kham|ghi chu)\b/.test(normalized) ||
      !/\b(mg|mcg|ml|vien|goi|ong|chai|tablet|capsule|siro|thuoc)\b/.test(normalized)
    ) {
      return [];
    }

    const medicineName = start.match[2]
      .split(/\s{2,}|\b(?:SL|Số lượng|Qty|Uống|Dùng)\s*[:.-]?/i, 1)[0]
      .trim()
      .slice(0, 200);
    if (!medicineName) return [];
    const dosage = /(?:lieu|moi lan|uong|dung)\s*[:.-]?\s*([^,;]+?)(?=\s+(?:ngay|sang|trua|chieu|toi)\b|$)/i.exec(normalized)?.[1]?.trim();
    const frequency = /\b((?:ngay|moi ngay)\s*\d+\s*lan|\d+\s*lan\s*\/\s*ngay)\b/i.exec(normalized)?.[1]?.trim();
    const duration = /\b(?:trong\s*)?(\d{1,3})\s*ngay\b/i.exec(normalized)?.[1];
    return [{
      medicineName,
      dosage: dosage ?? "",
      frequency: frequency ?? "",
      durationDays: duration ? Number(duration) : undefined,
      instructions: uniqueText(following, 300) ?? "",
    }];
  });
}

function parsePrescription(text: string): ExtractedFields {
  const lines = cleanLines(text);
  const fields: ExtractedFields = {};
  const prescribedBy = findDoctor(lines);
  const diagnosis = valueAfterLabel(lines, ["chẩn đoán", "diagnosis"]);
  const issuedAt = findDate(lines, [/ngay ke don/, /ngay kham/, /ngay cap/, /date/]);
  const items = prescriptionItems(lines);

  if (prescribedBy) fields.prescribedBy = prescribedBy;
  if (diagnosis) fields.diagnosis = diagnosis;
  if (issuedAt) fields.issuedAt = issuedAt;
  if (items.length > 0) fields.items = items;
  return withRawTextFallback(fields, text);
}

export function parseHealthDocument(text: string, recordType: HealthDocumentType) {
  if (recordType === "pregnancyCheckup") return parsePregnancyCheckup(text);
  if (recordType === "vaccination") return parseVaccination(text);
  return parsePrescription(text);
}
