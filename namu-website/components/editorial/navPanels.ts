/**
 * Content for the nav mega-panels.
 *
 * Each panel is a two-column tab set: a heading, a blurb and a list of
 * hoverable items on the left, and a single large preview on the right that
 * cross-fades as you move between them.
 *
 * Strings are i18n keys by default. The blog panel is built from real posts,
 * whose titles are already written prose rather than keys, so those items set
 * `literal` and are rendered as-is.
 */
import { postsByDate } from "@/lib/blog";

export type PanelItem = {
  /** i18n key for the item name — used in both the list and the preview. */
  title: string;
  /** i18n key for the preview description. */
  body: string;
  href: string;
  /** Square thumbnail in the list, and the large preview image. */
  image: string;
  /** `title` and `body` are finished copy, not keys. Skips translation. */
  literal?: boolean;
  /** Small line under the item — read time on stories. Always literal. */
  meta?: string;
};

export type NavPanel = {
  /**
   * `split` is the two-column form: a list on the left, one large preview on
   * the right that cross-fades between them. `stories` drops the preview and
   * lays the items out as full-width cards, which is what reads better when
   * every item is an article with its own picture and nothing to compare.
   */
  layout?: "split" | "stories";
  titleKey: string;
  bodyKey: string;
  /** Link pinned to the bottom of the left column. */
  allKey: string;
  allHref: string;
  items: PanelItem[];
};

/* Three cards is the whole panel in the stories layout — each one is tall
   enough that a fourth would push the panel past the fold. */
const MAX_BLOG_ITEMS = 3;

export const NAV_PANELS: Record<string, NavPanel> = {
  models: {
    layout: "split",
    titleKey: "nav.panel.models.title",
    bodyKey: "nav.panel.models.body",
    allKey: "nav.panel.allModels",
    allHref: "/models",
    /* Every model points at the catalogue until the individual pages exist. */
    items: [
      {
        title: "home.model.interpret.name",
        body: "home.model.interpret.body",
        href: "/models/namu-interpret",
        image: "/modim/hausa-french.png",
      },
      {
        title: "home.model.asr.name",
        body: "home.model.asr.body",
        href: "/models/namu-transcribe",
        image: "/modim/asr.png",
      },
      {
        title: "home.model.tts.name",
        body: "home.model.tts.body",
        href: "/models/namu-voice",
        image: "/modim/tts.png",
      },
      {
        title: "home.model.agent.name",
        body: "home.model.agent.body",
        href: "/models",
        image: "/modim/voice-agent.png",
      },
    ],
  },
  products: {
    layout: "split",
    titleKey: "nav.panel.products.title",
    bodyKey: "nav.panel.products.body",
    allKey: "nav.panel.allProducts",
    allHref: "/playground",
    items: [
      {
        title: "nav.product.studio.title",
        body: "nav.product.studio.body",
        href: "/playground",
        image: "/studio.jpeg",
      },
      {
        title: "nav.product.app.title",
        body: "nav.product.app.body",
        href: "/playground",
        image: "/namu_app.jpg",
      },
      {
        title: "nav.product.api.title",
        body: "nav.product.api.body",
        href: "/models",
        image: "/sdk.jpeg",
      },
    ],
  },
  blog: {
    layout: "stories",
    titleKey: "nav.panel.blog.title",
    bodyKey: "nav.panel.blog.body",
    allKey: "nav.panel.allPosts",
    allHref: "/blog",
    /* Derived from lib/blog so a new post shows up here without anyone
       remembering to add it, exactly as the home page rail does. */
    items: postsByDate.slice(0, MAX_BLOG_ITEMS).map((post) => ({
      title: post.title,
      body: post.excerpt,
      href: `/blog/${post.slug}`,
      image: post.image,
      literal: true,
      meta: post.readTime,
    })),
  },
};
