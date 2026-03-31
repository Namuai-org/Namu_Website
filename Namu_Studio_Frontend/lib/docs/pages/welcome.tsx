"use client";

import { Code2, MessageCircle, Mic, Sparkles } from "lucide-react";

import { DocsSectionKicker, DocsWelcomeHero } from "@/components/docs/DocsWelcomeHero";
import { useDocsLang } from "@/components/docs/docs-lang-context";
import {
  DocsBreadcrumb,
  DocsDivider,
  DocsH2,
  DocsH3,
  DocsP,
  DocsQuickGrid
} from "@/components/docs/docs-prose";
import { docsHref } from "@/lib/docs/nav-utils";

export function WelcomePage(): JSX.Element {
  const { lang } = useDocsLang();
  const isHa = lang === "ha";

  const cards = isHa
    ? [
        {
          href: docsHref("chat-mode"),
          icon: <MessageCircle />,
          title: "Fara taɓa",
          description: "Tambayi, tsara tunani, sami amsoshi masu zurfi da Hausa ko Turanci.",
          step: 1
        },
        {
          href: docsHref("kirkira"),
          icon: <Sparkles />,
          title: "Ƙirƙira",
          description: "Rubuta rubuce masu tsari—wasiku, posts, da rubutu don masu sauraro.",
          step: 2
        },
        {
          href: docsHref("voice-getting-started"),
          icon: <Mic />,
          title: "Murya",
          description: "Yi magana da alada; gane magana ya dogara da burauza da na’urar ku.",
          step: 3
        },
        {
          href: docsHref("api-overview"),
          icon: <Code2 />,
          title: "API",
          description: "Haɗa Namu cikin samfur ɗinku tare da mafaka da ke dacewa.",
          step: 4
        }
      ]
    : [
        {
          href: docsHref("chat-mode"),
          icon: <MessageCircle />,
          title: "Chat",
          description: "Explore ideas, plan work, and get answers in Hausa or English.",
          step: 1
        },
        {
          href: docsHref("kirkira"),
          icon: <Sparkles />,
          title: "Ƙirƙira",
          description: "Draft structured content—letters, posts, and audience-ready copy.",
          step: 2
        },
        {
          href: docsHref("voice-getting-started"),
          icon: <Mic />,
          title: "Voice",
          description: "Speak naturally; quality depends on your browser and microphone.",
          step: 3
        },
        {
          href: docsHref("api-overview"),
          icon: <Code2 />,
          title: "API",
          description: "Bring Namu into your product with clear integration patterns.",
          step: 4
        }
      ];

  return (
    <>
      <DocsBreadcrumb segments={[{ label: isHa ? "Fara" : "Get started" }]} />

      <DocsWelcomeHero
        eyebrow={isHa ? "Littattafan Namu" : "Namu documentation"}
        titleBefore={isHa ? "Barka da zuwa" : "Welcome to"}
        titleHighlight="Namu"
        subtitle={
          isHa
            ? "Namu AI-Studio ɗaya ne: taɓa, Ƙirƙira, lamba, da murya—an tsara shi don masu amfani da Hausa da kuma ƙungiyoyin da ke aiki da harsuna da yawa."
            : "One Studio for chat, structured writing, code, and voice—designed for Hausa-first workflows and multilingual teams who care about clarity."
        }
        pills={
          isHa
            ? ["Hausa · Boko", "English UI", "Ƙirƙira · Code · Voice", "Studio sessions"]
            : ["Hausa · Boko orthography", "English UI", "Ƙirƙira · Code · Voice", "Session-based workspace"]
        }
        scriptNote={
          isHa
            ? "Haruffa kamar Ɓ Ɗ Ƙ ƴ ana goyi bayansu a rubutu don inganta fahimta da ingancin amsoshi."
            : "Hooked letters (Ɓ Ɗ Ƙ ƴ) are first-class in Namu—use them whenever you write Hausa in Latin script."
        }
      />

      <DocsSectionKicker>{isHa ? "Tafiyar sauri" : "Choose a path"}</DocsSectionKicker>
      <DocsQuickGrid cards={cards} />

      <DocsH2 id="what-is-namu">{isHa ? "Menene Namu?" : "What is Namu?"}</DocsH2>
      {isHa ? (
        <>
          <DocsP>
            Namu yana haɗa samfuran harshe masu ƙarfi da kuma yanayin Studio mai ma&apos;ana: ba kawai shigar da rubutu ba, har da yadda zaku sarrafa zama, yadda zaku kula da tarihi, da yadda zaku canza tsakanin hanyoyin aiki.
          </DocsP>
          <DocsP>
            Kowane yanayi yana da manufa: <strong className="font-semibold text-[var(--text-primary)]">Taɓa</strong> don
            bincike, <strong className="font-semibold text-[var(--text-primary)]">Ƙirƙira</strong> don rubutu mai tsari,{" "}
            <strong className="font-semibold text-[var(--text-primary)]">Lamba</strong> don samfoti,{" "}
            <strong className="font-semibold text-[var(--text-primary)]">Murya</strong> idan hannu masu aiki.
          </DocsP>
        </>
      ) : (
        <>
          <DocsP>
            Namu pairs strong language models with a deliberate Studio layout: modes keep jobs separate, sessions keep
            context coherent, and your theme and language settings stay under your control.
          </DocsP>
          <DocsP>
            <strong className="font-semibold text-[var(--text-primary)]">Chat</strong> is for exploration and reasoning,{" "}
            <strong className="font-semibold text-[var(--text-primary)]">Ƙirƙira</strong> for finished drafts,{" "}
            <strong className="font-semibold text-[var(--text-primary)]">Code</strong> for prototypes, and{" "}
            <strong className="font-semibold text-[var(--text-primary)]">Voice</strong> when typing is not the right tool.
          </DocsP>
        </>
      )}

      <DocsDivider />

      <DocsH2 id="next-steps">{isHa ? "Mataki na gaba" : "Next steps"}</DocsH2>
      <DocsH3 id="learn-modes">{isHa ? "Koyi Studio a takaitacciyar lokaci" : "Learn the Studio in minutes"}</DocsH3>
      {isHa ? (
        <DocsP>
          Fara da <strong className="font-semibold text-[var(--text-primary)]">jagoran sauri</strong>, sannan karanta{" "}
          <strong className="font-semibold text-[var(--text-primary)]">yadda Namu ke aiki</strong> don fahimtar zama,
          yanayoyi, da keɓantawa.
        </DocsP>
      ) : (
        <DocsP>
          Start with the <strong className="font-semibold text-[var(--text-primary)]">quickstart</strong>, then read{" "}
          <strong className="font-semibold text-[var(--text-primary)]">how Namu works</strong> for sessions, modes, and
          privacy-minded defaults.
        </DocsP>
      )}
    </>
  );
}
