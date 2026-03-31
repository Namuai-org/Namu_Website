import type { Language } from "@/lib/supabase/types";

/**
 * Maps the browser's preferred languages (BCP 47) to a supported Namu UI language.
 * Uses `navigator.languages` order when available (user's ranked preferences).
 */
export function inferLanguageFromNavigator(): Language {
  if (typeof navigator === "undefined") {
    return "en";
  }

  const tags =
    typeof navigator.languages !== "undefined" && navigator.languages.length > 0
      ? [...navigator.languages]
      : [navigator.language];

  for (const tag of tags) {
    if (!tag) continue;
    const lower = tag.toLowerCase();
    const base = lower.split("-")[0] ?? lower;

    if (base === "ha") return "ha";
    if (base === "fr") return "fr";
    if (base === "en") return "en";
  }

  return "en";
}
