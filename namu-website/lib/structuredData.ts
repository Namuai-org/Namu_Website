import type { Post } from "./blog";

const SITE = "https://namu.ai";

const abs = (path: string) => `${SITE}${path}`;

/**
 * Structured data for the blog.
 *
 * Without this a crawler sees the index as an undifferentiated page of links —
 * it has no way to know the page lists articles, or what each one is. Emitting
 * an ItemList on the index and a BlogPosting on each article is what makes the
 * posts individually addressable in search.
 */
export function blogIndexJsonLd(posts: Post[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": abs("/blog#blog"),
    name: "Namu Journal",
    description:
      "Research, language and progress notes from Namu — speech-native AI for African languages.",
    url: abs("/blog"),
    publisher: {
      "@type": "Organization",
      name: "Namu",
      url: SITE,
    },
    blogPost: posts.map((p, i) => ({
      "@type": "BlogPosting",
      "@id": abs(`/blog/${p.slug}#post`),
      position: i + 1,
      headline: p.title,
      description: p.excerpt,
      url: abs(`/blog/${p.slug}`),
      image: abs(p.image),
      datePublished: p.date,
      articleSection: p.category,
      author: { "@type": "Person", name: p.author },
    })),
  };
}

export function postJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": abs(`/blog/${post.slug}#post`),
    headline: post.title,
    description: post.excerpt,
    url: abs(`/blog/${post.slug}`),
    image: abs(post.image),
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    inLanguage: "en",
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Namu",
      url: SITE,
    },
    isPartOf: { "@id": abs("/blog#blog") },
    mainEntityOfPage: { "@type": "WebPage", "@id": abs(`/blog/${post.slug}`) },
  };
}

export function breadcrumbJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Journal", item: abs("/blog") },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: abs(`/blog/${post.slug}`),
      },
    ],
  };
}
