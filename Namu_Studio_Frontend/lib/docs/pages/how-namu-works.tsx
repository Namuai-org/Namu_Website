"use client";

import { useDocsLang } from "@/components/docs/docs-lang-context";
import {
  DocsBreadcrumb,
  DocsH2,
  DocsH3,
  DocsLead,
  DocsP,
  DocsPageTitle,
  DocsTable
} from "@/components/docs/docs-prose";
import { docsHref } from "@/lib/docs/nav-utils";

export function HowNamuWorksPage(): JSX.Element {
  const { lang } = useDocsLang();
  const isHa = lang === "ha";

  return (
    <>
      <DocsBreadcrumb
        segments={[
          { label: isHa ? "Fara" : "Get started", href: docsHref("") },
          { label: isHa ? "Yadda Namu ke aiki" : "How Namu works" }
        ]}
      />
      <DocsPageTitle>{isHa ? "Yadda Namu ke aiki" : "How Namu works"}</DocsPageTitle>
      <DocsLead>
        {isHa
          ? "Namu yana raba aikin ku zuwa zama, yanayoyi, da saituna don ku sami sarari mai tsari."
          : "Namu splits your work into sessions, modes, and settings so you always know where context lives."}
      </DocsLead>

      <DocsH2 id="sessions">{isHa ? "Zama da tarihi" : "Sessions & history"}</DocsH2>
      {isHa ? (
        <DocsP>
          Kowane taɓa yana zama a cikin wani zama da ke da take. Tarihin zama yana baku damar komawa ga aikin baya ba tare
          da sake farawa ba. Sabon zama yana farfaɗowar allo don manufa sabuwa.
        </DocsP>
      ) : (
        <DocsP>
          Each conversation lives inside a session with its own title and transcript. Session history lets you reopen
          past work; starting a new session clears the canvas for a fresh goal.
        </DocsP>
      )}

      <DocsH2 id="modes-overview">{isHa ? "Yanayoyin Studio" : "Studio modes"}</DocsH2>
      {isHa ? (
        <DocsP>
          Kowane yanayi yana ba da kayan aiki masu alaƙa: allo na taɓa don tambayoyi masu luɗu, Ƙirƙira don rubutu mai
          tsari, lamba don samfoti, murya don gane magana.
        </DocsP>
      ) : (
        <DocsP>
          Modes swap the main canvas while keeping your account and theme intact. You can change modes anytime; the
          session you are in remembers the last mode you used there.
        </DocsP>
      )}

      <DocsTable
        headers={isHa ? ["Yanayi", "Mafi kyau don"] : ["Mode", "Best for"]}
        rows={
          isHa
            ? [
                ["Taɓa", "Tambayoyi, bayani, tsari"],
                ["Ƙirƙira", "Wasiku, posts, rubutu masu tsari"],
                ["Lamba", "Snippets, samfoti, aiwatarwa"],
                ["Murya", "Hannu masu aiki, tambayoyi masu sauri"]
              ]
            : [
                ["Chat", "Questions, explanations, planning"],
                ["Ƙirƙira", "Letters, posts, structured writing"],
                ["Code", "Snippets, prototypes, scripts"],
                ["Voice", "Hands-busy questions, dictation"]
              ]
        }
      />

      <DocsH2 id="settings-privacy">{isHa ? "Saituna da keɓe" : "Settings & privacy"}</DocsH2>
      <DocsH3 id="language-settings">{isHa ? "Harshe" : "Language"}</DocsH3>
      {isHa ? (
        <DocsP>
          Harshen allo daban ne da harshen da kuke rubuta a cikin taɓa. Kuna iya barci Turanci a menu kuma ku ci gaba da
          rubuta Hausa a cikin sako.
        </DocsP>
      ) : (
        <DocsP>
          UI language controls chrome and menus, not the model’s reply language. You can keep English chrome while
          prompting entirely in Hausa, or the reverse.
        </DocsP>
      )}

      <DocsH3 id="data-handling">{isHa ? "Bayanai" : "Data handling"}</DocsH3>
      {isHa ? (
        <DocsP>
          Saƙonniku ana amfani da su don samar da amsoshi. Kada ku raba bayanan sirri; duba manufar keɓantawa don cikakken
          bayani game da adanawa.
        </DocsP>
      ) : (
        <DocsP>
          Messages are processed to generate answers. Avoid sharing regulated personal data unless your organization has
          approved Namu for that use case, and review the privacy policy for retention details.
        </DocsP>
      )}
    </>
  );
}
