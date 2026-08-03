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
import { postsByDate } from "@/lib/blog";

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

/* The rail is a taster, not the archive — /blog is where everything lives. */
const MAX_STORIES = 4;

const LANGUAGE_IMAGES = [
  "/editorial/dune-lone-tree.jpg",
  "/editorial/dune-ridge.jpg",
  "/editorial/dune-shadows.jpg",
];

export default function HomePage() {
  const { t } = useTranslation();

  /* Real posts, newest first. These used to be three hand-written strings in
     the dictionaries pointing at /blog — headlines that looked like articles
     and led to an index instead of the piece they named. Deriving them from
     lib/blog means the rail cannot drift from what is actually published, and
     a new article appears here without anyone remembering to add it. */
  const stories: Story[] = postsByDate.slice(0, MAX_STORIES).map((post) => ({
    href: `/blog/${post.slug}`,
    image: post.image,
    alt: post.imageAlt,
    title: post.title,
    category: post.category.toLowerCase(),
    readTime: post.readTime,
  }));

  return (
    <>
      <main id="main-content">
        <Hero />

        <FeaturedStory
          href="/about"
          image="/namu_im.jpg"
          image2x="/namu_im@2x.jpg"
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
