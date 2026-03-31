import { inferLanguageFromNavigator } from "@/lib/i18n/inferLanguageFromNavigator";
import type { Language } from "@/lib/supabase/types";
import type { UserProfile } from "@/types";

const VALID: readonly Language[] = ["en", "ha", "fr"];

/**
 * Resolves UI language for the studio:
 * 1. `namu_language` in localStorage (explicit choice or previously persisted)
 * 2. Signed-in user's profile language (account preference on a new device)
 * 3. Browser locale via `inferLanguageFromNavigator` (first visit, no account preference)
 */
export function resolveStudioLanguage(user: UserProfile | null): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = window.localStorage.getItem("namu_language");
  if (stored && VALID.includes(stored as Language)) {
    return stored as Language;
  }

  if (user?.language && VALID.includes(user.language)) {
    window.localStorage.setItem("namu_language", user.language);
    return user.language;
  }

  const inferred = inferLanguageFromNavigator();
  window.localStorage.setItem("namu_language", inferred);
  return inferred;
}
