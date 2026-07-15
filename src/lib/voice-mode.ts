import type { VoiceStatus } from "@/components/chat/VoiceOrb";

export type VoicePhase = "listening" | "thinking" | "error";

/** What End / orb should do for the current voice phase. */
export type VoiceControlAction =
  | "finish-recording"
  | "return-to-chat"
  | "retry"
  | "wait";

export function voicePhaseToStatus(phase: VoicePhase): VoiceStatus {
  if (phase === "thinking") return "thinking";
  if (phase === "error") return "error";
  return "listening";
}

export function voicePhaseCopy(phase: VoicePhase): string {
  if (phase === "thinking") return "Transcribing…";
  if (phase === "error") return "Something went wrong";
  return "Listening";
}

/** Normalize speech-to-text output before placing it in the editable composer. */
export function voiceTranscriptDraft(transcript: string): string {
  return transcript.trim();
}

/**
 * End with a live mic: try to finish into a draft. Empty audio should
 * exit quietly — never trap the user on a connection-error screen.
 */
export function voiceEndAction(
  phase: VoicePhase,
  hasActiveRecorder: boolean,
): VoiceControlAction {
  if (phase === "listening" && hasActiveRecorder) return "finish-recording";
  if (phase === "thinking") return "return-to-chat";
  return "return-to-chat";
}

/** What to do when finish yields no usable audio/transcript. */
export type VoiceEmptyFinishAction = "return-to-chat" | "error";

export function voiceEmptyFinishAction(
  source: "end" | "orb",
): VoiceEmptyFinishAction {
  // End is an escape hatch — empty input must leave voice mode immediately.
  if (source === "end") return "return-to-chat";
  return "error";
}

/** Orb tap: finish while listening, retry on error, otherwise wait. */
export function voiceOrbAction(phase: VoicePhase): VoiceControlAction {
  if (phase === "listening") return "finish-recording";
  if (phase === "error") return "retry";
  return "wait";
}

/** True when MediaRecorder can be stopped cleanly. */
export function isRecorderActive(
  state: RecordingState | null | undefined,
): boolean {
  return state === "recording" || state === "paused";
}

export const VOICE_AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  channelCount: 1,
  echoCancellation: true,
  noiseSuppression: true,
};

/** Request mic inside a user-gesture handler (required by browsers). */
export async function requestVoiceMediaStream(): Promise<MediaStream> {
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getUserMedia
  ) {
    throw new Error("Microphone is not available in this browser");
  }
  return navigator.mediaDevices.getUserMedia({
    audio: VOICE_AUDIO_CONSTRAINTS,
  });
}

/**
 * Voice sessions can remount in React Strict Mode. Cleanup of the first
 * mount must not poison the second mount's "user cancelled" flag.
 */
export function shouldAcceptVoiceSession(params: {
  sessionId: number;
  activeSessionId: number;
  userCancelled: boolean;
}): boolean {
  return (
    params.sessionId === params.activeSessionId && !params.userCancelled
  );
}
