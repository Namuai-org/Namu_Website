"use client";

import { BlogCarousel } from "@/components/landing/BlogCarousel";
import { Footer } from "@/components/landing/Footer";
import { HeroEntrance } from "@/components/landing/HeroEntrance";
import { NavBar } from "@/components/landing/NavBar";
import { useTranslation } from "@/hooks/useTranslation";

function BlogPageHero() {
  const { t } = useTranslation();
  return (
    <section className="page-hero blog-page-hero">
      <div className="container">
        <HeroEntrance>
          <span className="section-label">{t("blog.label")}</span>
          <h1 className="hero-title page-title">{t("blog.title")}</h1>
        </HeroEntrance>
      </div>
    </section>
  );
}

export default function BlogPage() {
  return (
    <>
      <NavBar />
      <BlogPageHero />
      <section className="section" style={{ paddingTop: "32px" }}>
        <BlogCarousel hideBlogHead />
      </section>
      <Footer />
    </>
  );
}
