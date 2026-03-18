"use client";

import { parseAIStream } from "@/lib/ai/streamParser";

const aiBaseUrl = process.env.NEXT_PUBLIC_AI_API_URL;

async function streamResponse(
  path: string,
  body: Record<string, unknown>,
  onToken: (token: string) => void,
  onComplete: (fullText: string) => void,
  onError: (error: string) => void,
  signal?: AbortSignal
): Promise<void> {
  if (!aiBaseUrl) {
    onError("Ba a iya haɗa da AI a yanzu.");
    return;
  }

  try {
    const response = await fetch(`${aiBaseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, stream: true }),
      signal
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.status}`);
    }

    let fullText = "";
    for await (const token of parseAIStream(response)) {
      fullText += token;
      onToken(token);
    }
    onComplete(fullText);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return;
    }
    onError("Ba a iya haɗa da AI a yanzu.");
  }
}

export async function streamChatResponse(
  messages: { role: string; content: string }[],
  onToken: (token: string) => void,
  onComplete: (fullText: string) => void,
  onError: (error: string) => void,
  signal?: AbortSignal
): Promise<void> {
  await streamResponse("/api/ai/chat", { messages }, onToken, onComplete, onError, signal);
}

export async function streamCreateResponse(
  prompt: string,
  tone: string,
  length: string,
  onToken: (token: string) => void,
  onComplete: (fullText: string) => void,
  onError: (error: string) => void,
  signal?: AbortSignal
): Promise<void> {
  await streamResponse("/api/ai/create", { prompt, tone, length }, onToken, onComplete, onError, signal);
}

export async function streamCodeResponse(
  instruction: string,
  existingCode: string,
  language: string,
  onToken: (token: string) => void,
  onComplete: (fullText: string) => void,
  onError: (error: string) => void,
  signal?: AbortSignal
): Promise<void> {
  await streamResponse(
    "/api/ai/code",
    { instruction, existingCode, language },
    onToken,
    onComplete,
    onError,
    signal
  );
}
