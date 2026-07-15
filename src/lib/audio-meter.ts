/** Map analyser time-domain samples to 0..1 energy. */
export function meterFromTimeDomain(samples: Uint8Array): number {
  if (samples.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < samples.length; i += 1) {
    const centered = ((samples[i] ?? 128) - 128) / 128;
    sum += centered * centered;
  }
  const rms = Math.sqrt(sum / samples.length);
  const gated = Math.max(0, rms - 0.008);
  return Math.min(1, Math.pow(gated * 5.5, 0.55));
}

export const VOICE_SPEECH_LEVEL = 0.12;

/** Ignore room noise and only treat meaningful analyser energy as speech. */
export function isVoiceSpeechLevel(level: number): boolean {
  return level >= VOICE_SPEECH_LEVEL;
}
