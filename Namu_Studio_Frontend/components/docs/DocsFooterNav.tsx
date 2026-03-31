"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { useDocsLang } from "@/components/docs/docs-lang-context";
import { getAdjacentPages, docsHref, findNavMeta } from "@/lib/docs/nav-utils";
import { cn } from "@/lib/cn";

type DocsFooterNavProps = {
  slug: string;
};

export function DocsFooterNav({ slug }: DocsFooterNavProps): JSX.Element {
  const { lang } = useDocsLang();
  const { prev, next } = getAdjacentPages(slug);
  const L = (b: { en: string; ha: string }) => (lang === "ha" ? b.ha : b.en);

  return (
    <div className="mt-16 grid gap-4 sm:grid-cols-2">
      <div className="min-h-[72px]">
        {prev ? (
          <Link
            href={docsHref(prev.slug)}
            className={cn(
              "flex h-full min-h-[72px] flex-col justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 shadow-sm transition duration-200 ease-out",
              "hover:-translate-y-px hover:border-[var(--chip-hover-border)] hover:bg-[var(--chip-hover-bg)] hover:shadow-md"
            )}
          >
            <span className="mb-1 flex items-center gap-1 font-sans text-xs font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
              {lang === "ha" ? "Shafin baya" : "Previous"}
            </span>
            <span className="font-sans text-[14px] font-normal leading-snug text-[var(--text-primary)]">{L(prev.title)}</span>
            {findNavMeta(prev.slug) ? (
              <span className="mt-0.5 font-sans text-[13px] text-[var(--text-muted)]">
                {L(findNavMeta(prev.slug)!.section.title)}
              </span>
            ) : null}
          </Link>
        ) : (
          <div />
        )}
      </div>
      <div className="min-h-[72px] sm:text-right">
        {next ? (
          <Link
            href={docsHref(next.slug)}
            className={cn(
              "flex h-full min-h-[72px] flex-col justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 shadow-sm transition duration-200 ease-out sm:items-end",
              "hover:-translate-y-px hover:border-[var(--chip-hover-border)] hover:bg-[var(--chip-hover-bg)] hover:shadow-md"
            )}
          >
            <span className="mb-1 flex items-center gap-1 font-sans text-xs font-medium uppercase tracking-[0.12em] text-[var(--text-muted)] sm:flex-row-reverse">
              {lang === "ha" ? "Shafin gaba" : "Next"}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="font-sans text-[14px] font-normal leading-snug text-[var(--text-primary)]">{L(next.title)}</span>
            {findNavMeta(next.slug) ? (
              <span className="mt-0.5 font-sans text-[13px] text-[var(--text-muted)]">
                {L(findNavMeta(next.slug)!.section.title)}
              </span>
            ) : null}
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
