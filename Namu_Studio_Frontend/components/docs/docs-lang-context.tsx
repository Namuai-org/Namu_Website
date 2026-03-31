"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { DocsLang } from "@/lib/docs/nav";

const STORAGE = "namu_docs_lang";

type DocsLangContextValue = {
  lang: DocsLang;
  setLang: (lang: DocsLang) => void;
  t: (pair: { en: string; ha: string }) => string;
};

const DocsLangContext = createContext<DocsLangContextValue | null>(null);

function readInitial(): DocsLang {
  if (typeof window === "undefined") return "en";
  const s = window.localStorage.getItem(STORAGE);
  if (s === "ha" || s === "en") return s;
  const g = ((navigator.languages && navigator.languages[0]) || navigator.language || "en").toLowerCase();
  return g.startsWith("ha") ? "ha" : "en";
}

export function DocsLanguageProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [lang, setLangState] = useState<DocsLang>("en");

  useEffect(() => {
    setLangState(readInitial());
  }, []);

  const setLang = useCallback((next: DocsLang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE, next);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (pair: { en: string; ha: string }) => {
      return lang === "ha" ? pair.ha : pair.en;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <DocsLangContext.Provider value={value}>{children}</DocsLangContext.Provider>;
}

export function useDocsLang(): DocsLangContextValue {
  const ctx = useContext(DocsLangContext);
  if (!ctx) throw new Error("useDocsLang must be used under DocsLanguageProvider");
  return ctx;
}
