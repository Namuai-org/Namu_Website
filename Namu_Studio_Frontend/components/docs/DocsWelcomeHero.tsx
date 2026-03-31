"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type DocsWelcomeHeroProps = {
  eyebrow: string;
  titleBefore: string;
  titleHighlight: string;
  subtitle: string;
  pills: string[];
  /** Decorative: Hausa hook letters as a subtle nod to Boko orthography */
  scriptNote?: string;
};

/** Chips aligned with doc body scale */
const CHIP_CLASS =
  "inline-flex shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 font-sans text-[13px] font-normal transition";

const DOC_HERO_TITLE =
  "font-sans font-normal text-[clamp(1.22rem,2.2vw,1.46rem)] leading-snug tracking-tight text-[var(--text-primary)]";

export function DocsWelcomeHero({
  eyebrow,
  titleBefore,
  titleHighlight,
  subtitle,
  pills,
  scriptNote
}: DocsWelcomeHeroProps): JSX.Element {
  return (
    <div className="relative mb-12 overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--orange-subtle)] via-transparent to-transparent opacity-60" />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-[0.2] blur-3xl"
        style={{ background: `radial-gradient(circle, var(--orange) 0%, transparent 70%)` }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full opacity-[0.12] blur-3xl"
        style={{ background: `radial-gradient(circle, var(--orange-deep) 0%, transparent 70%)` }}
      />

      <div className="relative px-5 py-8 md:px-8 md:py-10">
        <p className="mb-3 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--orange)]">{eyebrow}</p>

        <div className={cn(DOC_HERO_TITLE, "max-w-none")}>
          <span className="block text-balance">{titleBefore}</span>
          <span className="mt-0.5 block bg-gradient-to-r from-[var(--orange)] via-[var(--orange-hover)] to-[var(--orange)] bg-clip-text text-transparent">
            {titleHighlight}
          </span>
        </div>

        <p className="mt-4 max-w-[52ch] font-sans text-[14px] font-normal leading-[1.65] text-[var(--text-secondary)]">{subtitle}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {pills.map((p) => (
            <span
              key={p}
              className={cn(CHIP_CLASS)}
              style={{
                background: "var(--chip-bg)",
                borderColor: "var(--chip-border)",
                color: "var(--chip-text)"
              }}
            >
              {p}
            </span>
          ))}
        </div>

        {scriptNote ? (
          <p className="mt-6 max-w-[48ch] border-t border-[var(--border)] pt-5 font-sans text-[13px] leading-relaxed text-[var(--text-muted)]">
            {scriptNote}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function DocsSectionKicker({ children }: { children: ReactNode }): JSX.Element {
  return (
    <p className="mb-2 font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--orange)]">{children}</p>
  );
}
