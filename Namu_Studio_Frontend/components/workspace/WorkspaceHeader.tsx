"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/shared/Button";
import { Logo } from "@/components/shared/Logo";
import { ProfileAccountMenu } from "@/components/workspace/ProfileAccountMenu";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function WorkspaceHeader(): JSX.Element {
  const { activeMode, activeSession, renameSession, resetToHome, hasActiveSession } = useStudio();
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(activeSession?.title ?? "Namu AI-Studio");

  useEffect(() => {
    setTitle(activeSession?.title ?? "Namu AI-Studio");
  }, [activeSession?.title]);

  return (
    <header
      className="studio-header-glass flex h-[52px] items-center justify-between border-b px-3 md:h-header md:px-5"
      style={{ borderColor: "var(--header-border)" }}
    >
        <div className="flex min-w-0 items-center gap-2.5 md:gap-3">
          <Logo size="sm" className="ml-1 translate-y-px md:ml-1.5" />
          <div className="hidden h-[1.125rem] w-px shrink-0 self-center bg-border md:block" />
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
              className="min-w-0 border-b bg-transparent text-sm font-medium leading-none outline-none"
              style={{ borderColor: "var(--orange)", color: "var(--header-text)" }}
            />
          ) : (
            <button
              type="button"
              onDoubleClick={() => (hasActiveSession ? setEditing(true) : undefined)}
              className="text-sm font-medium leading-none"
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
            <Button variant="secondary" size="sm" onClick={resetToHome}>
              <Plus className="h-4 w-4" />
              {t("common.newSession")}
            </Button>
          </div>
          <div className="md:hidden">
            <ProfileAccountMenu variant="header" />
          </div>
        </div>
    </header>
  );
}
