import type { DocsLang } from "@/lib/docs/nav";
import { DOCS_NAV } from "@/lib/docs/nav";

export type SearchGroup = "Pages" | "Sections" | "API Reference";

export type SearchResultItem = {
  id: string;
  group: SearchGroup;
  slug: string;
  anchor?: string;
  title: string;
  breadcrumb: string;
};

function L(lang: DocsLang, b: { en: string; ha: string }): string {
  return lang === "ha" ? b.ha : b.en;
}

export function buildSearchIndex(lang: DocsLang): SearchResultItem[] {
  const items: SearchResultItem[] = [];

  for (const section of DOCS_NAV) {
    const group: SearchGroup = section.id === "api-developers" ? "API Reference" : "Pages";
    for (const leaf of section.items) {
      items.push({
        id: `page-${leaf.slug || "welcome"}`,
        group,
        slug: leaf.slug,
        title: L(lang, leaf.title),
        breadcrumb: `${L(lang, section.title)} › ${L(lang, leaf.title)}`
      });
    }
  }

  const gs = lang === "ha" ? "Fara" : "Get started";
  const welcomeTitle = lang === "ha" ? "Maraba da zuwa Namu" : "Welcome to Namu";

  items.push(
    {
      id: "sec-what-is",
      group: "Sections",
      slug: "",
      anchor: "what-is-namu",
      title: lang === "ha" ? "Menene Namu?" : "What is Namu?",
      breadcrumb: `${gs} › ${welcomeTitle}`
    },
    {
      id: "sec-next",
      group: "Sections",
      slug: "",
      anchor: "next-steps",
      title: lang === "ha" ? "Mataki na gaba" : "Next steps",
      breadcrumb: `${gs} › ${welcomeTitle}`
    },
    {
      id: "sec-quick-before",
      group: "Sections",
      slug: "quickstart",
      anchor: "before-you-start",
      title: lang === "ha" ? "Kafin ku fara" : "Before you start",
      breadcrumb: `${gs} › ${lang === "ha" ? "Jagoran sauri" : "Quickstart guide"}`
    }
  );

  return items;
}

export function searchHref(item: SearchResultItem): string {
  const base = item.slug === "" ? "/docs" : `/docs/${item.slug}`;
  return item.anchor ? `${base}#${item.anchor}` : base;
}

export function filterSearchIndex(items: SearchResultItem[], query: string): SearchResultItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (it) =>
      it.title.toLowerCase().includes(q) ||
      it.breadcrumb.toLowerCase().includes(q) ||
      it.group.toLowerCase().includes(q)
  );
}
