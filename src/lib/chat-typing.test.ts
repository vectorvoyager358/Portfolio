import { describe, expect, it } from "vitest";
import {
  shouldRevealAssistantReply,
  shouldShowTypingIndicator,
  typingIndicatorLabel,
} from "@/lib/chat-typing";

describe("shouldShowTypingIndicator", () => {
  it("shows while request is submitted", () => {
    expect(shouldShowTypingIndicator("submitted", null)).toBe(true);
    expect(shouldShowTypingIndicator("submitted", "")).toBe(true);
  });

  it("shows while streaming before any assistant text", () => {
    expect(shouldShowTypingIndicator("streaming", null)).toBe(true);
    expect(shouldShowTypingIndicator("streaming", "")).toBe(true);
    expect(shouldShowTypingIndicator("streaming", "   ")).toBe(true);
  });

  it("hides once assistant text has started streaming after min window", () => {
    expect(shouldShowTypingIndicator("streaming", "Hello")).toBe(false);
  });

  it("keeps showing during the minimum typing window even with answer text", () => {
    expect(
      shouldShowTypingIndicator("streaming", "Hello", {
        minTypingComplete: false,
      }),
    ).toBe(true);
    expect(
      shouldShowTypingIndicator("ready", "Hello", {
        minTypingComplete: false,
      }),
    ).toBe(true);
  });

  it("hides when idle or ready after min window", () => {
    expect(shouldShowTypingIndicator("ready", null)).toBe(false);
    expect(shouldShowTypingIndicator("error", null)).toBe(false);
  });
});

describe("shouldRevealAssistantReply", () => {
  it("holds the reply while typing is showing", () => {
    expect(shouldRevealAssistantReply("Hello", true)).toBe(false);
  });

  it("reveals non-empty reply when typing is done", () => {
    expect(shouldRevealAssistantReply("Hello", false)).toBe(true);
  });

  it("never reveals empty text", () => {
    expect(shouldRevealAssistantReply("", false)).toBe(false);
  });
});

describe("typingIndicatorLabel", () => {
  it("formats the typing copy", () => {
    expect(typingIndicatorLabel("Jeethesh")).toBe("Jeethesh is typing...");
  });
});
