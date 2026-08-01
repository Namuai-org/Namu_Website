import type { MetadataRoute } from "next";
import { postsByDate } from "@/lib/blog";

const BASE = "https://namu.ai";

/* Every route that actually exists, plus a URL per post. This list was
   hand-written and had drifted: it advertised /solutions, which 404s, and
   omitted /about, /brand, /privacy, /terms and every article. */
const PAGES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/about", priority: 0.9 },
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
