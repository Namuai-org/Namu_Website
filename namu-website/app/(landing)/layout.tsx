"use client";

import type { ReactNode } from "react";
import { NavBar } from "@/components/landing/NavBar";
import { PageTransition } from "@/components/PageTransition";
import { LanguageProvider, useTranslation } from "@/hooks/useTranslation";

function LandingContent({ children }: { children: ReactNode }) {
  const { isTransitioning } = useTranslation();

  return (
    <div className={`landing-root ${isTransitioning ? "fading" : ""}`}>
      {children}
    </div>
  );
}

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <NavBar />
      <LandingContent>
        <PageTransition>{children}</PageTransition>
      </LandingContent>
    </LanguageProvider>
  );
}
