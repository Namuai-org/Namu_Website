/**
 * What the playground can run.
 *
 * The catalogue in lib/models.ts is the marketing view — what Namu builds. This
 * is the operational view: which of those models the playground can drive, what
 * the user has to give it, and what comes back. Keeping them apart means a
 * model can be announced before it is runnable, which is the normal order.
 */
import { MODELS } from "./models";

/**
 * What the console asks the user for.
 *
 * - `speak`   — record or attach audio; the model answers in audio
 * - `listen`  — record or attach audio; the model answers in text
 * - `write`   — type text; the model answers in audio
 * - `converse`— hold a turn-by-turn spoken conversation
 */
export type Modality = "speak" | "listen" | "write" | "converse";

/**
 * A variant chosen inside the composer rather than in the rail.
 *
 * The two interpreters are one model run in two directions, so listing both in
 * the rail would spend two rows saying almost the same thing. The rail carries
 * the family; the direction is a control next to the prompt, where you are
 * already deciding what to send.
 */
export type Variant = {
  id: string;
  /** Catalogue key, for the full name. */
  key: string;
  /** Copy namespace under `playground.*` — headline, placeholder, presets. */
  slug: string;
  /** Short label for the composer pill. */
  labelKey: string;
};

export type PlaygroundModel = {
  /** Matches a `key` in lib/models.ts, so names and copy stay in one place. */
  key: string;
  /** Stable id used in the URL (?model=) and as a React key. */
  id: string;
  modality: Modality;
  /** Endpoint this mode will POST to once the backend exists. */
  endpoint: string;
  /** Overrides the catalogue icon in the sidebar rail. */
  icon: "interpret" | "transcribe" | "voice" | "agent";
  /** Shown in the rail when the family name differs from the catalogue name. */
  railKey?: string;
  variants?: Variant[];
};

export const PLAYGROUND_MODELS: PlaygroundModel[] = [
  {
    key: "home.model.haFr",
    railKey: "playground.interpret.family",
    id: "interpret",
    modality: "speak",
    endpoint: "/api/playground/interpret",
    icon: "interpret",
    variants: [
      {
        id: "ha-fr",
        key: "home.model.haFr",
        slug: "haFr",
        labelKey: "playground.dir.haFr",
      },
      {
        id: "fr-ha",
        key: "home.model.frHa",
        slug: "frHa",
        labelKey: "playground.dir.frHa",
      },
    ],
  },
  {
    key: "home.model.asr",
    id: "transcribe",
    modality: "listen",
    endpoint: "/api/playground/transcribe",
    icon: "transcribe",
  },
  {
    key: "home.model.tts",
    id: "voice",
    modality: "write",
    endpoint: "/api/playground/voice",
    icon: "voice",
  },
  {
    key: "home.model.agent",
    id: "agent",
    modality: "converse",
    endpoint: "/api/playground/agent",
    icon: "agent",
  },
];

/** The catalogue entry behind a playground model, for its illustration. */
export const catalogueEntry = (model: PlaygroundModel) =>
  MODELS.find((m) => m.key === model.key);

export const modelById = (id: string) =>
  PLAYGROUND_MODELS.find((m) => m.id === id);

/* ---- Namu-Voice options ---------------------------------------------------
   The four voices and five registers from the Namu-Voice page, repeated here
   because the playground has to offer them as controls rather than prose. */

export const VOICES = ["Kanya", "Baobab", "Marke", "Gawo"] as const;
export const REGISTERS = [
  "Neutral",
  "Warm",
  "Bright",
  "Urgent",
  "Sombre",
] as const;

export type Voice = (typeof VOICES)[number];
export type Register = (typeof REGISTERS)[number];

/** Dialects Namu-Transcribe and the interpreters are measured on. */
export const DIALECTS = [
  "Auto",
  "Maradi",
  "Zinder",
  "Tahoua",
  "Tessaoua",
  "Konni",
  "Dogondoutchi",
  "Madaoua",
  "Mirriah",
] as const;

export type Dialect = (typeof DIALECTS)[number];
