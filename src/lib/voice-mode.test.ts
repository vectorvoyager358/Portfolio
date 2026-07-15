import { describe, expect, it } from "vitest";
import {
  isRecorderActive,
  shouldAcceptVoiceSession,
  voiceEmptyFinishAction,
  voiceEndAction,
  voiceOrbAction,
  voicePhaseCopy,
  voicePhaseToStatus,
  voiceTranscriptDraft,
  VOICE_AUDIO_CONSTRAINTS,
} from "@/lib/voice-mode";

describe("voice mode phase helpers", () => {
  it("maps phases to orb statuses", () => {
    expect(voicePhaseToStatus("listening")).toBe("listening");
    expect(voicePhaseToStatus("thinking")).toBe("thinking");
    expect(voicePhaseToStatus("error")).toBe("error");
  });

  it("returns user-facing copy per phase", () => {
    expect(voicePhaseCopy("listening")).toContain("Listening");
    expect(voicePhaseCopy("thinking")).toContain("Transcribing");
    expect(voicePhaseCopy("error")).toContain("wrong");
  });
});

describe("voiceTranscriptDraft", () => {
  it("normalizes a transcript for the editable chat composer", () => {
    expect(voiceTranscriptDraft("  Tell me about VoxWire.  ")).toBe(
      "Tell me about VoxWire.",
    );
  });
});

describe("voiceEndAction", () => {
  it("finishes recording when listening with a live recorder", () => {
    expect(voiceEndAction("listening", true)).toBe("finish-recording");
  });

  it("returns to chat when listening but recorder never started", () => {
    expect(voiceEndAction("listening", false)).toBe("return-to-chat");
  });

  it("returns to chat while thinking or on error so End is never a dead end", () => {
    expect(voiceEndAction("thinking", false)).toBe("return-to-chat");
    expect(voiceEndAction("error", false)).toBe("return-to-chat");
  });
});

describe("voiceOrbAction", () => {
  it("finishes on listening and retries on error", () => {
    expect(voiceOrbAction("listening")).toBe("finish-recording");
    expect(voiceOrbAction("error")).toBe("retry");
    expect(voiceOrbAction("thinking")).toBe("wait");
  });
});

describe("isRecorderActive", () => {
  it("treats recording and paused as active", () => {
    expect(isRecorderActive("recording")).toBe(true);
    expect(isRecorderActive("paused")).toBe(true);
    expect(isRecorderActive("inactive")).toBe(false);
    expect(isRecorderActive(null)).toBe(false);
  });
});

describe("shouldAcceptVoiceSession", () => {
  it("rejects stale sessions from Strict Mode remount cleanup", () => {
    expect(
      shouldAcceptVoiceSession({
        sessionId: 1,
        activeSessionId: 2,
        userCancelled: false,
      }),
    ).toBe(false);
  });

  it("rejects the active session only when the user cancelled", () => {
    expect(
      shouldAcceptVoiceSession({
        sessionId: 2,
        activeSessionId: 2,
        userCancelled: true,
      }),
    ).toBe(false);
    expect(
      shouldAcceptVoiceSession({
        sessionId: 2,
        activeSessionId: 2,
        userCancelled: false,
      }),
    ).toBe(true);
  });
});

describe("voiceEmptyFinishAction", () => {
  it("lets End exit quietly when there was no speech", () => {
    expect(voiceEmptyFinishAction("end")).toBe("return-to-chat");
  });

  it("keeps orb empty finishes as retryable errors", () => {
    expect(voiceEmptyFinishAction("orb")).toBe("error");
  });
});

describe("VOICE_AUDIO_CONSTRAINTS", () => {
  it("requests a mono processed mic stream", () => {
    expect(VOICE_AUDIO_CONSTRAINTS.channelCount).toBe(1);
    expect(VOICE_AUDIO_CONSTRAINTS.echoCancellation).toBe(true);
    expect(VOICE_AUDIO_CONSTRAINTS.noiseSuppression).toBe(true);
  });
});
