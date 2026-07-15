import { describe, expect, it } from "vitest";
import { meterFromTimeDomain } from "@/lib/audio-meter";

describe("voice level for canvas orb", () => {
  it("stays near zero for silence and rises for loud input", () => {
    const silence = Uint8Array.from({ length: 64 }, () => 128);
    const loud = Uint8Array.from({ length: 64 }, (_, i) =>
      i % 2 === 0 ? 255 : 0,
    );
    expect(meterFromTimeDomain(silence)).toBeLessThan(0.08);
    expect(meterFromTimeDomain(loud)).toBeGreaterThan(
      meterFromTimeDomain(silence),
    );
  });
});
