import type { Language } from "@/types";

const errorMap: Record<string, Record<Language, string>> = {
  "Invalid login credentials": {
    en: "Incorrect email or password.",
    ha: "Imel ko kalmar sirri ba daidai ba ne."
  },
  "User already registered": {
    en: "An account with this email exists. Try signing in.",
    ha: "Wannan imel yana da asusu. Ka shiga."
  },
  "Email not confirmed": {
    en: "Please confirm your email first.",
    ha: "Da fatan a tabbatar da imel ɗinka."
  },
  "Password should be at least 6 characters": {
    en: "Password must be at least 6 characters.",
    ha: "Kalmar sirri ta kasance haruffa 6+."
  }
};

export function getFriendlyAuthError(message: string | undefined, language: Language): string {
  if (!message) {
    return language === "ha" ? "An samu kuskure. Da fatan a sake gwadawa." : "Something went wrong. Please try again.";
  }

  return (
    errorMap[message]?.[language] ??
    (language === "ha" ? "An samu kuskure. Da fatan a sake gwadawa." : "Something went wrong. Please try again.")
  );
}
