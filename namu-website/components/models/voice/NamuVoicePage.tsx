"use client";

import Link from "next/link";
import { Button } from "@/components/editorial/Button";
import { Footer } from "@/components/editorial/Footer";
import { GradientField } from "@/components/editorial/GradientField";
import { ArrowUpRight } from "@/components/editorial/icons";
import { ScrollObject } from "@/components/editorial/ScrollObject";
import { SplitText } from "@/components/editorial/SplitText";
import { AudioSample } from "./AudioSample";
import { Check, Waveform } from "./icons";
import { LongFormHeading } from "./LongFormHeading";
import { SectionNav } from "./SectionNav";
import { VoiceEmotionGrid, type Emotion, type Voice } from "./VoiceEmotionGrid";
import { WaveBand } from "./WaveBand";
import styles from "./voice.module.css";

/* Voices are named for trees of the Sahel, the way the reference names its
   own after temperate ones. */
const VOICES: Voice[] = [
  {
    name: "Kanya",
    color: "#E8935A",
    note: "Warm and unhurried. The register of someone explaining something to you properly.",
  },
  {
    name: "Baobab",
    color: "#8C6239",
    note: "Low and steady, with weight behind it. Made for long passages.",
  },
  {
    name: "Marke",
    color: "#C05E3C",
    note: "Bright and forward, quick on its feet. Suits announcements and short turns.",
  },
  {
    name: "Gawo",
    color: "#6E8B5B",
    note: "Soft, close, conversational. The voice you would use across a table.",
  },
];

const EMOTIONS: Emotion[] = [
  { name: "Joy" },
  { name: "Calm" },
  { name: "Urgency" },
  { name: "Sorrow" },
  { name: "Warmth" },
];

/* Where a Hausa TTS voice actually has to hold up. */
const USE_CASES = [
  "Radio",
  "Public health",
  "Classrooms",
  "Audiobooks",
  "Announcements",
];

/* Hausa is not one accent. These are the varieties the model is measured on. */
const DIALECTS = [
  { name: "Kano", tint: "#EDD9B0" },
  { name: "Sokoto", tint: "#F0DCC4" },
  { name: "Zaria", tint: "#E6CAD1" },
  { name: "Katsina", tint: "#F7ECD9" },
  { name: "Maradi", tint: "#DDE3D0" },
  { name: "Zinder", tint: "#F2DDDB" },
  { name: "Damagaram", tint: "#EFE2C8" },
  { name: "Bauchi", tint: "#E3D5C0" },
];

/* Invented for now — real figures replace these. */
const STATS = [
  { value: "4.42", unit: "/ 5", label: "Mean opinion score", note: "Native listener panel, n=320" },
  { value: "180", unit: "ms", label: "Time to first audio", note: "Streaming, p50" },
  { value: "27×", unit: "", label: "Faster than real time", note: "Single A100, batch of 1" },
  { value: "8", unit: "", label: "Dialects covered", note: "Nigeria and Niger" },
];

const SAMPLES = [
  {
    title: "Health broadcast",
    voice: "Kanya",
    body: "A clinic announcement read the way a nurse would read it — clear, unhurried, and warm enough that people listen to the end rather than tuning out at the third sentence.",
  },
  {
    title: "Market report",
    voice: "Marke",
    body: "Prices and place names, one after another, at pace. The test here is the proper nouns: a voice that stumbles on Dawanau or Jibia is no use on air.",
  },
  {
    title: "Story reading",
    voice: "Baobab",
    body: "Twenty minutes of continuous narration. Speaker consistency is the whole game — the voice at minute nineteen has to be the same voice as at minute one.",
  },
];

const SECTIONS = [
  { id: "features", label: "Features" },
  { id: "performance", label: "Performance" },
  { id: "try-it-out", label: "Try it out" },
];

