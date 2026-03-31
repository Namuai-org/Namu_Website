"use client";

import { useEffect, useState, type RefObject } from "react";

import { useDocsLang } from "@/components/docs/docs-lang-context";
import { cn } from "@/lib/cn";

type Heading = { id: string; depth: 2 | 3; text: string };

type DocsTOCProps = {
  articleRef: RefObject<HTMLElement | null>;
};

export function DocsTOC({ articleRef }: DocsTOCProps): JSX.Element {
  const { lang } = useDocsLang();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;

    const collect = (): void => {
      const nodes = root.querySelectorAll<HTMLElement>("[data-docs-heading]");
      const next: Heading[] = [];
      nodes.forEach((el) => {
        const d = el.getAttribute("data-docs-heading");
        if (d !== "h2" && d !== "h3") return;
        const id = el.id;
        if (!id) return;
        next.push({ id, depth: d === "h2" ? 2 : 3, text: el.textContent?.trim() ?? id });
      });
      setHeadings(next);
    };

    collect();
    const mo = new MutationObserver(collect);
    mo.observe(root, { subtree: true, childList: true, characterData: true });
    return () => mo.disconnect();
  }, [articleRef]);

  useEffect(() => {
    if (headings.length === 0) return;
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (els.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 1] }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [headings]);

  if (headings.length === 0) return <div className="hidden w-[200px] shrink-0 min-[1280px]:block" />;

  return (
    <aside
      className="hidden w-[200px] shrink-0 pt-12 min-[1280px]:block"
      aria-label={lang === "ha" ? "A kan wannan shafi" : "On this page"}
    >
      <div className="sticky top-16 max-h-[calc(100vh-5rem)] overflow-y-auto pr-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 shadow-sm backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">
            <span className="h-1 w-1 rounded-full bg-[var(--orange)]" aria-hidden />
            {lang === "ha" ? "A kan wannan shafi" : "On this page"}
          </div>
          <ul className="space-y-2 border-l border-[var(--border)] pl-3">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={cn(
                  "block font-sans text-xs font-normal leading-snug transition-colors duration-150",
                  h.depth === 3 && "pl-3",
                  active === h.id ? "font-medium text-[var(--orange)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )}
              >
                {h.text}
              </a>
            </li>
          ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
