"use client";

import type { ReactNode } from "react";

import {
  DocsLead,
  DocsP,
  DocsPageTitle,
  DocsBreadcrumb,
  DocsCallout,
  DocsCodeBlock,
  DocsInlineCode,
  DocsTable
} from "@/components/docs/docs-prose";
import { useDocsLang } from "@/components/docs/docs-lang-context";
import { findNavMeta } from "@/lib/docs/nav-utils";

/** Short, real copy for nav pages without a dedicated long-form article yet. */
const STUB_BLOCKS: Record<
  string,
  {
    en: ReactNode;
    ha: ReactNode;
  }
> = {
  kirkira: {
    en: (
      <>
        <DocsP>
          Ƙirƙira is Namu&apos;s structured writing mode: you describe the kind of content you need—letters, posts,
          lesson notes, marketing lines—and Namu drafts in Hausa or English with tone and length you choose.
        </DocsP>
        <DocsP>
          Open <DocsInlineCode>Create</DocsInlineCode> from the Studio modes, pick a content type, then refine the
          output with follow-up messages or edits before copying or exporting.
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Ƙirƙira shine yanayin rubutu na Namu: kuna bayyana abin da kuke buƙata—wasiku, wallafe, bayanai, ko rubutun
          tallace—sai Namu ya fara rubutu da Hausa ko Turanci bisa yanayin da kuka zaɓa.
        </DocsP>
        <DocsP>
          Buɗe <DocsInlineCode>Create</DocsInlineCode> a Studio, zaɓi nau&apos;in rubutu, sannan ku inganta amsoshin
          ta hanyar sako na biyu ko gyara kafin kwafa ko fitar da shi.
        </DocsP>
      </>
    )
  },
  "code-mode": {
    en: (
      <>
        <DocsP>
          Code mode helps you iterate on small apps, scripts, and UI snippets with a live preview. Describe what you
          want to build; Namu proposes files and changes you can run in the preview pane.
        </DocsP>
        <DocsP>
          Treat generated code as a starting point: review logic, dependencies, and security before you ship anything
          to production.
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Yanayin lamba yana taimaka wajen haɓaka ƙananan manhaja, rubutun aiwatarwa, da sassan UI tare da samfoti mai
          rai. Bayyana abin da kuke son gina; Namu zai ba da shawarar fayiloli da canje-canje da zaku iya gwadawa a
          cikin allon samfoti.
        </DocsP>
        <DocsP>
          Yi amfani da lambar da aka samar da su a matsayin mafaka: duba tunani, buƙatun ƙaramin bayanai, da tsaro
          kafin ku saki komai zuwa aikin gaske.
        </DocsP>
      </>
    )
  },
  "voice-mode": {
    en: (
      <>
        <DocsP>
          Voice mode uses your browser&apos;s speech recognition so you can ask questions hands-free. It works best in
          a quiet room with a clear microphone and a supported browser such as recent Chrome or Edge.
        </DocsP>
        <DocsP>
          Hausa recognition quality can vary by device and engine; you can always switch to typing or edit the
          transcript before sending.
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Yanayin murya yana amfani da gane magana na burauzarku don ku yi tambayoyi ba tare da hannu ba. Yana aiki
          mafi kyau a cikin ɗaki mai shiru tare da mikrofon mai kyau da burauza da ake goyi baya kamar Chrome ko Edge na
          baya-bayan nan.
        </DocsP>
        <DocsP>
          Ingancin gane Hausa zai iya bambanta bisa na&apos;ura; koyaushe kuna iya canza zuwa rubutu ko gyara rubutun
          kafin aika.
        </DocsP>
      </>
    )
  },
  "using-namu-in-hausa": {
    en: (
      <>
        <DocsP>
          Type or speak in Hausa the same way you would in English. Namu understands common Hausa orthography including
          hooked consonants (Ɓ, Ɗ, Ƙ) and the hooked y (ƴ).
        </DocsP>
        <DocsP>
          For best results, write full sentences, name the audience (e.g. students, customers, family), and say whether
          you want a formal or friendly tone.
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Rubuta ko magana da Hausa kamar yadda kuke yi da Turanci. Namu yana fahimtar yadda ake rubuta Hausa yau da
          kullun, har da haruffa masu ƙafa (Ɓ, Ɗ, Ƙ) da ƴ.
        </DocsP>
        <DocsP>
          Don samun mafi kyau, rubuta cikakken jimloli, ambaci masu sauraro (kamar ɗalibai, abokan ciniki, iyali), kuma
          faɗa ko kuna son salo na hukuma ko na yabo.
        </DocsP>
      </>
    )
  },
  "switching-languages": {
    en: (
      <>
        <DocsP>
          The Studio interface language (menus and labels) can differ from the language you use in chat. Change UI
          language from your profile menu or Settings → Language &amp; region.
        </DocsP>
        <DocsP>
          In this documentation hub, use the HA / EN toggle in the top bar to read help in Hausa or English without
          changing your Studio preference.
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Harshen alƙuƙi na Studio (menu da bayanin allo) na iya bambanta da harshen da kuke amfani da shi a taɓa. Kuna
          iya canza harshen UI daga menu na bayanin ku ko Saituna → Harshe da yanki.
        </DocsP>
        <DocsP>
          A nan cikin littattafan, yi amfani da maɓallin HA / EN a saman don karanta taimako da Hausa ko Turanci ba tare
          da canza saitunan Studio ba.
        </DocsP>
      </>
    )
  },
  "supported-characters": {
    en: (
      <>
        <DocsP>
          Standard Hausa Ajami is not required for Namu to help you, but modern Boko Hausa with hooked letters is fully
          supported in input and output when you request it.
        </DocsP>
        <DocsTable
          headers={["Character", "Example use"]}
          rows={[
            ["Ɓ / ɓ", "Bakin ciki, ɓarna"],
            ["Ɗ / ɗ", "Ɗaki, ɗan"],
            ["Ƙ / ƙ", "Ƙirƙira, ƙarami"],
            ["Ƴ / ƴ", "ƴan uwa, haƴaƴaƴyun"]
          ]}
        />
      </>
    ),
    ha: (
      <>
        <DocsP>
          Ba dole ne ku yi amfani da Ajami don Namu ya taimake ku ba, amma Hausa na yau da kullun da haruffa masu ƙafa
          ana goyi baya sosai a shigarwa da amsoshi idan kuka buƙata.
        </DocsP>
        <DocsTable
          headers={["Harafi", "Misali"]}
          rows={[
            ["Ɓ / ɓ", "Bakin ciki, ɓarna"],
            ["Ɗ / ɗ", "Ɗaki, ɗan"],
            ["Ƙ / ƙ", "Ƙirƙira, ƙarami"],
            ["Ƴ / ƴ", "ƴan uwa, haƴaƴaƴyun"]
          ]}
        />
      </>
    )
  },
  "what-is-kirkira": {
    en: (
      <>
        <DocsP>
          Ƙirƙira (literally “creation”) in Namu is the mode focused on producing finished text for real tasks—not just
          open-ended chat. It nudges you toward prompts that include audience, tone, and format.
        </DocsP>
        <DocsCallout variant="tip" label="Tip">
          Start from a template when you are unsure: request “a short SMS in Hausa to confirm payment” instead of only
          “write something.”
        </DocsCallout>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Kalmar Ƙirƙira a nan tana nufin yanayin da ke mai da hankali kan samar da rubutu don aikin gaske—ba kawai
          taɓa ba. Yana taimaka ku ba da bayanai masu cikakken bayani game da masu sauraro, salo, da tsari.
        </DocsP>
        <DocsCallout variant="tip" label="Shawara">
          Fara da misali idan kun rasa ra&apos;ayi: nemi “SMS ɗan gajeren Hausa don tabbatar da biyan kuɗi” maimakon
          kawai “rubuta wani abu.”
        </DocsCallout>
      </>
    )
  },
  "content-types": {
    en: (
      <>
        <DocsP>
          Content types bundle default tone, length, and structure—so a “lesson note” reads differently from a “social
          post.” Pick the closest type and adjust in follow-up messages if the first draft is not quite right.
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Nau&apos;ikan abubuwa sun haɗa salo, tsayi, da tsari na asali—saboda haka “bayanin darasi” zai bambanta da
          “post na kafofin watsa labarai.” Zaɓi mafi kusa, sannan ku daidaita ta hanyar sako na biyu idan na farko bai
          yi kyau ba.
        </DocsP>
      </>
    )
  },
  "prompt-tips": {
    en: (
      <>
        <DocsP>
          Name the reader, the goal, and any facts Namu must include (dates, amounts, names). Say what to avoid—slang,
          religious phrases, or English mixing—if that matters for your audience.
        </DocsP>
        <DocsP>
          If output is too long, ask for a shorter version; if too formal, ask for a warmer tone. Small, explicit edits
          beat vague “make it better.”
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Ambaci mai karatu, manufa, da kowane gaskiya da Namu dole ne ya haɗa (kwanaki, kuɗi, sunaye). Faɗa abin da
          ba za a yi ba—zare-zare, jimlolin addini, ko haɗa Turanci—idan yana da muhimmanci ga masu sauraronku.
        </DocsP>
        <DocsP>
          Idan rubutu ya yi tsayi, nemi na gajere; idan ya yi tsanani, nemi salo mai dumi. Ƙananan gyare-gyare masu
          bayani sun fi kyau fiye da “inganta shi.”
        </DocsP>
      </>
    )
  },
  "exporting-content": {
    en: (
      <>
        <DocsP>
          Use the copy control in the Ƙirƙira output panel to grab plain text. Download options depend on the Studio
          build you are using; when in doubt, paste into your document and apply final formatting there.
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Yi amfani da maɓallin kwafa a fagen fitar da Ƙirƙira don ɗaukar rubutu mai sauƙi. Zaɓuɓɓukan sauke sun
          dogara da sigar Studio da kuke amfani da ita; idan kun yi shakka, liƙa zuwa fayil ɗinku kuma ku ƙare tsari a
          can.
        </DocsP>
      </>
    )
  },
  "voice-getting-started": {
    en: (
      <>
        <DocsP>
          Switch to Voice mode, allow the microphone when the browser prompts, then tap or hold the control shown in
          your toolbar (depending on device) to start listening.
        </DocsP>
        <DocsP>
          Speak clearly, pause briefly at the end of a thought, and review the transcript before Namu sends it as a
          message.
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Canza zuwa yanayin Murya, yarda da mikrofon lokacin da burauza ta nemi izini, sannan taɓa ko riƙe maɓallin da
          aka nuna a cikin toolbar ɗinku don fara sauraro.
        </DocsP>
        <DocsP>
          Yi magana da bayyani, dakatar da ɗan lokaci a ƙarshen tunani, kuma duba rubutun kafin Namu ya aika shi a
          matsayin sako.
        </DocsP>
      </>
    )
  },
  "voice-browsers": {
    en: (
      <>
        <DocsP>
          Chromium-based browsers generally expose the best speech APIs today. Safari and Firefox may offer limited or
          no dictation; if voice is greyed out, switch browsers or use chat typing instead.
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Burauzoji da ke bisa Chromium galibi suna ba da mafi kyawun API na magana a yau. Safari da Firefox na iya ba da
          iyaka ko rashin bayanin magana; idan murya ta kasance cikin toka, canza burauza ko yi amfani da rubutu a
          taɓa.
        </DocsP>
      </>
    )
  },
  "voice-transcripts": {
    en: (
      <>
        <DocsP>
          Transcripts are editable: fix misheard words before you send, especially for names and numbers. Namu treats
          the edited text as your final prompt.
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Ana iya gyara rubutun magana: gyara kalmomin da ba a fahimce su ba kafin aika, musamman sunaye da lambobi. Namu
          yana ɗaukar rubutun da aka gyara a matsayin buƙatun ku na ƙarshe.
        </DocsP>
      </>
    )
  },
  "voice-troubleshooting": {
    en: (
      <>
        <DocsP>
          If the level meter stays flat, check system microphone permissions and that no other app has exclusive
          access. USB headsets often behave more predictably than built-in laptop mics in noisy rooms.
        </DocsP>
        <DocsCallout variant="warning" label="Note">
          Namu cannot bypass OS-level blocks; resolving permission prompts or choosing another input device fixes most
          audio issues.
        </DocsCallout>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Idan mita na murya bai motsu ba, duba izinin mikrofon na tsarin kuma ko wani manhaja bai riƙe mikrofon ba.
          Na&apos;urorin kunne na USB galibi suna da kyau fiye da na kwamfuta a ɗakunan da ke da hayaniya.
        </DocsP>
        <DocsCallout variant="warning" label="Lura">
          Namu bai iya wuce takunkumin tsarin ba; warware buƙatun izini ko zaɓar wata na&apos;ura tana magance
          matsalar murya.
        </DocsCallout>
      </>
    )
  },
  "api-overview": {
    en: (
      <>
        <DocsP>
          The Namu API is intended for server-side integrations that send prompts and receive model output. This
          overview describes concepts shared across endpoints; see Authentication and Endpoints for concrete request
          shapes.
        </DocsP>
        <DocsCodeBlock language="http">
          {`GET  /v1/health
POST /v1/chat/completions`}
        </DocsCodeBlock>
      </>
    ),
    ha: (
      <>
        <DocsP>
          API na Namu an yi shi ne don haɗa da sabis a gefen saba don aika buƙatu da karɓar amsoshin samfuran AI. Wannan
          bayani yana bayyana ra&apos;ayoyi da ke ɗauke da duka maɓallai; duba Tabbatar da asusu da Maɓallai don cikakken
          tsari.
        </DocsP>
        <DocsCodeBlock language="http">
          {`GET  /v1/health
POST /v1/chat/completions`}
        </DocsCodeBlock>
      </>
    )
  },
  "api-authentication": {
    en: (
      <>
        <DocsP>
          Use API keys or OAuth-style tokens issued from the Namu developer console (when enabled for your workspace).
          Never embed long-lived secrets in client-side web bundles—proxy requests through your backend.
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Yi amfani da maɓallan API ko alamu na OAuth daga allon masu haɓakar Namu (lokacin da aka kunna wa wurin
          aikin ku). Kada ku saka sirri mai tsayi a cikin manhajar gaba—aika buƙatu ta wata hanyar sabar ku.
        </DocsP>
      </>
    )
  },
  "api-endpoints": {
    en: (
      <>
        <DocsP>
          Typical endpoints cover chat completions, optional file attachments where supported, and usage accounting.
          Always send JSON with explicit encoding and handle non-200 responses with exponential backoff.
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Maɓallan galibi sun rufe amsoshin taɓa, haɗa fayiloli inda aka yarda, da lissafin amfani. Koyaushe aika JSON
          tare da bayyana encoding kuma ku bi martani marasa 200 tare da jinkirta mai ƙaruwa.
        </DocsP>
      </>
    )
  },
  "api-rate-limits": {
    en: (
      <>
        <DocsP>
          Rate limits protect shared capacity. Respect <DocsInlineCode>Retry-After</DocsInlineCode> headers when present,
          and cache stable responses where business rules allow.
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Iyakar amfani tana kare iyawa ta hade. Ka bi taken <DocsInlineCode>Retry-After</DocsInlineCode> idan ya
          wanzu, kuma ajiye amsoshin da suka dace inda dokokin kasuwanci suka yarda.
        </DocsP>
      </>
    )
  },
  "api-sdks": {
    en: (
      <>
        <DocsP>
          Official SDKs wrap authentication, retries, and typing for Node and other runtimes as they become available.
          Until then, use any HTTP client and follow the OpenAPI specification published with your deployment.
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          SDKs na hukuma suna ɗaukar tabbatarwa, sake gwadawa, da rubutun nau&apos;i don Node da sauran muhallai yayin
          da suka bayyana. Har zuwa lokacin, yi amfani da kowane abokin HTTP kuma bi bayanin OpenAPI tare da sabis ɗinku.
        </DocsP>
      </>
    )
  },
  "managing-account": {
    en: (
      <>
        <DocsP>
          Update your display name and email from Settings → Profile. Account deletion, when offered, permanently
          removes your profile from Namu—export anything you need first.
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Sabunta sunan da aka nuna da imel daga Saituna → Bayanin martaba. Share asusu, idan an samar da shi, yana
          cire bayanin ku daga Namu har abada—fitar da abin da kuke buƙata na farko.
        </DocsP>
      </>
    )
  },
  "plans-pricing": {
    en: (
      <>
        <DocsP>
          Plans bundle monthly usage, priority access, and support tiers. Check the in-product billing page for current
          prices in your currency; documentation here stays descriptive and may trail the live checkout by a short
          time.
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Shirye-shirye sun haɗa amfani na wata, damar farko, da matakin taimako. Duba shafin biyan kuɗi a cikin manhajar
          don farashin yanzu a kuɗin ku; wannan bayani yana bayyana kawai kuma na iya baya da shafin biyan na gaske na
          ɗan lokaci.
        </DocsP>
      </>
    )
  },
  "usage-limits": {
    en: (
      <>
        <DocsP>
          Usage meters track messages, voice minutes, and Ƙirƙira generations depending on your plan. When you approach a
          limit, Namu surfaces a clear notice so you can upgrade or wait for the next reset window.
        </DocsP>
      </>
    ),
    ha: (
      <>
        <DocsP>
          Mitocin amfani suna bin sawu, mintuna na murya, da ƙirƙirar Ƙirƙira bisa shirinku. Lokacin da kuka kusanci
          iyaka, Namu yana nuna sanarwa mai bayyani don ku iya haɓaka ko jira tagomashin sake.
        </DocsP>
      </>
    )
  }
};

export function DocsStubPage({ slug }: { slug: string }): JSX.Element | null {
  const { lang } = useDocsLang();
  const meta = findNavMeta(slug);
  const block = STUB_BLOCKS[slug];
  if (!meta || !block) return null;

  const title = lang === "ha" ? meta.leaf.title.ha : meta.leaf.title.en;
  const section = lang === "ha" ? meta.section.title.ha : meta.section.title.en;

  return (
    <>
      <DocsBreadcrumb segments={[{ label: section }, { label: title }]} />
      <DocsPageTitle>{title}</DocsPageTitle>
      <DocsLead>
        {lang === "ha"
          ? "Takaitaccen bayani game da wannan batu a cikin Namu AI-Studio."
          : "A concise guide to this topic inside Namu AI-Studio."}
      </DocsLead>
      {lang === "ha" ? block.ha : block.en}
    </>
  );
}
