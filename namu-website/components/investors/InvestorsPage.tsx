"use client";

import Link from "next/link";
import { Button } from "@/components/editorial/Button";
import { Footer } from "@/components/editorial/Footer";
import { ArrowUpRight } from "@/components/editorial/icons";
import { ScrollObject } from "@/components/editorial/ScrollObject";
import { SplitText } from "@/components/editorial/SplitText";
import { GrowthChart, type Point } from "./GrowthChart";
import styles from "./investors.module.css";

/* ==========================================================================
   PLACEHOLDER FIGURES
   --------------------------------------------------------------------------
   Every number in HEADLINE, VOLUME, USAGE and ROUND below is invented, at the
   founder's request, so the page can be designed before the real reporting
   exists. They are plausible rather than arbitrary, which is exactly what
   makes them dangerous to forget.

   Replace all four before this page is shown to anyone. The two figures that
   are NOT invented are marked where they appear: four shipped models and
   eight dialects, both of which the rest of this site already stands behind.
   ========================================================================== */

/* Scanned before anything else on the page, so it goes directly under the
   headline rather than further down. */
const HEADLINE = [
  { value: "1.2M", label: "Minutes of Hausa processed", note: "Cumulative, to date" },
  { value: "34%", label: "Month on month growth", note: "Trailing six months" },
  { value: "240k", label: "People reached", note: "Through partner channels" },
  { value: "4", label: "Models in production", note: "Not invented: all four ship today" },
];

/* Monthly volume. The shape is the argument; the figures under it are the
   precision. */
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

const USAGE = [
  { value: "71%", label: "Return within 30 days", note: "Of callers who complete a task" },
  { value: "14.1%", label: "Word error rate in the field", note: "Market and street recordings" },
  { value: "0.9s", label: "Median interpretation lag", note: "Speech in to speech out" },
  { value: "8", label: "Dialects measured separately", note: "Not invented: across Niger" },
];

/* Sectors, deliberately not named organisations. Inventing a metric the
   founder asked for is one thing; inventing a named partner would put words in
   an identifiable third party's mouth. */
const SECTORS = [
  {
    name: "Public health",
    body: "Vaccination schedules, clinic hours and follow-up, answered in Hausa on a call rather than posted on a board people cannot read.",
  },
  {
    name: "Radio and broadcast",
    body: "Bulletins transcribed and archived, with the proper nouns intact, so a station can search what it has already put on air.",
  },
  {
    name: "Agricultural cooperatives",
    body: "Prices, delivery windows and registration by voice, for members who transact daily and type rarely.",
  },
  {
    name: "Microfinance and mobile money",
    body: "Balance, repayment and dispute calls handled in the caller's own language, at a fraction of the cost of a person.",
  },
];

const THESIS = [
  {
    claim: "The languages most people speak have almost no working speech AI.",
    body: "Hausa is one of the most widely spoken languages on the continent. The speech systems people meet every day were not built to hear it, and the ones that claim to were measured on an average across dozens of languages rather than on this one.",
  },
  {
    claim: "Voice is the interface, not a feature on top of one.",
    body: "Where typing and literacy are barriers, speech is already how people use a phone. A model that works by voice reaches people no text interface will, on the handset they own rather than the one they would need to buy.",
  },
  {
    claim: "Depth is worth more than breadth.",
    body: "One language done properly is worth more than ten done poorly. We build and measure on Hausa across eight dialects of Niger, and widen only once that holds. It is the slower route and the one that produces something people keep using.",
  },
];

const BUILT = [
  {
    name: "Namu-Interpret",
    body: "Speech translation between Hausa and French, both directions.",
    href: "/models/namu-interpret",
  },
  {
    name: "Namu-Transcribe",
    body: "Hausa speech to accurate, domain-aware text.",
    href: "/models/namu-transcribe",
  },
  {
    name: "Namu-Voice",
    body: "Natural Hausa speech from written text.",
    href: "/models/namu-voice",
  },
  {
    name: "Namu-Agent",
    body: "A whole conversation in Hausa, over an ordinary phone call.",
    href: "/models/namu-agent",
  },
];

