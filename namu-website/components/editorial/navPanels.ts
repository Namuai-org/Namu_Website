/**
 * Content for the nav mega-panels.
 *
 * Each panel is a two-column tab set: a heading, a blurb and a list of
 * hoverable items on the left, and a single large preview on the right that
 * cross-fades as you move between them.
 *
 * All strings are i18n keys, resolved at render.
 */
export type PanelItem = {
  /** i18n key for the item name — used in both the list and the preview. */
  title: string;
  /** i18n key for the preview description. */
  body: string;
  href: string;
  /** Square thumbnail in the list, and the large preview image. */
  image: string;
};

export type NavPanel = {
  titleKey: string;
  bodyKey: string;
  /** Link pinned to the bottom of the left column. */
  allKey: string;
  allHref: string;
  items: PanelItem[];
};

export const NAV_PANELS: Record<string, NavPanel> = {
  models: {
    titleKey: "nav.panel.models.title",
    bodyKey: "nav.panel.models.body",
    allKey: "nav.panel.allModels",
    allHref: "/#stack",
    items: [
      {
        title: "solution.step1.title",
        body: "solution.step1.body",
        href: "/#stack",
        image: "/editorial/desert-aerial-rose.jpg",
      },
      {
        title: "solution.step2.title",
        body: "solution.step2.body",
        href: "/#stack",
        image: "/editorial/canyon-lightfall.jpg",
      },
      {
        title: "solution.step3.title",
        body: "solution.step3.body",
        href: "/#stack",
        image: "/editorial/paint-golden-valley.jpg",
      },
      {
        title: "solution.step4.title",
        body: "solution.step4.body",
        href: "/#stack",
        image: "/editorial/paint-sea-dusk.jpg",
      },
    ],
  },
  products: {
    titleKey: "nav.panel.products.title",
    bodyKey: "nav.panel.products.body",
    allKey: "nav.panel.allProducts",
    allHref: "/playground",
    items: [
      {
        title: "nav.product.studio.title",
        body: "nav.product.studio.body",
        href: "/playground",
        image: "/Namu_mock_up.png",
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
        href: "/#stack",
        image: "/editorial/paint-caravan-pale.jpg",
      },
    ],
  },
};
