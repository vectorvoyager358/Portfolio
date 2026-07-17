import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { propagateAttributes, startActiveObservation } from "@langfuse/tracing";
import { after } from "next/server";
import { buildSystemPrompt } from "@/data/profile";
import {
  getLatestUserMessageText,
  normalizeLangfuseSessionId,
  sanitizeLangfuseTraceText,
} from "@/lib/langfuse";
import {
  flushLangfuseTracing,
  isLangfuseTracingReady,
} from "@/lib/langfuse.server";
import { getNvidiaChatModel, isNvidiaConfigured } from "@/lib/nvidia";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 60;

function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "anonymous";
  return req.headers.get("x-real-ip") || "anonymous";
}

export async function GET() {
  if (!isNvidiaConfigured()) {
    return Response.json({ configured: false }, { status: 503 });
  }
  return Response.json({ configured: true });
}

export async function HEAD() {
  if (!isNvidiaConfigured()) {
    return new Response(null, { status: 503 });
  }
  return new Response(null, { status: 200 });
}

export async function POST(req: Request) {
  if (!isNvidiaConfigured()) {
    return Response.json(
      {
        error: "Ask Jeethesh is temporarily offline. Please try again later.",
      },
      { status: 503 },
    );
  }

  const limit = checkRateLimit(clientKey(req));
  if (!limit.allowed) {
    return Response.json(
      { error: "Too many requests. Please wait a moment and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000)),
          ),
        },
      },
    );
  }

  let messages: UIMessage[];
  let sessionId: string | undefined;
  try {
    const body = (await req.json()) as {
      id?: unknown;
      messages?: UIMessage[];
    };
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return Response.json({ error: "messages are required" }, { status: 400 });
    }
    messages = body.messages;
    sessionId = normalizeLangfuseSessionId(body.id);
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const modelMessages = await convertToModelMessages(messages);

  if (!isLangfuseTracingReady()) {
    const result = streamText({
      model: getNvidiaChatModel(),
      system: buildSystemPrompt(),
      messages: modelMessages,
      temperature: 0.4,
      maxOutputTokens: 2048,
      telemetry: { isEnabled: false },
    });

    return result.toUIMessageStreamResponse();
  }

  return startActiveObservation(
    "chat-turn",
    (trace) =>
      propagateAttributes(
        {
          traceName: "ask-jeethesh",
          ...(sessionId ? { sessionId } : {}),
          tags: ["portfolio", "chat"],
          metadata: {
            feature: "ask-jeethesh",
            provider: "nvidia-nim",
            route: "api-chat",
          },
        },
        () => {
          trace.update({
            input: sanitizeLangfuseTraceText(
              getLatestUserMessageText(messages),
            ),
          });

          let traceEnded = false;
          const finishTrace = (attributes: Parameters<typeof trace.update>[0]) => {
            if (traceEnded) return;
            traceEnded = true;
            trace.update(attributes);
            trace.end();
          };

          after(async () => {
            finishTrace({
              level: "WARNING",
              statusMessage: "Stream closed without a completion callback.",
              output: "[stream closed]",
            });
            await flushLangfuseTracing();
          });

          try {
            const result = streamText({
              model: getNvidiaChatModel(),
              system: buildSystemPrompt(),
              messages: modelMessages,
              temperature: 0.4,
              maxOutputTokens: 2048,
              telemetry: {
                isEnabled: true,
                functionId: "ask-jeethesh.generate-response",
                recordInputs: false,
                recordOutputs: false,
              },
              onEnd: ({ text }) => {
                finishTrace({ output: sanitizeLangfuseTraceText(text) });
              },
              onError: () => {
                finishTrace({
                  level: "ERROR",
                  statusMessage: "The model stream failed.",
                  output: "[generation failed]",
                });
              },
              onAbort: () => {
                finishTrace({
                  level: "WARNING",
                  statusMessage: "The model stream was aborted.",
                  output: "[generation aborted]",
                });
              },
            });

            return result.toUIMessageStreamResponse();
          } catch (error) {
            finishTrace({
              level: "ERROR",
              statusMessage: "The model stream could not be created.",
              output: "[generation setup failed]",
            });
            throw error;
          }
        },
      ),
    { endOnExit: false },
  );
}
