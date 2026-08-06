"use client";

import Link from "next/link";
import { Button } from "@/components/editorial/Button";
import { Footer } from "@/components/editorial/Footer";
import { ArrowUpRight } from "@/components/editorial/icons";
import { ScrollObject } from "@/components/editorial/ScrollObject";
import { SplitText } from "@/components/editorial/SplitText";
import { CountUp } from "./CountUp";
import { GrowthChart, type Point } from "./GrowthChart";
import { ReachMap } from "./ReachMap";
import styles from "./investors.module.css";

/* ==========================================================================
   PLACEHOLDER FIGURES
   --------------------------------------------------------------------------
   Every number in HEADLINE, VOLUME and ROUND below is invented, at the
   founder's request, so the page can be designed before the real reporting
   exists. They are plausible rather than arbitrary, which is exactly what
   makes them dangerous to forget.

   Replace them before this page is shown to anyone. The figures that are NOT
   invented are the four shipped models and the eight dialects, both of which
   the rest of this site already stands behind.
   ========================================================================== */

const HEADLINE = [
  { to: 1.2, decimals: 1, suffix: "M", label: "Minutes of Hausa processed" },
  { to: 34, suffix: "%", label: "Growth, month on month" },
  { to: 240, suffix: "k", label: "People reached" },
  { to: 4, label: "Models in production" },
];

const VOLUME: Point[] = [
  { label: "Mar", value: 42 },
  { label: "Apr", value: 58 },
  { label: "May", value: 71 },
  { label: "Jun", value: 96 },
  { label: "Jul", value: 118 },
  { label: "Aug", value: 149 },
  { label: "Sep", value: 187 },
  { label: "Oct", value: 244 },
  { label: "Nov", value: 312 },
];

/* One line each. The argument is the headline; the sentence is the evidence. */
const THESIS = [
  {
    claim: "Nobody built speech AI for this language.",
    body: "Hausa is among the most spoken on the continent, and the systems people meet every day were not built to hear it.",
  },
  {
    claim: "Voice is the interface, not a feature.",
    body: "Where typing and literacy are barriers, speech is already how people use a phone.",
  },
  {
    claim: "One language, done properly.",
    body: "Eight dialects, each measured on its own. We widen only once that holds.",
  },
];

const BUILT = [
  { name: "Namu-Interpret", body: "Hausa and French, both ways", href: "/models/namu-interpret" },
  { name: "Namu-Transcribe", body: "Speech to accurate text", href: "/models/namu-transcribe" },
  { name: "Namu-Voice", body: "Text to natural speech", href: "/models/namu-voice" },
  { name: "Namu-Agent", body: "A whole call, end to end", href: "/models/namu-agent" },
];

/* Sectors, deliberately not named organisations: inventing a metric the
   founder asked for is one thing, inventing a named partner would put words in
   an identifiable third party's mouth. */
const SECTORS = [
  "Public health",
  "Radio and broadcast",
  "Agricultural cooperatives",
  "Microfinance and mobile money",
];

const ROUND = [
  { share: 40, title: "Data and evaluation" },
  { share: 25, title: "Dialect and language coverage" },
  { share: 20, title: "Delivery on low-bandwidth channels" },
  { share: 15, title: "Team on the ground" },
];

