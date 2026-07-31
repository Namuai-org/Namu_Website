"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/editorial/Footer";
import { Button } from "@/components/editorial/Button";
import { Dropdown } from "@/components/editorial/Dropdown";
import { ScrollObject } from "@/components/editorial/ScrollObject";
import { SplitText } from "@/components/editorial/SplitText";
import { CATEGORIES, postsByDate, type PostCategory } from "@/lib/blog";
import styles from "./blog.module.css";

type SubjectValue = "all" | PostCategory;
type SortValue = "newest" | "oldest";

const SUBJECT_OPTIONS = [
  { value: "all" as const, label: "All subjects" },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
];

const SORT_OPTIONS = [
  { value: "newest" as const, label: "Newest first" },
  { value: "oldest" as const, label: "Oldest first" },
];

/* The grid places cards rather than flowing them; the run of four repeats. */
const SLOTS = [styles.slotA, styles.slotB, styles.slotC, styles.slotD];

export default function BlogPage() {
  const [subject, setSubject] = useState<SubjectValue>("all");
  const [sort, setSort] = useState<SortValue>("newest");

  const visible = useMemo(() => {
    const filtered =
      subject === "all"
        ? postsByDate
        : postsByDate.filter((p) => p.category === subject);
    return sort === "newest" ? filtered : [...filtered].reverse();
  }, [subject, sort]);

  // The lead only makes sense on an unfiltered, newest-first view — otherwise
  // it would silently promote whichever post happens to sort first.
  const showLead = subject === "all" && sort === "newest";
  const lead = showLead ? visible[0] : undefined;
  const rest = showLead ? visible.slice(1) : visible;

  return (
    <>
      <main id="main-content" className={`ds-container ds-outer ${styles.page}`}>
        <ScrollObject as="header" className={styles.head}>
          <h1 className="h3">
            <SplitText
              immediate
              srText="Journal — research, language, progress."
              lines={[
                "Journal",
                <em key="sub">Research. Language. Progress.</em>,
              ]}
            />
          </h1>
        </ScrollObject>

        <div className={styles.controls}>
          <Dropdown
            label="Subject"
            value={subject}
            options={SUBJECT_OPTIONS}
            onChange={setSubject}
          />
          <Dropdown
            label="Sort"
            value={sort}
            options={SORT_OPTIONS}
            onChange={setSort}
          />
        </div>

        {subject !== "all" ? (
          <p className={`text-caption ${styles.count}`}>
            {visible.length} {visible.length === 1 ? "post" : "posts"} in{" "}
            {subject.toLowerCase()}
          </p>
        ) : null}

        {lead ? (
          <ScrollObject className={styles.featured}>
            <div className={styles.featuredMedia}>
              <Link
                href={`/blog/${lead.slug}`}
                className={styles.featuredFrame}
                tabIndex={-1}
                aria-hidden="true"
              >
                <img src={lead.image} alt="" loading="eager" />
              </Link>
            </div>

            <div className={styles.featuredBody}>
              <span className={`text-small ${styles.featuredKicker}`}>
                Latest
              </span>
              <h2 className="h5">
                <Link href={`/blog/${lead.slug}`} className="link-underline">
                  {lead.title}
                </Link>
              </h2>
              <p className={`text-regular ${styles.featuredExcerpt}`}>
                {lead.excerpt}
              </p>
              <div className={styles.cardMeta}>
                <span className={`text-small ${styles.tag}`}>
                  {lead.category}
                </span>
                <p className={`text-small ${styles.readTime}`}>
                  {lead.readTime}
                </p>
              </div>
            </div>
          </ScrollObject>
        ) : null}

        {rest.length ? (
          <div className={styles.grid}>
            {rest.map((post, i) => (
              <ScrollObject
                key={post.slug}
                as="article"
                className={`${styles.card} ${SLOTS[i % SLOTS.length]}`}
              >
                <div className="slide-up">
                  <Link
                    href={`/blog/${post.slug}`}
                    className={styles.cardFrame}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <img src={post.image} alt="" loading="lazy" />
                  </Link>

                  <h2 className={`h7 ${styles.cardTitle}`}>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <div className={styles.cardMeta}>
                    <span className={`text-small ${styles.tag}`}>
                      {post.category}
                    </span>
                    <p className={`text-small ${styles.readTime}`}>
                      {post.readTime}
                    </p>
                  </div>
                </div>
              </ScrollObject>
            ))}
          </div>
        ) : null}

        {!visible.length ? (
          <div className={styles.empty}>
            <p className="h6">
              Nothing filed under {subject.toLowerCase()} yet.
            </p>
            <div className={styles.emptyAction}>
              <Button onClick={() => setSubject("all")} simple>
                Show everything
              </Button>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
