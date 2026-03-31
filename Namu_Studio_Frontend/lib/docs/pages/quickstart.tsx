"use client";

import { useDocsLang } from "@/components/docs/docs-lang-context";
import {
  DocsBreadcrumb,
  DocsCallout,
  DocsH2,
  DocsH3,
  DocsLead,
  DocsLi,
  DocsOl,
  DocsP,
  DocsPageTitle,
  DocsUl
} from "@/components/docs/docs-prose";
import { docsHref } from "@/lib/docs/nav-utils";

export function QuickstartPage(): JSX.Element {
  const { lang } = useDocsLang();
  const isHa = lang === "ha";

  return (
    <>
      <DocsBreadcrumb
        segments={[
          { label: isHa ? "Fara" : "Get started", href: docsHref("") },
          { label: isHa ? "Jagoran sauri" : "Quickstart guide" }
        ]}
      />
      <DocsPageTitle>{isHa ? "Jagoran sauri" : "Quickstart guide"}</DocsPageTitle>
      <DocsLead>
        {isHa
          ? "A cikin mintuna kaɗan zaku iya fara amfani da Namu don taɓa, rubutu, ko murya."
          : "In a few minutes you can move from an empty workspace to a real task in chat, writing, or voice."}
      </DocsLead>

      <DocsH2 id="before-you-start">{isHa ? "Kafin ku fara" : "Before you start"}</DocsH2>
      {isHa ? (
        <DocsP>
          Shiga Studio bayan shiga asusu. Idan kun kasance a kan waya, za ku ga mazaɓu a ƙasa don sauya tsakanin
          yanayin taɓa, Ƙirƙira, lamba, da murya.
        </DocsP>
      ) : (
        <DocsP>
          Sign in and land in the Studio. On mobile you will see a bottom bar to hop between chat, create, code, and
          voice; on desktop the same modes live in the primary navigation.
        </DocsP>
      )}

      <DocsH2 id="first-chat">{isHa ? "Taɓar farko" : "Your first chat"}</DocsH2>
      <DocsOl>
        {isHa ? (
          <>
            <DocsLi>Zaɓi yanayin taɓa.</DocsLi>
            <DocsLi>Rubuta sako mai cikakken bayani (kamar “Aiko mini da sakonsa na gaisuwa zuwa sabbin ma&apos;aikata”).</DocsLi>
            <DocsLi>Ƙara ko gyara bisa amsar da Namu ya bayar.</DocsLi>
          </>
        ) : (
          <>
            <DocsLi>Choose Chat mode.</DocsLi>
            <DocsLi>Type a concrete request (for example, “Draft a welcome note for new volunteers”).</DocsLi>
            <DocsLi>Iterate with follow-ups until the tone and facts match what you need.</DocsLi>
          </>
        )}
      </DocsOl>

      <DocsH2 id="first-kirkira">{isHa ? "Ƙirƙira ta farko" : "Your first Ƙirƙira draft"}</DocsH2>
      {isHa ? (
        <DocsP>
          Canza zuwa Ƙirƙira, zaɓi nau&apos;in rubutu, sannan bayyana abin da kuke buƙata. Amfani da jerin buƙatu masu
          tsari yana taimaka Namu ya daidaita tsayi da salo.
        </DocsP>
      ) : (
        <DocsP>
          Switch to Ƙirƙira, pick a content type, and describe audience plus goal. Structured prompts produce cleaner
          first drafts than a single vague sentence.
        </DocsP>
      )}

      <DocsH3 id="after-draft">{isHa ? "Bayan samar da rubutu" : "After the draft"}</DocsH3>
      <DocsUl>
        {isHa ? (
          <>
            <DocsLi>Kwafa rubutu zuwa manhajar da kuke amfani da ita.</DocsLi>
            <DocsLi>Yi tambayoyi na biyu don rage jimla ko canza salo.</DocsLi>
          </>
        ) : (
          <>
            <DocsLi>Copy the output into your CMS, email, or notes.</DocsLi>
            <DocsLi>Ask for a shorter variant or a Hausa translation in a second message.</DocsLi>
          </>
        )}
      </DocsUl>

      <DocsCallout variant="info" label={isHa ? "Amintacce" : "Safety"}>
        {isHa
          ? "Kada ku saka sirri na asiri—kamar kalmar shiga ko bayanan kudi—cikin saƙonni."
          : "Do not paste secrets such as passwords or card numbers into prompts; treat the Studio like any cloud tool."}
      </DocsCallout>
    </>
  );
}
