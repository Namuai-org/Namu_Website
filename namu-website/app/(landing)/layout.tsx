"use client";

import type { ReactNode } from "react";
import { Nav } from "@/components/editorial/Nav";
import { PageTransition } from "@/components/PageTransition";
import { LanguageProvider, useTranslation } from "@/hooks/useTranslation";
import { useFluidScale } from "@/hooks/useFluidScale";

function LandingContent({ children }: { children: ReactNode }) {
  const { isTransitioning } = useTranslation();
  useFluidScale();

  return (
    <div className={`ds-root landing-root ${isTransitioning ? "fading" : ""}`}>
      {children}
      <div className="noise-overlay" aria-hidden="true" />
    </div>
  );
}

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <Nav />
      <LandingContent>
        <PageTransition>{children}</PageTransition>
      </LandingContent>
    </LanguageProvider>
  );
}
