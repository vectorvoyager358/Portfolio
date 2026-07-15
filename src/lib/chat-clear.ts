/** Abort any in-flight reply, then wipe the conversation. */
export function clearChatConversation(actions: {
  stop: () => void;
  setMessages: (messages: []) => void;
  clearError?: () => void;
}): void {
  actions.stop();
  actions.setMessages([]);
  actions.clearError?.();
}
