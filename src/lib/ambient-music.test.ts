import { describe, expect, it } from "vitest";
import {
  AMBIENT_TRACK_TITLE,
  ambientTargetVolume,
  clampVolume,
  fadeVolumeAtStep,
  hzToBin,
  musicTooltipText,
  parseAmbientPreference,
  serializeAmbientPreference,
} from "@/lib/ambient-music";

describe("ambient-music helpers", () => {
  it("maps frequency to FFT bins", () => {
    expect(hzToBin(0)).toBe(0);
    expect(hzToBin(187.5)).toBe(1);
    expect(hzToBin(750, 48_000, 256)).toBe(4);
  });

  it("ducks volume when chat is open", () => {
    expect(ambientTargetVolume(false)).toBeGreaterThan(
      ambientTargetVolume(true),
    );
  });

  it("fades volume linearly across steps", () => {
    expect(
      fadeVolumeAtStep({ start: 0.3, target: 0.1, step: 0, steps: 20 }),
    ).toBe(0.3);
    expect(
      fadeVolumeAtStep({ start: 0.3, target: 0.1, step: 10, steps: 20 }),
    ).toBeCloseTo(0.2);
    expect(
      fadeVolumeAtStep({ start: 0.3, target: 0.1, step: 20, steps: 20 }),
    ).toBe(0.1);
  });

  it("clamps volumes into 0..1", () => {
    expect(clampVolume(-0.2)).toBe(0);
    expect(clampVolume(1.4)).toBe(1);
  });

  it("returns tooltip copy for each state", () => {
    expect(musicTooltipText({ playing: true })).toBe(AMBIENT_TRACK_TITLE);
    expect(musicTooltipText({ playing: false })).toBe("Incoming ambient signal");
    expect(musicTooltipText({ playing: false, dismissed: true })).toBe(
      "Logging off. Signal desk out.",
    );
  });

  it("serializes ambient preference", () => {
    expect(parseAmbientPreference("on")).toBe(true);
    expect(parseAmbientPreference("off")).toBe(false);
    expect(serializeAmbientPreference(true)).toBe("on");
    expect(serializeAmbientPreference(false)).toBe("off");
  });
});