/* Allocation is invented along with the rest. The categories are real. */
const ROUND = [
  {
    share: "40%",
    title: "Data and evaluation",
    body: "Speech collected with the communities it comes from, on terms they set, and evaluation sets that measure the varieties people use rather than a clean-read average.",
  },
  {
    share: "25%",
    title: "Dialect and language coverage",
    body: "Every dialect we add is recorded, evaluated and reported on its own. Zarma and Kanuri follow Hausa.",
  },
  {
    share: "20%",
    title: "Delivery on low-bandwidth channels",
    body: "A voice call on a basic handset reaches people an app never will. Getting the models onto those channels is as much of the work as training them.",
  },
  {
    share: "15%",
    title: "Team on the ground",
    body: "Namu is built where the language is spoken, close enough to hear quickly when something is wrong.",
  },
];

export function InvestorsPage() {
  return (
    <>
      <main id="main-content">
        {/* ---- Hero ---------------------------------------------------- */}
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
                  text="AI that works for the people it was never built for."
                />
              </h1>
              <p className={`text-large ${styles.heroLede}`}>
                <SplitText
                  immediate
                  delay={0.25}
                  text="Namu builds speech models for African languages, starting with Hausa, and delivers them on the channels people already have."
                />
              </p>

              <div
                className={`slide-up ${styles.heroCta}`}
                style={{ "--i": 2 } as React.CSSProperties}
              >
                <Button href="mailto:contact@namuai.org?subject=Namu%20%E2%80%94%20investor%20enquiry">
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
            <ScrollObject className={styles.headlineRow}>
              {HEADLINE.map((s, i) => (
                <div
                  key={s.label}
                  className={`slide-up ${styles.figure}`}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <p className={styles.figureValue}>{s.value}</p>
                  <p className={`text-regular ${styles.figureLabel}`}>{s.label}</p>
                  <p className={styles.figureNote}>{s.note}</p>
                </div>
              ))}
            </ScrollObject>
          </div>
        </section>

        {/* ---- The case ------------------------------------------------ */}
        <section className={styles.thesis}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.blockHead}>
              <h2 className={`h6 ${styles.kicker}`}>
                <SplitText text="The case" />
              </h2>
            </ScrollObject>

            <div className={styles.claims}>
              {THESIS.map((t, i) => (
                <ScrollObject key={t.claim} className={styles.claim}>
                  <span
                    className={`slide-up ${styles.claimNum}`}
                    style={{ "--i": 0 } as React.CSSProperties}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={styles.claimBody}>
                    <h3 className={`h5 ${styles.claimTitle}`}>
                      <SplitText text={t.claim} />
                    </h3>
                    <p
                      className={`text-regular slide-up ${styles.claimText}`}
                      style={{ "--i": 1 } as React.CSSProperties}
                    >
                      {t.body}
                    </p>
                  </div>
                </ScrollObject>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Traction ------------------------------------------------ */}
        <section className={styles.traction}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.blockHead}>
              <h2 className={`h6 ${styles.kicker}`}>
                <SplitText text="Traction" />
              </h2>
              <p className={`h4 ${styles.blockTitle}`}>
                <SplitText delay={0.15} text="Minutes of Hausa, every month." />
              </p>
            </ScrollObject>

            <ScrollObject className={styles.chartWrap}>
              <GrowthChart points={VOLUME} unit="thousands of minutes processed" />
              <p className={`text-caption ${styles.chartNote}`}>
                Thousands of minutes processed per month across all four models.
              </p>
            </ScrollObject>

            <ScrollObject className={styles.usageRow}>
              {USAGE.map((s, i) => (
                <div
                  key={s.label}
                  className={`slide-up ${styles.usage}`}
                  style={{ "--i": i % 2 } as React.CSSProperties}
                >
                  <p className={styles.usageValue}>{s.value}</p>
                  <p className={`text-regular ${styles.usageLabel}`}>{s.label}</p>
                  <p className={styles.figureNote}>{s.note}</p>
                </div>
              ))}
            </ScrollObject>
          </div>
        </section>

        {/* ---- Where it is used ---------------------------------------- */}
        <section className={styles.sectors}>
          <div className={styles.sectorsMedia} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/inv1.jpeg" alt="" className={styles.sectorsImage} />
          </div>

          <div className="ds-container ds-outer">
            <ScrollObject className={styles.blockHead}>
              <h2 className={`h6 ${styles.kicker}`}>
                <SplitText text="Where it is used" />
              </h2>
              <p className={`h4 ${styles.blockTitle}`}>
                <SplitText
                  delay={0.15}
                  text="Four sectors where a call is still how business gets done."
                />
              </p>
            </ScrollObject>

            <div className={styles.sectorList}>
              {SECTORS.map((s, i) => (
                <ScrollObject key={s.name} className={styles.sector}>
                  <span
                    className={`slide-up ${styles.sectorNum}`}
                    style={{ "--i": 0 } as React.CSSProperties}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className={`text-large slide-up ${styles.sectorName}`}
                    style={{ "--i": 0 } as React.CSSProperties}
                  >
                    {s.name}
                  </h3>
                  <p
                    className={`text-regular slide-up ${styles.sectorBody}`}
                    style={{ "--i": 1 } as React.CSSProperties}
                  >
                    {s.body}
                  </p>
                </ScrollObject>
              ))}
            </div>
          </div>
        </section>

        {/* ---- What has shipped ---------------------------------------- */}
        <section className={styles.built}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.blockHead}>
              <h2 className={`h6 ${styles.kicker}`}>
                <SplitText text="What has shipped" />
              </h2>
              <p className={`h4 ${styles.blockTitle}`}>
                <SplitText delay={0.15} text="Four models, all of them in production." />
              </p>
            </ScrollObject>

            <ScrollObject className={styles.builtGrid}>
              {BUILT.map((m, i) => (
                <Link
                  key={m.name}
                  href={m.href}
                  className={`slide-up ${styles.builtCard}`}
                  style={{ "--i": i % 2 } as React.CSSProperties}
                >
                  <span className={`text-large ${styles.builtName}`}>{m.name}</span>
                  <span className={`text-regular ${styles.builtBody}`}>{m.body}</span>
                  <span className={`text-ui ${styles.builtLink}`}>
                    Read the model page
                    <ArrowUpRight className={styles.arrow} />
                  </span>
                </Link>
              ))}
            </ScrollObject>
          </div>
        </section>

        {/* ---- The round ----------------------------------------------- */}
        <section className={styles.round}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.blockHead}>
              <h2 className={`h6 ${styles.kicker}`}>
                <SplitText text="The round" />
              </h2>
              <p className={`h4 ${styles.blockTitle}`}>
                <SplitText delay={0.15} text="Where the money goes." />
              </p>
            </ScrollObject>

            <div className={styles.rows}>
              {ROUND.map((p) => (
                <ScrollObject key={p.title} className={styles.row}>
                  <span
                    className={`slide-up ${styles.rowShare}`}
                    style={{ "--i": 0 } as React.CSSProperties}
                  >
                    {p.share}
                  </span>
                  <h3
                    className={`text-large slide-up ${styles.rowTitle}`}
                    style={{ "--i": 0 } as React.CSSProperties}
                  >
                    {p.title}
                  </h3>
                  <p
                    className={`text-regular slide-up ${styles.rowBody}`}
                    style={{ "--i": 1 } as React.CSSProperties}
                  >
                    {p.body}
                  </p>
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
              <h2 className={`h3 ${styles.contactTitle}`}>
                <SplitText text="Talk to us" />
              </h2>
              <p className={`text-large ${styles.contactLede}`}>
                <SplitText
                  delay={0.15}
                  text="We are glad to walk through the models, the evaluation and the numbers behind them."
                />
              </p>

              {/* Everything needed to act, without hunting for it. */}
              <div className={styles.contactGrid}>
                <div
                  className={`slide-up ${styles.contactItem}`}
                  style={{ "--i": 0 } as React.CSSProperties}
                >
                  <span className={`text-caption ${styles.contactLabel}`}>Email</span>
                  <a
                    href="mailto:contact@namuai.org?subject=Namu%20%E2%80%94%20investor%20enquiry"
                    className={`text-large ${styles.contactValue}`}
                  >
                    contact@namuai.org
                  </a>
                </div>
                <div
                  className={`slide-up ${styles.contactItem}`}
                  style={{ "--i": 1 } as React.CSSProperties}
                >
                  <span className={`text-caption ${styles.contactLabel}`}>Who you will speak to</span>
                  <span className={`text-large ${styles.contactValue}`}>
                    Mouhamad Mamane
                  </span>
                  <span className={`text-caption ${styles.contactSub}`}>
                    Co-founder &amp; CEO
                  </span>
                </div>
                <div
                  className={`slide-up ${styles.contactItem}`}
                  style={{ "--i": 2 } as React.CSSProperties}
                >
                  <span className={`text-caption ${styles.contactLabel}`}>Based in</span>
                  <span className={`text-large ${styles.contactValue}`}>Niamey, Niger</span>
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
