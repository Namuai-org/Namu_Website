"use client";

import { useRef } from "react";
import styles from "./brand.module.css";
import { Footer } from "@/components/landing/Footer";

/* ─── Asset path helpers ─── */
const SVG  = (p: string) => `/brand/namu%20branding/svg/${p}`;
const GImg = (f: string) => `/brand/public/Namu/${f}`;

/* ─── Reusable pieces ─── */

function SectionHead({
  kicker,
  title,
  intro,
  flush,
}: {
  kicker: string;
  title: string;
  intro: string;
  flush?: boolean;
}) {
  return (
    <div className={`${styles.sectionHead} ${flush ? styles.sectionHeadFlush : ""}`}>
      <div className={styles.sectionKicker}>{kicker}</div>
      <div>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionIntro}>{intro}</p>
      </div>
    </div>
  );
}

function Good() {
  return (
    <span className={`${styles.status} ${styles.statusGood}`} aria-label="Do">
      ✓
    </span>
  );
}

function Bad() {
  return (
    <span className={`${styles.status} ${styles.statusBad}`} aria-label="Do not">
      ×
    </span>
  );
}

/* ─── Gallery ─── */
function BrandGallery() {
  const railRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const first = rail.firstElementChild as HTMLElement | null;
    const step = first ? first.getBoundingClientRect().width + 18 : rail.clientWidth;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const tiles = [
    { src: GImg("1ee9fbb5-4d83-4dfa-bc8f-eb6ef1886b33.jpg"), alt: "Namu tote bag mockup",            variant: `${styles.galleryTile} ${styles.tileDeep} ${styles.tilePortrait}` },
    { src: GImg("727ee443-42f1-44bd-8a1e-21439e0f8836.jpg"), alt: "Namu stationery and desk objects", variant: `${styles.galleryTile} ${styles.tileSoft} ${styles.tileLandscape}` },
    { src: GImg("8bf76e1a-a6b5-48c5-a19b-608765eda325.jpg"), alt: "Namu business cards",              variant: `${styles.galleryTile} ${styles.tileWarm} ${styles.tileLandscape}` },
    { src: GImg("b75ed8f0-5194-4b65-a315-19b9957bcde4.jpg"), alt: "Namu card and pen mockup",        variant: `${styles.galleryTile} ${styles.tileSoft} ${styles.tileLandscape}` },
    { src: GImg("4a5f465b-6fbb-4fa7-8bde-658ae98091ea.jpg"), alt: "Namu vertical brand application", variant: `${styles.galleryTile} ${styles.tileDeep} ${styles.tilePortrait}` },
    { src: GImg("bc41d20a-79de-4580-8752-430cd0f8d5c2.jpg"), alt: "Namu vertical mockup",            variant: `${styles.galleryTile} ${styles.tileSoft} ${styles.tilePortrait}` },
    { src: GImg("e80c3dda-fe2b-4c3b-b48b-d87f10888f41.jpg"), alt: "Namu printed brand item",         variant: `${styles.galleryTile} ${styles.tileWarm} ${styles.tilePortrait}` },
    { src: GImg("ee4173f2-7cdf-4f24-8a78-76588280d51c.jpg"), alt: "Namu landscape brand mockup",     variant: `${styles.galleryTile} ${styles.tileDeep} ${styles.tileLandscape}` },
  ];

  return (
    <section className={styles.brandGallery} id="gallery" aria-label="Namu brand gallery">
      <div className={styles.galleryTop}>
        <h2 className={styles.galleryTitle}>Gallery</h2>
        <div className={styles.galleryControls} aria-label="Gallery controls">
          <button type="button" className={styles.galleryControl} onClick={() => scroll(-1)} aria-label="Previous">←</button>
          <button type="button" className={styles.galleryControl} onClick={() => scroll(1)}  aria-label="Next">→</button>
        </div>
      </div>
      <div ref={railRef} className={styles.galleryRail}>
        {tiles.map((t) => (
          // eslint-disable-next-line @next/next/no-img-element
          <figure key={t.src} className={t.variant}><img src={t.src} alt={t.alt} /></figure>
        ))}
      </div>
    </section>
  );
}

