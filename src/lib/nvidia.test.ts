import { afterEach, describe, expect, it } from "vitest";
import {
  getNvidiaModel,
  isNvidiaConfigured,
} from "@/lib/nvidia";

describe("nvidia config", () => {
  const originalKey = process.env.NVIDIA_API_KEY;
  const originalModel = process.env.NVIDIA_MODEL;

  afterEach(() => {
    if (originalKey === undefined) delete process.env.NVIDIA_API_KEY;
    else process.env.NVIDIA_API_KEY = originalKey;
    if (originalModel === undefined) delete process.env.NVIDIA_MODEL;
    else process.env.NVIDIA_MODEL = originalModel;
  });

  it("reports unconfigured when API key is missing", () => {
    delete process.env.NVIDIA_API_KEY;
    expect(isNvidiaConfigured()).toBe(false);
  });

  it("defaults the model to z-ai/glm-5.2", () => {
    delete process.env.NVIDIA_MODEL;
    expect(getNvidiaModel()).toBe("z-ai/glm-5.2");
  });

  it("respects NVIDIA_MODEL overrides", () => {
    process.env.NVIDIA_MODEL = "meta/llama-3.3-70b-instruct";
    expect(getNvidiaModel()).toBe("meta/llama-3.3-70b-instruct");
  });
});
