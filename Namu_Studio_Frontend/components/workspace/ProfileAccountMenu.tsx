"use client";

import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Compass,
  Globe,
  HelpCircle,
  History,
  LogOut,
  Plus,
  Settings
} from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import { Avatar } from "@/components/shared/Avatar";
import { Tooltip } from "@/components/shared/Tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { Language } from "@/lib/supabase/types";
import { cn } from "@/lib/cn";

type ProfileAccountMenuProps = {
  variant: "sidebar" | "header";
  /** Narrow sidebar rail: avatar-only trigger, full row when false. */
  sidebarRailCompact?: boolean;
};

const LANGUAGES: { code: Language; labelKey: string }[] = [
  { code: "en", labelKey: "workspace.settingsLanguageEnglish" },
  { code: "ha", labelKey: "workspace.settingsLanguageHausa" },
  { code: "fr", labelKey: "workspace.settingsLanguageFrench" }
];

export function ProfileAccountMenu({ variant, sidebarRailCompact = false }: ProfileAccountMenuProps): JSX.Element {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const {
    openSettings,
    openHelp,
    openSidebar,
    resetToHome,
    closeSidebar,
    closeSettings
  } = useStudio();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const langRowRef = useRef<HTMLButtonElement | null>(null);
  const langFlyoutRef = useRef<HTMLDivElement | null>(null);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const [langFlyoutStyle, setLangFlyoutStyle] = useState<CSSProperties>({});

  const displayName = user?.fullName ?? "Namu User";
  const email = user?.email ?? "";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const update = (): void => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const w = 280;
      if (variant === "sidebar") {
        const left = Math.min(rect.left, window.innerWidth - w - 12);
        const bottom = window.innerHeight - rect.top + 8;
        setMenuStyle({
          position: "fixed",
          left: `${Math.max(12, left)}px`,
          bottom: `${bottom}px`,
          width: `${w}px`,
          maxHeight: `min(420px, ${rect.top - 16}px)`,
          overflowY: "auto",
          zIndex: 9999
        });
      } else {
        setMenuStyle({
          position: "fixed",
          top: `${rect.bottom + 8}px`,
          right: `${Math.max(12, window.innerWidth - rect.right)}px`,
          width: `${w}px`,
          maxHeight: "min(420px, calc(100vh - 96px))",
          overflowY: "auto",
          zIndex: 9999
        });
      }
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, variant]);

  useEffect(() => {
    if (!open || !langOpen || !langRowRef.current) {
      setLangFlyoutStyle({});
      return;
    }
    const position = (): void => {
      const rect = langRowRef.current?.getBoundingClientRect();
      if (!rect) return;
      const w = 248;
      let left = rect.right + 8;
      if (left + w > window.innerWidth - 10) {
        left = rect.left - w - 8;
      }
      left = Math.max(8, left);
      const maxH = Math.max(120, window.innerHeight - rect.top - 12);
      setLangFlyoutStyle({
        position: "fixed",
        top: `${rect.top}px`,
        left: `${left}px`,
        width: `${w}px`,
        maxHeight: `min(220px, ${maxH}px)`,
        overflowY: "auto",
        zIndex: 10000
      });
    };
    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [open, langOpen]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent): void => {
      const node = e.target as Node;
      if (triggerRef.current?.contains(node)) return;
      if (menuRef.current?.contains(node)) return;
      if (langFlyoutRef.current?.contains(node)) return;
      setOpen(false);
      setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key !== "Escape") return;
      if (langOpen) {
        setLangOpen(false);
      } else {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, langOpen]);

  const languageFlyout = useMemo(() => {
    if (!mounted || !open || !langOpen) return null;
    return createPortal(
      <div
        ref={langFlyoutRef}
        className="namu-workspace-cream studio-apple-frame p-1.5 shadow-xl"
        style={langFlyoutStyle}
      >
        {LANGUAGES.map(({ code, labelKey }) => (
          <button
            key={code}
            type="button"
            onClick={() => {
              setLanguage(code);
              setLangOpen(false);
            }}
            className="flex h-9 w-full items-center gap-2 rounded-lg px-3 text-left text-[13px] transition hover:bg-[var(--bg-active)]"
            style={{ color: "var(--text-secondary)" }}
          >
            <span className="min-w-0 flex-1 truncate">{t(labelKey)}</span>
            {language === code ? <Check className="h-4 w-4 shrink-0 text-brand-orange" /> : null}
          </button>
        ))}
      </div>,
      document.body
    );
  }, [mounted, open, langOpen, langFlyoutStyle, language, setLanguage, t]);

  const menu = useMemo(() => {
    if (!mounted || !open) return null;
    return createPortal(
      <div
        ref={menuRef}
        className="namu-workspace-cream studio-apple-frame z-[9999] p-1.5 shadow-xl"
        style={menuStyle}
      >
        {email ? (
          <div className="px-3 py-2 text-[11px] leading-snug" style={{ color: "var(--text-muted)" }}>
            {email}
          </div>
        ) : null}
        <div className="my-1 h-px" style={{ background: "var(--border)" }} />

        <MenuRow
          icon={<Settings className="h-4 w-4" />}
          label={t("workspace.profileMenuSettings")}
          hint={t("workspace.profileMenuKeyboardHint")}
          onClick={() => {
            setOpen(false);
            openSettings("general");
          }}
        />
        <button
          ref={langRowRef}
          type="button"
          onClick={() => setLangOpen((v) => !v)}
          className={cn(
            "flex h-9 w-full items-center gap-2 rounded-lg px-3 text-left text-sm transition",
            langOpen ? "bg-[var(--bg-active)]" : "hover:bg-[var(--bg-active)]"
          )}
          style={{ color: "var(--text-secondary)" }}
        >
          <Globe className="h-4 w-4 shrink-0 opacity-80" />
          <span className="flex-1">{t("workspace.profileMenuLanguage")}</span>
          <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
        </button>

        <MenuRow
          icon={<HelpCircle className="h-4 w-4" />}
          label={t("workspace.profileMenuHelp")}
          onClick={() => {
            setOpen(false);
            openHelp();
          }}
        />
        <MenuRow
          icon={<History className="h-4 w-4" />}
          label={t("workspace.profileMenuHistory")}
          onClick={() => {
            setOpen(false);
            openSidebar();
          }}
        />

        <div className="my-1 h-px" style={{ background: "var(--border)" }} />

        <MenuRow
          icon={<Plus className="h-4 w-4" />}
          label={t("workspace.profileMenuNewSession")}
          onClick={() => {
            setOpen(false);
            closeSidebar();
            closeSettings();
            resetToHome();
          }}
        />
        <MenuRow
          icon={<BookOpen className="h-4 w-4" />}
          label={t("workspace.profileMenuAbout")}
          onClick={() => {
            setOpen(false);
            openSettings("about");
          }}
        />
        <MenuRow
          icon={<Compass className="h-4 w-4" />}
          label={t("workspace.profileMenuDocumentation")}
          onClick={() => {
            setOpen(false);
            router.push("/docs");
          }}
        />

        <div className="my-1 h-px" style={{ background: "var(--border)" }} />

        <MenuRow
          icon={<LogOut className="h-4 w-4" />}
          label={t("workspace.signOut")}
          danger
          onClick={() => {
            setOpen(false);
            void signOut();
          }}
        />
      </div>,
      document.body
    );
  }, [
    mounted,
    open,
    menuStyle,
    t,
    email,
    langOpen,
    openSettings,
    openHelp,
    openSidebar,
    resetToHome,
    closeSidebar,
    closeSettings,
    signOut,
    router
  ]);

  const triggerButton = (
    <button
      ref={triggerRef}
      type="button"
      onClick={() => {
        setOpen((v) => {
          const next = !v;
          if (!next) setLangOpen(false);
          return next;
        });
      }}
      className={cn(
        variant === "sidebar"
          ? sidebarRailCompact
            ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border transition hover:bg-[var(--bg-active)]"
            : "flex w-full items-center gap-2.5 rounded-[10px] border px-2.5 py-2 text-left transition hover:bg-[var(--bg-active)]"
          : "rounded-full p-0.5 ring-offset-2 transition hover:ring-2 hover:ring-[var(--orange-subtle)]"
      )}
      style={
        variant === "sidebar"
          ? { borderColor: "var(--actbar-border)", background: "var(--bg-elevated)" }
          : undefined
      }
    >
      {variant === "sidebar" ? (
        sidebarRailCompact ? (
          <Avatar name={displayName} className="h-8 w-8 text-xs" />
        ) : (
          <>
            <Avatar name={displayName} className="h-9 w-9 shrink-0 text-sm" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                {displayName}
              </div>
              <div className="truncate text-[11px]" style={{ color: "var(--text-muted)" }}>
                {t("workspace.freePlan")}
              </div>
            </div>
            <ChevronDown
              className={cn("h-4 w-4 shrink-0 transition", open ? "rotate-180" : "")}
              style={{ color: "var(--text-muted)" }}
            />
          </>
        )
      ) : (
        <Avatar name={displayName} className="h-9 w-9 text-sm" />
      )}
    </button>
  );

  return (
    <>
      {variant === "sidebar" && sidebarRailCompact ? (
        <Tooltip content={`${displayName} · ${t("workspace.freePlan")}`}>
          <div className="flex w-full justify-center">{triggerButton}</div>
        </Tooltip>
      ) : (
        triggerButton
      )}
      {menu}
      {languageFlyout}
    </>
  );
}

function MenuRow({
  icon,
  label,
  hint,
  danger,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  danger?: boolean;
  onClick: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-full items-center gap-2 rounded-lg px-3 text-sm transition hover:bg-[var(--bg-active)]"
      style={{ color: danger ? "var(--orange)" : "var(--text-secondary)" }}
    >
      <span className="shrink-0 opacity-90">{icon}</span>
      <span className="min-w-0 flex-1 truncate text-left">{label}</span>
      {hint ? (
        <span className="shrink-0 text-[11px] tabular-nums" style={{ color: "var(--text-muted)" }}>
          {hint}
        </span>
      ) : null}
    </button>
  );
}
