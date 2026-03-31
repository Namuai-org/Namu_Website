"use client";

import { DocsLanguageProvider } from "@/components/docs/docs-lang-context";

export function DocsProviders({ children }: { children: React.ReactNode }): JSX.Element {
  return <DocsLanguageProvider>{children}</DocsLanguageProvider>;
}
