"use client";

import { FileText, Hash, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useDocsLang } from "@/components/docs/docs-lang-context";
import {
  buildSearchIndex,
  filterSearchIndex,
  searchHref,
  type SearchGroup,
  type SearchResultItem
} from "@/lib/docs/search-index";
import { cn } from "@/lib/cn";

const GROUP_ORDER: SearchGroup[] = ["Pages", "Sections", "API Reference"];

type DocsSearchPaletteProps = {
  open: boolean;
  onClose: () => void;
};

export function DocsSearchPalette({ open, onClose }: DocsSearchPaletteProps): JSX.Element | null {
  const router = useRouter();
  const { lang } = useDocsLang();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo(() => buildSearchIndex(lang), [lang]);
  const filtered = useMemo(() => filterSearchIndex(index, query), [index, query]);
  const flat = useMemo(() => {
    const out: SearchResultItem[] = [];
    for (const g of GROUP_ORDER) {
      for (const it of filtered) {
        if (it.group === g) out.push(it);
      }
    }
    return out;
  }, [filtered]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    setActive((a) => {
      if (flat.length === 0) return 0;
      return Math.min(a, flat.length - 1);
    });
  }, [flat.length]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
        return;
      }
      if (e.key === "Enter" && flat[active]) {
        e.preventDefault();
        router.push(searchHref(flat[active]));
        onClose();
      }
    },
    [active, flat, onClose, router]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-center pt-[15vh] sm:pt-[20vh]">
      <button
        type="button"
        aria-label="Close search"
        className="studio-modal-scrim absolute inset-0 backdrop-blur-[12px]"
        onClick={onClose}
      />
      <div
        className="relative z-[201] mx-3 w-full max-w-[560px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        onKeyDown={onKeyDown}
      >
        <div className="flex h-12 items-center gap-3 px-5">
          <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder={lang === "ha" ? "Nemo cikin littattafan…" : "Search documentation…"}
            className="h-full min-w-0 flex-1 border-0 bg-transparent font-sans text-[clamp(0.9375rem,1.65vw,1.0625rem)] font-normal text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          />
        </div>
        <div className="h-px bg-[var(--border)]" />

        <div className="max-h-[min(52vh,420px)] overflow-y-auto py-2">
          {flat.length === 0 ? (
            <div className="px-5 py-10 text-center font-sans text-sm font-normal text-[var(--text-muted)]">
              {lang === "ha"
                ? `Babu sakamako don “${query.trim() || "…"}”`
                : `No results for “${query.trim() || "…"}”`}
            </div>
          ) : (
            GROUP_ORDER.map((group) => {
              const groupItems = flat.filter((it) => it.group === group);
              if (groupItems.length === 0) return null;
              return (
                <div key={group} className="mb-2">
                  <div className="px-5 py-2 font-[family-name:var(--font-inter)] text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    {group}
                  </div>
                  <ul className="space-y-0.5">
                    {groupItems.map((it) => {
                      const idx = flat.indexOf(it);
                      const selected = idx === active;
                      const Icon = it.anchor ? Hash : FileText;
                      return (
                        <li key={it.id}>
                          <Link
                            href={searchHref(it)}
                            onClick={() => onClose()}
                            onMouseEnter={() => setActive(idx)}
                            className={cn(
                              "flex h-12 items-center gap-3 border-l-2 px-5 font-sans text-sm font-normal transition-colors duration-150",
                              selected
                                ? "border-[var(--orange)] bg-[var(--orange-subtle)]"
                                : "border-transparent hover:bg-[var(--bg-active)]"
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden />
                            <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--text-primary)]">
                              {it.title}
                            </span>
                            <span className="hidden max-w-[45%] truncate text-right text-xs text-[var(--text-muted)] sm:block">
                              {it.breadcrumb}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-[var(--border)] px-5 py-2.5 font-sans text-xs text-[var(--text-muted)]">
          ↑↓ navigate · ↵ open · esc close
        </div>
      </div>
    </div>
  );
}
