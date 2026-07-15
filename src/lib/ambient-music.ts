export const AMBIENT_STORAGE_KEY = "ambient-music";
export const AMBIENT_SEEN_KEY = "ambient-seen";
export const AMBIENT_VOL_DEFAULT = 0.3;
export const AMBIENT_VOL_CHAT_OPEN = 0.1;
export const AMBIENT_FADE_MS = 600;
export const AMBIENT_BAR_COUNT = 4;
export const AMBIENT_FFT_SIZE = 256;
export const AMBIENT_AUTO_SHOW_DELAY_MS = 10_000;
export const AMBIENT_TRACK_TITLE = "Uncharted Worlds";
export const AMBIENT_AUDIO_SRC = "/audio/ambient-loop.mp3";

export type AmbientBandCalibration = {
  lo: number;
  hi: number;
  floor: number;
  ceil: number;
  label: string;
};

/** Measured calibration for pad/drone energy bands (legacy analysis shape). */
export const AMBIENT_BAND_CALIBRATION: AmbientBandCalibration[] = [
  { lo: 60, hi: 200, floor: -24, ceil: -18, label: "sub-bass" },
  { lo: 200, hi: 500, floor: -20, ceil: -17, label: "bass" },
  { lo: 500, hi: 1200, floor: -23, ceil: -20, label: "low-mid" },
  { lo: 1200, hi: 3000, floor: -32, ceil: -28, label: "mid" },
];

export function hzToBin(
  hz: number,
  sampleRate = 48_000,
  fftSize = AMBIENT_FFT_SIZE,
): number {
  return Math.round(hz / (sampleRate / fftSize));
}

export function ambientTargetVolume(chatOpen: boolean): number {
  return chatOpen ? AMBIENT_VOL_CHAT_OPEN : AMBIENT_VOL_DEFAULT;
}

export function clampVolume(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/** Compute next volume for a linear fade step. */
export function fadeVolumeAtStep(params: {
  start: number;
  target: number;
  step: number;
  steps: number;
}): number {
  const { start, target, step, steps } = params;
  const t = Math.min(1, Math.max(0, step / steps));
  return clampVolume(start + (target - start) * t);
}

export function musicTooltipText(params: {
  playing: boolean;
  dismissed?: boolean;
}): string {
  if (params.playing) return AMBIENT_TRACK_TITLE;
  if (params.dismissed) return "Logging off. Signal desk out.";
  return "Incoming ambient signal";
}

export function parseAmbientPreference(value: string | null): boolean {
  return value === "on";
}

export function serializeAmbientPreference(playing: boolean): "on" | "off" {
  return playing ? "on" : "off";
}
