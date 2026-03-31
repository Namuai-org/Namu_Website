"use client";

import { DocsStubPage } from "@/lib/docs/stub-content";
import { ChatModePage } from "@/lib/docs/pages/chat-mode";
import { HowNamuWorksPage } from "@/lib/docs/pages/how-namu-works";
import { QuickstartPage } from "@/lib/docs/pages/quickstart";
import { WelcomePage } from "@/lib/docs/pages/welcome";

const SPECIAL: Record<string, React.ComponentType> = {
  "": WelcomePage,
  quickstart: QuickstartPage,
  "how-namu-works": HowNamuWorksPage,
  "chat-mode": ChatModePage
};

export function DocsPageBody({ slug }: { slug: string }): JSX.Element {
  const Special = SPECIAL[slug];
  if (Special) {
    return <Special />;
  }

  return <DocsStubPage slug={slug} />;
}
