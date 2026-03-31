import type { Language } from "@/types";

const errorMap: Record<string, Record<Language, string>> = {
  "Invalid login credentials": {
    en: "Incorrect email or password.",
    ha: "Imel ko kalmar sirri ba daidai ba ne.",
    fr: "E-mail ou mot de passe incorrect."
  },
  "User already registered": {
    en: "An account with this email exists. Try signing in.",
    ha: "Wannan imel yana da asusu. Ka shiga.",
    fr: "Un compte existe déjà avec cet e-mail. Connectez-vous."
  },
  "Email not confirmed": {
    en: "Please confirm your email first.",
    ha: "Da fatan a tabbatar da imel ɗinka.",
    fr: "Veuillez d’abord confirmer votre e-mail."
  },
  "Password should be at least 6 characters": {
    en: "Password must be at least 6 characters.",
    ha: "Kalmar sirri ta kasance haruffa 6+.",
    fr: "Le mot de passe doit contenir au moins 6 caractères."
  }
};

function genericError(language: Language): string {
  if (language === "ha") return "An samu kuskure. Da fatan a sake gwadawa.";
  if (language === "fr") return "Une erreur s’est produite. Veuillez réessayer.";
  return "Something went wrong. Please try again.";
}

export function getFriendlyAuthError(message: string | undefined, language: Language): string {
  if (!message) {
    return genericError(language);
  }

  return errorMap[message]?.[language] ?? genericError(language);
}
