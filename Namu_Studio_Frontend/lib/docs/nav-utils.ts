import type { DocsNavLeaf, DocsNavSection } from "@/lib/docs/nav";
import { DOCS_NAV } from "@/lib/docs/nav";

export function flattenDocsNav(): { section: DocsNavSection; leaf: DocsNavLeaf }[] {
  return DOCS_NAV.flatMap((section) => section.items.map((leaf) => ({ section, leaf })));
}

export function docsHref(slug: string): string {
  return slug === "" ? "/docs" : `/docs/${slug}`;
}

export function findNavMeta(slug: string): { section: DocsNavSection; leaf: DocsNavLeaf } | undefined {
  return flattenDocsNav().find(({ leaf }) => leaf.slug === slug);
}

export function getAdjacentPages(slug: string): { prev?: DocsNavLeaf; next?: DocsNavLeaf } {
  const flat = flattenDocsNav().map(({ leaf }) => leaf);
  const i = flat.findIndex((l) => l.slug === slug);
  if (i < 0) return {};
  return {
    prev: i > 0 ? flat[i - 1] : undefined,
    next: i < flat.length - 1 ? flat[i + 1] : undefined
  };
}
