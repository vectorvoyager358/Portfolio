import { describe, expect, it } from "vitest";
import {
  encodePcm16Wav,
  mixToMono,
  resampleLinear,
} from "@/lib/audio-wav";

describe("encodePcm16Wav", () => {
  it("writes a valid RIFF/WAVE header for mono PCM16", () => {
    const samples = new Float32Array([0, 0.5, -0.5, 1]);
    const buffer = encodePcm16Wav(samples, 16_000);
    const view = new DataView(buffer);
    const ascii = (start: number, length: number) =>
      String.fromCharCode(
        ...Array.from({ length }, (_, i) => view.getUint8(start + i)),
      );

    expect(ascii(0, 4)).toBe("RIFF");
    expect(ascii(8, 4)).toBe("WAVE");
    expect(ascii(12, 4)).toBe("fmt ");
    expect(view.getUint16(20, true)).toBe(1); // PCM
    expect(view.getUint16(22, true)).toBe(1); // mono
    expect(view.getUint32(24, true)).toBe(16_000);
    expect(view.getUint16(34, true)).toBe(16);
    expect(ascii(36, 4)).toBe("data");
    expect(view.getUint32(40, true)).toBe(samples.length * 2);
    expect(buffer.byteLength).toBe(44 + samples.length * 2);
  });
});

describe("resampleLinear", () => {
  it("returns the same buffer when rates match", () => {
    const input = new Float32Array([1, 2, 3]);
    expect(resampleLinear(input, 16_000, 16_000)).toBe(input);
  });

  it("downsamples length roughly by rate ratio", () => {
    const input = new Float32Array(16_000).fill(0.1);
    const output = resampleLinear(input, 16_000, 8_000);
    expect(output.length).toBe(8_000);
  });
});

describe("mixToMono", () => {
  it("averages stereo channels", () => {
    const left = new Float32Array([1, 0]);
    const right = new Float32Array([-1, 0.5]);
    const buffer = {
      numberOfChannels: 2,
      length: 2,
      getChannelData: (channel: number) => (channel === 0 ? left : right),
    } as unknown as AudioBuffer;

    expect(Array.from(mixToMono(buffer))).toEqual([0, 0.25]);
  });
});
