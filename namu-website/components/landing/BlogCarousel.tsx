"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

const angleMap = [-8, -3, 0, 3, 8];

type BlogCarouselProps = {
  /** When true, title/label come from the page hero instead */
  hideBlogHead?: boolean;
};

export function BlogCarousel({ hideBlogHead = false }: BlogCarouselProps) {
  useScrollReveal("#blog .reveal");
  const { t } = useTranslation();

  const [index, setIndex] = useState(2);
  const [paused, setPaused] = useState(false);

  const posts = [
    { title: t("blog.p1.title"), excerpt: t("blog.p1.excerpt"), author: t("blog.author"), date: t("blog.date1"), image: "cityscape" },
    { title: t("blog.p2.title"), excerpt: t("blog.p2.excerpt"), author: t("blog.author"), date: t("blog.date2"), image: "landscape" },
    { title: t("blog.p3.title"), excerpt: t("blog.p3.excerpt"), author: t("blog.author"), date: t("blog.date3"), image: "data" },
    { title: t("blog.p4.title"), excerpt: t("blog.p4.excerpt"), author: t("blog.author"), date: t("blog.date4"), image: "campus" },
    { title: t("blog.p5.title"), excerpt: t("blog.p5.excerpt"), author: t("blog.author"), date: t("blog.date5"), image: "developer" },
  ];

  const ordered = useMemo(() => {
    const before = posts.slice(0, index);
    const after = posts.slice(index);
    return [...after, ...before];
  }, [index, posts]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % posts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, posts.length]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setIndex((prev) => (prev + 1) % posts.length);
      if (event.key === "ArrowLeft") setIndex((prev) => (prev - 1 + posts.length) % posts.length);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [posts.length]);

  return (
    <section className="section blog" id="blog">
      <div className="container">
        {hideBlogHead ? (
          <div className="blog-head blog-head--link-only reveal reveal-fade">
            <Link href="/blog" className="text-orange">
              {t("blog.viewAll")}
            </Link>
          </div>
        ) : (
          <div className="blog-head reveal reveal-fade">
            <div>
              <span className="section-label">{t("blog.label")}</span>
              <h2 className="title">{t("blog.title")}</h2>
            </div>
            <Link href="/blog" className="text-orange">
              {t("blog.viewAll")}
            </Link>
          </div>
        )}

        <div className="carousel-wrap reveal reveal-up" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <button onClick={() => setIndex((prev) => (prev - 1 + posts.length) % posts.length)} aria-label="Previous" className="carousel-btn">
            {"\u2190"}
          </button>

          <div className="fan-stage">
            {ordered.map((post, cardIndex) => {
              const depth = cardIndex - 2;
              const active = cardIndex === 2;
              return (
                <article
                  key={`${post.title}-${cardIndex}`}
                  className={`blog-card ${active ? "active" : ""}`}
                  style={{
                    transform: `translateX(${depth * 120}px) rotate(${angleMap[cardIndex] ?? 0}deg) translateY(${active ? -18 : 0}px)`,
                    zIndex: active ? 20 : 10 - Math.abs(depth),
                  }}
                >
                  <div className={`blog-image ${post.image}`} />
                  <div className="blog-body">
                    <div className="blog-meta">
                      <div className="avatar" />
                      <span>{post.author}</span>
                      <time>{post.date}</time>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <button onClick={() => setIndex((prev) => (prev + 1) % posts.length)} aria-label="Next" className="carousel-btn">
            {"\u2192"}
          </button>
        </div>
      </div>
    </section>
  );
}
