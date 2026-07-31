"use client";

/* eslint-disable @next/next/no-img-element -- every image here is a static
   asset in /public. next/image cannot optimise the SVG marks, and the mockup
   JPGs are already sized for their stages. */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { BgFade } from "@/components/editorial/BgFade";
import { Footer } from "@/components/editorial/Footer";
import { ScrollObject } from "@/components/editorial/ScrollObject";
import { SplitText } from "@/components/editorial/SplitText";
import { clamp, useRafScroll } from "@/hooks/useRafScroll";
import styles from "./brand.module.css";

const SVG = (p: string) => `/brand/namu%20branding/svg/${p}`;
const SHOT = (f: string) => `/brand/public/Namu/${f}`;

/* Page background per section. Every section declares one so the handover is
   always defined — a section with no colour of its own would inherit whichever
   one happened to be set last and the rhythm would stall. */
const PAPER = "#FFFAF1";
const HARMATTAN = "#F7F0E3";
const CLAY = "#EDD9B0";
const CLAY_TEXT = "#4A2A12";

/* ── Scroll progress ───────────────────────────────────────────────────────
   A hairline in the right-hand gutter. This document is long and otherwise
   gives no sense of how much of it is left. */
function ProgressRail() {
  const fillRef = useRef<HTMLDivElement>(null);

  useRafScroll((scrollY) => {
    const el = fillRef.current;
    if (!el) return;
    const runway = document.documentElement.scrollHeight - window.innerHeight;
    el.style.transform = `scaleY(${runway > 0 ? clamp(scrollY / runway) : 0})`;
  });

  return (
    <div className={styles.progress} aria-hidden="true">
      <div ref={fillRef} className={styles.progressFill} />
    </div>
  );
}

/* ── Section scaffold ──────────────────────────────────────────────────── */

function Section({
  id,
  index,
  kicker,
  title,
  intro,
  bg,
  text,
  children,
}: {
  id: string;
  index: string;
  kicker: string;
  title: string;
  intro?: string;
  bg: string;
  text?: string;
  children?: ReactNode;
}) {
  return (
    <BgFade bg={bg} text={text}>
      <section id={id} className={styles.section}>
        <div className="ds-container ds-outer">
          <ScrollObject className={styles.head}>
            <div className={styles.headMeta}>
              <span className={`text-small ${styles.index}`}>{index}</span>
              <span className={`text-small ${styles.kicker}`}>{kicker}</span>
            </div>
            <div className={styles.headBody}>
              <h2 className={`h5 ${styles.title}`}>
                <SplitText text={title} />
              </h2>
              {intro ? (
                <p className={`text-regular ${styles.intro}`} data-fade>
                  {intro}
                </p>
              ) : null}
            </div>
          </ScrollObject>
          {children ? <div className={styles.body}>{children}</div> : null}
        </div>
      </section>
    </BgFade>
  );
}

/* ── Colour ────────────────────────────────────────────────────────────── */

function Swatch({ name, hex, note }: { name: string; hex: string; note: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      className={styles.swatch}
      style={{ "--sw": hex } as React.CSSProperties}
      onClick={() => {
        navigator.clipboard?.writeText(hex).then(
          () => setCopied(true),
          () => {},
        );
      }}
      aria-label={`Copy ${name} ${hex}`}
    >
      <span className={styles.swatchChip} />
      <span className={styles.swatchMeta}>
        <strong className="text-large-alt">{name}</strong>
        <span className={`text-small ${styles.swatchHex}`}>
          {copied ? "Copied" : hex}
        </span>
        <span className={`text-small ${styles.swatchNote}`}>{note}</span>
      </span>
    </button>
  );
}

/* ── Do / Don't example ────────────────────────────────────────────────── */