export function NamuVoicePage() {
  return (
    <>
      <main id="main-content">
        {/* ---- Hero ---------------------------------------------------- */}
        <section className={styles.hero}>
          <div className={styles.heroField} aria-hidden="true">
            <GradientField />
          </div>

          <ScrollObject className={styles.heroInner}>
            <p className={`text-ui ${styles.heroEyebrow}`}>Speech synthesis</p>
            <h1 className={styles.heroTitle}>
              <SplitText immediate text="Namu-Voice" />
            </h1>
            <p className={`text-large ${styles.heroLede}`}>
              <SplitText
                immediate
                delay={0.2}
                text="Turn Hausa text into speech people actually want to listen to."
              />
            </p>
            <div
              className={`slide-up ${styles.heroCta}`}
              style={{ "--i": 3 } as React.CSSProperties}
            >
              <Button href="/playground" variant="invert">
                Try in playground
              </Button>
            </div>
          </ScrollObject>
        </section>

        <SectionNav sections={SECTIONS} />

        {/* ---- Features ------------------------------------------------ */}
        <section id="features" className={styles.section}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.sectionHead}>
              <h2 className={`h3 ${styles.sectionTitle}`}>
                <SplitText text="Features" />
              </h2>
              <p
                className={`text-large ds-span ${styles.sectionLede}`}
                style={
                  { "--span": 14, marginInline: "auto" } as React.CSSProperties
                }
              >
                <SplitText
                  delay={0.2}
                  text="Namu-Voice reads Hausa the way it is spoken, not the way it is spelled — tone, vowel length and sentence rhythm carried through from the text, with consent built into every voice it can use."
                />
              </p>
            </ScrollObject>
          </div>
        </section>

        {/* ---- Voice × emotion ----------------------------------------- */}
        <section className={styles.expression}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.expressionHead}>
              <h3 className={`h7 ${styles.expressionTitle}`}>
                <SplitText text="Realistic expression" />
              </h3>
              <p className={`text-regular ${styles.expressionLede}`}>
                <SplitText
                  delay={0.2}
                  text="Organic pacing, tone and emotional range that sound like a person, not a text-to-speech engine."
                />
              </p>
            </ScrollObject>

            <VoiceEmotionGrid voices={VOICES} emotions={EMOTIONS} />
          </div>
        </section>

        {/* ---- Voice matching ------------------------------------------ */}
        <section className={styles.matching}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.matchingHead}>
              <h3 className={`h7 ${styles.expressionTitle}`}>
                <SplitText text="Instant voice matching" />
              </h3>
              <p className={`text-regular ${styles.expressionLede}`}>
                <SplitText
                  delay={0.2}
                  text="Capture a voice from a short reference clip, with its owner's consent on file. No fine-tuning run, no dataset to assemble."
                />
              </p>
            </ScrollObject>
          </div>

          <div className={styles.waveWrap}>
            <WaveBand />
          </div>
        </section>

        {/* ---- Long form ----------------------------------------------- */}
        <section className={styles.longFormSection}>
          <div className="ds-container ds-outer">
            <LongFormHeading before="Built for l" stretch="o" after="ng form" />

            <ScrollObject className={styles.longFormBody}>
              <p className={`text-regular ${styles.longFormLede}`}>
                <SplitText
                  delay={0.2}
                  text="Stable, high-fidelity output that holds the same speaker across an hour of audio."
                />
              </p>

              <ul className={styles.useCases}>
                {USE_CASES.map((label, i) => (
                  <li
                    key={label}
                    className={`slide-up ${styles.useCase}`}
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <Check className={styles.useCaseIcon} />
                    <span className="text-regular">{label}</span>
                  </li>
                ))}
              </ul>
            </ScrollObject>
          </div>
        </section>

        {/* ---- Dialects ------------------------------------------------ */}
        <section className={styles.dialects}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.dialectsHead}>
              <h3 className={`h7 ${styles.expressionTitle}`}>
                Natural across eight Hausa dialects
              </h3>
              <p className={`text-regular ${styles.expressionLede}`}>
                <SplitText
                  text="Hausa is not one accent. The model is trained and measured on the varieties people actually speak, from Kano to Zinder."
                />
              </p>
            </ScrollObject>

            <ScrollObject className={styles.dialectCloud}>
              {DIALECTS.map((d, i) => (
                <span
                  key={d.name}
                  className={`text-small slide-up ${styles.dialectChip}`}
                  style={
                    { background: d.tint, "--i": i } as React.CSSProperties
                  }
                >
                  {d.name}
                </span>
              ))}
            </ScrollObject>
          </div>
        </section>

        {/* ---- Using the model ----------------------------------------- */}
        <section className={styles.using}>
          <div className={styles.usingBg} aria-hidden="true" />

          <div className="ds-container ds-outer">
            <ScrollObject className={styles.usingHead}>
              <h2 className={`h6 ${styles.usingKicker}`}>
                <SplitText text="Using the model" />
              </h2>
              <p className={`h3 ${styles.usingTitle}`}>
                <SplitText delay={0.2} text="Hausa speech, live and on demand." />
              </p>
              <p className={`text-small ${styles.usingNote}`}>
                <SplitText
                  delay={0.3}
                  text="Samples generated with Namu-Voice"
                />
              </p>
            </ScrollObject>

            <ScrollObject className={styles.sampleRow}>
              {SAMPLES.map((s, i) => (
                <article
                  key={s.title}
                  className={`slide-up ${styles.sampleCard}`}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <div className={styles.sampleTop}>
                    <h3 className={`text-large ${styles.sampleTitle}`}>
                      {s.title}
                    </h3>
                    <AudioSample compact />
                  </div>
                  <p className={`text-small ${styles.sampleBody}`}>{s.body}</p>
                  <p className={styles.sampleMeta}>{s.voice}</p>
                </article>
              ))}
            </ScrollObject>
          </div>
        </section>

        {/* ---- Performance --------------------------------------------- */}
        <section id="performance" className={styles.section}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.sectionHead}>
              <p className={`h3 ${styles.sectionKicker}`}>
                <SplitText text="Performance" />
              </p>
              <h2 className={`h2 ${styles.performanceTitle}`}>
                <SplitText delay={0.1} text="Leading on naturalness in Hausa" />
              </h2>
              <p
                className={`text-large ds-span ${styles.sectionLede}`}
                style={
                  { "--span": 14, marginInline: "auto" } as React.CSSProperties
                }
              >
                <SplitText
                  delay={0.2}
                  text="Namu-Voice holds its speaker across long passages and starts speaking fast enough to hold a conversation."
                />
              </p>
            </ScrollObject>

            <ScrollObject className={styles.stats}>
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`slide-up ${styles.stat}`}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <p className={styles.statValue}>
                    {s.value}
                    {s.unit ? (
                      <span className={styles.statUnit}>{s.unit}</span>
                    ) : null}
                  </p>
                  <p className={`text-regular ${styles.statLabel}`}>{s.label}</p>
                  <p className={styles.statNote}>{s.note}</p>
                </div>
              ))}
            </ScrollObject>
          </div>
        </section>

        {/* ---- Listen across dialects ---------------------------------- */}
        <ListenAcrossDialects />

        {/* ---- Dig deeper ---------------------------------------------- */}
        <div className="ds-container ds-outer">
          <div className={styles.digDeeper}>
            <h2 className="h7">Dig deeper</h2>
            <div className={styles.digLinks}>
              <Link href="/models" className={`text-ui ${styles.digLink}`}>
                <span>Model card</span>
                <ArrowUpRight className={styles.digArrow} />
              </Link>
              <Link href="/blog" className={`text-ui ${styles.digLink}`}>
                <span>Blog post</span>
                <ArrowUpRight className={styles.digArrow} />
              </Link>
            </div>
          </div>
        </div>

        {/* ---- Try it out ---------------------------------------------- */}
        <section id="try-it-out" className={styles.tryOut}>
          <div className="ds-container ds-outer">
            <h2 className={`h3 ${styles.tryTitle}`}>
              <SplitText text="Try Namu-Voice" />
            </h2>

            <ScrollObject className={styles.tryRow}>
              {[
                {
                  title: "Namu Playground",
                  body: "Type a line of Hausa and hear it back in any of the four voices.",
                  cta: "Try in playground",
                  href: "/playground",
                },
                {
                  title: "Namu API",
                  body: "Stream speech into your own product, with the same voices and consent controls.",
                  cta: "Contact sales",
                  href: "mailto:contact@namuai.org",
                },
                {
                  title: "All Namu models",
                  body: "Interpretation, transcription and the end-to-end voice agent.",
                  cta: "See all models",
                  href: "/models",
                },
              ].map((c, i) => (
                <article
                  key={c.title}
                  className={`slide-up ${styles.tryCard}`}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <div>
                    <h3 className={`h7 ${styles.tryCardTitle}`}>{c.title}</h3>
                    <p className={`text-regular ${styles.tryCardBody}`}>
                      {c.body}
                    </p>
                  </div>
                  <Link href={c.href} className={`text-ui ${styles.digLink}`}>
                    <span>{c.cta}</span>
                    <ArrowUpRight className={styles.digArrow} />
                  </Link>
                </article>
              ))}
            </ScrollObject>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/**
 * Two clips per dialect, swapped by the selector — the reference's "listen
 * across languages", which for a Hausa-first model is a dialect comparison.
 */
function ListenAcrossDialects() {
  return (
    <section className={styles.listen}>
      <div className="ds-container ds-outer">
        <div className={styles.listenHead}>
          <h3 className="h6">
            <SplitText text="Listen across dialects" />
          </h3>

          <label className={styles.listenSelect}>
            <Waveform className={styles.listenSelectIcon} />
            <span className="sr-only">Select a dialect</span>
            <select className={`text-ui ${styles.listenSelectInput}`} defaultValue="Kano">
              {DIALECTS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ScrollObject className={styles.listenRow}>
          {["Joy example", "Sorrow example"].map((label, i) => (
            <div
              key={label}
              className={`slide-up ${styles.listenCard}`}
              style={{ "--i": i } as React.CSSProperties}
            >
              <AudioSample title={label} />
            </div>
          ))}
        </ScrollObject>
      </div>
    </section>
  );
}