export function InvestorsPage() {
  return (
    <>
      <main id="main-content">
        {/* ---- Hero ---------------------------------------------------- */}
        {/* Full height and the image at full strength, as on the model pages.
            The scrim only goes as dark as the copy needs. */}
        <section className={styles.hero}>
          <div className={styles.heroMedia} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/inv2.jpeg"
              alt=""
              className={`${styles.heroImage} scale-out`}
              width={736}
              height={1104}
            />
          </div>

          <div className="ds-container ds-outer">
            <ScrollObject className={styles.heroInner}>
              <p className={`text-ui ${styles.heroEyebrow}`}>
                <SplitText immediate text="Investors" />
              </p>
              <h1 className={styles.heroTitle}>
                <SplitText
                  immediate
                  delay={0.1}
                  text="A language nobody built for."
                />
              </h1>
              <p className={`text-large ${styles.heroLede}`}>
                <SplitText
                  immediate
                  delay={0.25}
                  text="Namu builds speech models for African languages, starting with Hausa."
                />
              </p>

              <div
                className={`slide-up ${styles.heroCta}`}
                style={{ "--i": 2 } as React.CSSProperties}
              >
                <Button
                  href="mailto:contact@namuai.org?subject=Namu%20%E2%80%94%20investor%20enquiry"
                  variant="invert"
                >
                  Get in touch
                </Button>
                <a
                  href="mailto:contact@namuai.org?subject=Namu%20%E2%80%94%20deck%20request"
                  className={`text-ui ${styles.heroSecondary}`}
                >
                  Request the deck
                  <ArrowUpRight className={styles.arrow} />
                </a>
              </div>
            </ScrollObject>
          </div>
        </section>

        {/* ---- Headline numbers ---------------------------------------- */}
        <section className={styles.headline}>
          <div className="ds-container ds-outer">
            <div className={styles.headlineRow}>
              {HEADLINE.map((s) => (
                <ScrollObject key={s.label} className={styles.figure}>
                  <p className={styles.figureValue}>
                    <CountUp
                      to={s.to}
                      decimals={s.decimals}
                      suffix={s.suffix}
                    />
                  </p>
                  <p className={`text-ui ${styles.figureLabel}`}>{s.label}</p>
                </ScrollObject>
              ))}
            </div>
          </div>
        </section>

        {/* ---- The case ------------------------------------------------ */}
        <section className={styles.thesis}>
          <div className="ds-container ds-outer">
            <div className={styles.claims}>
              {THESIS.map((t, i) => (
                <ScrollObject key={t.claim} className={styles.claim}>
                  <span
                    className={`slide-up ${styles.claimNum}`}
                    style={{ "--i": 0 } as React.CSSProperties}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className={`${styles.claimTitle}`}>
                    <SplitText text={t.claim} />
                  </h2>
                  <p
                    className={`text-large slide-up ${styles.claimText}`}
                    style={{ "--i": 1 } as React.CSSProperties}
                  >
                    {t.body}
                  </p>
                </ScrollObject>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Reach --------------------------------------------------- */}
        {/* The page's signature: the coverage draws itself in. */}
        <section className={styles.reach}>
          <div className={styles.reachMedia} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/inv1.jpeg" alt="" className={styles.reachImage} />
          </div>

          <div className="ds-container ds-outer">
            <ScrollObject className={styles.reachHead}>
              <h2 className={styles.bigTitle}>
                <SplitText text="Eight dialects. Measured one by one." />
              </h2>
            </ScrollObject>

            <ReachMap />
          </div>
        </section>

        {/* ---- Traction ------------------------------------------------ */}
        <section className={styles.traction}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.tractionHead}>
              <h2 className={styles.bigTitle}>
                <SplitText text="Minutes of Hausa, every month." />
              </h2>
            </ScrollObject>

            <ScrollObject>
              <GrowthChart points={VOLUME} unit="thousands of minutes processed" />
            </ScrollObject>

            <ScrollObject className={styles.sectorRow}>
              {SECTORS.map((s, i) => (
                <span
                  key={s}
                  className={`text-ui slide-up ${styles.sectorChip}`}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  {s}
                </span>
              ))}
            </ScrollObject>
          </div>
        </section>

        {/* ---- What has shipped ---------------------------------------- */}
        <section className={styles.built}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.builtHead}>
              <h2 className={styles.bigTitle}>
                <SplitText text="Four models. All shipped." />
              </h2>
            </ScrollObject>

            <div className={styles.builtGrid}>
              {BUILT.map((m, i) => (
                <ScrollObject key={m.name} className={styles.builtCell}>
                  <Link
                    href={m.href}
                    className={`slide-up ${styles.builtCard}`}
                    style={{ "--i": i % 2 } as React.CSSProperties}
                  >
                    <span className={styles.builtName}>{m.name}</span>
                    <span className={`text-regular ${styles.builtBody}`}>{m.body}</span>
                    <ArrowUpRight className={styles.builtArrow} />
                  </Link>
                </ScrollObject>
              ))}
            </div>
          </div>
        </section>

        {/* ---- The round ----------------------------------------------- */}
        <section className={styles.round}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.roundHead}>
              <h2 className={styles.bigTitle}>
                <SplitText text="Where the money goes." />
              </h2>
            </ScrollObject>

            <div className={styles.rows}>
              {ROUND.map((p) => (
                <ScrollObject key={p.title} className={styles.row}>
                  <span className={styles.rowShare}>
                    <CountUp to={p.share} suffix="%" />
                  </span>
                  <span className={`${styles.rowTitle}`}>{p.title}</span>
                  {/* The share, drawn. Says what a pie chart would, in line. */}
                  <span className={styles.rowBar} aria-hidden="true">
                    <span
                      className={styles.rowBarFill}
                      style={{ "--w": `${p.share}%` } as React.CSSProperties}
                    />
                  </span>
                </ScrollObject>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Talk to us ---------------------------------------------- */}
        <section className={styles.contact}>
          <div className={styles.contactMedia} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/inv3.jpeg" alt="" className={styles.contactImage} />
          </div>

          <div className="ds-container ds-outer">
            <ScrollObject className={styles.contactInner}>
              <h2 className={styles.contactTitle}>
                <SplitText text="Talk to us" />
              </h2>

              <div className={styles.contactGrid}>
                <div
                  className={`slide-up ${styles.contactItem}`}
                  style={{ "--i": 0 } as React.CSSProperties}
                >
                  <span className={`text-caption ${styles.contactLabel}`}>Email</span>
                  <a
                    href="mailto:contact@namuai.org?subject=Namu%20%E2%80%94%20investor%20enquiry"
                    className={styles.contactValue}
                  >
                    contact@namuai.org
                  </a>
                </div>
                <div
                  className={`slide-up ${styles.contactItem}`}
                  style={{ "--i": 1 } as React.CSSProperties}
                >
                  <span className={`text-caption ${styles.contactLabel}`}>
                    Who you will speak to
                  </span>
                  <span className={styles.contactValue}>Mouhamad Mamane</span>
                  <span className={`text-caption ${styles.contactSub}`}>
                    Co-founder &amp; CEO
                  </span>
                </div>
                <div
                  className={`slide-up ${styles.contactItem}`}
                  style={{ "--i": 2 } as React.CSSProperties}
                >
                  <span className={`text-caption ${styles.contactLabel}`}>Based in</span>
                  <span className={styles.contactValue}>Niamey, Niger</span>
                  <span className={`text-caption ${styles.contactSub}`}>
                    Where the language is spoken
                  </span>
                </div>
              </div>

              <div
                className={`slide-up ${styles.contactCta}`}
                style={{ "--i": 3 } as React.CSSProperties}
              >
                <Button
                  href="mailto:contact@namuai.org?subject=Namu%20%E2%80%94%20deck%20request"
                  variant="invert"
                >
                  Request the deck
                </Button>
              </div>
            </ScrollObject>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
