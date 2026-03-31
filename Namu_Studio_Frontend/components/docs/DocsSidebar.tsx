"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useDocsLang } from "@/components/docs/docs-lang-context";
import { DOCS_NAV } from "@/lib/docs/nav";
import { docsHref } from "@/lib/docs/nav-utils";
import { cn } from "@/lib/cn";

type DocsSidebarProps = {
  currentSlug: string;
  onNavigate?: () => void;
  className?: string;
};

export function DocsSidebar({ currentSlug, onNavigate, className }: DocsSidebarProps): JSX.Element {
  const { lang } = useDocsLang();

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const s of DOCS_NAV) {
      init[s.id] = !s.defaultCollapsed;
    }
    return init;
  });

  const label = useMemo(() => (b: { en: string; ha: string }) => (lang === "ha" ? b.ha : b.en), [lang]);

  const brand = lang === "ha" ? { title: "Littattafan Namu", tag: "Jagora da API" } : { title: "Namu docs", tag: "Guides & API" };

  return (
    <nav
      aria-label="Documentation"
      className={cn(
        "flex h-full w-[260px] shrink-0 flex-col overflow-y-auto border-r border-[var(--actbar-border)] bg-[var(--actbar-bg)]",
        className
      )}
    >
      <div className="border-b border-[var(--actbar-border)] px-4 pb-4 pt-5">
        <p className="studio-editorial-section border-none font-normal">{brand.title}</p>
        <p className="mt-1 font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">
          {brand.tag}
        </p>
      </div>
      <div className="px-3 pb-8 pt-4">
        {DOCS_NAV.map((section, si) => {
          const open = expanded[section.id] ?? true;
          return (
            <div key={section.id} className={cn(si > 0 && "mt-6")}>
              <div className="flex items-center gap-1 pl-2">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setExpanded((e) => ({ ...e, [section.id]: !open }))}
                  className="rounded-md p-1 text-[var(--text-muted)] transition hover:bg-[var(--bg-active)] hover:text-[var(--text-primary)]"
                  aria-label={open ? "Collapse section" : "Expand section"}
                >
                  <ChevronDown
                    className={cn("h-3.5 w-3.5 transition-transform duration-[220ms] ease-out", open ? "rotate-0" : "rotate-180")}
                    aria-hidden
                  />
                </button>
                <span className="pointer-events-none font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  {label(section.title)}
                </span>
              </div>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-[220ms] ease-out",
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <ul className="mt-1 space-y-0.5 pl-1">
                    {section.items.map((item) => {
                      const href = docsHref(item.slug);
                      const active = item.slug === currentSlug;
                      return (
                        <li key={item.slug || "welcome"}>
                          <Link
                            href={href}
                            onClick={onNavigate}
                            className={cn(
                              "flex h-8 items-center rounded-lg py-0 pl-4 pr-4 font-sans text-sm font-normal leading-tight transition-colors duration-150 ease-out",
                              active
                                ? "border-l-2 border-[var(--orange)] bg-[var(--orange-subtle)] pl-[14px] font-medium text-[var(--orange)]"
                                : "border-l-2 border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-active)] hover:text-[var(--text-primary)]"
                            )}
                          >
                            {label(item.title)}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
