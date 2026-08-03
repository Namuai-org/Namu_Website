import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/editorial/Footer";
import { ArrowRight } from "@/components/editorial/icons";
import { MotionHero } from "@/components/editorial/MotionHero";
import { ScrollObject } from "@/components/editorial/ScrollObject";
import { SplitText } from "@/components/editorial/SplitText";
import { formatDate, getPost, posts, postsByDate } from "@/lib/blog";
import { breadcrumbJsonLd, postJsonLd } from "@/lib/structuredData";
import styles from "./article.module.css";

type Params = { params: Promise<{ slug: string }> };

/**
 * Inline links in body copy, written as [label](href).
 *
 * A technical post has to be able to point at the code and the datasets it
 * describes, and a plain string cannot. This is deliberately the smallest
 * thing that does that: one pattern, no nesting, no other markup. Post bodies
 * are our own copy from lib/blog, never user input, so there is nothing to
 * sanitise, but external links still get rel="noreferrer".
 */
const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

function withLinks(text: string) {
  const out: ReactNode[] = [];
  let last = 0;

  for (const m of text.matchAll(LINK)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));

    const [, label, href] = m;
    const external = href.startsWith("http");
    out.push(
      <a
        key={`${href}-${at}`}
        href={href}
        className="link-underline"
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {label}
      </a>,
    );
    last = at + m[0].length;
  }

  if (last < text.length) out.push(text.slice(last));
  return out.length ? out : text;
}

/* Every post is known at build time, so each one prerenders. */
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found | Namu" };

  return {
    title: `${post.title} | Namu`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      images: [post.image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = postsByDate.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        // Content is built from our own data, never user input.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([postJsonLd(post), breadcrumbJsonLd(post)]),
        }}
      />

      <main id="main-content" className={`ds-container ds-outer ${styles.page}`}>
        <Link href="/blog" className={`text-ui ${styles.back}`}>
          <ArrowRight className={styles.backArrow} />
          All posts
        </Link>

        <ScrollObject as="header" className={styles.header}>
          <div className={`text-small ${styles.meta}`}>
            <span className={styles.tag}>{post.category}</span>
            <span>{formatDate(post.date)}</span>
            <span className={styles.dot}>·</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="h4">
            <SplitText immediate text={post.title} />
          </h1>

          <p className={`text-large ${styles.excerpt}`}>{post.excerpt}</p>
        </ScrollObject>

        <ScrollObject className={styles.hero}>
          {post.video ? (
            <MotionHero
              webm={post.video.webm}
              mp4={post.video.mp4}
              poster={post.image}
              label={post.imageAlt}
              className="scale-out"
            />
          ) : (
            <img
              src={post.image}
              alt={post.imageAlt}
              className="scale-out"
              loading="eager"
            />
          )}
        </ScrollObject>

        <article className={`text-regular ${styles.body}`}>
          {post.body.map((para, i) =>
            para.endsWith(":") ? (
              <p key={i} className={`h7 ${styles.subhead}`}>
                {para.slice(0, -1)}
              </p>
            ) : (
              <p key={i}>{withLinks(para)}</p>
            ),
          )}

          <div className={`text-caption ${styles.signoff}`}>
            <span>{post.author}</span>
            <span>{formatDate(post.date)}</span>
          </div>
        </article>

        {more.length ? (
          <section className={styles.more}>
            <h2 className={`h6 ${styles.moreHead}`}>Keep reading</h2>
            <div className={styles.moreGrid}>
              {more.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className={styles.moreCard}
                >
                  <span className={styles.moreFrame}>
                    <img src={p.image} alt="" loading="lazy" />
                  </span>
                  <span className={`h7 ${styles.moreTitle}`}>{p.title}</span>
                  <span className={`text-small ${styles.moreMeta}`}>
                    <span className={styles.tag}>{p.category}</span>
                    <span>{p.readTime}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
