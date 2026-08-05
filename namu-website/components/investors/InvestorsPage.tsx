"use client";

import Link from "next/link";
import { Button } from "@/components/editorial/Button";
import { Footer } from "@/components/editorial/Footer";
import { ArrowUpRight } from "@/components/editorial/icons";
import { ScrollObject } from "@/components/editorial/ScrollObject";
import { SplitText } from "@/components/editorial/SplitText";
import styles from "./investors.module.css";

/**
 * The case, laid out as a case.
 *
 * Investors read for the argument, so the middle of this page is three
 * numbered claims rather than a feature tour — each one a sentence you could
 * disagree with, followed by why we think it holds.
 */
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

/* Shipped, and each with a page on this site. */
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

/* Only figures this site already stands behind: four models with pages, eight
   dialects measured separately, one language taken seriously, and a company
   built where the language is spoken.

   Deliberately no traction, revenue, headcount or raise figures. Put them here
   when they are real — inventing them on an investor page is not the same kind
   of placeholder as an unshipped benchmark. */
const POSITION = [
  { value: "4", label: "Models shipped", note: "Interpret, Transcribe, Voice, Agent" },
  { value: "8", label: "Dialects measured", note: "Separately, across Niger" },
  { value: "2", label: "Languages carried", note: "Hausa and French" },
  { value: "1", label: "Language done properly", note: "Before we add a second" },
];

/* What the work needs, in the order it needs it. */
const PRIORITIES = [
  {
    title: "Data and evaluation",
    body: "Speech collected with the communities it comes from, on terms they set, and evaluation sets that measure the varieties people actually use rather than a clean-read average.",
  },
  {
    title: "Dialect coverage",
    body: "Eight dialects measured separately today. Every one we add is recorded, evaluated and reported on its own, because an average across Niger hides the varieties a model does worst on.",
  },
  {
    title: "Delivery on the channels people have",
    body: "A voice call on a basic handset reaches people an app never will. Getting the models onto those channels is as much of the work as training them.",
  },
  {
    title: "The team on the ground",
    body: "Namu is built where the language is spoken, close enough to hear quickly when something is wrong.",
  },
];

export function InvestorsPage() {
  return (
    <>
      <main id="main-content">
        {/* ---- Hero ---------------------------------------------------- */}
        {/* Typographic rather than photographic. Every other page here opens
            on a full-bleed image; this one opens on the argument, which is
            what the reader came for. */}
        <section className={styles.hero}>
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
                <Button href="mailto:contact@namuai.org">Get in touch</Button>
              </div>
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

        {/* ---- Where we are -------------------------------------------- */}
        <section className={styles.built}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.blockHead}>
              <h2 className={`h6 ${styles.kicker}`}>
                <SplitText text="Where we are" />
              </h2>
              <p className={`h4 ${styles.blockTitle}`}>
                <SplitText delay={0.15} text="Four models, all of them shipped." />
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

            <ScrollObject className={styles.position}>
              {POSITION.map((p, i) => (
                <div
                  key={p.label}
                  className={`slide-up ${styles.stat}`}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <p className={styles.statValue}>{p.value}</p>
                  <p className={`text-regular ${styles.statLabel}`}>{p.label}</p>
                  <p className={styles.statNote}>{p.note}</p>
                </div>
              ))}
            </ScrollObject>
          </div>
        </section>

        {/* ---- What the work needs ------------------------------------- */}
        <section className={styles.priorities}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.blockHead}>
              <h2 className={`h6 ${styles.kicker}`}>
                <SplitText text="What the work needs" />
              </h2>
              <p className={`h4 ${styles.blockTitle}`}>
                <SplitText delay={0.15} text="Where the next round goes." />
              </p>
            </ScrollObject>

            <div className={styles.rows}>
              {PRIORITIES.map((p, i) => (
                <ScrollObject key={p.title} className={styles.row}>
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
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.contactInner}>
              <h2 className={`h3 ${styles.contactTitle}`}>
                <SplitText text="Talk to us" />
              </h2>
              <p className={`text-large ${styles.contactLede}`}>
                <SplitText
                  delay={0.15}
                  text="We are glad to walk through the models, the evaluation, and what we are building next."
                />
              </p>
              <div
                className={`slide-up ${styles.contactCta}`}
                style={{ "--i": 2 } as React.CSSProperties}
              >
                <Button href="mailto:contact@namuai.org">contact@namuai.org</Button>
              </div>
            </ScrollObject>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
