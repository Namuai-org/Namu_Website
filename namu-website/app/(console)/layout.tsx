"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/hooks/useTranslation";
import { useFluidScale } from "@/hooks/useFluidScale";

function ConsoleContent({ children }: { children: ReactNode }) {
  useFluidScale();
  return <div className="ds-root">{children}</div>;
}

/**
 * The console shell.
 *
 * Everything the landing layout provides except the site chrome: no floating
 * nav, no footer, no page transition. The playground is an application, and it
 * carries its own wordmark in the rail — a second global bar above it would
 * just be two navigations competing for the same corner.
 */
export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ConsoleContent>{children}</ConsoleContent>
    </LanguageProvider>
  );
}
