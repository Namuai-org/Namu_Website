"use client";

import { Check, Copy, Info, Lightbulb, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState, type ReactNode } from "react";

import { useDocsLang } from "@/components/docs/docs-lang-context";
import { cn } from "@/lib/cn";

/** Main documentation column — compact Inter (sidebar unchanged) */
const DOC_BODY = "font-sans text-[14px] font-normal leading-[1.65] text-[var(--text-secondary)]";
const DOC_H1 = "font-sans text-[clamp(1.28rem,2.25vw,1.52rem)] font-normal leading-snug tracking-tight text-[var(--text-primary)]";
const DOC_H2 = "font-sans text-[clamp(1.08rem,1.65vw,1.22rem)] font-normal leading-snug text-[var(--text-primary)]";
const DOC_H3 = "font-sans text-[0.9375rem] font-medium leading-snug text-[var(--text-primary)]";

/** HomeState “Try asking” / chip label */
const HOME_LABEL = "font-sans text-[11px] font-medium uppercase tracking-[0.12em]";

export function DocsBreadcrumb({ segments }: { segments: { label: string; href?: string }[] }): JSX.Element {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-5 flex flex-wrap items-center gap-2 font-sans text-[12px] text-[var(--text-muted)]")}>
      {segments.map((s, i) => (
        <span key={`${s.label}-${i}`} className="flex items-center gap-1.5">
          {i > 0 ? <span className="text-[var(--text-muted)] opacity-50">›</span> : null}
          {s.href ? (
            <Link href={s.href} className="transition-colors hover:text-[var(--text-secondary)]">
              {s.label}
            </Link>
          ) : (
            <span>{s.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function DocsPageTitle({ children }: { children: ReactNode }): JSX.Element {
  return <h1 className={cn(DOC_H1, "mb-3")}>{children}</h1>;
}

export function DocsLead({ children }: { children: ReactNode }): JSX.Element {
  return <p className={cn(DOC_BODY, "mb-10 max-w-[52ch]")}>{children}</p>;
}

export function DocsP({ children }: { children: ReactNode }): JSX.Element {
  return <p className={cn(DOC_BODY, "mb-5 last:mb-0")}>{children}</p>;
}

export function DocsH2({ id, children }: { id: string; children: ReactNode }): JSX.Element {
  return (
    <h2
      id={id}
      data-docs-heading="h2"
      className="group mb-3 mt-12 scroll-mt-24 border-b border-[var(--border)] pb-2.5 first:mt-0"
    >
      <span className="flex items-start gap-2.5">
        <span
          className="mt-1 inline-block h-6 w-0.5 shrink-0 rounded-full bg-[var(--orange)] shadow-[0_0_12px_rgba(218,119,86,0.3)]"
          aria-hidden
        />
        <span className={DOC_H2}>{children}</span>
      </span>
    </h2>
  );
}

export function DocsH3({ id, children }: { id: string; children: ReactNode }): JSX.Element {
  return (
    <h3 id={id} data-docs-heading="h3" className={cn(DOC_H3, "mb-2 mt-7")}>
      {children}
    </h3>
  );
}

export function DocsH4({ children }: { children: ReactNode }): JSX.Element {
  return (
    <h4 className={cn("mb-2 mt-5 text-[var(--orange)]", HOME_LABEL)}>{children}</h4>
  );
}

export function DocsA({ href, children }: { href: string; children: ReactNode }): JSX.Element {
  const ext = href.startsWith("http");
  return (
    <a
      href={href}
      className="text-[var(--orange)] underline decoration-transparent transition-[text-decoration-color,color] duration-150 hover:underline hover:decoration-[var(--orange)]"
      {...(ext ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function DocsUl({ children }: { children: ReactNode }): JSX.Element {
  return <ul className={cn(DOC_BODY, "mb-5 list-disc space-y-1.5 pl-5")}>{children}</ul>;
}

export function DocsOl({ className, children }: { className?: string; children: ReactNode }): JSX.Element {
  return (
    <ol className={cn(DOC_BODY, "mb-5 list-decimal space-y-1.5 pl-5", className)}>{children}</ol>
  );
}

export function DocsLi({ children }: { children: ReactNode }): JSX.Element {
  return <li className="leading-relaxed">{children}</li>;
}

export function DocsInlineCode({ children }: { children: ReactNode }): JSX.Element {
  return (
    <code className="rounded-[5px] border border-[var(--border)] bg-[var(--bg-elevated)] px-1.5 py-px font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-[var(--orange)]">
      {children}
    </code>
  );
}

export function DocsDivider(): JSX.Element {
  return <hr className="my-10 border-0 border-t border-[var(--border)]" />;
}

type CalloutVariant = "info" | "warning" | "tip";

const CALLOUT_ICONS: Record<CalloutVariant, typeof Info> = {
  info: Info,
  warning: TriangleAlert,
  tip: Lightbulb
};

export function DocsCallout({
  variant = "info",
  label,
  children
}: {
  variant?: CalloutVariant;
  label: string;
  children: ReactNode;
}): JSX.Element {
  const Icon = CALLOUT_ICONS[variant];
  return (
    <div className="my-5 flex gap-3 rounded-2xl border border-[var(--border)] border-l-[3px] border-l-[var(--orange)] bg-[var(--orange-subtle)] py-4 pl-4 pr-4 shadow-sm">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--orange)]" aria-hidden />
      <div className="min-w-0">
        <div className="mb-1 font-sans text-[13px] font-medium text-[var(--orange)]">{label}</div>
        <div className={cn(DOC_BODY, "leading-relaxed")}>{children}</div>
      </div>
    </div>
  );
}

export function DocsCodeBlock({
  language,
  children
}: {
  language: string;
  children: ReactNode;
}): JSX.Element {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const onCopy = useCallback(async () => {
    const text = codeRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text.trim());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="my-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-panel)] shadow-sm">
      <div className="flex h-10 items-center justify-between border-b border-[var(--border)] px-3">
        <span className={cn("rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 text-[var(--text-muted)]", HOME_LABEL)}>
          {language}
        </span>
        <button
          type="button"
          onClick={() => void onCopy()}
          className={cn(DOC_BODY, "flex items-center gap-1.5 text-[13px] transition-colors hover:text-[var(--text-primary)]")}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-[var(--orange)]" />
              Copied ✓
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-[1.65] text-[var(--msg-ai-text)]">
        <code ref={codeRef}>{children}</code>
      </pre>
    </div>
  );
}

export function DocsTable({
  headers,
  rows
}: {
  headers: string[];
  rows: string[][];
}): JSX.Element {
  return (
    <div className="my-7 overflow-x-auto">
      <table className="w-full border-collapse font-sans text-[13px]">
        <thead>
          <tr className="bg-[var(--bg-elevated)]">
            {headers.map((h) => (
              <th key={h} className={cn("border-b border-[var(--border)] px-3 py-2.5 text-left text-[var(--text-muted)]", HOME_LABEL)}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-[var(--border)] transition-colors hover:bg-[var(--orange-subtle)]">
              {row.map((cell, ci) => (
                <td key={ci} className={cn(DOC_BODY, "px-3 py-2.5")}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DocsQuickGrid({
  cards
}: {
  cards: { href: string; icon: ReactNode; title: string; description: string; step?: number }[];
}): JSX.Element {
  const { lang } = useDocsLang();
  const cta = lang === "ha" ? "Ci gaba" : "Continue";

  return (
    <div className="mb-12 grid gap-3 sm:grid-cols-2">
      {cards.map((c, i) => {
        const step = c.step ?? i + 1;
        const stepLabel = step < 10 ? `0${step}` : `${step}`;
        return (
          <Link
            key={c.href}
            href={c.href}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--chip-hover-border)] hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--orange-subtle)] text-[var(--orange)] transition group-hover:scale-[1.03] [&_svg]:h-[19px] [&_svg]:w-[19px]">
                {c.icon}
              </span>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium tabular-nums text-[var(--text-muted)] opacity-80 transition group-hover:text-[var(--orange)]">
                {stepLabel}
              </span>
            </div>
            <span className={cn(DOC_H3, "mb-1.5")}>{c.title}</span>
            <span className="font-sans text-[13px] font-normal leading-relaxed text-[var(--text-muted)]">{c.description}</span>
            <span
              className={cn(DOC_BODY, "mt-3 inline-flex items-center gap-1 font-medium text-[var(--orange)] opacity-0 transition duration-200 group-hover:opacity-100")}
              aria-hidden
            >
              <span>{cta}</span>
              <span className="translate-x-0 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
