"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/landing/Footer";
import { NamuLogoMark } from "@/components/brand/NamuLogoMark";
import styles from "./blog.module.css";

type ArticleCategory = "Product" | "Story" | "Press";

type Article = {
  slug: string;
  title: string;
  category: ArticleCategory;
  monthLabel: string;
  dateLabel: string;
  readTime: string;
  author: string;
  authorInitials: string;
  accent: "dune" | "river" | "copper" | "sun";
};

const articles: Article[] = [
  {
    slug: "shipping-hausa-writing-tools",
    title: "Shipping writing tools that sound natural in Hausa.",
    category: "Product",
    monthLabel: "October",
    dateLabel: "October 12, 2025",
    readTime: "4 min read",
    author: "Mouhamad",
    authorInitials: "MO",
    accent: "dune",
  },
  {
    slug: "the-mother-who-typed-first",
    title: "Why did we start this",
    category: "Story",
    monthLabel: "October",
    dateLabel: "October 4, 2025",
    readTime: "3 min read",
    author: "Mouhamad",
    authorInitials: "MO",
    accent: "copper",
  },
  {
    slug: "building-ai-for-niger",
    title: "What building AI for Niger teaches you about trust.",
    category: "Story",
    monthLabel: "September",
    dateLabel: "September 19, 2025",
    readTime: "5 min read",
    author: "Mouhamad",
    authorInitials: "AI",
    accent: "river",
  },
  {
    slug: "namu-ai-studio-early-access",
    title: "Opening early access to Namu AI-Studio.",
    category: "Product",
    monthLabel: "September",
    dateLabel: "September 8, 2025",
    readTime: "2 min read",
    author: "Mouhamad",
    authorInitials: "MO",
    accent: "sun",
  },
  {
    slug: "west-africa-language-infrastructure",
    title: "Why language infrastructure matters in West Africa.",
    category: "Press",
    monthLabel: "August",
    dateLabel: "August 22, 2025",
    readTime: "4 min read",
    author: "Mouhamad",
    authorInitials: "NA",
    accent: "river",
  },
  {
    slug: "designing-for-hausa-speakers",
    title: "Designing product experiences for Hausa speakers first.",
    category: "Product",
    monthLabel: "August",
    dateLabel: "August 10, 2025",
    readTime: "6 min read",
    author: "Mouhamad",
    authorInitials: "AI",
    accent: "dune",
  },
];

const filters: Array<"All" | ArticleCategory> = ["All", "Product", "Story", "Press"];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon({ kind }: { kind: "All" | ArticleCategory }) {
  if (kind === "Product") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 5h12l-4.5 7.2V18l-3 1v-6.8z" fill="currentColor" />
      </svg>
    );
  }

  if (kind === "Story") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 5.5A2.5 2.5 0 0 0 3.5 8V18A2.5 2.5 0 0 0 6 20.5h11A3.5 3.5 0 0 1 20.5 17V8A2.5 2.5 0 0 0 18 5.5z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 9h8M8 12h8M8 15h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "Press") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 12h16M12 4c2.4 2.1 3.6 4.8 3.6 8S14.4 17.9 12 20M12 4c-2.4 2.1-3.6 4.8-3.6 8s1.2 5.9 3.6 8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="currentColor" />
    </svg>
  );
}

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesFilter = activeFilter === "All" ? true : article.category === activeFilter;
      const matchesQuery =
        lowered.length === 0
          ? true
          : [article.title, article.author, article.monthLabel, article.category]
              .join(" ")
              .toLowerCase()
              .includes(lowered);

      return matchesFilter && matchesQuery;
    });
  }, [query, activeFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, Article[]>();
    for (const article of filtered) {
      const existing = map.get(article.monthLabel) ?? [];
      existing.push(article);
      map.set(article.monthLabel, existing);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const featured = articles[0];

  return (
    <>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroMarkWrap}>
            <div className={styles.heroMarkTile}>
              <NamuLogoMark variant="onLight" height={64} />
            </div>
          </div>
          <h1 className={styles.heroTitle}>Blog</h1>
          <p className={styles.heroSubtitle}>
            Product updates, founder notes, and stories from building AI for Hausa speakers.
          </p>
        </section>

        <section className={styles.featuredWrap}>
          <article className={styles.featuredCard}>
            <div className={styles.featuredCopy}>
              <div className={styles.featuredMeta}>
                <span className={styles.featuredPill}>{featured.category}</span>
                <span>{featured.dateLabel}</span>
                <span>{featured.readTime}</span>
              </div>
              <h2 className={styles.featuredTitle}>Shipping writing tools that sound natural in Hausa.</h2>
              <Link href="/login" className={styles.featuredButton}>
                Read Article
                <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>

            <div className={styles.featuredArt} aria-hidden="true">
              <div className={styles.featuredCanvas} />
              <div className={styles.featuredGlow} />
              <div className={styles.featuredLamp} />
              <div className={styles.featuredDune} />
              <div className={styles.featuredRibbon} />
              <div className={styles.featuredFigure} />
              <div className={styles.featuredTable} />
              <div className={styles.featuredVase} />
              <div className={styles.featuredBrushTexture} />
            </div>
          </article>
        </section>

        <section className={styles.listSection}>
          <div className={styles.searchShell}>
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search writings..."
              className={styles.searchInput}
              aria-label="Search writings"
            />
          </div>

          <div className={styles.filterRow}>
            {filters.map((filter) => {
              const isActive = filter === activeFilter;
              return (
                <button
                  key={filter}
                  type="button"
                  className={`${styles.filterPill} ${isActive ? styles.filterPillActive : ""}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  <FilterIcon kind={filter} />
                  <span>{filter}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.timeline}>
            {grouped.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No writings match that search yet.</p>
              </div>
            ) : (
              grouped.map(([month, monthArticles], groupIndex) => (
                <section key={month} className={styles.monthGroup}>
                  <h3 className={styles.monthLabel}>{month}</h3>
                  <div className={styles.monthStack}>
                    {monthArticles.map((article, articleIndex) => {
                      const isLast = articleIndex === monthArticles.length - 1;
                      return (
                        <article
                          key={article.slug}
                          className={styles.articleRow}
                          style={{ ["--stagger" as string]: `${groupIndex * 120 + articleIndex * 80}ms` }}
                        >
                          <div className={styles.articleRail}>
                            <div className={`${styles.thumb} ${styles[`thumb${article.accent[0].toUpperCase()}${article.accent.slice(1)}`]}`}>
                              <span className={styles.thumbGlyph} />
                            </div>
                            {!isLast ? <span className={styles.railLine} aria-hidden="true" /> : null}
                          </div>

                          <div className={styles.articleContent}>
                            <h4 className={styles.articleTitle}>{article.title}</h4>
                            <div className={styles.articleMeta}>
                              <span className={styles.avatar}>{article.authorInitials}</span>
                              <span className={styles.authorName}>{article.author}</span>
                              <span className={styles.metaDot}>•</span>
                              <span className={styles.articleDate}>{article.dateLabel}</span>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))
            )}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaMarkTile}>
            <NamuLogoMark variant="onLight" height={56} />
          </div>
          <h2 className={styles.ctaTitle}>Stay close.</h2>
          <p className={styles.ctaBody}>Get updates on Namu AI-Studio and early access.</p>
          <div className={styles.ctaActions}>
            <a href="/login" className={styles.ctaPrimary}>
              Join Waitlist
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className={styles.ctaSecondary}>
              Follow on X
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
