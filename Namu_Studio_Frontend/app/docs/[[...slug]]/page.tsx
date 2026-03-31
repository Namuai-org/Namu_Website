import { notFound } from "next/navigation";

import { DocsLayoutShell } from "@/components/docs/DocsLayoutShell";
import { flattenDocsNav } from "@/lib/docs/nav-utils";

export default function DocsCatchAllPage({ params }: { params: { slug?: string[] } }): JSX.Element {
  const parts = params.slug ?? [];
  if (parts.length > 1) {
    notFound();
  }
  const slug = parts[0] ?? "";
  const valid = flattenDocsNav().some(({ leaf }) => leaf.slug === slug);
  if (!valid) {
    notFound();
  }
  return <DocsLayoutShell slug={slug} />;
}
