"use client";

import { useDocsLang } from "@/components/docs/docs-lang-context";
import {
  DocsBreadcrumb,
  DocsCallout,
  DocsH2,
  DocsH3,
  DocsLead,
  DocsLi,
  DocsP,
  DocsPageTitle,
  DocsUl
} from "@/components/docs/docs-prose";
export function ChatModePage(): JSX.Element {
  const { lang } = useDocsLang();
  const isHa = lang === "ha";

  return (
    <>
      <DocsBreadcrumb
        segments={[
          { label: isHa ? "Hanyoyin Studio" : "Studio modes" },
          { label: isHa ? "Yanayin taɓa" : "Chat mode" }
        ]}
      />
      <DocsPageTitle>{isHa ? "Yanayin taɓa" : "Chat mode"}</DocsPageTitle>
      <DocsLead>
        {isHa
          ? "Taɓa shine zuciyar Namu: wuri don tambayoyi masu luɗu, fahimta, da aiki tare da samfurin harshe."
          : "Chat mode is Namu’s open conversation surface—best for questions, explanations, and iterative thinking."}
      </DocsLead>

      <DocsH2 id="when-to-use">{isHa ? "Yaushe ya fi dacewa" : "When to use chat"}</DocsH2>
      <DocsUl>
        {isHa ? (
          <>
            <DocsLi>Tuntuɓar sabbin fahimta ko tsari kafin rubutu mai tsauri.</DocsLi>
            <DocsLi>Jerin tambayoyi akan takardu, tarihi, ko fasaha.</DocsLi>
            <DocsLi>Sake-fasalin rubutu da aka riga aka rubuta.</DocsLi>
          </>
        ) : (
          <>
            <DocsLi>Exploring a topic before you commit to a structured brief.</DocsLi>
            <DocsLi>Breaking down documents, ideas, or technical concepts step by step.</DocsLi>
            <DocsLi>Rewriting or tightening text you already drafted elsewhere.</DocsLi>
          </>
        )}
      </DocsUl>

      <DocsH2 id="threads-context">{isHa ? "Zama da kontekst" : "Sessions carry context"}</DocsH2>
      {isHa ? (
        <DocsP>
          Namu yana tunawa da saƙonni a cikin wannan zama. Don batu sabo mara alaƙa, fara zama sabo don kada a riƙe
          tsohon kontekst.
        </DocsP>
      ) : (
        <DocsP>
          Namu remembers messages inside the current session. Start a new session when the topic shifts so older
          context does not steer answers the wrong way.
        </DocsP>
      )}

      <DocsH2 id="attachments">{isHa ? "Haɗa fayiloli" : "Attachments"}</DocsH2>
      <DocsH3 id="images-text">{isHa ? "Hotuna da rubutu" : "Images & text"}</DocsH3>
      {isHa ? (
        <DocsP>
          Idan an samar da haɗa fayiloli, zaku iya loda hotuna ko rubuce-rubuce don taimako. Kiyaye fayiloli a matsayin
          masu zaman kansu—kada ku saka bayanan sirri.
        </DocsP>
      ) : (
        <DocsP>
          When attachments are enabled in your workspace, you can upload images or documents for richer answers. Treat
          uploads like email attachments: redact sensitive pages first.
        </DocsP>
      )}

      <DocsCallout variant="tip" label={isHa ? "Salo" : "Tone"}>
        {isHa
          ? "Yi bayanin salo da kuke so a kowane sako na farko: “a cikin Hausa mai sauƙi” ko “a Turanci hukumomi.”"
          : "State tone early: “reply in friendly Hausa” or “keep answers under five sentences in English.”"}
      </DocsCallout>
    </>
  );
}
