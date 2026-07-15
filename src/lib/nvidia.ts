import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const DEFAULT_MODEL = "z-ai/glm-5.2";
const BASE_URL = "https://integrate.api.nvidia.com/v1";

export function getNvidiaApiKey(): string | undefined {
  const key = process.env.NVIDIA_API_KEY?.trim();
  return key || undefined;
}

export function getNvidiaModel(): string {
  return process.env.NVIDIA_MODEL?.trim() || DEFAULT_MODEL;
}

export function isNvidiaConfigured(): boolean {
  return Boolean(getNvidiaApiKey());
}

export function createNvidiaProvider() {
  const apiKey = getNvidiaApiKey();
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not configured");
  }

  return createOpenAICompatible({
    name: "nvidia-nim",
    baseURL: BASE_URL,
    apiKey,
  });
}

export function getNvidiaChatModel() {
  const provider = createNvidiaProvider();
  return provider.chatModel(getNvidiaModel());
}
