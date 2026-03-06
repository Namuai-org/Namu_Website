"use client";

import type { ReactNode } from "react";
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
      <LandingContent>{children}</LandingContent>
    </LanguageProvider>
  );
}
