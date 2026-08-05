import type { MetadataRoute } from "next";
import { postsByDate } from "@/lib/blog";

const BASE = "https://namu.ai";

/* Every route that actually exists, plus a URL per post.

   There is no /about entry because there is no /about route: the page was
   removed and the homepage card that led to it no longer links anywhere. Both
   come back together. */
const PAGES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/models", priority: 0.9 },
  { path: "/models/namu-voice", priority: 0.8 },
  { path: "/models/namu-transcribe", priority: 0.8 },
  { path: "/models/namu-interpret", priority: 0.8 },
  { path: "/models/namu-agent", priority: 0.8 },
  { path: "/blog", priority: 0.8 },
  { path: "/playground", priority: 0.7 },
  { path: "/brand", priority: 0.5 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...PAGES.map(({ path, priority }) => ({
      url: `${BASE}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...postsByDate.map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: new Date(`${post.date}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
