# Namu — website

Marketing site for Namu, an African AI company building speech-native models,
datasets and products for African languages, starting with Hausa.

Next.js 15 (App Router) · React 19 · TypeScript · plain CSS + CSS Modules.
No UI framework, no CSS framework, no animation library.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

---

## Routes

| Route          | Source                                | Notes                          |
| -------------- | ------------------------------------- | ------------------------------ |
| `/`            | `app/(landing)/page.tsx`              | Editorial homepage             |
| `/blog`        | `app/(landing)/blog/page.tsx`         | Posts are a hardcoded array    |
| `/brand`       | `components/brand/BrandPage.tsx`      | Brand guidelines               |
| `/playground`  | `app/(landing)/playground/page.tsx`   | Product playground             |
| `/privacy`     | `components/legal/PrivacyPolicyPage`  | via `LegalDocLayout`           |
| `/terms`       | `components/legal/TermsOfServicePage` | via `LegalDocLayout`           |
| `/api/contact` | `app/api/contact/route.ts`            | **Validates only — see below** |

Everything sits in the `(landing)` route group, which supplies the language
provider, the nav, the page transition and the motion toggle.

---

## The design system

`app/design-system.css` is the foundation. Read it before adding UI.

### Fluid units

Every dimension is authored at a **1728px reference width** and expressed as a
multiple of `--unit-fx`, which equals exactly `1px` there:

```css
padding: calc(30 * var(--unit-fx)); /* 30px at 1728, scales down proportionally */
```

Above 1728px the scale locks at 1:1 and the container simply centres, so the
design never inflates on large monitors.

The **type** scale is a separate variable, `--unit-fx-type`, and is deliberately
**frozen between 861px and 1536px**. Headline sizes therefore stay put across the
whole laptop range instead of creeping on every window resize. Use
`--unit-fx-type` for font sizes and `--unit-fx` for everything else.

### Grid

24 columns: `--col24` (50fx) and `--gutter24` (20fx). Widths and offsets:

```css
width: calc(var(--col24) * 10 + var(--gutter24) * 9);         /* 10-column span */
padding-inline: calc(var(--col24) * 2 + var(--gutter24) * 2); /* 2-column inset */
```

`.ds-container` applies the 1660fx max width; `.ds-outer` the outer gutters.

### Colour

Namu's palette, exposed as both raw names and semantic roles. Style against the
**semantic** ones so the `BgFade` colour rhythm keeps working:

`--ds-bg` · `--ds-text` · `--ds-text-soft` · `--ds-surface` · `--ds-accent`

Raw: Paper `#FFFAF1` · Harmattan `#F7F0E3` · Dry Clay `#EDD9B0` · Sahel
`#E8935A` · Kola `#6B3E1E` · Forest `#1A3A2E` · Ink `#1C1410`.

### Type

`.h1`–`.h7`, `.text-large`, `.text-regular` are the serif (Newsreader).
`.text-ui`, `.text-caption`, `.text-small` are the mono (Red Hat Mono).

---

## Components

```
components/
  editorial/          the design system in React
    home/             homepage sections, one file each
  brand/              /brand only
  legal/              /privacy and /terms
  PageTransition.tsx  wraps every page
```

### Primitives worth knowing

| Component       | Purpose                                                          |
| --------------- | ---------------------------------------------------------------- |
| `ScrollObject`  | Adds `.in-view` when scrolled into view. Wrap anything revealing. |
| `SplitText`     | Masked line-by-line reveal. Measures real wrap points.            |
| `BgFade`        | Re-tints the page as the block passes the viewport midpoint.      |
| `GradientField` | The hero's WebGL field.                                           |
| `Button`        | Pill plus detached arrow tile.                                    |

`hooks/useRafScroll.ts` is a **single shared rAF loop**. Scroll-driven sections
subscribe to it rather than each adding a listener — keep it that way.

### Adding a homepage section

1. New file in `components/editorial/home/`, styles in `home.module.css`.
2. Wrap revealing content in `<ScrollObject>`; use `.slide-up`, `.fade-in`,
   `.scale-out` for the motion.
3. For scroll-driven motion use `useRafScroll`, not your own listener.
4. Add it to `app/(landing)/page.tsx`, wrapped in `<BgFade>` if it changes the
   page colour.

---

## Internationalisation

English and Hausa, in `lib/i18n/en.ts` and `ha.ts`. Flat dot-notation keys.

```tsx
const { t, language, setLanguage } = useTranslation();
t("home.values.title");
```

Fallback is `ha → en → key`, so a missing key renders as the key itself — if you
see a raw `some.key` on the page, it is missing from `en.ts`.

**Both files must hold the same key set**, or Hausa silently falls back to
English for the gaps. Compare the key lists before committing.

---

## Images

Live in `public/editorial/`. Sourced from public-domain museum collections and
freely-licensed material, plus original generated plates.

**`public/editorial/CREDITS.md` is a licence requirement**, not documentation —
several images are CC BY-SA and attribution must remain reachable. Do not delete
it, and add a row when you add an image.

Keep the long edge at or under 2000px and JPEG quality around 80.

---

## Known gaps

- **`/api/contact` stores nothing.** It validates `name`/`email`/`message` and
  echoes the payload. There is no database, no email, no logging — the site
  cannot currently capture a lead. Wire this up before running acquisition.
- **`/blog` posts are a hardcoded array** with no detail route, so post links go
  nowhere.
- The **Hausa strings added during the redesign have not been reviewed by a
  native speaker**.
- `/blog`, `/brand`, `/playground`, `/privacy` and `/terms` still use their
  older visual design under the new nav and footer.

---

## Deploying

Vercel, with **Root Directory set to `namu-website`** — the git repo root is the
parent folder. See `docs/VERCEL.md`.
