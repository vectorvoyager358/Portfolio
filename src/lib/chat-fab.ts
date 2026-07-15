export type ChatFabGlyph = "idle" | "plus" | "close";

export const CHAT_FAB_PLUS_MS = 280;

export function resolveChatFabGlyph(state: {
  open: boolean;
  closing: boolean;
}): ChatFabGlyph {
  if (state.open) return "close";
  if (state.closing) return "plus";
  return "idle";
}

export type AssistantLiveStatus = boolean | null;

export function assistantStatusDotClass(
  configured: AssistantLiveStatus,
): string {
  if (configured === true) return "bg-emerald-500";
  if (configured === false) return "bg-danger";
  return "bg-fg-muted";
}

export function assistantStatusLabel(configured: AssistantLiveStatus): string {
  if (configured === true) return "Assistant online";
  if (configured === false) return "Assistant offline";
  return "Checking assistant status";
}
