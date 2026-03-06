"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { en } from "@/lib/i18n/en";
import { ha } from "@/lib/i18n/ha";

type Language = "en" | "ha";
type Dict = Record<string, string>;

const dictionaries: Record<Language, Dict> = {
  en,
  ha,
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (next: Language) => void;
  t: (key: string) => string;
  isTransitioning: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("namu-lang");
    if (saved === "en" || saved === "ha") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = useCallback(
    (next: Language) => {
      if (next === language) return;
      setIsTransitioning(true);
      window.setTimeout(() => {
        setLanguageState(next);
        window.localStorage.setItem("namu-lang", next);
        window.requestAnimationFrame(() => setIsTransitioning(false));
      }, 200);
    },
    [language]
  );

  const t = useCallback(
    (key: string) => {
      return dictionaries[language][key] ?? dictionaries.en[key] ?? key;
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t, isTransitioning }),
    [isTransitioning, language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used inside LanguageProvider");
  }

  return context;
}
