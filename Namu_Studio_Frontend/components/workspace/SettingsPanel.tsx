"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Copy, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar } from "@/components/shared/Avatar";
import { useAuth } from "@/hooks/useAuth";
import type { UserProfile } from "@/types";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { supabase } from "@/lib/supabase/client";
import { STUDIO_THEME_PRESETS } from "@/lib/studio/themePresets";
import type { SettingsSection } from "@/lib/studio/settingsSections";
import { useTheme } from "@/lib/theme/themeContext";
import type { Language, ThemeName } from "@/lib/supabase/types";
import type { ToastItem } from "@/types";
import { cn } from "@/lib/cn";

const NOTIFY_KEY = "namu_prefs_notify_complete";

const NAV: { id: SettingsSection; labelKey: string }[] = [
  { id: "general", labelKey: "workspace.settingsNavGeneral" },
  { id: "account", labelKey: "workspace.settingsNavAccount" },
  { id: "appearance", labelKey: "workspace.settingsNavAppearance" },
  { id: "language", labelKey: "workspace.settingsNavLanguage" },
  { id: "privacy", labelKey: "workspace.settingsNavPrivacy" },
  { id: "about", labelKey: "workspace.settingsNavAbout" }
];

export function SettingsPanel(): JSX.Element {
  const { settingsOpen, settingsSection, closeSettings, pushToast } = useStudio();
  const { user, signOutEverywhere, deleteAccount } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState<SettingsSection>("general");
  const [notify, setNotify] = useState(false);

  useEffect(() => {
    if (settingsOpen) {
      setActive(settingsSection);
    }
  }, [settingsOpen, settingsSection]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setNotify(window.localStorage.getItem(NOTIFY_KEY) === "1");
  }, [settingsOpen]);

  const persistNotify = (value: boolean): void => {
    setNotify(value);
    window.localStorage.setItem(NOTIFY_KEY, value ? "1" : "0");
  };

  return (
    <AnimatePresence>
      {settingsOpen ? (
        <>
          <motion.button
            type="button"
            aria-label={t("workspace.settingsClose")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSettings}
            className="studio-modal-scrim absolute inset-0 z-20"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 flex bg-[var(--bg-base)]"
          >
            <nav
              className="flex w-[min(260px,92vw)] shrink-0 flex-col border-r"
              style={{ borderColor: "var(--border)", background: "var(--bg-panel)" }}
            >
              <div
                className="flex h-14 items-center gap-2 border-b px-3 md:h-[52px] md:px-4"
                style={{ borderColor: "var(--border)" }}
              >
                <button
                  type="button"
                  onClick={closeSettings}
                  className="rounded-lg p-2 transition hover:bg-[var(--bg-active)]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <span className="font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
                  {t("workspace.settings")}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                {NAV.map((item) => {
                  const selected = active === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActive(item.id)}
                      className={cn(
                        "mx-2 flex w-[calc(100%-16px)] items-center rounded-[10px] px-3 py-2.5 text-left text-[13px] transition",
                        selected ? "font-medium" : "hover:bg-[var(--bg-active)]"
                      )}
                      style={{
                        background: selected ? "var(--bg-elevated)" : "transparent",
                        color: selected ? "var(--text-primary)" : "var(--text-secondary)",
                        boxShadow: selected ? "inset 0 0 0 1px var(--border-bright)" : undefined
                      }}
                    >
                      {t(item.labelKey)}
                    </button>
                  );
                })}
              </div>
            </nav>

            <main className="min-w-0 flex-1 overflow-y-auto px-5 py-6 md:px-10 md:py-8">
              <div className="mx-auto max-w-xl">
                {active === "general" ? (
                  <GeneralPane
                    user={user}
                    notify={notify}
                    onNotifyChange={persistNotify}
                    t={t}
                  />
                ) : null}
                {active === "account" && user ? (
                  <AccountPane
                    user={user}
                    language={language}
                    t={t}
                    pushToast={pushToast}
                    signOutEverywhere={signOutEverywhere}
                    deleteAccount={deleteAccount}
                    settingsOpen={settingsOpen}
                  />
                ) : null}
                {active === "appearance" ? <AppearancePane theme={theme} setTheme={setTheme} t={t} /> : null}
                {active === "language" ? (
                  <LanguagePane language={language} setLanguage={setLanguage} t={t} />
                ) : null}
                {active === "privacy" ? <PrivacyPane t={t} /> : null}
                {active === "about" ? <AboutPane t={t} /> : null}
              </div>
            </main>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function GeneralPane({
  user,
  notify,
  onNotifyChange,
  t
}: {
  user: UserProfile | null;
  notify: boolean;
  onNotifyChange: (v: boolean) => void;
  t: (path: string, params?: Record<string, string>) => string;
}): JSX.Element {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
          {t("workspace.settingsGeneralTitle")}
        </h2>
        <p className="mt-4 text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {t("workspace.settingsGeneralWorkspaceBody")}
        </p>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <Avatar name={user?.fullName ?? "Namu User"} className="h-14 w-14 text-lg" />
        <div className="min-w-0 flex-1 space-y-4">
          <Field label={t("workspace.settingsGeneralName")} value={user?.fullName ?? "—"} />
          <Field label={t("workspace.settingsGeneralEmail")} value={user?.email ?? "—"} />
        </div>
      </div>

      <div>
        <h3 className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
          {t("workspace.settingsNotifTitle")}
        </h3>
        <div
          className="mt-4 flex items-start justify-between gap-4 rounded-[14px] border p-4"
          style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        >
          <div className="min-w-0">
            <div className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>
              {t("workspace.settingsNotifComplete")}
            </div>
            <p className="mt-1 text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {t("workspace.settingsNotifCompleteDesc")}
            </p>
          </div>
          <Toggle checked={notify} onChange={onNotifyChange} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      <div
        className="rounded-[10px] border px-3 py-2.5 text-[13px]"
        style={{ borderColor: "var(--border)", background: "var(--bg-input)", color: "var(--text-primary)" }}
      >
        {value}
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }): JSX.Element {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative h-7 w-11 shrink-0 rounded-full transition"
      style={{ background: checked ? "var(--orange)" : "var(--border-bright)" }}
    >
      <span
        className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform"
        style={{ left: checked ? "calc(100% - 26px)" : "2px" }}
      />
    </button>
  );
}

