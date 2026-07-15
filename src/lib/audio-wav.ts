/** Encode mono PCM samples as a 16-bit little-endian WAV ArrayBuffer. */
export function encodePcm16Wav(
  samples: Float32Array,
  sampleRate: number,
): ArrayBuffer {
  const bytesPerSample = 2;
  const blockAlign = bytesPerSample; // mono
  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // PCM fmt chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // bits per sample
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[i] ?? 0));
    view.setInt16(
      offset,
      clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff,
      true,
    );
    offset += 2;
  }

  return buffer;
}

export function mixToMono(buffer: AudioBuffer): Float32Array {
  const { numberOfChannels, length } = buffer;
  if (numberOfChannels === 1) {
    return buffer.getChannelData(0).slice(0);
  }

  const mono = new Float32Array(length);
  for (let channel = 0; channel < numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      mono[i] = (mono[i] ?? 0) + (data[i] ?? 0) / numberOfChannels;
    }
  }
  return mono;
}

export function resampleLinear(
  input: Float32Array,
  inputRate: number,
  outputRate: number,
): Float32Array {
  if (inputRate === outputRate) return input;
  if (input.length === 0) return new Float32Array(0);

  const ratio = inputRate / outputRate;
  const outputLength = Math.max(1, Math.round(input.length / ratio));
  const output = new Float32Array(outputLength);

  for (let i = 0; i < outputLength; i += 1) {
    const position = i * ratio;
    const index = Math.floor(position);
    const fraction = position - index;
    const a = input[index] ?? 0;
    const b = input[Math.min(index + 1, input.length - 1)] ?? 0;
    output[i] = a + (b - a) * fraction;
  }

  return output;
}

export async function blobToWavBlob(
  blob: Blob,
  targetSampleRate = 16_000,
): Promise<Blob> {
  const AudioContextCtor =
    typeof window !== "undefined"
      ? window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      : undefined;

  if (!AudioContextCtor) {
    throw new Error("Web Audio API is not available in this browser");
  }

  const context = new AudioContextCtor();
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(arrayBuffer.slice(0));
    const mono = mixToMono(audioBuffer);
    const resampled = resampleLinear(
      mono,
      audioBuffer.sampleRate,
      targetSampleRate,
    );
    const wav = encodePcm16Wav(resampled, targetSampleRate);
    return new Blob([wav], { type: "audio/wav" });
  } finally {
    await context.close().catch(() => undefined);
  }
}

function writeString(view: DataView, offset: number, value: string) {
  for (let i = 0; i < value.length; i += 1) {
    view.setUint8(offset + i, value.charCodeAt(i));
  }
}
