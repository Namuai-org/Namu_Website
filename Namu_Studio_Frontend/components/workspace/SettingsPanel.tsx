"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, LogOut, Palette, X } from "lucide-react";
import { useEffect } from "react";

import { Avatar } from "@/components/shared/Avatar";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useAuth } from "@/hooks/useAuth";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useTheme } from "@/lib/theme/themeContext";

const themeLabels = {
  namu: "Namu",
  gece: "Gece",
  daji: "Daji",
  sahara: "Sahara",
  dare: "Dare"
} as const;

export function SettingsPanel(): JSX.Element {
  const { settingsOpen, closeSettings, openThemeSwitcher } = useStudio();
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    if (!settingsOpen) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        closeSettings();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSettings, settingsOpen]);

  return (
    <AnimatePresence>
      {settingsOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSettings}
            className="absolute inset-0 z-20 bg-black/30"
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-0 z-30 flex h-full w-[300px] flex-col border-r"
            style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
          >
            <div
              className="flex h-12 items-center justify-between border-b px-4"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {t("workspace.settings")}
              </div>
              <button
                type="button"
                onClick={closeSettings}
                className="rounded-md p-1 transition hover:bg-[var(--bg-active)]"
                style={{ color: "var(--text-muted)" }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <SectionLabel label="Bayyanawa" />
              <SettingsRow
                label={t("workspace.theme")}
                right={<span style={{ color: "var(--orange)" }}>{themeLabels[theme]}</span>}
                icon={<Palette className="h-4 w-4" />}
                onClick={() => openThemeSwitcher()}
              />
              <div className="mt-1 flex h-11 items-center justify-between rounded-lg px-4 transition hover:bg-[var(--bg-active)]">
                <span className="text-[13px]" style={{ color: "var(--text-primary)" }}>
                  {t("workspace.language")}
                </span>
                <LanguageToggle dark />
              </div>

              <SectionLabel label="Asusun" />
              <div className="mt-1 flex h-11 items-center gap-3 rounded-lg px-4">
                <Avatar name={user?.fullName ?? "Namu User"} className="h-7 w-7 text-[11px]" />
                <div className="min-w-0">
                  <div className="truncate text-[13px]" style={{ color: "var(--text-primary)" }}>
                    {user?.fullName ?? "Namu User"}
                  </div>
                  <div className="truncate text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {user?.email ?? "support@namu.ai"}
                  </div>
                </div>
              </div>
              <SettingsRow
                label={t("workspace.signOut")}
                icon={<LogOut className="h-4 w-4" />}
                labelColor="var(--orange)"
                onClick={() => {
                  void signOut();
                  closeSettings();
                }}
              />

              <SectionLabel label="Game da" />
              <div className="mt-1 h-11 rounded-lg px-4 py-3 text-[12px]" style={{ color: "var(--text-muted)" }}>
                Namu AI-Studio v1.0 Beta
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function SectionLabel({ label }: { label: string }): JSX.Element {
  return (
    <div
      className="px-4 pb-2 pt-4 text-[11px] uppercase tracking-[0.1em]"
      style={{ color: "var(--text-muted)" }}
    >
      {label}
    </div>
  );
}

function SettingsRow({
  label,
  icon,
  right,
  labelColor,
  onClick
}: {
  label: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  labelColor?: string;
  onClick: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-1 flex h-11 w-full items-center justify-between rounded-lg px-4 text-left transition hover:bg-[var(--bg-active)]"
    >
      <span className="flex items-center gap-3">
        {icon ? <span style={{ color: labelColor ?? "var(--text-muted)" }}>{icon}</span> : null}
        <span className="text-[13px]" style={{ color: labelColor ?? "var(--text-primary)" }}>
          {label}
        </span>
      </span>
      {right ?? <ChevronRight className="h-4 w-4" style={{ color: "var(--text-muted)" }} />}
    </button>
  );
}
