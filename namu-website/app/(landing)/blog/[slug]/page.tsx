import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/editorial/Footer";
import { ArrowRight } from "@/components/editorial/icons";
import { ScrollObject } from "@/components/editorial/ScrollObject";
import { SplitText } from "@/components/editorial/SplitText";
import { formatDate, getPost, posts, postsByDate } from "@/lib/blog";
import styles from "./article.module.css";

type Params = { params: Promise<{ slug: string }> };

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
          <img
            src={post.image}
            alt={post.imageAlt}
            className="scale-out"
            loading="eager"
          />
        </ScrollObject>

        <article className={`text-regular ${styles.body}`}>
          {post.body.map((para, i) =>
            para.endsWith(":") ? (
              <p key={i} className={`h7 ${styles.subhead}`}>
                {para.slice(0, -1)}
              </p>
            ) : (
              <p key={i}>{para}</p>
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
