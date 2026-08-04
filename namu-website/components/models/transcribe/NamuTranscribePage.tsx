"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/editorial/Button";
import { Footer } from "@/components/editorial/Footer";
import { ArrowUpRight } from "@/components/editorial/icons";
import { ScrollObject } from "@/components/editorial/ScrollObject";
import { SplitText } from "@/components/editorial/SplitText";
import { AudioSample } from "@/components/models/voice/AudioSample";
import { DialectRing } from "@/components/models/voice/DialectRing";
import { SectionNav } from "@/components/models/voice/SectionNav";
import { SoundWave } from "./SoundWave";
import styles from "./transcribe.module.css";

/* Initials stand in for the reference's portraits. Inventing faces to sit
   beside invented transcripts would claim more than we can. */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/* Where Hausa speech reaches Namu, and the register each one brings. */
const DOMAINS = [
  {
    id: "radio",
    label: "Radio bulletin",
    lines: [
      {
        who: "Presenter",
        at: "00:04",
        text: "Barka da yamma. Wannan shi ne labarin karfe shida na yammacin yau.",
      },
      {
        who: "Presenter",
        at: "00:11",
        text: "Ruwan sama ya sauka a yankin Maradi da Tessaoua a daren jiya, kuma manoma na sa ran fara shuka a mako mai zuwa.",
      },
      {
        who: "Correspondent",
        at: "00:23",
        text: "A nan Zinder, kasuwar dabbobi ta bude da karfe bakwai. Farashin raguna ya ragu kadan idan aka kwatanta da makon jiya.",
      },
    ],
  },
  {
    id: "clinic",
    label: "Clinic visit",
    lines: [
      {
        who: "Nurse",
        at: "00:03",
        text: "Sannu da zuwa. Me ya kawo ki yau?",
      },
      {
        who: "Patient",
        at: "00:07",
        text: "Ina jin ciwon kai tun kwana uku, kuma ba na iya barci da dare.",
      },
      {
        who: "Nurse",
        at: "00:15",
        text: "Za mu auna zafin jiki tukuna. Kin sha wani magani a gida?",
      },
      {
        who: "Patient",
        at: "00:21",
        text: "Na sha paracetamol sau biyu, amma bai yi tasiri sosai ba.",
      },
    ],
  },
  {
    id: "market",
    label: "Market call",
    lines: [
      {
        who: "Trader",
        at: "00:02",
        text: "Ina son sanin farashin gero a kasuwar Dawanau yau.",
      },
      {
        who: "Agent",
        at: "00:08",
        text: "Buhu daya na gero yana kan dubu talatin da biyar. Ya karu da dubu daya tun ranar Litinin.",
      },
      {
        who: "Trader",
        at: "00:17",
        text: "To. Ka ajiye min buhu goma, zan aika mota gobe da safe.",
      },
    ],
  },
] as const;

/* Niger's Hausa-speaking areas, the same set the model page quotes. */
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
  { value: "8.4", unit: "%", label: "Word error rate", note: "Read speech, clean audio" },
  { value: "14.1", unit: "%", label: "In the field", note: "Market and street recordings" },
  { value: "8", unit: "", label: "Dialects measured", note: "Across Niger" },
  { value: "11×", unit: "", label: "Faster than real time", note: "Batch, single GPU" },
];

/* One more row of facts under the headline numbers. There is no second
   version to compare against yet — this is the first. */
const SPECS: [string, string][] = [
  ["Domain terms", "Supported"],
  ["Timestamps", "Word level"],
  ["Streaming", "Yes"],
  ["Price", "$0.22 per hour of audio"],
];

/* Clips the model is demonstrated on. Audio arrives later; the transcript is
   what the section is really showing. */
const SAMPLES = [
  {
    id: "radio",
    label: "Radio feed",
    text: "Ruwan sama ya sauka a yankin Maradi da Tessaoua a daren jiya, kuma manoma na sa ran fara shuka a mako mai zuwa.",
  },
  {
    id: "phone",
    label: "Phone call",
    text: "Ba na jin ka sosai. Za ka iya maimaita adireshin, don Allah?",
  },
  {
    id: "note",
    label: "Voice note",
    text: "Na isa kasuwa da karfe bakwai. Zan sayo buhu biyar na gero idan farashin bai canza ba.",
  },
] as const;

