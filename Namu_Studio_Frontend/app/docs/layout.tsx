import type { Metadata } from "next";

import { DocsProviders } from "@/components/docs/DocsProviders";

export const metadata: Metadata = {
  title: "Documentation — Namu AI-Studio",
  description: "Guides for Namu AI-Studio: chat, Ƙirƙira, code, voice, API, and account."
};

export default function DocsLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return <DocsProviders>{children}</DocsProviders>;
}
