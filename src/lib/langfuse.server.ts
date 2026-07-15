import "server-only";

import { registerTelemetry } from "ai";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { LangfuseVercelAiSdkIntegration } from "@langfuse/vercel-ai-sdk";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  getLangfuseEnvironment,
  isLangfuseConfigured,
  redactLangfuseData,
} from "@/lib/langfuse";

type LangfuseTracingState = {
  initialized: boolean;
  processor?: LangfuseSpanProcessor;
  sdk?: NodeSDK;
};

const globalState = globalThis as typeof globalThis & {
  __portfolioLangfuseTracing?: LangfuseTracingState;
};

const tracingState =
  globalState.__portfolioLangfuseTracing ??
  (globalState.__portfolioLangfuseTracing = { initialized: false });

export function registerLangfuseTracing(): void {
  if (tracingState.initialized || !isLangfuseConfigured()) return;
  tracingState.initialized = true;

  try {
    const processor = new LangfuseSpanProcessor({
      environment: getLangfuseEnvironment(),
      exportMode: "immediate",
      mediaUploadEnabled: false,
      mask: ({ data }) => redactLangfuseData(data),
      release:
        process.env.LANGFUSE_TRACING_RELEASE?.trim() ||
        process.env.LANGFUSE_RELEASE?.trim() ||
        process.env.VERCEL_GIT_COMMIT_SHA?.trim(),
    });
    const sdk = new NodeSDK({ spanProcessors: [processor] });

    sdk.start();
    registerTelemetry(new LangfuseVercelAiSdkIntegration());

    tracingState.processor = processor;
    tracingState.sdk = sdk;
  } catch {
    // Observability must never make the portfolio assistant unavailable.
    console.warn("Langfuse tracing could not be initialized.");
  }
}

export function isLangfuseTracingReady(): boolean {
  return Boolean(tracingState.processor);
}

export async function flushLangfuseTracing(): Promise<void> {
  try {
    await tracingState.processor?.forceFlush();
  } catch {
    console.warn("Langfuse traces could not be flushed.");
  }
}
