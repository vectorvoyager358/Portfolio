import { describe, expect, it } from "vitest";
import {
  assistantStatusDotClass,
  assistantStatusLabel,
  resolveChatFabGlyph,
} from "@/lib/chat-fab";

describe("resolveChatFabGlyph", () => {
  it("shows close while open", () => {
    expect(resolveChatFabGlyph({ open: true, closing: false })).toBe("close");
    expect(resolveChatFabGlyph({ open: true, closing: true })).toBe("close");
  });

  it("shows plus briefly while closing", () => {
    expect(resolveChatFabGlyph({ open: false, closing: true })).toBe("plus");
  });

  it("shows idle emoji when closed", () => {
    expect(resolveChatFabGlyph({ open: false, closing: false })).toBe("idle");
  });
});

describe("assistant live status", () => {
  it("maps configured state to status colors", () => {
    expect(assistantStatusDotClass(true)).toContain("emerald");
    expect(assistantStatusDotClass(false)).toContain("danger");
    expect(assistantStatusDotClass(null)).toContain("muted");
  });

  it("maps configured state to accessible labels", () => {
    expect(assistantStatusLabel(true)).toBe("Assistant online");
    expect(assistantStatusLabel(false)).toBe("Assistant offline");
    expect(assistantStatusLabel(null)).toBe("Checking assistant status");
  });
});
