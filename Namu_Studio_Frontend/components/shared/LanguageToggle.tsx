"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/cn";

export function LanguageToggle({ dark = false }: { dark?: boolean }): JSX.Element {
  const { language, setLanguage } = useTranslation();
  return (
    <div className={cn("inline-flex rounded-full border p-1", dark ? "border-border bg-bg-panel" : "border-border bg-bg-elevated")}>
      {(["en", "ha", "fr"] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setLanguage(value)}
          className={cn(
            "rounded-full px-2.5 py-1.5 text-xs font-medium transition",
            language === value
              ? "bg-brand-orange text-white"
              : dark
                ? "text-text-secondary hover:text-text-primary"
                : "text-text-muted hover:text-brand-orange"
          )}
        >
          {value === "en" ? "EN" : value === "ha" ? "HA" : "FR"}
        </button>
      ))}
    </div>
  );
}
