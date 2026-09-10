import type { AssistantAnswer, AssistantContext, AssistantSource } from "@/features/ai/types";

export type ProviderInput = { question: string; context: AssistantContext; excerpts: string[]; sources: AssistantSource[]; locale: "vi" | "en" };

export type HealthRecordType = "vaccination" | "prescription" | "pregnancyCheckup";

export type ExtractionInput = { imageDataUrl: string; recordType: HealthRecordType; locale: "vi" | "en" };

const EXTRACTION_FIELDS: Record<HealthRecordType, string[]> = {
  vaccination: ["vaccineName", "doseNumber", "administeredAt", "facility", "batchNumber", "nextDueAt", "notes"],
  prescription: ["prescribedBy", "diagnosis", "issuedAt", "notes", "items"],
  pregnancyCheckup: ["gestationalWeek", "weightKg", "bloodPressure", "fetalHeartRate", "fundalHeightCm", "facility", "doctor", "findings", "nextCheckupAt", "notes"],
};

export type CheckupValues = {
  gestationalWeek?: number;
  weightKg?: number;
  bloodPressure?: string;
  fetalHeartRate?: number;
  fundalHeightCm?: number;
  findings?: string;
};

export type CheckupAssessmentInput = {
  checkup: CheckupValues;
  flags: string[];
  level: "GOOD" | "WATCH" | "URGENT";
  locale: "vi" | "en";
};

export type CheckupAssessment = { summary: string; suggestions: string[] };

export interface AIProvider {
  answer(input: ProviderInput): Promise<Pick<AssistantAnswer, "answer" | "evidenceLevel" | "sources">>;
  extractFromImage(input: ExtractionInput): Promise<Record<string, unknown>>;
  assessCheckup(input: CheckupAssessmentInput): Promise<CheckupAssessment>;
}

class SafeFallbackProvider implements AIProvider {
  async answer(input: ProviderInput): Promise<Pick<AssistantAnswer, "answer" | "evidenceLevel" | "sources">> {
    return {
      answer: input.locale === "vi" ? "Kho kiến thức hiện chưa đủ dữ liệu đã kiểm duyệt để trả lời an toàn. Mình sẽ không suy đoán. Hãy hỏi bác sĩ hoặc chuyên gia y tế phù hợp." : "The reviewed knowledge base does not contain enough information to answer safely. I won't guess. Please contact an appropriate health professional.",
      evidenceLevel: "INSUFFICIENT",
      sources: [],
    };
  }

  async extractFromImage(): Promise<Record<string, unknown>> {
    throw new Error("OCR_UNAVAILABLE");
  }

  async assessCheckup(input: CheckupAssessmentInput): Promise<CheckupAssessment> {
    return {
      summary: input.locale === "vi"
        ? "Đã kiểm tra các chỉ số theo ngưỡng chuẩn ở trên. Chưa cấu hình trợ lý AI nên chưa có gợi ý chi tiết thêm — hãy trao đổi với bác sĩ khi tái khám."
        : "The values above were checked against standard thresholds. No AI assistant is configured for further suggestions — please discuss with your doctor at the next visit.",
      suggestions: [],
    };
  }
}

class OpenAICompatibleProvider implements AIProvider {
  constructor(private readonly baseUrl: string, private readonly apiKey: string, private readonly model: string) {}

