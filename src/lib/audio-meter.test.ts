import { describe, expect, it } from "vitest";
import {
  isVoiceSpeechLevel,
  meterFromTimeDomain,
  VOICE_SPEECH_LEVEL,
} from "@/lib/audio-meter";

describe("meterFromTimeDomain", () => {
  it("returns near zero for silence-centered samples", () => {
    const silence = Uint8Array.from({ length: 64 }, () => 128);
    expect(meterFromTimeDomain(silence)).toBeLessThan(0.05);
  });

  it("returns higher energy for loud samples", () => {
    const loud = Uint8Array.from({ length: 64 }, (_, i) =>
      i % 2 === 0 ? 255 : 0,
    );
    const quiet = Uint8Array.from({ length: 64 }, () => 128);
    expect(meterFromTimeDomain(loud)).toBeGreaterThan(
      meterFromTimeDomain(quiet),
    );
    expect(meterFromTimeDomain(loud)).toBeGreaterThan(0.4);
  });
});

describe("isVoiceSpeechLevel", () => {
  it("ignores silence and accepts meaningful voice energy", () => {
    expect(isVoiceSpeechLevel(VOICE_SPEECH_LEVEL - 0.01)).toBe(false);
    expect(isVoiceSpeechLevel(VOICE_SPEECH_LEVEL)).toBe(true);
    expect(isVoiceSpeechLevel(0.8)).toBe(true);
  });
});
