/**
 * The model catalogue.
 *
 * One source for the home page listing, the /models page and the nav panel,
 * so a new model appears in all three at once.
 */

export type ModelEntry = {
  /** i18n key prefix — `.kicker`, `.name`, `.body` and `.alt` hang off it. */
  key: string;
  image: string;
  /**
   * The model's own page, once one exists. Without it a card renders as plain
   * content: no link wrapper and no "Learn more" control that goes nowhere.
   */
  href?: string;
};

export const MODELS: ModelEntry[] = [
  {
    key: "home.model.interpret",
    image: "/modim/hausa-french.png",
    href: "/models/namu-interpret",
  },
  { key: "home.model.asr", image: "/modim/asr.png", href: "/models/namu-transcribe" },
  { key: "home.model.tts", image: "/modim/tts.png", href: "/models/namu-voice" },
  {
    key: "home.model.agent",
    image: "/modim/voice-agent.png",
    href: "/models/namu-agent",
  },
];
