import type { UIMessage } from "ai";

const MAX_TRACE_TEXT_LENGTH = 4_000;
const TRUNCATED_SUFFIX = "… [truncated]";
const SESSION_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/;

type LangfuseEnvironment = Partial<
  Record<
    | "LANGFUSE_PUBLIC_KEY"
    | "LANGFUSE_SECRET_KEY"
    | "LANGFUSE_TRACING_ENVIRONMENT"
    | "VERCEL_ENV"
    | "NODE_ENV",
    string | undefined
  >
>;

export function isLangfuseConfigured(
  env: LangfuseEnvironment = process.env,
): boolean {
  return Boolean(
    env.LANGFUSE_PUBLIC_KEY?.trim() && env.LANGFUSE_SECRET_KEY?.trim(),
  );
}

export function getLangfuseEnvironment(
  env: LangfuseEnvironment = process.env,
): string {
  return (
    env.LANGFUSE_TRACING_ENVIRONMENT?.trim() ||
    env.VERCEL_ENV?.trim() ||
    env.NODE_ENV?.trim() ||
    "development"
  );
}

/** Accept only opaque, non-PII chat IDs as Langfuse session identifiers. */
export function normalizeLangfuseSessionId(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const sessionId = value.trim();
  return SESSION_ID_PATTERN.test(sessionId) ? sessionId : undefined;
}

/** Defense-in-depth masking applied by the Langfuse span processor. */
export function redactLangfuseData(data: string): string {
  return data
    .replace(/\bnvapi-[A-Za-z0-9._-]+\b/gi, "[NVIDIA_API_KEY_REDACTED]")
    .replace(/\bsk-lf-[A-Za-z0-9_-]+\b/gi, "[LANGFUSE_SECRET_REDACTED]")
    .replace(
      /\bBearer\s+[A-Za-z0-9._~+/=-]+\b/gi,
      "Bearer [TOKEN_REDACTED]",
    )
    .replace(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      "[EMAIL_REDACTED]",
    )
    .replace(
      /(?:\+?1[\s().-]*)?(?:\(?\d{3}\)?[\s.-]*)\d{3}[\s.-]*\d{4}/g,
      "[PHONE_REDACTED]",
    )
    .replace(
      /("(?:api[_-]?key|secret(?:[_-]?key)?|authorization|token)"\s*:\s*")[^"]*(")/gi,
      "$1[SECRET_REDACTED]$2",
    );
}

export function sanitizeLangfuseTraceText(text: string): string {
  const redacted = redactLangfuseData(text.trim());
  if (redacted.length <= MAX_TRACE_TEXT_LENGTH) return redacted;
  return `${redacted.slice(
    0,
    MAX_TRACE_TEXT_LENGTH - TRUNCATED_SUFFIX.length,
  )}${TRUNCATED_SUFFIX}`;
}

export function getLatestUserMessageText(messages: UIMessage[]): string {
  const message = messages.findLast((candidate) => candidate.role === "user");
  if (!message) return "[no user text]";

  const text = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();

  return text || "[non-text message]";
}
