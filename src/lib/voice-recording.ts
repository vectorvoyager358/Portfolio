import { isRecorderActive } from "@/lib/voice-mode";

function pickMimeType(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
  ];
  if (typeof MediaRecorder === "undefined") return "audio/webm";
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

type VoiceRecordingSession = {
  stream: MediaStream;
  recorder: MediaRecorder;
  chunks: BlobPart[];
};

/** Module-level session so React Strict Mode remounts don't kill the mic. */
let session: VoiceRecordingSession | null = null;
let finishWaiter: {
  resolve: (blob: Blob | null) => void;
} | null = null;

export function getActiveVoiceStream(): MediaStream | null {
  return session?.stream ?? null;
}

export function isVoiceRecordingActive(): boolean {
  return isRecorderActive(session?.recorder.state);
}

export function startVoiceRecording(stream: MediaStream): void {
  if (session?.stream === stream && isRecorderActive(session.recorder.state)) {
    return;
  }

  disposeVoiceRecording({ stopTracks: false });

  const mimeType = pickMimeType();
  const recorder = mimeType
    ? new MediaRecorder(stream, { mimeType })
    : new MediaRecorder(stream);
  const chunks: BlobPart[] = [];

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };

  recorder.onstop = () => {
    const type = recorder.mimeType || "audio/webm";
    const blob = new Blob(chunks, { type });
    const waiter = finishWaiter;
    finishWaiter = null;
    if (session?.recorder === recorder) {
      session = null;
    }
    waiter?.resolve(blob.size > 0 ? blob : null);
  };

  recorder.onerror = () => {
    const waiter = finishWaiter;
    finishWaiter = null;
    if (session?.recorder === recorder) {
      session = null;
    }
    waiter?.resolve(null);
  };

  recorder.start(250);
  session = { stream, recorder, chunks };
}

/** Stop recording and resolve with the captured audio blob (or null). */
export function finishVoiceRecording(): Promise<Blob | null> {
  const current = session;
  if (!current) return Promise.resolve(null);

  if (!isRecorderActive(current.recorder.state)) {
    const type = current.recorder.mimeType || "audio/webm";
    const blob = new Blob(current.chunks, { type });
    session = null;
    return Promise.resolve(blob.size > 0 ? blob : null);
  }

  return new Promise((resolve) => {
    finishWaiter = { resolve };
    try {
      current.recorder.requestData();
    } catch {
      // Some browsers throw if no data is buffered yet.
    }
    try {
      current.recorder.stop();
    } catch {
      finishWaiter = null;
      session = null;
      resolve(null);
    }
  });
}

export function disposeVoiceRecording(options?: { stopTracks?: boolean }) {
  const stopTracks = options?.stopTracks ?? true;
  const current = session;
  const waiter = finishWaiter;
  finishWaiter = null;
  session = null;

  if (waiter) waiter.resolve(null);

  if (current) {
    if (isRecorderActive(current.recorder.state)) {
      try {
        current.recorder.stop();
      } catch {
        // ignore
      }
    }
    if (stopTracks) {
      current.stream.getTracks().forEach((track) => track.stop());
    }
  }
}
