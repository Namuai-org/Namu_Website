"use client";

import { useEffect, useRef, useState } from "react";

import { DocsFooterNav } from "@/components/docs/DocsFooterNav";
import { DocsPageBody } from "@/lib/docs/docs-page-body";
import { DocsSearchPalette } from "@/components/docs/DocsSearchPalette";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsTOC } from "@/components/docs/DocsTOC";
import { DocsTopBar } from "@/components/docs/DocsTopBar";

type DocsLayoutShellProps = {
  slug: string;
};

export function DocsLayoutShell({ slug }: DocsLayoutShellProps): JSX.Element {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!mobileNav) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNav]);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)]">
      <DocsTopBar onOpenSearch={() => setSearchOpen(true)} onOpenMobileNav={() => setMobileNav(true)} />
      <DocsSearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="flex min-h-0 flex-1">
        <div className="hidden h-full lg:block">
          <DocsSidebar currentSlug={slug} />
        </div>

        {mobileNav ? (
          <>
            <button
              type="button"
              aria-label="Close navigation"
              className="studio-modal-scrim fixed inset-0 z-[90] lg:hidden"
              onClick={() => setMobileNav(false)}
            />
            <div
              className="fixed inset-y-0 left-0 z-[95] flex w-full max-w-full flex-col border-r border-[var(--border)] shadow-xl md:max-w-[260px] lg:hidden"
              style={{ background: "var(--actbar-bg)" }}
            >
              <DocsSidebar currentSlug={slug} onNavigate={() => setMobileNav(false)} className="w-full border-r-0" />
            </div>
          </>
        ) : null}

        <div className="flex min-h-0 min-w-0 flex-1">
          <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-0 h-52 bg-gradient-to-b from-[var(--orange-subtle)] to-transparent opacity-90"
              aria-hidden
            />
            <div className="relative z-[1] mx-auto flex w-full max-w-[720px] flex-col px-4 pb-24 pt-12 md:px-6 lg:px-6">
              <article ref={articleRef} className="min-w-0">
                <DocsPageBody slug={slug} />
              </article>
              <DocsFooterNav slug={slug} />
            </div>
          </div>
          <DocsTOC articleRef={articleRef} />
        </div>
      </div>
    </div>
  );
}
