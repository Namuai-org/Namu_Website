"use client";

import { useShell } from "@/lib/studio/shellContext";

export function useTranslation() {
  const { dictionary, language, setLanguage, t } = useShell();
  return { dictionary, language, setLanguage, t };
}
