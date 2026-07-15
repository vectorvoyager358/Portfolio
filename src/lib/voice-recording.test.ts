import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  disposeVoiceRecording,
  finishVoiceRecording,
  getActiveVoiceStream,
  isVoiceRecordingActive,
  startVoiceRecording,
} from "@/lib/voice-recording";

class FakeMediaRecorder {
  static instances: FakeMediaRecorder[] = [];
  static isTypeSupported() {
    return true;
  }
  state: RecordingState = "inactive";
  mimeType = "audio/webm";
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  onerror: (() => void) | null = null;
  private chunksEmitted = false;

  constructor(public stream: MediaStream) {
    FakeMediaRecorder.instances.push(this);
  }

  start() {
    this.state = "recording";
  }

  requestData() {
    this.chunksEmitted = true;
    this.ondataavailable?.({
      data: new Blob([new Uint8Array([1, 2, 3])], { type: "audio/webm" }),
    });
  }

  stop() {
    this.state = "inactive";
    if (!this.chunksEmitted) this.requestData();
    this.onstop?.();
  }
}

function fakeStream(): MediaStream {
  const track = {
    stop: vi.fn(),
    readyState: "live",
  };
  return {
    getTracks: () => [track as unknown as MediaStreamTrack],
  } as MediaStream;
}

describe("voice-recording session", () => {
  const originalMediaRecorder = globalThis.MediaRecorder;

  beforeEach(() => {
    FakeMediaRecorder.instances = [];
    vi.stubGlobal("MediaRecorder", FakeMediaRecorder);
    disposeVoiceRecording({ stopTracks: false });
  });

  afterEach(() => {
    disposeVoiceRecording({ stopTracks: true });
    if (originalMediaRecorder) {
      vi.stubGlobal("MediaRecorder", originalMediaRecorder);
    } else {
      vi.unstubAllGlobals();
    }
  });

  it("starts once and survives a second start on the same stream", () => {
    const stream = fakeStream();
    startVoiceRecording(stream);
    startVoiceRecording(stream);
    expect(FakeMediaRecorder.instances).toHaveLength(1);
    expect(isVoiceRecordingActive()).toBe(true);
    expect(getActiveVoiceStream()).toBe(stream);
  });

  it("finishes into a non-empty blob", async () => {
    const stream = fakeStream();
    startVoiceRecording(stream);
    const blob = await finishVoiceRecording();
    expect(blob).not.toBeNull();
    expect(blob?.size).toBeGreaterThan(0);
    expect(isVoiceRecordingActive()).toBe(false);
  });

  it("dispose without stopTracks leaves track running", () => {
    const stream = fakeStream();
    const track = stream.getTracks()[0] as unknown as { stop: ReturnType<typeof vi.fn> };
    startVoiceRecording(stream);
    disposeVoiceRecording({ stopTracks: false });
    expect(track.stop).not.toHaveBeenCalled();
    expect(isVoiceRecordingActive()).toBe(false);
  });
});