  async answer(input: ProviderInput): Promise<Pick<AssistantAnswer, "answer" | "evidenceLevel" | "sources">> {
    if (input.excerpts.length === 0 || input.sources.length === 0) return new SafeFallbackProvider().answer(input);
    const response = await fetch(`${this.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "Answer only from the supplied reviewed excerpts. Never add medical facts. Return JSON with answer and evidenceLevel. Say evidence is insufficient when the excerpts do not answer the question." },
          { role: "user", content: JSON.stringify({ question: input.question, context: input.context, excerpts: input.excerpts }) },
        ],
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error("AI provider request failed");
    const json: unknown = await response.json();
    const content = extractContent(json);
    const parsed: unknown = JSON.parse(content);
    if (!isProviderAnswer(parsed)) throw new Error("AI provider returned an invalid response");
    return { answer: parsed.answer, evidenceLevel: parsed.evidenceLevel, sources: input.sources };
  }

  async extractFromImage(input: ExtractionInput): Promise<Record<string, unknown>> {
    const fields = EXTRACTION_FIELDS[input.recordType];
    const response = await fetch(`${this.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `Extract only what is visibly printed on the photo of a ${input.recordType === "pregnancyCheckup" ? "pregnancy ultrasound/checkup" : "child's"} document. Return a JSON object with exactly these keys: ${fields.join(", ")}. Use null for anything unclear or not visible. Never invent values. Dates must be ISO 8601 (YYYY-MM-DD). ${input.recordType === "prescription" ? "The 'items' key is an array of objects with keys: medicineName, dosage, frequency, durationDays, instructions." : ""}`,
          },
          {
            role: "user",
            content: [
              { type: "text", text: input.locale === "vi" ? "Trích xuất thông tin từ ảnh sau." : "Extract the information from this image." },
              { type: "image_url", image_url: { url: input.imageDataUrl } },
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error("OCR_UNAVAILABLE");
    const json: unknown = await response.json();
    const content = extractContent(json);
    const parsed: unknown = JSON.parse(content);
    if (typeof parsed !== "object" || parsed === null) throw new Error("OCR_UNAVAILABLE");
    const allowed = new Set(fields);
    return Object.fromEntries(Object.entries(parsed).filter(([key]) => allowed.has(key)));
  }

  async assessCheckup(input: CheckupAssessmentInput): Promise<CheckupAssessment> {
    const response = await fetch(`${this.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You add a short, friendly note to a prenatal checkup entry. You are given the entered values and a deterministic safety level/flags that a rule engine already computed from established thresholds — you must NEVER contradict, soften, or omit those flags, and you may only suggest general well-established prenatal lifestyle/nutrition tips (e.g. iron or calcium intake, hydration, rest, follow-up timing) that are relevant to the given flags. Never diagnose. If level is not GOOD, the summary must end by recommending contacting the doctor. Return JSON with 'summary' (string) and 'suggestions' (array of short strings, max 5).",
          },
          {
            role: "user",
            content: JSON.stringify({ locale: input.locale, checkup: input.checkup, level: input.level, flags: input.flags }),
          },
        ],
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error("AI provider request failed");
    const json: unknown = await response.json();
    const content = extractContent(json);
    const parsed: unknown = JSON.parse(content);
    if (!isCheckupAssessment(parsed)) throw new Error("AI provider returned an invalid response");
    return { summary: parsed.summary, suggestions: parsed.suggestions.slice(0, 5) };
  }
}

function extractContent(value: unknown): string {
  if (typeof value !== "object" || value === null || !("choices" in value) || !Array.isArray(value.choices)) throw new Error("Invalid provider response");
  const first: unknown = value.choices[0];
  if (typeof first !== "object" || first === null || !("message" in first)) throw new Error("Invalid provider response");
  const message = first.message;
  if (typeof message !== "object" || message === null || !("content" in message) || typeof message.content !== "string") throw new Error("Invalid provider response");
  return message.content;
}

function isCheckupAssessment(value: unknown): value is { summary: string; suggestions: string[] } {
  return (
    typeof value === "object" &&
    value !== null &&
    "summary" in value &&
    typeof value.summary === "string" &&
    value.summary.length <= 2000 &&
    "suggestions" in value &&
    Array.isArray(value.suggestions) &&
    value.suggestions.every((item) => typeof item === "string")
  );
}

function isProviderAnswer(value: unknown): value is { answer: string; evidenceLevel: AssistantAnswer["evidenceLevel"] } {
  const allowed = new Set(["STRONG", "MODERATE", "LIMITED", "TRADITIONAL", "NO_EVIDENCE", "POTENTIALLY_HARMFUL", "INSUFFICIENT"]);
  return typeof value === "object" && value !== null && "answer" in value && typeof value.answer === "string" && value.answer.length <= 8000 && "evidenceLevel" in value && typeof value.evidenceLevel === "string" && allowed.has(value.evidenceLevel);
}

export function getAIProvider(): AIProvider {
  const { AI_BASE_URL, AI_API_KEY, AI_MODEL } = process.env;
  return AI_BASE_URL && AI_API_KEY && AI_MODEL ? new OpenAICompatibleProvider(AI_BASE_URL, AI_API_KEY, AI_MODEL) : new SafeFallbackProvider();
}
