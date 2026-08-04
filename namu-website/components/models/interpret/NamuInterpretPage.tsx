"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/editorial/Button";
import { Footer } from "@/components/editorial/Footer";
import { ArrowUpRight } from "@/components/editorial/icons";
import { ScrollObject } from "@/components/editorial/ScrollObject";
import { SplitText } from "@/components/editorial/SplitText";
import { AudioSample } from "@/components/models/voice/AudioSample";
import { SectionNav } from "@/components/models/voice/SectionNav";
import { CrossingTalk, type Turn } from "./CrossingTalk";
import { LatencyTrack } from "./LatencyTrack";
import { LiveInterpret } from "./LiveInterpret";
import styles from "./interpret.module.css";

/* A single call, start to finish. Both directions run inside it, because that
   is what an interpreted conversation is — not two one-way translations. */
const TURNS: Turn[] = [
  {
    from: "fr",
    said: "Bonjour, je vous appelle pour les dix sacs de mil.",
    heard: "Barka dai, ina kiran ka ne game da buhu goma na gero.",
  },
  {
    from: "ha",
    said: "Barka dai. Buhu goma na nan, amma farashin ya karu tun makon jiya.",
    heard: "Bonjour. Les dix sacs sont là, mais le prix a monté depuis la semaine dernière.",
  },
  {
    from: "fr",
    said: "De combien ?",
    heard: "Nawa ne ya karu?",
  },
  {
    from: "ha",
    said: "Dubu daya kan kowane buhu. Yanzu dubu talatin da biyar ne.",
    heard: "Mille de plus par sac. Ça fait trente-cinq mille maintenant.",
  },
  {
    from: "fr",
    said: "D'accord. Vous pouvez les envoyer demain matin ?",
    heard: "To. Za ka iya aika su gobe da safe?",
  },
  {
    from: "ha",
    said: "Zan aika mota da karfe bakwai.",
    heard: "J'enverrai le camion à sept heures.",
  },
];

/* The cases where word-for-word gives you something confidently wrong. The
   middle column is the failure, kept visible so the last one has something to
   be measured against. */
const CROSSINGS = [
  {
    id: "numbers",
    label: "Numbers",
    source: "Dubu talatin da biyar",
    literal: "Mille trente et cinq",
    good: "Trente-cinq mille",
    note: "Hausa builds the thousand first. Read left to right into French and you land three zeros off, on a price.",
  },
  {
    id: "places",
    label: "Place names",
    source: "Ya tafi Dogondoutchi",
    literal: "Il est allé à la longue pierre",
    good: "Il est allé à Dogondoutchi",
    note: "Plenty of Nigerien place names are ordinary Hausa words. A model that translates everything translates the map too.",
  },
  {
    id: "greetings",
    label: "Greetings",
    source: "Sannu da aiki",
    literal: "Bonjour avec le travail",
    good: "Bon courage",
    note: "There is no French phrase for greeting someone mid-task. The job is to carry what it does, not what it says.",
  },
  {
    id: "negation",
    label: "Negation",
    source: "Ba na jin ka",
    literal: "Pas je entendre toi",
    good: "Je ne t'entends pas",
    note: "Hausa wraps the negative around the verb. Dropped or misplaced, a sentence can come out meaning its opposite.",
  },
];

/* Invented for now — real figures replace these. */
const STATS = [
  { value: "0.9", unit: "s", label: "Median lag", note: "Speech in to speech out" },
  { value: "2", unit: "", label: "Directions", note: "One model, either way" },
  { value: "93", unit: "%", label: "Numbers kept", note: "Prices, dates, quantities" },
  { value: "8", unit: "", label: "Dialects in", note: "Hausa across Niger" },
];

const SPECS: [string, string][] = [
  ["Directions", "HA to FR, FR to HA"],
  ["Input", "Speech or text"],
  ["Turn handover", "Automatic"],
  ["Price", "$0.30 per hour of audio"],
];

/* Sample clips. Audio arrives later; the pairing is what the section shows. */
const SAMPLES = [
  {
    id: "ha-fr",
    label: "Hausa to French",
    source: "Ina son sanin farashin gero a kasuwar yau.",
    target: "Je voudrais connaître le prix du mil au marché aujourd'hui.",
  },
  {
    id: "fr-ha",
    label: "French to Hausa",
    source: "Le camion arrivera avant midi, si la route est ouverte.",
    target: "Motar za ta iso kafin tsakar rana, idan hanya a bude take.",
  },
];

const SECTIONS = [
  { id: "features", label: "Features" },
  { id: "performance", label: "Performance" },
  { id: "try-it-out", label: "Try it out" },
];