function Example({
  verdict,
  caption,
  stage,
  children,
}: {
  verdict: "do" | "dont";
  caption: string;
  stage?: string;
  children: ReactNode;
}) {
  return (
    <figure className={`${styles.example} slide-up`}>
      <div className={`${styles.exampleStage} ${stage ?? ""}`}>
        {children}
        <span
          className={`${styles.verdict} ${
            verdict === "do" ? styles.verdictDo : styles.verdictDont
          }`}
          aria-hidden="true"
        >
          {verdict === "do" ? "✓" : "✕"}
        </span>
      </div>
      <figcaption className={`text-small ${styles.exampleCaption}`}>
        <strong>{verdict === "do" ? "Do" : "Don't"}</strong> {caption}
      </figcaption>
    </figure>
  );
}

/* ── Gallery ───────────────────────────────────────────────────────────── */

const TILES = [
  { src: SHOT("1ee9fbb5-4d83-4dfa-bc8f-eb6ef1886b33.jpg"), alt: "Namu tote bag", tall: true },
  { src: SHOT("727ee443-42f1-44bd-8a1e-21439e0f8836.jpg"), alt: "Namu stationery and desk objects", tall: false },
  { src: SHOT("8bf76e1a-a6b5-48c5-a19b-608765eda325.jpg"), alt: "Namu business cards", tall: false },
  { src: SHOT("b75ed8f0-5194-4b65-a315-19b9957bcde4.jpg"), alt: "Namu card and pen", tall: false },
  { src: SHOT("4a5f465b-6fbb-4fa7-8bde-658ae98091ea.jpg"), alt: "Namu vertical brand application", tall: true },
  { src: SHOT("bc41d20a-79de-4580-8752-430cd0f8d5c2.jpg"), alt: "Namu vertical mockup", tall: true },
  { src: SHOT("e80c3dda-fe2b-4c3b-b48b-d87f10888f41.jpg"), alt: "Namu printed brand item", tall: true },
  { src: SHOT("ee4173f2-7cdf-4f24-8a78-76588280d51c.jpg"), alt: "Namu landscape mockup", tall: false },
];

function Gallery() {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = () => {
    const rail = railRef.current;
    if (!rail) return;
    setAtStart(rail.scrollLeft < 8);
    setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8);
  };

  useEffect(sync, []);

  const nudge = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const first = rail.firstElementChild as HTMLElement | null;
    const step = first ? first.getBoundingClientRect().width + 18 : rail.clientWidth;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <>
      <div className={styles.galleryControls}>
        <button
          type="button"
          className={styles.galleryControl}
          onClick={() => nudge(-1)}
          disabled={atStart}
          aria-label="Previous"
        >
          ←
        </button>
        <button
          type="button"
          className={styles.galleryControl}
          onClick={() => nudge(1)}
          disabled={atEnd}
          aria-label="Next"
        >
          →
        </button>
      </div>

      <div ref={railRef} className={styles.galleryRail} onScroll={sync}>
        {TILES.map((t) => (
          <figure
            key={t.src}
            className={`${styles.tile} ${t.tall ? styles.tileTall : styles.tileWide}`}
          >
            <img src={t.src} alt={t.alt} loading="lazy" />
          </figure>
        ))}
      </div>
    </>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */

