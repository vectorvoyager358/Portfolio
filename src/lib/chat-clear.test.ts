import { describe, expect, it, vi } from "vitest";
import { clearChatConversation } from "@/lib/chat-clear";

describe("clearChatConversation", () => {
  it("stops the in-flight reply before clearing messages", () => {
    const calls: string[] = [];
    clearChatConversation({
      stop: () => calls.push("stop"),
      setMessages: () => calls.push("setMessages"),
    });
    expect(calls).toEqual(["stop", "setMessages"]);
  });

  it("clears error state when provided", () => {
    const clearError = vi.fn();
    clearChatConversation({
      stop: vi.fn(),
      setMessages: vi.fn(),
      clearError,
    });
    expect(clearError).toHaveBeenCalledOnce();
  });
});
