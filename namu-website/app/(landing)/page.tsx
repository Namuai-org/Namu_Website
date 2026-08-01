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

/* Photography and painting alternating, so the flight never reads as a stock
   slideshow, with the two founders placed at 3 and 6 — far enough in that they
   arrive while panels are at full opacity and nearly sharp.

   Order is positional: index N lands in LAYOUT slot N, whose aspect ratio is
   cut to match that exact file. Adding one here means adding a slot there.

   Mouhamad's photo is the same file the closing quote uses, referenced rather
   than copied into /editorial. */
const PORTAL_IMAGES = [
  { src: "/editorial/panel-children-dusk.jpg", alt: "Children standing together in low golden light" },
  { src: "/editorial/panel-portrait-headwrap.jpg", alt: "Painted portrait of a woman in a patterned headwrap" },
  { src: "/mouhamad.jpeg", alt: "Mouhamad Mamane speaking at a podium" },
  { src: "/editorial/panel-baskets-wall.jpg", alt: "Women carrying woven baskets along a sunlit wall" },
  { src: "/editorial/panel-cofounder.jpg", alt: "Namu co-founder portrait" },
  { src: "/editorial/panel-acacia-sunset.jpg", alt: "Painted acacia grove against a red sun" },
  { src: "/editorial/panel-elephants-crossing.jpg", alt: "A herd crossing a river at dawn, seen from above" },
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

        <FeaturedStory
          href="/about"
          image="/namu_im.jpg"
          /* The frame takes the plate's own ratio so nothing is cropped — the
             mark, the tagline and the acacia all have to survive. */
          ratio="1536 / 1024"
        />

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