export function BrandPage() {
  const [agreed, setAgreed] = useState(false);

  return (
    <>
      <ProgressRail />

      <main id="main-content" className={styles.page}>
        {/* ── Hero ── */}
        <BgFade bg={PAPER}>
          <header className={styles.hero}>
            <div className="ds-container ds-outer">
              <p className={`text-small ${styles.heroEyebrow}`}>
                Namu — visual identity
              </p>

              <h1 className={`h1 ${styles.heroTitle}`}>
                <SplitText
                  immediate
                  srText="Brand guidelines"
                  lines={["Brand", <em key="g">guidelines</em>]}
                />
              </h1>

              <ScrollObject className={styles.heroLead}>
                <p className="text-large" data-fade>
                  Namu is an African AI research and technology company building
                  speech-native models, datasets, and products that make
                  technology accessible through natural conversation in every
                  language and every community.
                </p>
              </ScrollObject>

              <ScrollObject className={styles.heroStage}>
                <div className={styles.heroStageInner}>
                  <img
                    className={styles.heroWordmark}
                    src={SVG("logo/namu-logo-transparent-dark.svg")}
                    alt="The Namu wordmark"
                  />
                </div>
                <div className={`text-small ${styles.heroStageMeta}`}>
                  <span>Primary wordmark</span>
                  <span>SVG · PNG</span>
                </div>
              </ScrollObject>
            </div>
          </header>
        </BgFade>

        {/* ── 01 Introduction ── */}
        <Section
          id="introduction"
          index="01"
          kicker="Introduction"
          title="Who these guidelines are for."
          bg={PAPER}
        >
          <ScrollObject className={styles.statement}>
            <p className={`h6 ${styles.statementLead} slide-up`}>
              The &ldquo;Namu&rdquo; name, the Namu logo, the Namu wordmark, the
              Blossom, and other Namu trademarks are property of Namu.
            </p>
            <p className={`text-regular ${styles.statementBody} slide-up`}>
              These guidelines are intended to help our partners, customers,
              developers, collaborators, publishers, and any other third parties
              understand how to use and display our trademarks, visual identity,
              and copyrighted work in their own assets and materials.
            </p>
          </ScrollObject>
        </Section>

        {/* ── 02 Foundation ── */}
        <Section
          id="foundation"
          index="02"
          kicker="Brand foundation"
          title="A brand built for language, access, and trust."
          intro="Namu's identity should feel precise, grounded, and human. It carries the seriousness of infrastructure and the warmth of community: technology that does not ask people to become someone else before they can participate."
          bg={HARMATTAN}
        >
          <ScrollObject className={styles.pillars}>
            {[
              { idx: "01", title: "Native", body: "We start by deeply understanding the languages, cultures, and realities of the communities we serve." },
              { idx: "02", title: "Access", body: "Language should never be a barrier to knowledge, opportunity, or participation." },
              { idx: "03", title: "Together", body: "We succeed when communities, partners, and team members grow alongside us." },
            ].map((c, i) => (
              <article
                key={c.idx}
                className={`${styles.pillar} slide-up`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <span className={`text-small ${styles.pillarIdx}`}>{c.idx}</span>
                <h3 className="h7">{c.title}</h3>
                <p className={`text-regular ${styles.pillarBody}`}>{c.body}</p>
              </article>
            ))}
          </ScrollObject>
        </Section>

        {/* ── 03 Logo ── */}
        <Section
          id="logo"
          index="03"
          kicker="Logo"
          title="Wordmark and symbol."
          intro="The Namu wordmark is the primary expression of the brand. Use the full wordmark for most communications. Use the icon only when space is limited, or when Namu is already clearly identified."
          bg={PAPER}
        >
          <ScrollObject className={styles.assetPair}>
            <figure className={`${styles.asset} slide-up`}>
              <div className={styles.assetStage}>
                <img src={SVG("logo/namu-logo-transparent-dark.svg")} alt="Namu wordmark in dark ink" />
              </div>
              <figcaption className={`text-small ${styles.assetMeta}`}>
                <strong>Primary wordmark</strong>
                <span>Light backgrounds</span>
              </figcaption>
            </figure>

            <figure className={`${styles.asset} slide-up`} style={{ "--i": 1 } as React.CSSProperties}>
              <div className={`${styles.assetStage} ${styles.stageInk}`}>
                <img src={SVG("logo/namu-logo-transparent-light.svg")} alt="Namu wordmark reversed out of ink" />
              </div>
              <figcaption className={`text-small ${styles.assetMeta}`}>
                <strong>Reverse wordmark</strong>
                <span>Dark backgrounds</span>
              </figcaption>
            </figure>
          </ScrollObject>

          <ScrollObject className={styles.assetTrio}>
            {[
              { src: SVG("icon/namu-icon-transparent-dark.svg"), stage: "", name: "Icon", note: "Transparent", alt: "Namu icon" },
              { src: SVG("icon/namu-icon-on-ink.svg"), stage: styles.stageForest, name: "App mark", note: "Depth contexts", alt: "Namu icon on a dark ground" },
              { src: SVG("icon/namu-icon-app-on-sahel.svg"), stage: styles.stageSahel, name: "Accent mark", note: "High emphasis", alt: "Namu app icon on Sahel orange" },
            ].map((a, i) => (
              <figure
                key={a.name}
                className={`${styles.asset} slide-up`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className={`${styles.assetStage} ${styles.assetStageSquare} ${a.stage}`}>
                  <img src={a.src} alt={a.alt} />
                </div>
                <figcaption className={`text-small ${styles.assetMeta}`}>
                  <strong>{a.name}</strong>
                  <span>{a.note}</span>
                </figcaption>
              </figure>
            ))}
          </ScrollObject>

          <div className={styles.download}>
            <label className={styles.agree}>
              <input
                type="checkbox"
                className={styles.agreeBox}
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span className={`text-small ${styles.agreeText}`}>
                By using our logos, you agree to our Marks{" "}
                <a href="#usage-terms" className="link-underline">
                  usage terms
                </a>
                .
              </span>
            </label>

            <a
              href="/brand/namu%20branding/README.txt"
              target="_blank"
              rel="noreferrer"
              aria-disabled={!agreed}
              tabIndex={agreed ? 0 : -1}
              className={`${styles.downloadAction} ${!agreed ? styles.downloadOff : ""}`}
              onClick={(e) => {
                if (!agreed) e.preventDefault();
              }}
            >
              Download logos
            </a>
          </div>
        </Section>

        {/* ── 04 Clear space ── */}
        <Section
          id="clear-space"
          index="04"
          kicker="Clear space"
          title="Give the mark room to speak."
          intro="The logo should never feel crowded. Keep a generous margin around the wordmark and avoid placing it inside busy visual areas."
          bg={HARMATTAN}
        >
          <ScrollObject className={styles.clear}>
            <div className={`${styles.clearDiagram} slide-up`}>
              <div className={styles.clearFrame}>
                <img src={SVG("logo/namu-logo-transparent-dark.svg")} alt="The Namu wordmark with its minimum clear space marked" />
              </div>
              <span className={`text-small ${styles.clearTick}`}>1×</span>
            </div>

            <div className={`${styles.clearNote} slide-up`} style={{ "--i": 1 } as React.CSSProperties}>
              <h3 className="h7">Minimum clear space</h3>
              <p className={`text-regular ${styles.clearP}`}>
                Use at least the height of the orange dot as a minimum margin
                around the mark. For premium layouts, use more space than the
                minimum. The Namu identity is strongest when it is quiet,
                legible, and allowed to breathe.
              </p>
              <p className={`text-regular ${styles.clearP}`}>
                Do not rebuild, redraw, stretch, recolor, or crop the logo.
                Always use approved assets from the brand folder.
              </p>
            </div>
          </ScrollObject>
        </Section>

        {/* ── 05 Dos and Don'ts ── */}
        <Section
          id="rules"
          index="05"
          kicker="Dos and Don'ts"
          title="How the marks behave."
          intro="The marks are drawn once and used as drawn. Everything below is a real failure we would rather not see in the wild."
          bg={PAPER}
        >
          <ScrollObject className={styles.rules}>
            <h3 className={`text-small ${styles.rulesLabel}`}>The Blossom</h3>
            <div className={styles.rulesGrid}>
              <Example verdict="dont" caption="add any colors to the Blossom">
                <img className={`${styles.mark} ${styles.markRecolored}`} src={SVG("icon/namu-icon-transparent-dark.svg")} alt="" />
              </Example>

              <Example verdict="dont" caption="use the Blossom as the primary branding">
                <img className={styles.mark} src={SVG("icon/namu-icon-transparent-dark.svg")} alt="" />
              </Example>

              <Example verdict="dont" caption="add any unauthorized elements">
                <span className={styles.seal}>
                  <span className={`text-small ${styles.sealTop}`}>NAMU RESEARCH</span>
                  <img src={SVG("icon/namu-icon-transparent-dark.svg")} alt="" />
                  <span className={`text-small ${styles.sealBottom}`}>EST. 2026 NIGER</span>
                </span>
              </Example>

              <Example verdict="dont" caption="use the Blossom over a busy image" stage={styles.stageBusy}>
                <img className={styles.mark} src={SVG("icon/namu-icon-transparent-light.svg")} alt="" />
              </Example>

              <Example verdict="do" caption="use the established spacing rules">
                <span className={styles.spacing}>
                  <span className={`${styles.spacingDot} ${styles.dotTop}`} />
                  <span className={`${styles.spacingDot} ${styles.dotRight}`} />
                  <span className={`${styles.spacingDot} ${styles.dotBottom}`} />
                  <span className={`${styles.spacingDot} ${styles.dotLeft}`} />
                  <img src={SVG("icon/namu-icon-transparent-dark.svg")} alt="" />
                </span>
              </Example>

              <Example verdict="do" caption="use the Blossom with lots of open space" stage={styles.stageMist}>
                <span className={styles.openSpace}>
                  <img src={SVG("icon/namu-icon-transparent-dark.svg")} alt="" />
                </span>
              </Example>
            </div>
          </ScrollObject>

          <ScrollObject className={styles.rules}>
            <h3 className={`text-small ${styles.rulesLabel}`}>The wordmark</h3>
            <div className={styles.rulesGrid}>
              <Example verdict="dont" caption="stretch or alter the wordmark in any way">
                <span className={styles.stretched}>
                  <img src={SVG("icon/namu-icon-transparent-dark.svg")} alt="" />
                  <span>namu</span>
                </span>
              </Example>

              <Example verdict="dont" caption="use the Blossom as the primary branding">
                <img className={styles.markSmall} src={SVG("icon/namu-icon-transparent-dark.svg")} alt="" />
              </Example>

              <Example verdict="dont" caption="crop wordmarks">
                <span className={styles.cropped}>
                  <img src={SVG("logo/namu-logo-transparent-dark.svg")} alt="" />
                </span>
              </Example>

              <Example verdict="dont" caption="use wordmarks as masks">
                <span className={styles.masked}>Namu</span>
              </Example>

              <Example verdict="dont" caption="use any unapproved variations">
                <span className={styles.altWord}>Namu</span>
              </Example>

              <Example verdict="dont" caption="use any effects or textures">
                <img className={`${styles.wordmark} ${styles.shadowed}`} src={SVG("logo/namu-logo-transparent-dark.svg")} alt="" />
              </Example>
            </div>
          </ScrollObject>
        </Section>

        {/* ── 06 Gallery ── */}
        <Section
          id="gallery"
          index="06"
          kicker="Gallery"
          title="The identity, applied."
          bg={CLAY}
          text={CLAY_TEXT}
        >
          <Gallery />
        </Section>

        {/* ── 07 Colour ── */}
        <Section
          id="color"
          index="07"
          kicker="Color"
          title="Warmth, depth, and restraint."
          intro="Namu's palette is designed for editorial clarity and cultural warmth. Harmattan cream and Ink carry the system; Sahel, Kola, Forest, and Dry Clay add emphasis and depth."
          bg={PAPER}
        >
          <ScrollObject className={styles.palette}>
            {[
              { name: "Harmattan", hex: "#F7F0E3", note: "Raised surface" },
              { name: "Ink", hex: "#1C1410", note: "Deepest contrast" },
              { name: "Sahel", hex: "#E8935A", note: "Accent" },
              { name: "Kola", hex: "#6B3E1E", note: "Primary text" },
              { name: "Forest", hex: "#1A3A2E", note: "Inverted sections" },
              { name: "Dry Clay", hex: "#EDD9B0", note: "Sand surface" },
            ].map((c) => (
              <Swatch key={c.name} {...c} />
            ))}
          </ScrollObject>
          <p className={`text-small ${styles.paletteHint}`}>
            Click a swatch to copy its hex.
          </p>
        </Section>

        {/* ── 08 Typography ── */}
        <Section
          id="type"
          index="08"
          kicker="Typography"
          title="Expressive, clear, and measured."
          intro="Use the display serif for high-emphasis brand moments and the mono for utility, interface labels, and documentation."
          bg={HARMATTAN}
        >
          <ScrollObject className={styles.specimen}>
            <div className={styles.specimenRow} data-fade>
              <span className={`text-small ${styles.specimenLabel}`}>Display · Newsreader</span>
              <p className={`h4 ${styles.specimenDisplay}`}>
                Every language, every community.
              </p>
            </div>

            <div className={styles.specimenScale} data-fade>
              {"AaBbCcDdEeFfGgHh"}
            </div>

            <div className={styles.specimenRow} data-fade>
              <span className={`text-small ${styles.specimenLabel}`}>Body · Newsreader</span>
              <p className={`text-regular ${styles.specimenBody}`}>
                Namu builds speech-native models, datasets, and products that
                enable people to access technology through natural conversation
                in their own language. The typography should feel precise enough
                for research and warm enough for people.
              </p>
            </div>

            <div className={styles.specimenRow} data-fade>
              <span className={`text-small ${styles.specimenLabel}`}>Utility · Red Hat Mono</span>
              <p className={`text-caption ${styles.specimenMono}`}>
                MODEL CARD / DATASET / EVALUATION / RELEASE NOTES
              </p>
            </div>
          </ScrollObject>
        </Section>

        {/* ── 09 Voice ── */}
        <Section
          id="voice"
          index="09"
          kicker="Voice"
          title="Speak with clarity and conviction."
          intro="Namu's voice is grounded, direct, and inclusive. We explain infrastructure through human access, and we avoid hype that makes the mission feel temporary."
          bg={PAPER}
        >
          <ScrollObject className={styles.voice}>
            <div className={`${styles.voiceCard} ${styles.voiceGood} slide-up`}>
              <h3 className={`text-small ${styles.voiceHead}`}>Write this</h3>
              <ul className={styles.voiceList}>
                {[
                  "Making AI work for every language and every community.",
                  "Technology should meet people where they are.",
                  "Speech-native AI infrastructure for African languages.",
                  "Access should not depend on speaking a global language.",
                ].map((l) => (
                  <li key={l} className="text-regular">{l}</li>
                ))}
              </ul>
            </div>

            <div className={`${styles.voiceCard} ${styles.voiceBad} slide-up`} style={{ "--i": 1 } as React.CSSProperties}>
              <h3 className={`text-small ${styles.voiceHead}`}>Not this</h3>
              <ul className={styles.voiceList}>
                {[
                  "The next revolutionary AI platform for everyone.",
                  "We are disrupting African language markets.",
                  "Just translate everything into local languages.",
                  "Low-resource users need simplified tools.",
                ].map((l) => (
                  <li key={l} className="text-regular">{l}</li>
                ))}
              </ul>
            </div>
          </ScrollObject>
        </Section>

        {/* ── 10 Applications ── */}
        <Section
          id="applications"
          index="10"
          kicker="Applications"
          title="The system in use."
          intro="Namu applications should feel calm, legible, and trustworthy. The brand should support the content rather than overpowering it."
          bg="#F7ECD9"
        >
          <ScrollObject className={styles.applications}>
            <article className={`${styles.poster} slide-up`}>
              <img className={styles.posterLogo} src={SVG("logo/namu-logo-transparent-light.svg")} alt="Namu" />
              <div>
                <h3 className="h6">Speech-native AI for African languages.</h3>
                <p className={`text-regular ${styles.posterP}`}>
                  Models, datasets, and products designed around the way people
                  naturally communicate.
                </p>
              </div>
            </article>

            <div className={styles.stack}>
              <article className={`${styles.mini} slide-up`} style={{ "--i": 1 } as React.CSSProperties}>
                <span className={`text-small ${styles.miniEyebrow}`}>Document cover</span>
                <h3 className="h7">Company overview</h3>
                <p className={`text-regular ${styles.miniP}`}>
                  A quiet page system for reports, briefs, and partner documents.
                </p>
              </article>

              <article className={`${styles.mini} ${styles.miniDark} slide-up`} style={{ "--i": 2 } as React.CSSProperties}>
                <span className={`text-small ${styles.miniEyebrow}`}>Presentation</span>
                <h3 className="h7">Making AI work for every language.</h3>
                <p className={`text-regular ${styles.miniP}`}>
                  Use high-contrast moments for pitches, talks, and strategic
                  storytelling.
                </p>
              </article>
            </div>
          </ScrollObject>
        </Section>

        {/* ── 11 Partnerships ── */}
        <Section
          id="partnerships"
          index="11"
          kicker="Partnerships"
          title="Using Namu with partners."
          intro="When Namu appears with another organization, keep the relationship clear. Do not imply endorsement, sponsorship, or product partnership unless formally approved."
          bg={PAPER}
        >
          <ScrollObject className={styles.pair}>
            <article className={`${styles.note} slide-up`}>
              <h3 className="h7">Approved language</h3>
              <p className={`text-regular ${styles.noteP}`}>
                Use &ldquo;in partnership with Namu&rdquo; only for active
                collaborations. Use &ldquo;built with Namu technology&rdquo; only
                when the integration has been reviewed and approved.
              </p>
            </article>

            <article className={`${styles.note} slide-up`} style={{ "--i": 1 } as React.CSSProperties}>
              <h3 className="h7">Lockups</h3>
              <p className={`text-regular ${styles.noteP}`}>
                Partner lockups should use equal visual weight, generous spacing,
                and neutral alignment. Do not place Namu inside another
                brand&apos;s shape or color system.
              </p>
            </article>
          </ScrollObject>
        </Section>

        {/* ── 12 Usage terms ── */}
        <Section
          id="usage-terms"
          index="12"
          kicker="Legal"
          title="Usage terms."
          bg={HARMATTAN}
        >
          <ScrollObject className={styles.legal}>
            <p className={`text-regular ${styles.legalP}`} data-fade>
              The term &ldquo;Marks&rdquo; includes anything we use to identify
              our goods or services, including our names, logos, icons,
              wordmarks, visual identity, and design elements. By using
              Namu&apos;s Marks, you agree that Namu owns them and that any
              goodwill generated by your use benefits Namu.
            </p>
            <p className={`text-regular ${styles.legalP}`} data-fade>
              Permission to use our Marks is limited in the following ways:
            </p>
            <ol className={styles.legalList} data-fade>
              {[
                "Only use our Marks if they adhere to these brand guidelines.",
                "The permission we grant is non-exclusive and non-transferable.",
                "Do not feature our Marks more prominently than your own company's name or marks.",
                "Do not imply endorsement, partnership, sponsorship, or approval unless Namu has formally authorized it.",
                "We may update this guide, review uses of our Marks, require changes, or end permission at any time.",
              ].map((item) => (
                <li key={item} className="text-regular">{item}</li>
              ))}
            </ol>
            <p className={`text-regular ${styles.legalP}`} data-fade>
              Please make sure your product, communication, dataset, model,
              application, or public material describes Namu accurately and does
              not confuse people about your relationship with Namu. Do not use
              Namu&apos;s name, logo, Blossom, wordmark, or other Marks in your
              app, product, developer, organization, or company name unless you
              have written permission from Namu.
            </p>
          </ScrollObject>
        </Section>

        {/* ── 13 Contact ── */}
        <Section
          id="contact"
          index="13"
          kicker="Contact"
          title="Talk to us."
          bg={PAPER}
        >
          <ScrollObject className={styles.legal}>
            <p className={`text-regular ${styles.legalP}`} data-fade>
              For legal inquiries, please contact{" "}
              <a href="mailto:legal@namuai.org" className="link-underline">
                legal@namuai.org
              </a>
              .
            </p>
            <p className={`text-regular ${styles.legalP}`} data-fade>
              For everything else — including permission requests for the use of
              our logos, questions about these guidelines, or communications that
              go beyond the cases outlined above — please contact{" "}
              <a href="mailto:legal@namuai.org" className="link-underline">
                legal@namuai.org
              </a>
              .
            </p>
          </ScrollObject>
        </Section>
      </main>

      <Footer />
    </>
  );
}
