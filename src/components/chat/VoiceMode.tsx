"use client";

import { motion } from "motion/react";
import { MessageSquare, MicOff, PhoneOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { blobToWavBlob } from "@/lib/audio-wav";
import { profile } from "@/data/profile";
import {
  voiceEmptyFinishAction,
  voiceEndAction,
  voicePhaseCopy,
  voicePhaseToStatus,
  type VoicePhase,
} from "@/lib/voice-mode";
import {
  disposeVoiceRecording,
  finishVoiceRecording,
  getActiveVoiceStream,
  isVoiceRecordingActive,
  startVoiceRecording,
} from "@/lib/voice-recording";
import { VoiceOrb } from "@/components/chat/VoiceOrb";
import { PersonaAvatar } from "@/components/ui/PersonaAvatar";

export function VoiceMode({
  initialStream = null,
  onClose,
  onTranscript,
}: {
  initialStream?: MediaStream | null;
  onClose: () => void;
  onEnd?: () => void;
  onTranscript: (text: string) => void | Promise<void>;
}) {
  const [phase, setPhase] = useState<VoicePhase>(() =>
    initialStream || isVoiceRecordingActive() ? "listening" : "error",
  );
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(
    () => initialStream ?? getActiveVoiceStream(),
  );
  const phaseRef = useRef(phase);
  const closingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const hasSpeechRef = useRef(false);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    mountedRef.current = true;
    closingRef.current = false;

    // Parent starts recording on click; this only re-binds after Strict remount.
    if (initialStream) {
      try {
        startVoiceRecording(initialStream);
      } catch {
        queueMicrotask(() => {
          if (mountedRef.current) {
            setPhase("error");
            setMediaStream(null);
          }
        });
      }
    }

    return () => {
      mountedRef.current = false;
    };
  }, [initialStream]);

  async function finishAndSend(source: "end" | "orb") {
    const onEmpty = voiceEmptyFinishAction(source);

    if (!hasSpeechRef.current) {
      if (onEmpty === "return-to-chat") {
        returnToChat();
        return;
      }
      disposeVoiceRecording({ stopTracks: true });
      setMediaStream(null);
      setPhase("error");
      return;
    }

    if (!isVoiceRecordingActive() && !getActiveVoiceStream()) {
      if (onEmpty === "return-to-chat") {
        returnToChat();
        return;
      }
      setPhase("error");
      return;
    }

    try {
      const blob = await finishVoiceRecording();
      if (closingRef.current || !mountedRef.current) return;
      if (!blob) {
        if (onEmpty === "return-to-chat") {
          returnToChat();
          return;
        }
        setPhase("error");
        return;
      }
      setMediaStream(null);
      await transcribeBlob(blob, onEmpty);
    } catch {
      if (closingRef.current || !mountedRef.current) return;
      if (onEmpty === "return-to-chat") {
        returnToChat();
        return;
      }
      setPhase("error");
    }
  }

  async function transcribeBlob(
    blob: Blob,
    onEmpty: "return-to-chat" | "error" = "error",
  ) {
    if (closingRef.current || !mountedRef.current) return;
    setPhase("thinking");
    const abort = new AbortController();
    abortRef.current = abort;
    try {
      const wavBlob = await blobToWavBlob(blob, 16_000);
      if (abort.signal.aborted || closingRef.current || !mountedRef.current) {
        return;
      }

      const form = new FormData();
      form.append("file", wavBlob, "recording.wav");

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: form,
        signal: abort.signal,
      });
      const payload = (await response.json()) as {
        text?: string;
        error?: string;
      };

      if (abort.signal.aborted || closingRef.current || !mountedRef.current) {
        return;
      }

      const text = payload.text?.trim() ?? "";
      if (!response.ok) {
        throw new Error(payload.error || "Could not transcribe audio");
      }
      if (!text) {
        if (onEmpty === "return-to-chat") {
          returnToChat();
          return;
        }
        setPhase("error");
        return;
      }

      await onTranscript(text);
      if (!closingRef.current && mountedRef.current) onClose();
    } catch (error) {
      if (abort.signal.aborted || closingRef.current || !mountedRef.current) {
        return;
      }
      if (error instanceof DOMException && error.name === "AbortError") return;
      if (onEmpty === "return-to-chat") {
        returnToChat();
        return;
      }
      setPhase("error");
    } finally {
      if (abortRef.current === abort) abortRef.current = null;
    }
  }

  function returnToChat() {
    closingRef.current = true;
    abortRef.current?.abort();
    abortRef.current = null;
    disposeVoiceRecording({ stopTracks: true });
    setMediaStream(null);
    onClose();
  }

  function exitVoice(next: "text" | "end") {
    if (next === "text") {
      returnToChat();
      return;
    }

    const action = voiceEndAction(
      phaseRef.current,
      isVoiceRecordingActive(),
    );

    if (action === "finish-recording") {
      void finishAndSend("end");
      return;
    }

    returnToChat();
  }

  const statusLine =
    phase === "error"
      ? "Connection error. Please try again."
      : phase === "thinking"
        ? "Transcribing…"
        : "Listening";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Voice mode"
      className="absolute inset-0 z-30 flex flex-col bg-bg-elevated"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="section-band-hero pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
      />

      <div className="relative z-10 flex items-center gap-3 border-b border-line px-4 py-3">
        <PersonaAvatar size="md" className="ring-2 ring-accent/20" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm text-fg">
            {profile.shortName.toLowerCase()}
          </p>
          <p
            className={`truncate text-xs ${
              phase === "error" ? "text-danger" : "text-fg-muted"
            }`}
          >
            {statusLine}
          </p>
        </div>
        {phase === "error" ? (
          <MicOff className="h-4 w-4 shrink-0 text-danger" aria-hidden />
        ) : null}
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
        <VoiceOrb
          stream={mediaStream}
          status={voicePhaseToStatus(phase)}
          statusText={voicePhaseCopy(phase)}
          onSpeechDetected={() => {
            hasSpeechRef.current = true;
          }}
        />
        {phase !== "listening" ? (
          <p className="mt-2 max-w-[16rem] text-center text-sm text-fg-muted">
            {phase === "thinking"
              ? "Turning your voice into a chat draft…"
              : "Mic unavailable or connection error. Tap End to return."}
          </p>
        ) : null}
      </div>

      <div className="relative z-10 flex items-center justify-center gap-2 border-t border-line px-4 py-3">
        <button
          type="button"
          onClick={() => exitVoice("text")}
          className="inline-flex items-center gap-2 rounded-full bg-bg-soft px-4 py-2.5 text-sm text-fg transition hover:bg-bg"
        >
          <MessageSquare className="h-4 w-4 text-fg-muted" aria-hidden />
          Switch to text
        </button>
        <button
          type="button"
          onClick={() => exitVoice("end")}
          className="inline-flex items-center gap-2 rounded-full bg-danger/10 px-4 py-2.5 text-sm text-danger transition hover:bg-danger/15"
        >
          <PhoneOff className="h-4 w-4" aria-hidden />
          End
        </button>
      </div>
    </motion.div>
  );
}