export function NamuInterpretPage() {
  const [crossing, setCrossing] = useState(0);
  const [sample, setSample] = useState(0);

  return (
    <>
      <main id="main-content">
        {/* ---- Hero ---------------------------------------------------- */}
        <section className={styles.hero}>
          <div className={styles.heroMedia} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/interpret.jpeg"
              alt=""
              className={`${styles.heroImage} scale-out`}
              width={736}
              height={552}
            />
          </div>

          <ScrollObject className={styles.heroInner}>
            <h1 className={styles.heroTitle}>
              <SplitText immediate text="Namu-Interpret" />
            </h1>
            <p className={`text-large ${styles.heroLede}`}>
              <SplitText
                immediate
                delay={0.2}
                text="Hausa and French, carried both ways in speech, fast enough to keep a conversation going."
              />
            </p>

            {/* Runs its own clock, so it sits outside the reveal. */}
            <LiveInterpret />

            <div
              className={`slide-up ${styles.heroCta}`}
              style={{ "--i": 3 } as React.CSSProperties}
            >
              <Button href="/playground?model=interpret" variant="invert">
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
                  text="Most translation tools hand you a finished paragraph. An interpreter has to work while someone is still talking, and hand it over before the moment passes."
                />
              </p>
            </ScrollObject>
          </div>
        </section>

        {/* ---- The conversation ---------------------------------------- */}
        <section className={styles.talkSection}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.blockHead}>
              <h3 className={`h4 ${styles.blockTitle}`}>
                <SplitText text="One model, both ways" />
              </h3>
              <p
                className={`text-large ds-span ${styles.blockLede}`}
                style={{ "--span": 12, marginInline: "auto" } as React.CSSProperties}
              >
                <SplitText
                  delay={0.2}
                  text="A real conversation does not run in one direction. Here is a single call, with Hausa on the left and French on the right, and every turn crossing the middle."
                />
              </p>
            </ScrollObject>

            <CrossingTalk turns={TURNS} />
          </div>
        </section>

        {/* ---- What survives the crossing ------------------------------ */}
        <section className={styles.crossings}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.blockHead}>
              <h3 className={`h4 ${styles.blockTitle}`}>
                <SplitText text="The hard part is what has to survive" />
              </h3>
              <p
                className={`text-large ds-span ${styles.blockLede}`}
                style={{ "--span": 12, marginInline: "auto" } as React.CSSProperties}
              >
                <SplitText
                  delay={0.2}
                  text="Word-for-word is not wrong in an obvious way. It is wrong in a confident way, which is worse."
                />
              </p>
            </ScrollObject>

            <div className={styles.tabs} role="tablist" aria-label="Kinds of crossing">
              {CROSSINGS.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={i === crossing}
                  className={`text-ui ${styles.tab} ${i === crossing ? styles.tabActive : ""}`}
                  onClick={() => setCrossing(i)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <ScrollObject className={styles.ladder} key={CROSSINGS[crossing].id}>
              <div className={styles.rung}>
                <span className={`text-caption ${styles.rungTag}`}>Hausa</span>
                <p className={styles.rungText} lang="ha">
                  {CROSSINGS[crossing].source}
                </p>
              </div>

              <div className={`${styles.rung} ${styles.rungBad}`}>
                <span className={`text-caption ${styles.rungTag}`}>Word for word</span>
                <p className={styles.rungText} lang="fr">
                  <s>{CROSSINGS[crossing].literal}</s>
                </p>
              </div>

              <div className={`${styles.rung} ${styles.rungGood}`}>
                <span className={`text-caption ${styles.rungTag}`}>Namu-Interpret</span>
                <p className={styles.rungText} lang="fr">
                  {CROSSINGS[crossing].good}
                </p>
              </div>

              <p className={`text-regular ${styles.rungNote}`}>
                {CROSSINGS[crossing].note}
              </p>
            </ScrollObject>
          </div>
        </section>

        {/* ---- Latency ------------------------------------------------- */}
        <section className={styles.timing}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.timingCopy}>
              <h3 className={`h4 ${styles.blockTitle}`}>
                <SplitText text="Late is the same as wrong" />
              </h3>
              <p className={`text-large ${styles.blockLede}`}>
                <SplitText
                  delay={0.2}
                  text="A transcript can arrive after the fact and still be worth reading. An interpretation that arrives late has already missed its turn."
                />
              </p>
            </ScrollObject>

            <LatencyTrack />
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
                <SplitText delay={0.2} text="Speak either language. Pick neither." />
              </p>
              <p
                className={`text-regular ds-span ${styles.blockLede}`}
                style={{ "--span": 12, marginInline: "auto" } as React.CSSProperties}
              >
                <SplitText
                  delay={0.3}
                  text="The model works out which language it just heard and answers in the other one, so nobody has to set a direction mid-conversation."
                />
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
              <div className={styles.samplePair}>
                <div className={styles.sampleSide}>
                  <span className={`text-caption ${styles.rungTag}`}>Heard</span>
                  <p className={styles.sampleText}>{SAMPLES[sample].source}</p>
                </div>
                <span className={styles.sampleArrow} aria-hidden="true" />
                <div className={styles.sampleSide}>
                  <span className={`text-caption ${styles.rungTag}`}>Returned</span>
                  <p className={styles.sampleText}>{SAMPLES[sample].target}</p>
                </div>
              </div>
              <AudioSample />
            </ScrollObject>
          </div>
        </section>

        {/* ---- Performance --------------------------------------------- */}
        <section id="performance" className={styles.section}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.sectionHead}>
              <h2 className={`h4 ${styles.sectionTitle}`}>
                <SplitText text="Measured on conversations, not sentences" />
              </h2>
              <p
                className={`text-large ds-span ${styles.sectionLede}`}
                style={{ "--span": 14, marginInline: "auto" } as React.CSSProperties}
              >
                <SplitText
                  delay={0.2}
                  text="Single sentences are easy. What matters is whether a call still makes sense after twenty turns, with a price and a date in the middle of it."
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
              <SplitText text="Try Namu-Interpret" />
            </h2>

            <ScrollObject className={styles.tryRow}>
              {[
                {
                  title: "Namu Playground",
                  body: "Say a line in Hausa or French and hear it come back in the other.",
                  cta: "Try in playground",
                  href: "/playground?model=interpret",
                },
                {
                  title: "Namu API",
                  body: "Put interpretation into a call flow, in either direction.",
                  cta: "Contact sales",
                  href: "mailto:contact@namuai.org",
                },
                {
                  title: "All Namu models",
                  body: "Speech recognition, speech synthesis and the end-to-end voice agent.",
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
