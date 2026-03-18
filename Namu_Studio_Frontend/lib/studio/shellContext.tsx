"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import en from "@/lib/i18n/en";
import ha from "@/lib/i18n/ha";
import { updateProfile } from "@/lib/studio/profileService";
import type { Language, ThemeName } from "@/lib/supabase/types";
import type { AppMode, ToastItem } from "@/types";

type Dictionary = Record<string, unknown>;

interface ShellContextValue {
  activeMode: AppMode;
  setMode: (mode: AppMode) => void;
  historyOpen: boolean;
  settingsOpen: boolean;
  helpOpen: boolean;
  themeSwitcherOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  openHelp: () => void;
  closeHelp: () => void;
  openThemeSwitcher: () => void;
  closeThemeSwitcher: () => void;
  toggleThemeSwitcher: () => void;
  toasts: ToastItem[];
  pushToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  dictionary: Dictionary;
  t: (path: string, params?: Record<string, string>) => string;
  offline: boolean;
}

const ShellContext = createContext<ShellContextValue | null>(null);
const dictionaries: Record<Language, Dictionary> = { en: en as Dictionary, ha: ha as Dictionary };

function getValue(target: Dictionary, path: string): string {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (typeof acc === "object" && acc !== null && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return path;
  }, target) as string;
}

function readLocalValue<T extends string>(key: string, fallback: T, values: readonly T[]): T {
  if (typeof window === "undefined") return fallback;
  const value = window.localStorage.getItem(key) as T | null;
  return value && values.includes(value) ? value : fallback;
}

export function ShellProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { user } = useAuth();
  const [activeMode, setActiveMode] = useState<AppMode>("chat");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [themeSwitcherOpen, setThemeSwitcherOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [theme, setThemeState] = useState<ThemeName>("namu");
  const [language, setLanguageState] = useState<Language>("en");
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const nextTheme =
      user?.theme ??
      readLocalValue<ThemeName>("namu_theme", "namu", ["namu", "gece", "daji", "sahara", "dare"]);
    const nextLanguage = user?.language ?? readLocalValue<Language>("namu_language", "en", ["en", "ha"]);
    setThemeState(nextTheme);
    setLanguageState(nextLanguage);
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem("namu_theme", nextTheme);
    window.localStorage.setItem("namu_language", nextLanguage);
  }, [user?.language, user?.theme]);

  useEffect(() => {
    const updateOnline = (): void => setOffline(!navigator.onLine);
    updateOnline();
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, []);

  const pushToast = useCallback((toast: Omit<ToastItem, "id">) => {
    setToasts((current) => [...current.slice(-2), { ...toast, id: crypto.randomUUID() }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const setTheme = useCallback((nextTheme: ThemeName) => {
    setThemeState(nextTheme);
    window.localStorage.setItem("namu_theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    if (user?.id) {
      void updateProfile(user.id, { theme: nextTheme });
    }
  }, [user?.id]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem("namu_language", nextLanguage);
    if (user?.id) {
      void updateProfile(user.id, { language: nextLanguage });
    }
  }, [user?.id]);

  const value = useMemo<ShellContextValue>(() => {
    const dictionary = dictionaries[language];
    return {
      activeMode,
      setMode: setActiveMode,
      historyOpen,
      settingsOpen,
      helpOpen,
      themeSwitcherOpen,
      openSidebar: () => setHistoryOpen(true),
      closeSidebar: () => setHistoryOpen(false),
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false),
      openHelp: () => setHelpOpen(true),
      closeHelp: () => setHelpOpen(false),
      openThemeSwitcher: () => setThemeSwitcherOpen(true),
      closeThemeSwitcher: () => setThemeSwitcherOpen(false),
      toggleThemeSwitcher: () => setThemeSwitcherOpen((current) => !current),
      toasts,
      pushToast,
      removeToast,
      theme,
      setTheme,
      language,
      setLanguage,
      dictionary,
      t: (path, params) => {
        let result = getValue(dictionary, path);
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            result = result.replace(`{${key}}`, value);
          });
        }
        return result;
      },
      offline
    };
  }, [
    activeMode,
    helpOpen,
    historyOpen,
    language,
    offline,
    pushToast,
    removeToast,
    settingsOpen,
    setLanguage,
    setTheme,
    theme,
    themeSwitcherOpen,
    toasts
  ]);

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell(): ShellContextValue {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error("useShell must be used within ShellProvider");
  }
  return context;
}
