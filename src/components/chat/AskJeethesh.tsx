"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, generateId } from "ai";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUp,
  LoaderCircle,
  Mic,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { clearChatConversation } from "@/lib/chat-clear";
import {
  CHAT_FAB_PLUS_MS,
  assistantStatusDotClass,
  assistantStatusLabel,
  resolveChatFabGlyph,
} from "@/lib/chat-fab";
import {
  TYPING_MIN_MS,
  shouldRevealAssistantReply,
  shouldShowTypingIndicator,
  typingIndicatorLabel,
} from "@/lib/chat-typing";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChatMarkdown } from "@/components/chat/ChatMarkdown";
import { SECTION_BANDS, sectionBandClass } from "@/lib/section-band";
import { VoiceMode } from "@/components/chat/VoiceMode";
import { PersonaAvatar } from "@/components/ui/PersonaAvatar";
import {
  requestVoiceMediaStream,
  voiceTranscriptDraft,
} from "@/lib/voice-mode";
import {
  disposeVoiceRecording,
  startVoiceRecording,
} from "@/lib/voice-recording";

function messageText(
  message: { parts?: Array<{ type: string; text?: string }> },
): string {
  if (!message.parts) return "";
  return message.parts
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text ?? "")
    .join("");
}

export function AskJeethesh({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [input, setInput] = useState("");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceStream, setVoiceStream] = useState<MediaStream | null>(null);
  const [closing, setClosing] = useState(false);
  const [minTypingComplete, setMinTypingComplete] = useState(true);
  const [chatId, setChatId] = useState(() => generateId());
  const scrollerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef = useRef<number | null>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const { messages, sendMessage, status, error, setMessages, stop, clearError } =
    useChat({
      id: chatId,
      transport,
    });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/chat", { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setConfigured(res.status !== 503);
      })
      .catch(() => {
        if (!cancelled) setConfigured(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open, status, minTypingComplete]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [input, open]);

  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(() => setClosing(false), CHAT_FAB_PLUS_MS);
    return () => window.clearTimeout(timer);
  }, [closing]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current !== null) {
        window.clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  const busy = status === "submitted" || status === "streaming";
  const fabGlyph = resolveChatFabGlyph({ open, closing });
  const lastAssistant = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");
  const lastAssistantText = lastAssistant
    ? messageText(lastAssistant)
    : null;
  const showTyping = shouldShowTypingIndicator(status, lastAssistantText, {
    minTypingComplete,
  });

  function beginTypingWindow() {
    if (typingTimerRef.current !== null) {
      window.clearTimeout(typingTimerRef.current);
    }
    setMinTypingComplete(false);
    typingTimerRef.current = window.setTimeout(() => {
      setMinTypingComplete(true);
      typingTimerRef.current = null;
    }, TYPING_MIN_MS);
  }

  function toggleOpen() {
    if (open) {
      disposeVoiceRecording({ stopTracks: true });
      setVoiceStream(null);
      setVoiceOpen(false);
      setClosing(true);
      onOpenChange(false);
      return;
    }
    setClosing(false);
    onOpenChange(true);
  }

  async function openVoiceMode() {
    if (busy || configured === false) return;
    try {
      const stream = await requestVoiceMediaStream();
      // Start in the click turn so Strict Mode remounts reuse the same session.
      startVoiceRecording(stream);
      setVoiceStream(stream);
      setVoiceOpen(true);
    } catch {
      disposeVoiceRecording({ stopTracks: true });
      setVoiceStream(null);
      setVoiceOpen(true);
    }
  }

  function closeVoiceMode() {
    disposeVoiceRecording({ stopTracks: true });
    voiceStream?.getTracks().forEach((track) => track.stop());
    setVoiceStream(null);
    setVoiceOpen(false);
  }

  function stageVoiceTranscript(text: string) {
    setInput(voiceTranscriptDraft(text));
    window.setTimeout(() => textareaRef.current?.focus(), 0);
  }

  async function submitPrompt(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    beginTypingWindow();
    await sendMessage({ text: trimmed });
  }

  function clearConversation() {
    if (typingTimerRef.current !== null) {
      window.clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setMinTypingComplete(true);
    clearChatConversation({ stop, setMessages, clearError });
    setChatId(generateId());
  }

  return (
    <>
      <section
        id="ask"
        className={`${sectionBandClass(SECTION_BANDS.ask)} relative`}
      >
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Ask me"
              title="Chat with a grounded copy of my profile"
              description="Ask about my experience. Speak or type — answers stay scoped to this portfolio."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex flex-wrap gap-3">
              {profile.suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    onOpenChange(true);
                    void submitPrompt(prompt);
                  }}
                  className="rounded-md border border-line bg-bg-elevated/60 px-4 py-2 text-left text-sm text-fg-muted transition hover:border-accent/40 hover:text-fg"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(true)}
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-bg transition hover:bg-accent-strong"
            >
              <Sparkles className="h-4 w-4" />
              Open assistant
            </button>
          </Reveal>
        </div>
      </section>

      <motion.button
        type="button"
        onClick={toggleOpen}
        className="fixed z-[55] flex h-[3.75rem] w-[3.75rem] items-center justify-center overflow-visible rounded-full border border-line bg-bg-elevated shadow-lg backdrop-blur-md transition hover:border-accent/40"
        style={{
          bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px) + 0.5rem)",
          right: "max(1.25rem, env(safe-area-inset-right, 0px) + 0.5rem)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        aria-label={
          open
            ? "Close Ask Jeethesh"
            : `Open Ask Jeethesh. ${assistantStatusLabel(configured)}`
        }
      >
        <AnimatePresence mode="wait">
          {fabGlyph === "close" ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-full w-full items-center justify-center rounded-full bg-accent"
            >
              <X className="h-6 w-6 text-bg" aria-hidden />
            </motion.div>
          ) : fabGlyph === "plus" ? (
            <motion.div
              key="plus"
              initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex h-full w-full items-center justify-center rounded-full bg-accent"
            >
              <Plus className="h-6 w-6 text-bg" aria-hidden />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex h-full w-full items-center justify-center"
            >
              <div className="relative h-full w-full overflow-hidden rounded-full">
                <PersonaAvatar size="fab" className="!h-full !w-full" />
              </div>
              {configured === true ? (
                <motion.span
                  className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ) : null}
              <span
                className={`absolute -right-0.5 -bottom-0.5 z-10 h-3.5 w-3.5 rounded-full border-2 border-bg-elevated ${assistantStatusDotClass(configured)}`}
                title={assistantStatusLabel(configured)}
                aria-hidden
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {open ? (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-end p-0 sm:items-end sm:justify-end sm:p-6 sm:pb-24">
          <motion.div
            role="dialog"
            aria-label="Ask Jeethesh"
            data-lenis-prevent
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto relative mb-20 flex h-[min(78vh,680px)] w-full flex-col overflow-hidden border border-line bg-bg-elevated shadow-2xl sm:mb-0 sm:max-w-md sm:rounded-2xl"
            onWheel={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line bg-bg-elevated/80 px-4 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <PersonaAvatar size="md" className="ring-2 ring-accent/20" />
                  <span
                    className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-bg-elevated ${assistantStatusDotClass(configured)}`}
                    title={assistantStatusLabel(configured)}
                    aria-hidden
                  />
                </div>
                <div>
                  <p className="font-display text-base text-fg">Ask Jeethesh</p>
                  <p className="font-mono text-[10px] tracking-[0.16em] text-fg-muted uppercase">
                    {configured === false
                      ? "Offline"
                      : configured === null
                        ? "Connecting…"
                        : "Grounded portfolio assistant"}
                  </p>
                </div>
              </div>
              {messages.length > 0 || busy ? (
                <button
                  type="button"
                  className="rounded-md px-2 py-1 text-xs text-fg-muted transition hover:text-fg"
                  onClick={clearConversation}
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div
              ref={scrollerRef}
              className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4"
            >
              {configured === false ? (
                <div className="flex h-full min-h-48 flex-col items-center justify-center gap-2 px-2 text-center">
                  <p className="font-display text-lg text-fg">
                    Assistant is offline
                  </p>
                  <p className="max-w-sm text-sm leading-relaxed text-fg-muted">
                    Ask Jeethesh is temporarily unavailable. Please try again
                    later, or reach out via the contact links below.
                  </p>
                </div>
              ) : (
                <>
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-4 text-center">
                      <PersonaAvatar
                        size="hero"
                        className="!h-16 !w-16 ring-2 ring-accent/20"
                      />
                      <div className="space-y-1.5">
                        <p className="font-display text-lg text-fg">
                          Hey, I&apos;m {profile.shortName}&apos;s assistant
                        </p>
                        <p className="mx-auto max-w-xs text-sm leading-relaxed text-fg-muted">
                          Ask about Halliburton work, pinned projects, skills, or
                          how to get in touch. Tap the mic for voice mode.
                        </p>
                      </div>
                      <div className="mt-1 flex w-full flex-col gap-2">
                        {profile.suggestedPrompts.slice(0, 4).map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => void submitPrompt(prompt)}
                            className="group flex items-center justify-between gap-2 rounded-lg border border-line bg-bg-soft/50 px-3 py-2.5 text-left text-xs text-fg-muted transition hover:border-accent/40 hover:bg-bg-soft hover:text-fg"
                          >
                            <span>{prompt}</span>
                            <ArrowUp className="h-3.5 w-3.5 shrink-0 rotate-45 text-fg-muted opacity-0 transition group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {messages.map((message) => {
                    const text = messageText(message);
                    const isUser = message.role === "user";
                    const isStreamingAssistant =
                      !isUser &&
                      status === "streaming" &&
                      message.id === lastAssistant?.id &&
                      !showTyping;

                    if (!isUser && !shouldRevealAssistantReply(text, showTyping)) {
                      return null;
                    }

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        {!isUser ? (
                          <PersonaAvatar
                            size="sm"
                            className="!h-7 !w-7 shrink-0 self-end"
                          />
                        ) : null}
                        <div
                          className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                            isUser
                              ? "rounded-2xl rounded-br-md bg-accent text-bg"
                              : "rounded-2xl rounded-bl-md border border-line bg-bg-soft text-fg"
                          }`}
                        >
                          {isUser ? (
                            text
                          ) : (
                            <>
                              <ChatMarkdown text={text} />
                              {isStreamingAssistant ? (
                                <span
                                  className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-accent/80"
                                  aria-hidden
                                />
                              ) : null}
                            </>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}

                  {showTyping ? (
                    <div className="flex items-end justify-start gap-2">
                      <PersonaAvatar
                        size="sm"
                        className="!h-7 !w-7 shrink-0 self-end"
                      />
                      <div
                        className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-line bg-bg-soft px-3 py-2 text-sm text-fg-muted"
                        aria-live="polite"
                      >
                        <LoaderCircle
                          className="h-3.5 w-3.5 animate-spin text-accent"
                          aria-hidden
                        />
                        {typingIndicatorLabel(profile.shortName)}
                      </div>
                    </div>
                  ) : null}

                  {error ? (
                    <p className="text-sm text-danger">
                      {error.message || "Something went wrong. Try again."}
                    </p>
                  ) : null}
                </>
              )}
            </div>

            <form
              className="border-t border-line bg-bg-elevated/80 p-3 backdrop-blur-sm"
              onSubmit={(event) => {
                event.preventDefault();
                void submitPrompt(input);
              }}
            >
              <div className="flex items-end gap-2 rounded-2xl border border-line bg-bg px-2 py-1.5 transition focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/15">
                <button
                  type="button"
                  onClick={() => void openVoiceMode()}
                  disabled={busy || configured === false}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-fg-muted transition hover:bg-bg-soft hover:text-accent disabled:opacity-40"
                  aria-label="Open voice mode"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={1}
                  placeholder={
                    configured === false
                      ? "Assistant offline"
                      : "Type your question…"
                  }
                  disabled={busy || configured === false}
                  className="max-h-40 min-h-[2.25rem] flex-1 resize-none overflow-y-auto bg-transparent px-1 py-1.5 text-sm leading-relaxed text-fg outline-none placeholder:text-fg-muted disabled:opacity-50"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void submitPrompt(input);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim() || configured === false}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-bg transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  {busy ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                </button>
              </div>
            </form>

            {voiceOpen ? (
              <VoiceMode
                initialStream={voiceStream}
                onClose={closeVoiceMode}
                onTranscript={stageVoiceTranscript}
              />
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </>
  );
}
