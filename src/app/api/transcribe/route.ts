import { getNvidiaApiKey, isNvidiaConfigured } from "@/lib/nvidia";
import { checkRateLimit } from "@/lib/rate-limit";
import { transcribeAudioWithNvidia } from "@/lib/asr";

export const maxDuration = 60;

const MAX_AUDIO_BYTES = 12 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "audio/webm",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/m4a",
  "audio/ogg",
  "audio/flac",
  "video/webm",
]);

function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "anonymous";
  return req.headers.get("x-real-ip") || "anonymous";
}

export async function GET() {
  if (!isNvidiaConfigured()) {
    return Response.json({ configured: false }, { status: 503 });
  }
  return Response.json({ configured: true, feature: "asr" });
}

export async function POST(req: Request) {
  if (!isNvidiaConfigured()) {
    return Response.json(
      { error: "Speech-to-text is temporarily offline. Please try again later." },
      { status: 503 },
    );
  }

  const limit = checkRateLimit(`asr:${clientKey(req)}`, 12, 60_000);
  if (!limit.allowed) {
    return Response.json(
      { error: "Too many transcription requests. Please wait a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000)),
          ),
        },
      },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "file is required" }, { status: 400 });
  }

  if (file.size === 0) {
    return Response.json({ error: "Empty audio file" }, { status: 400 });
  }

  if (file.size > MAX_AUDIO_BYTES) {
    return Response.json(
      { error: "Audio file too large (max 12MB)" },
      { status: 413 },
    );
  }

  const type = file.type || "audio/webm";
  if (type && !ALLOWED_TYPES.has(type) && !type.startsWith("audio/")) {
    return Response.json(
      { error: `Unsupported audio type: ${type}` },
      { status: 415 },
    );
  }

  const apiKey = getNvidiaApiKey();
  if (!apiKey) {
    return Response.json(
      { error: "Speech-to-text is temporarily offline. Please try again later." },
      { status: 503 },
    );
  }

  try {
    const { text } = await transcribeAudioWithNvidia({
      apiKey,
      file,
      filename: file.name?.endsWith(".wav")
        ? file.name
        : "recording.wav",
      language: "en-US",
    });
    return Response.json({ text });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Transcription failed";
    return Response.json({ error: message }, { status: 502 });
  }
}
