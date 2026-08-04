/**
 * The playground's contract with the backend.
 *
 * None of these endpoints exist yet. Rather than fake a result — which would
 * make a disconnected playground look like a working one — each call posts for
 * real and surfaces `NotConnectedError` when nothing answers. The console shows
 * that as a plain note under the composer, so what you see is always the truth
 * about what is wired up.
 *
 * To go live: implement the routes in lib/playground.ts's `endpoint` fields to
 * accept the request shapes below and return the response shapes. Nothing in
 * the UI needs to change.
 */

export class NotConnectedError extends Error {
  constructor(endpoint: string) {
    super(`No handler at ${endpoint}`);
    this.name = "NotConnectedError";
  }
}

/* ---- Request shapes ------------------------------------------------------ */

export type InterpretRequest = {
  /** Base64 audio, without the data-URI prefix. */
  audio: string;
  mimeType: string;
  from: "ha" | "fr";
  to: "ha" | "fr";
  dialect?: string;
};

export type TranscribeRequest = {
  audio: string;
  mimeType: string;
  dialect?: string;
};

export type VoiceRequest = {
  text: string;
  voice: string;
  register: string;
};

export type AgentTurn = { role: "user" | "assistant"; text: string };

export type AgentRequest = {
  audio: string;
  mimeType: string;
  /** Prior turns, so the model has the thread. */
  history: AgentTurn[];
};

/* ---- Response shapes ----------------------------------------------------- */

export type InterpretResponse = {
  /** What the speaker said, in the source language. */
  heard: string;
  /** The translation, in the target language. */
  spoken: string;
  /** URL or data-URI for the spoken answer. */
  audioUrl?: string;
};

export type TranscribeResponse = {
  text: string;
  /** 0–1. Rendered as a quiet note, never as a headline claim. */
  confidence?: number;
  dialect?: string;
};

export type VoiceResponse = { audioUrl: string; durationMs?: number };

export type AgentResponse = {
  heard: string;
  reply: string;
  audioUrl?: string;
};

/* ---- Transport ----------------------------------------------------------- */

async function post<TReq, TRes>(
  endpoint: string,
  body: TReq,
  signal?: AbortSignal,
): Promise<TRes> {
  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    // An aborted request is the user's doing, not a missing backend.
    if ((err as Error)?.name === "AbortError") throw err;
    throw new NotConnectedError(endpoint);
  }

  // A Next app with no matching route answers 404 with an HTML error page, so
  // treat any non-JSON or 404 as "nothing is listening here yet".
  if (res.status === 404) throw new NotConnectedError(endpoint);
  if (!res.ok) throw new Error(`${endpoint} returned ${res.status}`);

  const type = res.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) throw new NotConnectedError(endpoint);

  return (await res.json()) as TRes;
}

export const runInterpret = (
  endpoint: string,
  body: InterpretRequest,
  signal?: AbortSignal,
) => post<InterpretRequest, InterpretResponse>(endpoint, body, signal);

export const runTranscribe = (
  endpoint: string,
  body: TranscribeRequest,
  signal?: AbortSignal,
) => post<TranscribeRequest, TranscribeResponse>(endpoint, body, signal);

export const runVoice = (
  endpoint: string,
  body: VoiceRequest,
  signal?: AbortSignal,
) => post<VoiceRequest, VoiceResponse>(endpoint, body, signal);

export const runAgent = (
  endpoint: string,
  body: AgentRequest,
  signal?: AbortSignal,
) => post<AgentRequest, AgentResponse>(endpoint, body, signal);

/** Strips the `data:audio/webm;base64,` prefix a FileReader result carries. */
export const stripDataUri = (dataUri: string) =>
  dataUri.slice(dataUri.indexOf(",") + 1);

export const blobToBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(stripDataUri(String(reader.result)));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
