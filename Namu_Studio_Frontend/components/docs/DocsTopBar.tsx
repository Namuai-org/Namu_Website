"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/shared/Logo";
import { ProfileAccountMenu } from "@/components/workspace/ProfileAccountMenu";
import { useDocsLang } from "@/components/docs/docs-lang-context";
import { cn } from "@/lib/cn";

type DocsTopBarProps = {
  onOpenSearch: () => void;
  onOpenMobileNav: () => void;
};

export function DocsTopBar({ onOpenSearch, onOpenMobileNav }: DocsTopBarProps): JSX.Element {
  const { lang, setLang } = useDocsLang();

  return (
    <header className="studio-header-glass flex h-12 shrink-0 items-center justify-between gap-3 border-b px-3 md:px-5">
      <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-[var(--header-text)] transition hover:bg-[var(--bg-active)] lg:hidden"
          aria-label="Open navigation"
          onClick={onOpenMobileNav}
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link
          href="/workspace"
          className="flex min-w-0 shrink-0 items-center gap-2 md:gap-2.5"
          style={{ ["--text-primary" as string]: "var(--header-text)" }}
        >
          <Logo size="sm" className="h-8" />
        </Link>
        <span className="hidden text-[var(--text-muted)] sm:inline" aria-hidden>
          /
        </span>
        <span className="hidden rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] sm:inline">
          Docs
        </span>
      </div>

      <div className="hidden flex-1 justify-center px-4 md:flex">
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex h-9 w-full max-w-[420px] items-center gap-2 rounded-[10px] border border-[var(--input-border)] bg-[var(--input-bg)] px-3 text-left transition hover:border-[var(--input-focus-border)]"
        >
          <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden />
          <span className="flex-1 font-sans text-[clamp(0.9375rem,1.65vw,1.0625rem)] font-normal text-[var(--text-muted)]">
            {lang === "ha" ? "Nemo cikin littattafan…" : "Search documentation…"}
          </span>
          <kbd className="hidden rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-1.5 py-0.5 font-sans text-[11px] text-[var(--text-muted)] sm:inline-block">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none md:flex-initial">
        <button
          type="button"
          onClick={onOpenSearch}
          className="rounded-[10px] border border-[var(--input-border)] bg-[var(--input-bg)] p-2 text-[var(--header-text)] md:hidden"
          aria-label={lang === "ha" ? "Bincike" : "Search"}
        >
          <Search className="h-4 w-4" />
        </button>

        <div className="flex items-center rounded-[10px] border border-[var(--border)] bg-[var(--bg-elevated)] p-0.5">
          <button
            type="button"
            onClick={() => setLang("ha")}
            className={cn(
              "rounded-lg px-2.5 py-1 font-[family-name:var(--font-inter)] text-xs font-medium transition duration-150",
              lang === "ha" ? "bg-[var(--orange-subtle)] text-[var(--orange)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            HA
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={cn(
              "rounded-lg px-2.5 py-1 font-sans text-xs font-medium transition duration-150",
              lang === "en" ? "bg-[var(--orange-subtle)] text-[var(--orange)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            EN
          </button>
        </div>

        <ProfileAccountMenu variant="header" />
      </div>
    </header>
  );
}
