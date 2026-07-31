"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { BgFade } from "@/components/editorial/BgFade";
import { Footer } from "@/components/editorial/Footer";
import { Building } from "@/components/editorial/home/Building";
import { FeaturedStory } from "@/components/editorial/home/FeaturedStory";
import { Hero } from "@/components/editorial/home/Hero";
import { Mission } from "@/components/editorial/home/Mission";
import { Places } from "@/components/editorial/home/Places";
import { Portal } from "@/components/editorial/home/Portal";
import { Quote } from "@/components/editorial/home/Quote";
import { StoryRail, type Story } from "@/components/editorial/home/StoryRail";
import { Values } from "@/components/editorial/home/Values";

/* Namu's own photography and product shots, interleaved with the generated
   Sahel plates so the flight through the portal stays warm and varied. */
const PORTAL_IMAGES = [
  { src: "/editorial/panel-canyon-01.jpg", alt: "" },
  { src: "/editorial/panel-valley-gold.jpg", alt: "" },
  { src: "/editorial/panel-canyon-02.jpg", alt: "" },
  { src: "/namu_app.png", alt: "" },
  { src: "/editorial/panel-desert-dusk.jpg", alt: "" },
  { src: "/editorial/panel-canyon-03.jpg", alt: "" },
  { src: "/editorial/panel-caravan.jpg", alt: "" },
];

const LANGUAGE_IMAGES = [
  "/editorial/dune-lone-tree.jpg",
  "/editorial/dune-ridge.jpg",
  "/editorial/dune-shadows.jpg",
];

export default function HomePage() {
  const { t } = useTranslation();

  const stories: Story[] = [
    {
      href: "/blog",
      image: "/editorial/paint-sea-dusk.jpg",
      alt: "",
      title: t("home.story1.title"),
      category: t("home.story1.cat"),
      readTime: t("home.story1.time"),
    },
    {
      href: "/blog",
      image: "/editorial/paint-lake-haze.jpg",
      alt: "",
      title: t("home.story2.title"),
      category: t("home.story2.cat"),
      readTime: t("home.story2.time"),
    },
    {
      href: "/blog",
      image: "/editorial/desert-aerial-rose.jpg",
      alt: "",
      title: t("home.story3.title"),
      category: t("home.story3.cat"),
      readTime: t("home.story3.time"),
    },
  ];

  return (
    <>
      <main id="main-content">
        <Hero />

        <FeaturedStory href="/#approach" image="/editorial/canyon-ochre-wide.jpg" />

        <StoryRail stories={stories} />

        <BgFade bg="#FFFAF1">
          <Building />
        </BgFade>

        <BgFade bg="#EDD9B0" text="#4A2A12">
          <Mission />
        </BgFade>

        <BgFade bg="#FFFAF1">
          <Values />
        </BgFade>

        <BgFade bg="#FFFAF1">
          <Portal images={PORTAL_IMAGES} />
        </BgFade>

        <BgFade bg="#F7F0E3">
          <Places images={LANGUAGE_IMAGES} />
        </BgFade>

        <BgFade bg="#F7ECD9">
          <Quote
            portrait="/mouhamad.jpeg"
            portraitAlt={t("mission.attributionLine")}
            signature="/momo_signature_trimmed.png"
          />
        </BgFade>
      </main>

      <Footer />
    </>
  );
}
