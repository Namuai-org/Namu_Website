"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import en from "@/lib/i18n/en";
import ha from "@/lib/i18n/ha";
import { resolveStudioLanguage } from "@/lib/i18n/resolveStudioLanguage";
import { updateProfile } from "@/lib/studio/profileService";
import type { Language, ThemeName } from "@/lib/supabase/types";
import type { SettingsSection } from "@/lib/studio/settingsSections";
import type { AppMode, ToastItem } from "@/types";

import fr from "@/lib/i18n/fr";

type Dictionary = Record<string, unknown>;

interface ShellContextValue {
  activeMode: AppMode;
  setMode: (mode: AppMode) => void;
  /** Desktop: wide sidebar with inline session list. Persisted in localStorage. */
  sidebarExpanded: boolean;
  setSidebarExpanded: (value: boolean) => void;
  toggleSidebarExpanded: () => void;
  historyOpen: boolean;
  settingsOpen: boolean;
  settingsSection: SettingsSection;
  helpOpen: boolean;
  openSidebar: () => void;
  /** Mobile slide-over session list only (desktop uses expanded rail). */
  openHistoryPanel: () => void;
  closeSidebar: () => void;
  openSettings: (section?: SettingsSection) => void;
  closeSettings: () => void;
  openHelp: () => void;
  closeHelp: () => void;
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
const dictionaries: Record<Language, Dictionary> = {
  en: en as Dictionary,
  ha: ha as Dictionary,
  fr: fr as Dictionary
};

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
  const [sidebarExpanded, setSidebarExpandedState] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<SettingsSection>("general");
  const [helpOpen, setHelpOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [theme, setThemeState] = useState<ThemeName>("namu");
  const [language, setLanguageState] = useState<Language>("en");
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem("namu_sidebar_expanded") === "false") {
      setSidebarExpandedState(false);
    }
  }, []);

  useEffect(() => {
    const nextTheme =
      user?.theme ??
      readLocalValue<ThemeName>("namu_theme", "namu", ["namu", "gece", "daji", "sahara", "dare"]);
    const nextLanguage = resolveStudioLanguage(user);
    setThemeState(nextTheme);
    setLanguageState(nextLanguage);
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.documentElement.lang = nextLanguage === "ha" ? "ha" : nextLanguage === "fr" ? "fr" : "en";
    window.localStorage.setItem("namu_theme", nextTheme);
  }, [user]);

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

  const setSidebarExpanded = useCallback((value: boolean) => {
    setSidebarExpandedState(value);
    window.localStorage.setItem("namu_sidebar_expanded", value ? "true" : "false");
  }, []);

  const toggleSidebarExpanded = useCallback(() => {
    setSidebarExpandedState((prev) => {
      const next = !prev;
      window.localStorage.setItem("namu_sidebar_expanded", next ? "true" : "false");
      return next;
    });
  }, []);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem("namu_language", nextLanguage);
    document.documentElement.lang = nextLanguage === "ha" ? "ha" : nextLanguage === "fr" ? "fr" : "en";
    if (user?.id) {
      void updateProfile(user.id, { language: nextLanguage });
    }
  }, [user?.id]);

  useEffect(() => {
    document.documentElement.lang = language === "ha" ? "ha" : language === "fr" ? "fr" : "en";
  }, [language]);

  const value = useMemo<ShellContextValue>(() => {
    const dictionary = dictionaries[language];
    return {
      activeMode,
      setMode: setActiveMode,
      sidebarExpanded,
      setSidebarExpanded,
      toggleSidebarExpanded,
      historyOpen,
      settingsOpen,
      settingsSection,
      helpOpen,
      openSidebar: () => setHistoryOpen(true),
      openHistoryPanel: () => setHistoryOpen(true),
      closeSidebar: () => setHistoryOpen(false),
      openSettings: (section = "general") => {
        setSettingsSection(section);
        setSettingsOpen(true);
      },
      closeSettings: () => {
        setSettingsOpen(false);
        setSettingsSection("general");
      },
      openHelp: () => setHelpOpen(true),
      closeHelp: () => setHelpOpen(false),
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
    setSidebarExpanded,
    sidebarExpanded,
    toggleSidebarExpanded,
    language,
    offline,
    pushToast,
    removeToast,
    settingsOpen,
    settingsSection,
    setLanguage,
    setTheme,
    theme,
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
