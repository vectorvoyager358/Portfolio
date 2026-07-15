const DEFAULT_ASR_URL =
  "https://1598d209-5e27-4d3c-8079-4751568b1081.invocation.api.nvcf.nvidia.com/v1/audio/transcriptions";

export function getNvidiaAsrUrl(): string {
  return process.env.NVIDIA_ASR_URL?.trim() || DEFAULT_ASR_URL;
}

export function extractTranscriptionText(payload: unknown): string {
  if (typeof payload === "string") return payload.trim();
  if (!payload || typeof payload !== "object") return "";

  const record = payload as Record<string, unknown>;

  if (typeof record.text === "string" && record.text.trim()) {
    return record.text.trim();
  }

  if (typeof record.transcript === "string" && record.transcript.trim()) {
    return record.transcript.trim();
  }

  if (Array.isArray(record.texts)) {
    const joined = record.texts
      .filter((item): item is string => typeof item === "string")
      .join(" ")
      .trim();
    if (joined) return joined;
  }

  if (Array.isArray(record.segments)) {
    const joined = record.segments
      .map((segment) => {
        if (!segment || typeof segment !== "object") return "";
        const text = (segment as { text?: unknown }).text;
        return typeof text === "string" ? text : "";
      })
      .join(" ")
      .trim();
    if (joined) return joined;
  }

  return "";
}

export async function transcribeAudioWithNvidia(params: {
  apiKey: string;
  file: Blob;
  filename: string;
  language?: string;
  asrUrl?: string;
}): Promise<{ text: string; raw: unknown }> {
  const form = new FormData();
  form.append("language", params.language ?? "en-US");
  form.append("word_time_offsets", "True");
  form.append("encoding", "linear16");
  form.append("sample_rate_hertz", "16000");
  form.append("file", params.file, params.filename);

  const response = await fetch(params.asrUrl ?? getNvidiaAsrUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
    },
    body: form,
  });

  const contentType = response.headers.get("content-type") || "";
  const raw = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const detail =
      typeof raw === "string"
        ? raw
        : JSON.stringify(raw).slice(0, 400);
    throw new Error(
      `Speech-to-text failed (${response.status}): ${detail || response.statusText}`,
    );
  }

  const text = extractTranscriptionText(raw);
  if (!text) {
    throw new Error("Speech-to-text returned an empty transcript");
  }

  return { text, raw };
}
