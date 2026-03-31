export type DocsLang = "en" | "ha";

export type Bilingual = { en: string; ha: string };

export type DocsNavLeaf = {
  slug: string;
  title: Bilingual;
};

export type DocsNavSection = {
  id: string;
  title: Bilingual;
  defaultCollapsed?: boolean;
  items: DocsNavLeaf[];
};

export const DOCS_NAV: DocsNavSection[] = [
  {
    id: "get-started",
    title: { en: "Get started", ha: "Fara" },
    items: [
      { slug: "", title: { en: "Welcome to Namu", ha: "Maraba da zuwa Namu" } },
      { slug: "quickstart", title: { en: "Quickstart Guide", ha: "Jagoran sauri" } },
      { slug: "how-namu-works", title: { en: "How Namu Works", ha: "Yadda Namu ke aiki" } }
    ]
  },
  {
    id: "studio-modes",
    title: { en: "Studio modes", ha: "Hanyoyin Studio" },
    items: [
      { slug: "chat-mode", title: { en: "Chat Mode", ha: "Yanayin taɓa" } },
      { slug: "kirkira", title: { en: "Ƙirƙira — Content Generation", ha: "Ƙirƙira — Ƙirƙirar abubuwa" } },
      { slug: "code-mode", title: { en: "Code Mode", ha: "Yanayin lamba" } },
      { slug: "voice-mode", title: { en: "Voice Mode", ha: "Yanayin murya" } }
    ]
  },
  {
    id: "language-localization",
    title: { en: "Language & localization", ha: "Harshe da wajen yanki" },
    items: [
      { slug: "using-namu-in-hausa", title: { en: "Using Namu in Hausa", ha: "Amfani da Namu da Hausa" } },
      { slug: "switching-languages", title: { en: "Switching Between Languages", ha: "Canza harsuna" } },
      {
        slug: "supported-characters",
        title: { en: "Supported Characters (Ɓ Ɗ Ƙ ƴ)", ha: "Haruffa da ake goyi (Ɓ Ɗ Ƙ ƴ)" }
      }
    ]
  },
  {
    id: "kirkira-guide",
    title: { en: "Ƙirƙira guide", ha: "Jagoran Ƙirƙira" },
    items: [
      { slug: "what-is-kirkira", title: { en: "What is Ƙirƙira?", ha: "Menene Ƙirƙira?" } },
      { slug: "content-types", title: { en: "Content Types", ha: "Nau'in abubuwa" } },
      { slug: "prompt-tips", title: { en: "Prompt Tips", ha: "Shawarwari akan buƙatun rubutu" } },
      { slug: "exporting-content", title: { en: "Exporting Content", ha: "Fitar da abubuwa" } }
    ]
  },
  {
    id: "voice-mode-guide",
    title: { en: "Voice mode guide", ha: "Jagoran yanayin murya" },
    items: [
      { slug: "voice-getting-started", title: { en: "Getting Started with Voice", ha: "Fara da murya" } },
      { slug: "voice-browsers", title: { en: "Supported Browsers", ha: "Ingantattun burauza" } },
      { slug: "voice-transcripts", title: { en: "Voice Transcripts", ha: "Rubutun magana" } },
      { slug: "voice-troubleshooting", title: { en: "Troubleshooting Audio", ha: "Magance matsalar sauti" } }
    ]
  },
  {
    id: "api-developers",
    title: { en: "API & developers", ha: "API da masu haɓaka" },
    defaultCollapsed: true,
    items: [
      { slug: "api-overview", title: { en: "API Overview", ha: "Bayanin API" } },
      { slug: "api-authentication", title: { en: "Authentication", ha: "Tabbatar da asusu" } },
      { slug: "api-endpoints", title: { en: "Endpoints Reference", ha: "Tushen maɓallai" } },
      { slug: "api-rate-limits", title: { en: "Rate Limits", ha: "Iyakar amfani" } },
      { slug: "api-sdks", title: { en: "SDKs", ha: "SDKs" } }
    ]
  },
  {
    id: "account-billing",
    title: { en: "Account & billing", ha: "Asusu da biyan kuɗi" },
    items: [
      { slug: "managing-account", title: { en: "Managing Your Account", ha: "Sarrafa asusunka" } },
      { slug: "plans-pricing", title: { en: "Plans & Pricing", ha: "Shirye-shirye da farashi" } },
      { slug: "usage-limits", title: { en: "Usage & Limits", ha: "Amfani da iyaka" } }
    ]
  }
];
