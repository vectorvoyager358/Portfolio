export const TYPING_MIN_MS = 3000;

export function shouldShowTypingIndicator(
  status: string,
  lastAssistantText: string | null,
  options?: {
    minTypingComplete?: boolean;
  },
): boolean {
  const minTypingComplete = options?.minTypingComplete ?? true;

  // Hold the spinner for a minimum window even if tokens already arrived.
  if (!minTypingComplete) return true;

  if (status === "submitted") return true;
  if (status === "streaming") {
    return !lastAssistantText?.trim();
  }
  return false;
}

/** Hide the assistant bubble while the minimum typing spinner is still showing. */
export function shouldRevealAssistantReply(
  text: string,
  showTyping: boolean,
): boolean {
  if (!text.trim()) return false;
  return !showTyping;
}

export function typingIndicatorLabel(name: string): string {
  return `${name} is typing...`;
}
