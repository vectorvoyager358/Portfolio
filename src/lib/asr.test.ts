import { afterEach, describe, expect, it } from "vitest";
import { extractTranscriptionText, getNvidiaAsrUrl } from "@/lib/asr";

describe("extractTranscriptionText", () => {
  it("reads OpenAI-style text field", () => {
    expect(extractTranscriptionText({ text: "  Hello world  " })).toBe(
      "Hello world",
    );
  });

  it("falls back to transcript and segments", () => {
    expect(extractTranscriptionText({ transcript: "Voice query" })).toBe(
      "Voice query",
    );
    expect(
      extractTranscriptionText({
        segments: [{ text: "What" }, { text: "projects" }],
      }),
    ).toBe("What projects");
  });

  it("returns empty string for unknown shapes", () => {
    expect(extractTranscriptionText(null)).toBe("");
    expect(extractTranscriptionText({ foo: 1 })).toBe("");
  });
});

describe("getNvidiaAsrUrl", () => {
  const original = process.env.NVIDIA_ASR_URL;

  afterEach(() => {
    if (original === undefined) delete process.env.NVIDIA_ASR_URL;
    else process.env.NVIDIA_ASR_URL = original;
  });

  it("defaults to the Parakeet NVCF transcription endpoint", () => {
    delete process.env.NVIDIA_ASR_URL;
    expect(getNvidiaAsrUrl()).toContain("/v1/audio/transcriptions");
  });

  it("respects NVIDIA_ASR_URL override", () => {
    process.env.NVIDIA_ASR_URL = "https://example.test/transcribe";
    expect(getNvidiaAsrUrl()).toBe("https://example.test/transcribe");
  });
});