/* ─── Main page ─── */
export function BrandPage() {
  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.heroCentered}>
        <h1 className={styles.heroH1}>
          <span>Brand</span>
          <span>guidelines</span>
        </h1>
        <p className={styles.heroCopy}>
          Namu is an African AI research and technology company building speech-native models, datasets,
          and products that make technology accessible through natural conversation in every language and every community.
        </p>
      </section>

      {/* ── Introduction ── */}
      <section className={`${styles.section} ${styles.sectionNoTopRule}`} id="introduction">
        <div className={`${styles.sectionHead} ${styles.sectionHeadFlush}`}>
          <div className={styles.sectionKicker}>Introduction</div>
          <div className={styles.introStatement}>
            <p>
              The "Namu" name, the Namu logo, the Namu wordmark, the Blossom,
              and other Namu trademarks are property of Namu.
            </p>
            <p>
              These guidelines are intended to help our partners, customers, developers,
              collaborators, publishers, and any other third parties understand how to use
              and display our trademarks, visual identity, and copyrighted work in their
              own assets and materials.
            </p>
          </div>
        </div>
      </section>

      {/* ── Brand Foundation ── */}
      <section className={styles.section} id="brand-foundation">
        <SectionHead
          kicker="Brand foundation"
          title="A brand built for language, access, and trust."
          intro="Namu's identity should feel precise, grounded, and human. It carries the seriousness of infrastructure and the warmth of community: technology that does not ask people to become someone else before they can participate."
        />
        <div className={styles.threeUp}>
          {[
            { idx: "01", title: "Native",   body: "We start by deeply understanding the languages, cultures, and realities of the communities we serve." },
            { idx: "02", title: "Access",   body: "Language should never be a barrier to knowledge, opportunity, or participation." },
            { idx: "03", title: "Together", body: "We succeed when communities, partners, and team members grow alongside us." },
          ].map((c) => (
            <article key={c.idx} className={styles.card}>
              <span className={styles.cardIdx}>{c.idx}</span>
              <h3 className={styles.cardH3}>{c.title}</h3>
              <p className={styles.cardP}>{c.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Logos ── */}
      <section className={styles.section} id="logos">
        <SectionHead
          kicker="Logo"
          title="Wordmark and symbol"
          intro="The Namu wordmark is the primary expression of the brand. Use the full wordmark for most communications. Use the icon only when space is limited or when Namu is already clearly identified."
        />

        {/* Primary / reverse wordmark */}
        <div className={styles.twoUp}>
          <article className={`${styles.card} ${styles.assetCard}`}>
            <div className={styles.assetStage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SVG("logo/namu-logo-transparent-dark.svg")} alt="Namu dark wordmark" />
            </div>
            <div className={styles.assetMeta}>
              <strong>Primary wordmark</strong><span>Light backgrounds</span>
            </div>
          </article>
          <article className={`${styles.card} ${styles.cardDark} ${styles.assetCard}`}>
            <div className={styles.assetStage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SVG("logo/namu-logo-transparent-light.svg")} alt="Namu light wordmark" />
            </div>
            <div className={styles.assetMeta}>
              <strong>Reverse wordmark</strong><span>Dark backgrounds</span>
            </div>
          </article>
        </div>

        {/* Icon variants */}
        <div className={`${styles.threeUp} ${styles.gridGapTop}`}>
          <article className={`${styles.card} ${styles.assetCard}`}>
            <div className={styles.assetStage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SVG("icon/namu-icon-transparent-dark.svg")} alt="Namu icon" />
            </div>
            <div className={styles.assetMeta}>
              <strong>Icon</strong><span>Transparent</span>
            </div>
          </article>
          <article className={`${styles.card} ${styles.cardForest} ${styles.assetCard}`}>
            <div className={styles.assetStage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SVG("icon/namu-icon-on-ink.svg")} alt="Namu icon on ink" />
            </div>
            <div className={styles.assetMeta}>
              <strong>App mark</strong><span>Depth contexts</span>
            </div>
          </article>
          <article className={`${styles.card} ${styles.cardSahel} ${styles.assetCard}`}>
            <div className={styles.assetStage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SVG("icon/namu-icon-app-on-sahel.svg")} alt="Namu app icon" />
            </div>
            <div className={styles.assetMeta}>
              <strong>Accent mark</strong><span>High emphasis</span>
            </div>
          </article>
        </div>

        <div className={styles.downloadRow}>
          <a
            href="/brand/namu%20branding/README.txt"
            target="_blank"
            rel="noreferrer"
            className={styles.downloadAction}
          >
            Download logos
          </a>
        </div>
      </section>

      {/* ── Clear space ── */}
      <section className={styles.section}>
        <SectionHead
          kicker="Clear space"
          title="Give the mark room to speak."
          intro="The logo should never feel crowded. Keep a generous margin around the wordmark and avoid placing it inside busy visual areas."
        />
        <div className={styles.clearspace}>
          <div className={styles.clearDemo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SVG("logo/namu-logo-transparent-dark.svg")} alt="Namu clear space demo" />
          </div>
          <div className={styles.clearNote}>
            <h3 className={styles.clearNoteH3}>Minimum clear space</h3>
            <p className={styles.clearNoteP}>
              Use at least the height of the orange dot as a minimum margin around the mark.
              For premium layouts, use more space than the minimum. The Namu identity is
              strongest when it is quiet, legible, and allowed to breathe.
            </p>
            <p className={styles.clearNoteP}>
              Do not rebuild, redraw, stretch, recolor, or crop the logo.
              Always use approved assets from the brand folder.
            </p>
          </div>
        </div>
      </section>

      {/* ── Dos & Don'ts ── */}
      <section className={styles.section} id="dos-donts">

        {/* Blossom rules */}
        <div className={styles.rulesSection}>
          <h2 className={styles.rulesTitle}>Dos and Don&apos;ts: Blossom</h2>
          <div className={styles.rulesGrid}>

            <article className={styles.example}>
              <div className={styles.exampleVisual}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={`${styles.blossomImg} ${styles.badColor}`} src={SVG("icon/namu-icon-transparent-dark.svg")} alt="" />
                <Bad />
              </div>
              <p className={styles.exampleCaption}><strong>DON&apos;T</strong> add any colors to the Blossom</p>
            </article>

            <article className={styles.example}>
              <div className={styles.exampleVisual}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.blossomImg} src={SVG("icon/namu-icon-transparent-dark.svg")} alt="" />
                <Bad />
              </div>
              <p className={styles.exampleCaption}><strong>DON&apos;T</strong> use the Blossom as the primary branding</p>
            </article>

            <article className={styles.example}>
              <div className={styles.exampleVisual}>
                <div className={styles.seal}>
                  <span className={styles.sealTop}>NAMU RESEARCH</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={styles.sealImg} src={SVG("icon/namu-icon-transparent-dark.svg")} alt="" />
                  <span className={styles.sealBottom}>EST. 2026 NIGER</span>
                </div>
                <Bad />
              </div>
              <p className={styles.exampleCaption}><strong>DON&apos;T</strong> add any unauthorized elements</p>
            </article>

            <article className={styles.example}>
              <div className={`${styles.exampleVisual} ${styles.visualBusy}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.blossomImg} src={SVG("icon/namu-icon-transparent-light.svg")} alt="" />
                <Bad />
              </div>
              <p className={styles.exampleCaption}><strong>DON&apos;T</strong> use the Blossom over a busy image</p>
            </article>

            <article className={styles.example}>
              <div className={styles.exampleVisual}>
                <div className={styles.spacingDemo}>
                  <span className={`${styles.spacingDot} ${styles.dotTop}`}    />
                  <span className={`${styles.spacingDot} ${styles.dotRight}`}  />
                  <span className={`${styles.spacingDot} ${styles.dotBottom}`} />
                  <span className={`${styles.spacingDot} ${styles.dotLeft}`}   />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={SVG("icon/namu-icon-transparent-dark.svg")} alt="" />
                </div>
                <Good />
              </div>
              <p className={styles.exampleCaption}><strong>DO</strong> use the established spacing rules</p>
            </article>

            <article className={styles.example}>
              <div className={`${styles.exampleVisual} ${styles.visualMist}`}>
                <div className={styles.openSpacePaper}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={SVG("icon/namu-icon-transparent-dark.svg")} alt="" />
                </div>
                <Good />
              </div>
              <p className={styles.exampleCaption}><strong>DO</strong> use the Blossom with lots of open space</p>
            </article>

          </div>
        </div>

        {/* Wordmark rules */}
        <div className={styles.rulesSection}>
          <h2 className={styles.rulesTitle}>Dos and Don&apos;ts: Wordmark</h2>
          <div className={styles.rulesGrid}>

            <article className={styles.example}>
              <div className={styles.exampleVisual}>
                <div className={styles.distorted}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={SVG("icon/namu-icon-transparent-dark.svg")} alt="" />
                  <span>namu</span>
                </div>
                <Bad />
              </div>
              <p className={styles.exampleCaption}><strong>DON&apos;T</strong> stretch or alter the wordmark in any way</p>
            </article>

            <article className={styles.example}>
              <div className={styles.exampleVisual}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.smallWordmarkImg} src={SVG("icon/namu-icon-transparent-dark.svg")} alt="" style={{ width: 96 }} />
                <Bad />
              </div>
              <p className={styles.exampleCaption}><strong>DON&apos;T</strong> use the Blossom as the primary branding</p>
            </article>

            <article className={styles.example}>
              <div className={styles.exampleVisual}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={`${styles.wordmarkImg} ${styles.badCrop}`} src={SVG("logo/namu-logo-transparent-dark.svg")} alt="" />
                <Bad />
              </div>
              <p className={styles.exampleCaption}><strong>DON&apos;T</strong> crop wordmarks</p>
            </article>

            <article className={styles.example}>
              <div className={styles.exampleVisual}>
                <span className={styles.maskWord}>Namu</span>
                <Bad />
              </div>
              <p className={styles.exampleCaption}><strong>DON&apos;T</strong> use wordmarks as masks</p>
            </article>

            <article className={styles.example}>
              <div className={styles.exampleVisual}>
                <span className={styles.altWord}>Namu</span>
                <Bad />
              </div>
              <p className={styles.exampleCaption}><strong>DON&apos;T</strong> use any unapproved variations</p>
            </article>

            <article className={styles.example}>
              <div className={styles.exampleVisual}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={`${styles.wordmarkImg} ${styles.badShadow}`} src={SVG("logo/namu-logo-transparent-dark.svg")} alt="" />
                <Bad />
              </div>
              <p className={styles.exampleCaption}><strong>DON&apos;T</strong> use any effects or textures</p>
            </article>

          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <BrandGallery />

      {/* ── Color ── */}
      <section className={styles.section} id="color">
        <SectionHead
          kicker="Color"
          title="Warmth, depth, and restraint."
          intro="Namu's palette is designed for editorial clarity and cultural warmth. Harmattan cream and Ink carry the system; Sahel, Kola, Forest, and Dry Clay add emphasis and depth."
        />
        <div className={styles.palette}>
          {[
            { label: "Harmattan", hex: "#F7F0E3", cls: styles.swHarmattan },
            { label: "Ink",       hex: "#1C1410", cls: styles.swInk       },
            { label: "Sahel",     hex: "#E8935A", cls: styles.swSahel     },
            { label: "Kola",      hex: "#6B3E1E", cls: styles.swKola      },
            { label: "Forest",    hex: "#1A3A2E", cls: styles.swForest    },
            { label: "Dry Clay",  hex: "#EDD9B0", cls: styles.swClay      },
          ].map(({ label, hex, cls }) => (
            <div key={label} className={`${styles.swatch} ${cls}`}>
              <strong>{label}</strong>
              <code>{hex}</code>
            </div>
          ))}
        </div>
      </section>

      {/* ── Typography ── */}
      <section className={styles.section} id="type">
        <SectionHead
          kicker="Typography"
          title="Expressive, clear, and measured."
          intro="Use the display serif for high-emphasis brand moments and DM Sans for utility, body copy, interface labels, and documentation."
        />
        <div className={styles.typeSample}>
          <div className={styles.typeDisplay}>
            <p className={styles.typeDisplaySample}>Every language, every community.</p>
          </div>
          <div className={styles.typeBody}>
            <p className={styles.typeBodyP}>
              Namu builds speech-native models, datasets, and products that enable people to access
              technology through natural conversation in their own language. The typography should
              feel precise enough for research and warm enough for people.
            </p>
          </div>
        </div>
      </section>

      {/* ── Voice ── */}
      <section className={styles.section} id="voice">
        <SectionHead
          kicker="Voice"
          title="Speak with clarity and conviction."
          intro="Namu's voice is grounded, direct, and inclusive. We explain infrastructure through human access, and we avoid hype that makes the mission feel temporary."
        />
        <div className={styles.voiceGrid}>
          <div className={styles.writeCard}>
            <div className={`${styles.writeHead} ${styles.writeHeadGood}`}>Write this</div>
            <ul className={styles.writeCardUl}>
              <li>Making AI work for every language and every community.</li>
              <li>Technology should meet people where they are.</li>
              <li>Speech-native AI infrastructure for African languages.</li>
              <li>Access should not depend on speaking a global language.</li>
            </ul>
          </div>
          <div className={styles.writeCard}>
            <div className={`${styles.writeHead} ${styles.writeHeadBad}`}>Not this</div>
            <ul className={styles.writeCardUl}>
              <li>The next revolutionary AI platform for everyone.</li>
              <li>We are disrupting African language markets.</li>
              <li>Just translate everything into local languages.</li>
              <li>Low-resource users need simplified tools.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Applications ── */}
      <section className={styles.section} id="applications">
        <SectionHead
          kicker="Applications"
          title="The system in use."
          intro="Namu applications should feel calm, legible, and trustworthy. The brand should support the content rather than overpowering it."
        />
        <div className={styles.applicationsGallery}>
          <div className={styles.poster}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.posterLogo} src={SVG("logo/namu-logo-transparent-light.svg")} alt="Namu" />
            <div>
              <h3 className={styles.posterH3}>Speech-native AI for African languages.</h3>
              <p className={styles.posterP}>Models, datasets, and products designed around the way people naturally communicate.</p>
            </div>
          </div>
          <div className={styles.stack}>
            <div className={styles.miniApp}>
              <div className={styles.miniAppEyebrow}>Document cover</div>
              <h3 className={styles.miniAppH3}>Company overview</h3>
              <p className={styles.miniAppP}>A quiet page system for reports, briefs, and partner documents.</p>
            </div>
            <div className={`${styles.miniApp} ${styles.miniAppDark}`}>
              <div className={styles.miniAppEyebrow}>Presentation</div>
              <h3 className={styles.miniAppH3}>Making AI work for every language.</h3>
              <p className={styles.miniAppP}>Use high-contrast moments for pitches, talks, and strategic storytelling.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partnerships ── */}
      <section className={styles.section}>
        <SectionHead
          kicker="Partnerships"
          title="Using Namu with partners."
          intro="When Namu appears with another organization, keep the relationship clear. Do not imply endorsement, sponsorship, or product partnership unless formally approved."
        />
        <div className={styles.twoUp}>
          <div className={styles.card}>
            <h3 className={styles.cardH3}>Approved language</h3>
            <p className={styles.cardP}>
              Use "in partnership with Namu" only for active collaborations.
              Use "built with Namu technology" only when the integration has been reviewed and approved.
            </p>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardH3}>Lockups</h3>
            <p className={styles.cardP}>
              Partner lockups should use equal visual weight, generous spacing, and neutral alignment.
              Do not place Namu inside another brand's shape or color system.
            </p>
          </div>
        </div>
      </section>

      {/* ── Usage terms ── */}
      <section className={`${styles.section} ${styles.legalBg} ${styles.legalSection}`} id="usage-terms">
        <div className={styles.legalContent}>
          <h2 className={styles.legalH2}>Usage terms</h2>
          <p className={styles.legalP}>
            The term "Marks" includes anything we use to identify our goods or services, including our
            names, logos, icons, wordmarks, visual identity, and design elements. By using Namu's Marks,
            you agree that Namu owns them and that any goodwill generated by your use benefits Namu.
          </p>
          <p className={styles.legalP}>Permission to use our Marks is limited in the following ways:</p>
          <ul className={styles.legalUl}>
            {[
              "Only use our Marks if they adhere to these brand guidelines.",
              "The permission we grant is non-exclusive and non-transferable.",
              "Do not feature our Marks more prominently than your own company's name or marks.",
              "Do not imply endorsement, partnership, sponsorship, or approval unless Namu has formally authorized it.",
              "We may update this guide, review uses of our Marks, require changes, or end permission at any time.",
            ].map((item) => (
              <li key={item} className={styles.legalLi}>{item}</li>
            ))}
          </ul>
          <p className={styles.legalP}>
            Please make sure your product, communication, dataset, model, application, or public material
            describes Namu accurately and does not confuse people about your relationship with Namu.
            Do not use Namu's name, logo, Blossom, wordmark, or other Marks in your app, product,
            developer, organization, or company name unless you have written permission from Namu.
          </p>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className={`${styles.section} ${styles.legalBg} ${styles.legalSection}`} id="contact">
        <div className={styles.legalContent}>
          <h2 className={styles.legalH2}>Contact</h2>
          <p className={styles.legalP}>
            For legal inquiries, please contact{" "}
            <a href="mailto:legal@namuai.org" className={styles.legalA}>legal@namuai.org</a>.
          </p>
          <p className={styles.legalP}>
            For everything else, including permission requests for the use of our logos, questions
            about these guidelines, or communications that go beyond the cases outlined above,
            please contact{" "}
            <a href="mailto:legal@namuai.org" className={styles.legalA}>legal@namuai.org</a>.
          </p>
        </div>
      </section>

      <Footer />

    </div>
  );
}