const SECTIONS = [
  { id: "features", label: "Features" },
  { id: "performance", label: "Performance" },
  { id: "try-it-out", label: "Try it out" },
];

export function NamuTranscribePage() {
  const [domain, setDomain] = useState(0);
  const [sample, setSample] = useState(0);

  return (
    <>
      <main id="main-content">
        {/* ---- Hero ---------------------------------------------------- */}
        <section className={styles.hero}>
          <div className={styles.heroMedia} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cinetrans.jpeg"
              alt=""
              className={`${styles.heroImage} scale-out`}
              width={736}
              height={983}
            />
          </div>

          <ScrollObject className={styles.heroInner}>
            <h1 className={styles.heroTitle}>
              <SplitText immediate text="Namu-Transcribe" />
            </h1>
            <p className={`text-large ${styles.heroLede}`}>
              <SplitText
                immediate
                delay={0.2}
                text="Turn noisy Hausa audio into accurate, domain-aware transcripts."
              />
            </p>

            {/* Runs its own pointer loop, so it sits outside the reveal. */}
            <div className={styles.waveWrap}>
              <SoundWave />
            </div>

            <div
              className={`slide-up ${styles.heroCta}`}
              style={{ "--i": 3 } as React.CSSProperties}
            >
              <Button href="/playground?model=transcribe" variant="invert">
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
                style={{ "--span": 14, marginInline: "auto" } as React.CSSProperties}
              >
                <SplitText
                  delay={0.2}
                  text="Namu-Transcribe is trained on Hausa the way people speak it: across dialects, over bad lines, and in rooms where other people are talking."
                />
              </p>
            </ScrollObject>
          </div>
        </section>

        {/* ---- Dialect coverage ---------------------------------------- */}
        <section className={styles.coverage}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.coverageStage}>
              {/* The names orbit; the claim sits still in the middle of them. */}
              <div className={styles.coverageHead}>
                <h3 className={`h7 ${styles.blockTitle}`}>
                  Accurate across eight Hausa dialects
                </h3>
                <p className={`text-regular ${styles.blockLede}`}>
                  <SplitText text="Measured separately on each, because an average across Niger hides the varieties it does worst on." />
                </p>
              </div>

              <DialectRing dialects={DIALECTS} />
            </ScrollObject>
          </div>
        </section>

        {/* ---- Domain transcripts -------------------------------------- */}
        <section className={styles.domains}>
          <div className={`ds-container ds-outer ${styles.domainsInner}`}>
            <ScrollObject className={styles.domainsCopy}>
              <h3 className={`h4 ${styles.blockTitle}`}>
                <SplitText text="It learns your words" />
              </h3>
              <p className={`text-large ${styles.blockLede}`}>
                <SplitText
                  delay={0.2}
                  text="Every trade has names of its own. Tell Namu the ones you use and it will stop guessing at them."
                />
              </p>
            </ScrollObject>

            <ScrollObject className={styles.domainsPanel}>
              <div
                className={styles.tabs}
                role="tablist"
                aria-label="Transcript examples"
              >
                {DOMAINS.map((d, i) => (
                  <button
                    key={d.id}
                    type="button"
                    role="tab"
                    aria-selected={i === domain}
                    className={`text-ui ${styles.tab} ${i === domain ? styles.tabActive : ""}`}
                    onClick={() => setDomain(i)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <div className={styles.transcript}>
                {DOMAINS[domain].lines.map((line) => (
                  <div key={line.at + line.who} className={styles.line}>
                    <span className={styles.avatar} aria-hidden="true">
                      {initials(line.who)}
                    </span>
                    <div className={styles.lineBody}>
                      <p className={styles.lineHead}>
                        <span className={`text-ui ${styles.lineSpeaker}`}>
                          {line.who}
                        </span>
                        <span className={styles.lineClock}>{line.at}</span>
                      </p>
                      {/* Mono, because this is machine output being shown as
                          machine output rather than set as prose. */}
                      <p className={styles.lineText}>{line.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.transcriptControls}>
                <AudioSample compact />
              </div>
            </ScrollObject>
          </div>
        </section>

        {/* ---- Noisy conditions ---------------------------------------- */}
        <section className={styles.noisy}>
          <div className={`ds-container ds-outer ${styles.noisyInner}`}>
            <ScrollObject className={styles.noisyCopy}>
              <h3 className={`h7 ${styles.blockTitle}`}>
                <SplitText text="Made for real recordings" />
              </h3>
              <p className={`text-regular ${styles.blockLede}`}>
                <SplitText
                  delay={0.2}
                  text="Built for imperfect conditions: a phone on a market stall, a radio feed, a room with three people talking at once."
                />
              </p>
            </ScrollObject>

            <ScrollObject className={styles.noisyMedia}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cinetrans.jpeg"
                alt="A field seen through trees from a moving vehicle"
                className={`${styles.noisyImage} scale-out`}
                loading="lazy"
                width={736}
                height={983}
              />

              <div className={styles.noisyStrip}>
                <p className={`text-regular ${styles.noisyText}`}>
                  Ina son sanin farashin gero a kasuwar yau.
                </p>
                <AudioSample compact />
              </div>
            </ScrollObject>
          </div>
        </section>

        {/* ---- Using the model ----------------------------------------- */}
        <section className={styles.using}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.blockHead}>
              <h2 className={`h6 ${styles.usingKicker}`}>
                <SplitText text="Using the model" />
              </h2>
              <p className={`h4 ${styles.usingTitle}`}>
                <SplitText delay={0.2} text="Hausa in, text out." />
              </p>
            </ScrollObject>

            <div className={styles.tabs} role="tablist" aria-label="Sample clips">
              {SAMPLES.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={i === sample}
                  className={`text-ui ${styles.tab} ${i === sample ? styles.tabActive : ""}`}
                  onClick={() => setSample(i)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <ScrollObject className={styles.sampleCard}>
              <p className={`text-regular ${styles.sampleText}`}>
                {SAMPLES[sample].text}
              </p>
              <AudioSample />
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
              <h2 className={`h4 ${styles.performanceTitle}`}>
                <SplitText delay={0.1} text="Measured on Hausa, not on average" />
              </h2>
              <p
                className={`text-large ds-span ${styles.sectionLede}`}
                style={{ "--span": 14, marginInline: "auto" } as React.CSSProperties}
              >
                <SplitText
                  delay={0.2}
                  text="Benchmarks that quote one number across forty languages tell you very little about the one you speak. These are Hausa alone."
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
                    {s.unit ? <span className={styles.statUnit}>{s.unit}</span> : null}
                  </p>
                  <p className={`text-regular ${styles.statLabel}`}>{s.label}</p>
                  <p className={styles.statNote}>{s.note}</p>
                </div>
              ))}
            </ScrollObject>

            <ScrollObject className={styles.specs}>
              {SPECS.map(([label, value], i) => (
                <div
                  key={label}
                  className={`slide-up ${styles.spec}`}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <span className={`text-ui ${styles.specLabel}`}>{label}</span>
                  <span className={`text-regular ${styles.specValue}`}>{value}</span>
                </div>
              ))}
            </ScrollObject>
          </div>
        </section>

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
              <SplitText text="Try Namu-Transcribe" />
            </h2>

            <ScrollObject className={styles.tryRow}>
              {[
                {
                  title: "Namu Playground",
                  body: "Record a line of Hausa, or drop in a file, and read it back.",
                  cta: "Try in playground",
                  href: "/playground?model=transcribe",
                },
                {
                  title: "Namu API",
                  body: "Transcribe at volume, with your own domain terms loaded.",
                  cta: "Contact sales",
                  href: "mailto:contact@namuai.org",
                },
                {
                  title: "All Namu models",
                  body: "Interpretation, speech synthesis and the end-to-end voice agent.",
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
                    <p className={`text-regular ${styles.tryCardBody}`}>{c.body}</p>
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