function AppearancePane({
  theme,
  setTheme,
  t
}: {
  theme: ThemeName;
  setTheme: (name: ThemeName) => void;
  t: (path: string, params?: Record<string, string>) => string;
}): JSX.Element {
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
        {t("workspace.settingsAppearanceTitle")}
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {t("workspace.settingsAppearanceHint")}
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {STUDIO_THEME_PRESETS.map((item) => {
          const active = item.key === theme;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTheme(item.key)}
              className="flex flex-col rounded-[14px] border p-3 text-left transition hover:bg-[var(--bg-active)]"
              style={{
                borderColor: active ? "rgba(218,119,86,0.45)" : "var(--border)",
                background: active ? "var(--orange-subtle)" : "var(--bg-elevated)",
                boxShadow: active ? "0 0 0 1px rgba(218,119,86,0.2)" : undefined
              }}
            >
              <span className="mb-3 flex h-16 w-full overflow-hidden rounded-[10px] border border-black/10">
                <span className="w-1/3" style={{ backgroundColor: item.swatch.base }} />
                <span className="w-1/3" style={{ backgroundColor: item.swatch.elevated }} />
                <span className="w-1/3" style={{ backgroundColor: "#DA7756" }} />
              </span>
              <span className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                  {item.name}
                </span>
                <Check className="h-4 w-4 shrink-0" style={{ color: "var(--orange)", opacity: active ? 1 : 0 }} />
              </span>
              <span className="mt-0.5 text-[11px] leading-snug" style={{ color: "var(--text-muted)" }}>
                {item.tagline}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const LANGS: { code: Language; labelKey: string }[] = [
  { code: "en", labelKey: "workspace.settingsLanguageEnglish" },
  { code: "ha", labelKey: "workspace.settingsLanguageHausa" },
  { code: "fr", labelKey: "workspace.settingsLanguageFrench" }
];

function LanguagePane({
  language,
  setLanguage,
  t
}: {
  language: Language;
  setLanguage: (l: Language) => void;
  t: (path: string, params?: Record<string, string>) => string;
}): JSX.Element {
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
        {t("workspace.settingsLanguageTitle")}
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {t("workspace.settingsLanguageHint")}
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {LANGS.map(({ code, labelKey }) => {
          const active = language === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              className="rounded-[14px] border px-4 py-6 text-center transition"
              style={{
                borderColor: active ? "rgba(218,119,86,0.45)" : "var(--border)",
                background: active ? "var(--orange-subtle)" : "var(--bg-elevated)"
              }}
            >
              <span className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
                Aa
              </span>
              <span className="mt-2 block text-[13px] font-medium" style={{ color: active ? "var(--orange)" : "var(--text-secondary)" }}>
                {t(labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PrivacyPane({ t }: { t: (path: string, params?: Record<string, string>) => string }): JSX.Element {
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
        {t("workspace.settingsPrivacyTitle")}
      </h2>
      <p className="mt-4 text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {t("workspace.settingsPrivacyBody")}
      </p>
    </div>
  );
}

function AboutPane({ t }: { t: (path: string, params?: Record<string, string>) => string }): JSX.Element {
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
        {t("workspace.settingsAboutTitle")}
      </h2>
      <p className="mt-3 text-[13px]" style={{ color: "var(--text-muted)" }}>
        {t("workspace.settingsAboutTagline")}
      </p>
      <div
        className="mt-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wide"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        {t("workspace.settingsAboutVersion")} 1.0 · {t("workspace.settingsAboutBeta")}
      </div>
    </div>
  );
}

function browserDeviceSummary(): string {
  if (typeof navigator === "undefined") return "—";
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "Microsoft Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return "Safari";
  return "Web browser";
}

function osHint(): string {
  if (typeof navigator === "undefined") return "";
  const ua = navigator.userAgent;
  if (/Windows NT/.test(ua)) return "Windows";
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Linux/.test(ua)) return "Linux";
  return "";
}

function formatSessionInstant(iso: string | undefined, language: Language): string {
  if (!iso) return "—";
  try {
    const loc = language === "fr" ? "fr" : language === "ha" ? "en-GB" : "en-US";
    return new Intl.DateTimeFormat(loc, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function AccountPane({
  user,
  language,
  t,
  pushToast,
  signOutEverywhere,
  deleteAccount,
  settingsOpen
}: {
  user: UserProfile;
  language: Language;
  t: (path: string, params?: Record<string, string>) => string;
  pushToast: (toast: Omit<ToastItem, "id">) => void;
  signOutEverywhere: () => Promise<void>;
  deleteAccount: () => Promise<{ ok: boolean; error?: string; code?: string }>;
  settingsOpen: boolean;
}): JSX.Element {
  const [meta, setMeta] = useState<{ created?: string; last?: string }>({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

  useEffect(() => {
    if (!settingsOpen) return;
    void supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (!u) return;
      setMeta({ created: u.created_at, last: u.last_sign_in_at ?? undefined });
    });
  }, [settingsOpen, user.id]);

  const copyId = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(user.id);
      pushToast({
        title: t("workspace.settingsAccountIdCopied"),
        description: t("toasts.accountIdCopied"),
        type: "success"
      });
    } catch {
      pushToast({
        title: t("common.somethingWrong"),
        description: t("toasts.saveFailed"),
        type: "error"
      });
    }
  };

  const onDeleteConfirm = async (): Promise<void> => {
    setDeleteBusy(true);
    try {
      const result = await deleteAccount();
      if (!result.ok) {
        if (result.code === "not_configured") {
          pushToast({
            title: t("workspace.settingsAccountDeleteTitle"),
            description: t("workspace.settingsAccountDeleteUnavailable"),
            type: "warning"
          });
        } else {
          pushToast({
            title: t("common.somethingWrong"),
            description: t("workspace.settingsAccountDeleteFailed"),
            type: "error"
          });
        }
        setDeleteOpen(false);
      }
    } finally {
      setDeleteBusy(false);
    }
  };

  const deviceLine =
    typeof navigator !== "undefined"
      ? `${browserDeviceSummary()} (${osHint() || "—"})`
      : t("workspace.settingsAccountSessionsThisDevice");
  const tzLine =
    typeof Intl !== "undefined"
      ? `${Intl.DateTimeFormat().resolvedOptions().timeZone} · ${t("workspace.settingsAccountLocationApprox")}`
      : "—";

  return (
    <div className="space-y-10">
      <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
        {t("workspace.settingsAccountTitle")}
      </h2>

      <div className="divide-y" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <div className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
              {t("workspace.settingsAccountLogoutAllTitle")}
            </div>
            <p className="mt-1 max-w-md text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {t("workspace.settingsAccountLogoutAllBody")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void signOutEverywhere()}
            className="shrink-0 rounded-[10px] border bg-bg-elevated px-4 py-2.5 text-[13px] font-medium transition hover:bg-[var(--bg-active)]"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            {t("workspace.settingsAccountLogoutAllButton")}
          </button>
        </div>

        <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <div className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
              {t("workspace.settingsAccountDeleteTitle")}
            </div>
            <p className="mt-1 max-w-md text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {t("workspace.settingsAccountDeleteBody")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="shrink-0 rounded-[10px] bg-[#111] px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-black/90"
          >
            {t("workspace.settingsAccountDeleteButton")}
          </button>
        </div>
      </div>

      <div>
        <label
          className="mb-2 block text-[11px] font-medium uppercase tracking-wide"
          style={{ color: "var(--text-muted)" }}
        >
          {t("workspace.settingsAccountIdLabel")}
        </label>
        <div
          className="flex items-center gap-2 rounded-[12px] border px-3 py-2.5"
          style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        >
          <code className="min-w-0 flex-1 truncate text-[12px]" style={{ color: "var(--text-secondary)" }}>
            {user.id}
          </code>
          <button
            type="button"
            onClick={() => void copyId()}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition hover:bg-[var(--bg-active)]"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            <Copy className="h-3.5 w-3.5" />
            {t("workspace.settingsAccountIdCopy")}
          </button>
        </div>
      </div>

      <div className="border-t pt-8" style={{ borderColor: "var(--border)" }}>
        <h3 className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
          {t("workspace.settingsAccountSessionsTitle")}
        </h3>
        <div
          className="mt-4 overflow-x-auto rounded-[12px] border"
          style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        >
          <table className="w-full min-w-[480px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>
                  {t("workspace.settingsAccountSessionsDevice")}
                </th>
                <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>
                  {t("workspace.settingsAccountSessionsLocation")}
                </th>
                <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>
                  {t("workspace.settingsAccountSessionsCreated")}
                </th>
                <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>
                  {t("workspace.settingsAccountSessionsUpdated")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t" style={{ borderColor: "var(--border)" }}>
                <td className="px-4 py-3 align-top" style={{ color: "var(--text-primary)" }}>
                  <span
                    className="mr-2 inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                    style={{ background: "var(--orange-subtle)", color: "var(--orange)" }}
                  >
                    {t("workspace.settingsAccountSessionsCurrent")}
                  </span>
                  {deviceLine}
                </td>
                <td className="px-4 py-3 align-top" style={{ color: "var(--text-secondary)" }}>
                  {tzLine}
                </td>
                <td className="px-4 py-3 align-top tabular-nums" style={{ color: "var(--text-secondary)" }}>
                  {formatSessionInstant(meta.created, language)}
                </td>
                <td className="px-4 py-3 align-top tabular-nums" style={{ color: "var(--text-secondary)" }}>
                  {formatSessionInstant(meta.last, language)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {deleteOpen ? (
        <>
          <button
            type="button"
            aria-label={t("workspace.settingsClose")}
            className="fixed inset-0 z-[200] bg-black/35 backdrop-blur-[1px]"
            onClick={() => {
              if (!deleteBusy) setDeleteOpen(false);
            }}
          />
          <div
            className="fixed left-1/2 top-1/2 z-[201] w-[min(420px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-2xl"
            style={{ borderColor: "var(--border)", background: "var(--bg-panel)" }}
          >
            <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              {t("workspace.settingsAccountDeleteModalTitle")}
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {t("workspace.settingsAccountDeleteModalBody")}
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                disabled={deleteBusy}
                onClick={() => setDeleteOpen(false)}
                className="rounded-[10px] border px-4 py-2 text-[13px] font-medium transition hover:bg-[var(--bg-active)] disabled:opacity-50"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                {t("workspace.settingsAccountDeleteModalCancel")}
              </button>
              <button
                type="button"
                disabled={deleteBusy}
                onClick={() => void onDeleteConfirm()}
                className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#111] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-black/90 disabled:opacity-60"
              >
                {deleteBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {t("workspace.settingsAccountDeleteModalConfirm")}
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
