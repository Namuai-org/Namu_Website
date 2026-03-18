"use client";

import { HelpCircle, History, LogOut, Plus, Settings } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Avatar } from "@/components/shared/Avatar";
import { Button } from "@/components/shared/Button";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { Logo } from "@/components/shared/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function WorkspaceHeader(): JSX.Element {
  const { user, signOut } = useAuth();
  const {
    activeMode,
    activeSession,
    renameSession,
    resetToHome,
    hasActiveSession,
    openSidebar,
    openSettings,
    openHelp
  } = useStudio();
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(activeSession?.title ?? "Namu AI-Studio");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 64, right: 16 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setTitle(activeSession?.title ?? "Namu AI-Studio");
  }, [activeSession?.title]);

  useEffect(() => {
    if (!menuOpen || !buttonRef.current) return;
    const updatePosition = (): void => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenuPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: MouseEvent): void => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const items = useMemo(
    () => [
      { icon: Settings, label: t("workspace.preferences"), action: openSettings },
      { icon: HelpCircle, label: t("workspace.help"), action: openHelp },
      { icon: History, label: t("workspace.sessionHistory"), action: openSidebar },
      { icon: LogOut, label: t("workspace.signOut"), action: signOut }
    ],
    [openHelp, openSettings, openSidebar, signOut, t]
  );

  const dropdown =
    mounted && menuOpen
      ? createPortal(
          <div
            ref={menuRef}
            className="fixed z-[9999] w-48 rounded-xl border p-1.5 shadow-lg"
            style={{
              top: `${menuPosition.top}px`,
              right: `${menuPosition.right}px`,
              background: "var(--bg-elevated)",
              borderColor: "var(--border)"
            }}
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={async () => {
                  setMenuOpen(false);
                  await item.action();
                }}
                className="flex h-9 w-full items-center gap-2 rounded-lg px-3 text-sm transition hover:bg-[var(--bg-active)]"
                style={{ color: item.label === t("workspace.signOut") ? "var(--orange)" : "var(--text-secondary)" }}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <header
        className="flex h-[52px] items-center justify-between border-b px-3 md:h-header md:px-5"
        style={{ background: "var(--header-bg)", borderColor: "var(--header-border)" }}
      >
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <div className="hidden h-4 w-px bg-border md:block" />
          {editing && hasActiveSession ? (
            <input
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={() => {
                void renameSession(title);
                setEditing(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void renameSession(title);
                  setEditing(false);
                }
              }}
              className="border-b bg-transparent text-sm outline-none"
              style={{ borderColor: "var(--orange)", color: "var(--header-text)" }}
            />
          ) : (
            <button
              type="button"
              onDoubleClick={() => (hasActiveSession ? setEditing(true) : undefined)}
              className="text-sm font-medium"
              style={{ color: "var(--header-text)" }}
            >
              {hasActiveSession ? activeSession?.title : "Namu AI-Studio"}
            </button>
          )}
        </div>

        <div className="hidden rounded-full border px-4 py-1 text-sm font-medium md:block" style={{ borderColor: "var(--orange-subtle)", background: "var(--orange-subtle)", color: "var(--orange)" }}>
          {t(`workspace.${activeMode}`)}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LanguageToggle dark />
          </div>
          <div className="hidden md:block">
            <Button variant="dark" size="sm" onClick={resetToHome}>
              <Plus className="h-4 w-4" />
              {t("common.newSession")}
            </Button>
          </div>
          <button ref={buttonRef} type="button" onClick={() => setMenuOpen((value) => !value)}>
            <Avatar name={user?.fullName ?? "Namu User"} className="h-9 w-9 text-sm" />
          </button>
        </div>
      </header>
      {dropdown}
    </>
  );
}
