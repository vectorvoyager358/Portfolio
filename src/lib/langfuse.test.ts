import { describe, expect, it } from "vitest";
import {
  getLangfuseEnvironment,
  getLatestUserMessageText,
  isLangfuseConfigured,
  normalizeLangfuseSessionId,
  redactLangfuseData,
  sanitizeLangfuseTraceText,
} from "@/lib/langfuse";

describe("Langfuse tracing helpers", () => {
  it("enables tracing only when both project keys exist", () => {
    expect(isLangfuseConfigured({})).toBe(false);
    expect(isLangfuseConfigured({ LANGFUSE_PUBLIC_KEY: "pk-lf-test" })).toBe(
      false,
    );
    expect(
      isLangfuseConfigured({
        LANGFUSE_PUBLIC_KEY: "pk-lf-test",
        LANGFUSE_SECRET_KEY: "sk-lf-test",
      }),
    ).toBe(true);
  });

  it("uses an explicit tracing environment before Vercel defaults", () => {
    expect(
      getLangfuseEnvironment({
        LANGFUSE_TRACING_ENVIRONMENT: "preview",
        VERCEL_ENV: "production",
      }),
    ).toBe("preview");
    expect(getLangfuseEnvironment({ VERCEL_ENV: "production" })).toBe(
      "production",
    );
  });

  it("accepts opaque session IDs and rejects PII-like or oversized values", () => {
    expect(normalizeLangfuseSessionId("chat_abc-123.xyz")).toBe(
      "chat_abc-123.xyz",
    );
    expect(normalizeLangfuseSessionId("person@example.com")).toBeUndefined();
    expect(normalizeLangfuseSessionId("a".repeat(201))).toBeUndefined();
    expect(normalizeLangfuseSessionId(null)).toBeUndefined();
  });

  it("masks common secrets and contact details", () => {
    const value = redactLangfuseData(
      'Email me@example.com, call +1 (312) 555-0199, use nvapi-secret or sk-lf-secret, {"authorization":"Bearer hidden"}',
    );

    expect(value).not.toContain("me@example.com");
    expect(value).not.toContain("312");
    expect(value).not.toContain("nvapi-secret");
    expect(value).not.toContain("sk-lf-secret");
    expect(value).not.toContain("Bearer hidden");
  });

  it("captures only the latest user text and bounds trace content", () => {
    const latest = getLatestUserMessageText([
      { id: "1", role: "user", parts: [{ type: "text", text: "Earlier" }] },
      { id: "2", role: "assistant", parts: [{ type: "text", text: "Reply" }] },
      {
        id: "3",
        role: "user",
        parts: [{ type: "text", text: "Latest person@example.com" }],
      },
    ]);

    expect(latest).toBe("Latest person@example.com");
    expect(sanitizeLangfuseTraceText(latest)).toBe(
      "Latest [EMAIL_REDACTED]",
    );
    expect(sanitizeLangfuseTraceText("x".repeat(5_000))).toHaveLength(4_000);
  });
});
