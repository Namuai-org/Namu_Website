"use client";

import { useTranslation } from "@/hooks/useTranslation";

export function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="lang-toggle" role="group" aria-label="Language toggle">
      <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>
        EN
      </button>
      <span aria-hidden="true" />
      <button type="button" className={language === "ha" ? "active" : ""} onClick={() => setLanguage("ha")}>
        HA
      </button>
    </div>
  );
}
