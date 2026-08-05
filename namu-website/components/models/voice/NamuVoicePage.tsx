"use client";

import Link from "next/link";
import { Button } from "@/components/editorial/Button";
import { Footer } from "@/components/editorial/Footer";
import { GradientField } from "@/components/editorial/GradientField";
import { ArrowUpRight, ChevronDown } from "@/components/editorial/icons";
import { ScrollObject } from "@/components/editorial/ScrollObject";
import { SplitText } from "@/components/editorial/SplitText";
import { AudioSample } from "./AudioSample";
import { DialectRing } from "./DialectRing";
import { HeroVideo } from "./HeroVideo";
import { Check, Waveform } from "./icons";
import { LongFormHeading } from "./LongFormHeading";
import { SectionNav } from "./SectionNav";
import { VoiceEmotionGrid, type Emotion, type Voice } from "./VoiceEmotionGrid";
import { WaveBand } from "./WaveBand";
import styles from "./voice.module.css";

/* Voices are named for trees of the Sahel, the way the reference names its
   own after temperate ones. The colour drives both the list swatch and the
   wash behind the stage. */
const VOICES: Voice[] = [
  {
    name: "Kanya",
    color: "#E8935A",
  },
  {
    name: "Baobab",
    color: "#8C6239",
  },
  {
    name: "Marke",
    color: "#C05E3C",
  },
  {
    name: "Gawo",
    color: "#6E8B5B",
  },
];

const EMOTIONS: Emotion[] = [
  { name: "Joy" },
  { name: "Calm" },
  { name: "Urgency" },
  { name: "Sorrow" },
  { name: "Warmth" },
];

/* Where a Hausa TTS voice has to hold up. */
const USE_CASES = [
  "Radio",
  "Public health",
  "Classrooms",
  "Audiobooks",
  "Announcements",
];

/* Hausa-speaking areas of Niger. Namu is a Niger-first company, so the
   coverage claim is about Niger — not the Nigerian varieties. */
const DIALECTS = [
  { name: "Maradi", tint: "#EDD9B0" },
  { name: "Zinder", tint: "#F0DCC4" },
  { name: "Tahoua", tint: "#E6CAD1" },
  { name: "Tessaoua", tint: "#F7ECD9" },
  { name: "Konni", tint: "#DDE3D0" },
  { name: "Dogondoutchi", tint: "#F2DDDB" },
  { name: "Madaoua", tint: "#EFE2C8" },
  { name: "Mirriah", tint: "#E3D5C0" },
];

/* Invented for now — real figures replace these. */
const STATS = [
  { value: "4.42", unit: "/ 5", label: "Mean opinion score", note: "Native listener panel, n=320" },
  { value: "180", unit: "ms", label: "Time to first audio", note: "Streaming, p50" },
  { value: "27×", unit: "", label: "Faster than real time", note: "Single A100, batch of 1" },
  { value: "8", unit: "", label: "Dialects covered", note: "Nigeria and Niger" },
];

/* The Hausa each clip reads, rather than an English note about it.
   Between them they cover what the section claims: plain public-health copy,
   a run of proper nouns and figures, and continuous narration. */
const SAMPLES = [
  {
    title: "Health broadcast",
    voice: "Kanya",
    body: "Ku zo asibiti gobe daga karfe takwas na safe zuwa karfe biyu na rana, domin allurar rigakafi ga yara 'yan kasa da shekaru biyar. Ba a biyan komai.",
  },
  {
    title: "Market report",
    voice: "Marke",
    body: "Farashin gero a Dawanau ya kai dubu talatin da biyar kan buhu. A Jibia kuwa, dubu talatin da uku. Masara ta tsaya kan dubu ashirin da takwas.",
  },
  {
    title: "Story reading",
    voice: "Baobab",
    body: "Da daddare, iska ta fara busawa daga gabas. Kowa ya shiga gida, sai tsohuwa daya tak ta zauna a bakin kofa tana jiran dawowar jikanta.",
  },
];

/* Spelled out, so the heading reads as prose — but still derived from the
   list, so it cannot drift when a dialect is added. */
const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const dialectCount = NUMBER_WORDS[DIALECTS.length] ?? String(DIALECTS.length);

/* The hero clip, converted from public/"Paisajes Idílicos.gif". That gif does
   loop cleanly on its own, so it is a straight transcode — no ping-pong, and
   the grass keeps moving one way. Swap these paths to change the footage; the
   gradient behind stays as the fallback if it cannot play. */
const HERO_CLIP = {
  mp4: "/editorial/voice-hero.mp4",
  webm: "/editorial/voice-hero.webm",
  poster: "/editorial/voice-hero.jpg",
  alt: "A field of grass moving in the wind under a clouded sky",
};

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
            <HeroVideo {...HERO_CLIP} />
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
                text="Turn Hausa text into speech people want to listen to."
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
                  text="Namu-Voice reads Hausa the way people say it, not the way it is written. Tone, vowel length and the rhythm of a sentence all come through. And every voice it uses is one somebody agreed to give."
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
                  text="Give it a short clip of someone speaking, with their permission, and it can read in their voice. No training run, no dataset to gather."
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
            <LongFormHeading
              text="Built for the people"
              srText="Built for the people"
            />

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
            <ScrollObject className={styles.dialectStage}>
              {/* The names orbit; the claim sits still in the middle of them. */}
              <div className={styles.dialectsHead}>
                <h3 className={`h7 ${styles.expressionTitle}`}>
                  {`Natural across ${dialectCount} Hausa dialects`}
                </h3>
                <p className={`text-regular ${styles.expressionLede}`}>
                  <SplitText text="Hausa is not one accent. The model is trained and measured on the varieties people speak across Niger, from Maradi to Zinder." />
                </p>
              </div>

              <DialectRing dialects={DIALECTS} />
            </ScrollObject>
          </div>
        </section>

        {/* ---- Using the model ----------------------------------------- */}
        <section className={styles.using}>
          {/* Full-bleed and scaling back from a slight zoom as it enters, the
              way the reference sets its own blurred backdrop. */}
          <ScrollObject className={styles.usingBg}>
            <img
              src="/windi.png"
              alt=""
              className={`${styles.usingBgImage} scale-out`}
              loading="lazy"
            />
          </ScrollObject>

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
                  <p className={`text-small ${styles.sampleBody}`} lang="ha">
                    {s.body}
                  </p>
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
            <select
              className={`text-ui ${styles.listenSelectInput}`}
              defaultValue={DIALECTS[0].name}
            >
              {DIALECTS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
            {/* The native control is stripped of its own arrow, so the field
                needs one back or it does not read as a dropdown at all. */}
            <ChevronDown className={styles.listenSelectChevron} />
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
