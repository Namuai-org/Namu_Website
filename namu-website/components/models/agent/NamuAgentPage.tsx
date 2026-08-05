"use client";

import Link from "next/link";
import { Button } from "@/components/editorial/Button";
import { Footer } from "@/components/editorial/Footer";
import { ArrowUpRight } from "@/components/editorial/icons";
import { ScrollObject } from "@/components/editorial/ScrollObject";
import { SplitText } from "@/components/editorial/SplitText";
import { SectionNav } from "@/components/models/voice/SectionNav";
import { CallThread, type CallLine } from "./CallThread";
import { TurnMeter } from "./TurnMeter";
import styles from "./agent.module.css";

/* One call, start to finish, ending in something actually done. The work lines
   are the point: they are the part of a voice agent that usually goes unshown. */
const CALL: CallLine[] = [
  {
    who: "agent",
    said: "Sannu, Namu ke nan. Me zan taimaka maka?",
    gloss: "Hello, this is Namu. How can I help?",
  },
  {
    who: "caller",
    said: "Ina son sanin lokacin allurar rigakafi a asibitin Maradi.",
    gloss: "I want to know the vaccination times at the Maradi clinic.",
  },
  {
    who: "agent",
    said: "Ana yin allurar rigakafi kowace Talata da Alhamis, daga karfe takwas na safe zuwa karfe biyu.",
    gloss: "Vaccinations are every Tuesday and Thursday, eight in the morning to two.",
    work: "Read the Maradi clinic timetable",
  },
  {
    who: "caller",
    said: "To, ina son in kawo dana ranar Alhamis.",
    gloss: "Alright, I want to bring my child on Thursday.",
  },
  {
    who: "agent",
    said: "Na yi rijista. Za a aiko maka da sako a wayarka.",
    gloss: "I have registered it. You will get a message on your phone.",
    work: "Held a Thursday slot, sent an SMS",
  },
];

/* The repair. A caller cutting in mid-sentence is the normal case on a phone,
   not an edge case, so it gets its own section rather than a footnote. */
const REPAIR = {
  cut: "Ana yin allurar rigakafi kowace Talata da Alhamis, daga karfe",
  cutGloss: "Vaccinations are every Tuesday and Thursday, from",
  interrupt: "A'a, ba wannan ba. Ina son na Zinder.",
  interruptGloss: "No, not that one. I want Zinder.",
  recover: "Na gane. A Zinder, ranar Litinin kawai ake yi.",
  recoverGloss: "Understood. In Zinder it is Mondays only.",
};

/* What it is allowed to do on a call. The last one is a capability, not a
   caveat: knowing when to stop is part of the job. */
const ABILITIES = [
  {
    title: "Answer from your own material",
    body: "Timetables, prices, procedures. It reads from what you give it, and says so when it has nothing.",
  },
  {
    title: "Look something up mid-call",
    body: "A record, a stock level, a delivery date. The caller waits about as long as they would for a person.",
  },
  {
    title: "Book, register, record",
    body: "Hold a slot, take a name, log a complaint. The call ends with the thing done, not with a promise.",
  },
  {
    title: "Send a message after",
    body: "An SMS confirming what was agreed, so there is a record on a phone that may have no data.",
  },
  {
    title: "Ask again when unsure",
    body: "A name it did not catch gets asked for again rather than guessed at and written down wrong.",
  },
  {
    title: "Hand over to a person",
    body: "When the call is beyond it, or the caller asks, it stops and passes them on with what it has.",
  },
];

/* Invented for now — real figures replace these. */
const STATS = [
  { value: "0.6", unit: "s", label: "Reply gap", note: "Caller stops, agent starts" },
  { value: "91", unit: "%", label: "Calls it finishes", note: "No person needed" },
  { value: "8", unit: "", label: "Dialects understood", note: "Hausa across Niger" },
  { value: "2G", unit: "", label: "Works down to", note: "A voice call, not an app" },
];

const SPECS: [string, string][] = [
  ["Channel", "Phone call or in app"],
  ["Language", "Hausa, French on request"],
  ["Handover", "To a person, at any point"],
  ["Price", "$0.05 per minute"],
];

const SECTIONS = [
  { id: "features", label: "Features" },
  { id: "performance", label: "Performance" },
  { id: "try-it-out", label: "Try it out" },
];

export function NamuAgentPage() {
  return (
    <>
      <main id="main-content">
        {/* ---- Hero ---------------------------------------------------- */}
        <section className={styles.hero}>
          <div className={styles.heroMedia} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ag1.jpeg"
              alt=""
              className={`${styles.heroImage} scale-out`}
              width={735}
              height={490}
            />
          </div>

          <ScrollObject className={styles.heroInner}>
            <h1 className={styles.heroTitle}>
              <SplitText immediate text="Namu-Agent" />
            </h1>
            <p className={`text-large ${styles.heroLede}`}>
              <SplitText
                immediate
                delay={0.2}
                text="A whole conversation in Hausa, handled over an ordinary phone call."
              />
            </p>

            {/* Runs its own clock, so it sits outside the reveal. */}
            <TurnMeter />

            <div
              className={`slide-up ${styles.heroCta}`}
              style={{ "--i": 3 } as React.CSSProperties}
            >
              <Button href="/playground?model=agent" variant="invert">
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
                  text="Namu-Agent listens, works out what the caller needs, does it, and answers out loud, all inside a single Hausa conversation."
                />
              </p>
            </ScrollObject>
          </div>
        </section>

        {/* ---- The call ------------------------------------------------ */}
        <section className={styles.call}>
          <div className={styles.callMedia} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ag2.jpeg" alt="" className={styles.callImage} />
          </div>

          <div className="ds-container ds-outer">
            <ScrollObject className={styles.blockHead}>
              <h3 className={`h4 ${styles.blockTitle}`}>
                <SplitText text="Built for phone calls" />
              </h3>
              <p className={`text-large ${styles.blockLede}`}>
                <SplitText
                  delay={0.2}
                  text="No app to install and no data connection needed, with the work it does between hearing and answering shown here."
                />
              </p>
            </ScrollObject>

            <CallThread lines={CALL} />
          </div>
        </section>

        {/* ---- Interruption -------------------------------------------- */}
        <section className={styles.repair}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.blockHead}>
              <h3 className={`h4 ${styles.blockTitle}`}>
                <SplitText text="Handles interruption" />
              </h3>
              <p
                className={`text-large ds-span ${styles.blockLede}`}
                style={{ "--span": 12, marginInline: "auto" } as React.CSSProperties}
              >
                <SplitText
                  delay={0.2}
                  text="Callers talk over the agent, change their mind and correct themselves, and it takes the correction and carries on."
                />
              </p>
            </ScrollObject>

            <ScrollObject className={styles.repairStage}>
              {/* The agent's line is literally cut off, and the caller's sits
                  across the break rather than under it. */}
              <div
                className={`slide-up ${styles.repairCut}`}
                style={{ "--i": 0 } as React.CSSProperties}
              >
                <span className={`text-caption ${styles.turnWho}`}>Namu</span>
                <p className={styles.repairText} lang="ha">
                  {REPAIR.cut}
                  <span className={styles.repairBreak} aria-hidden="true" />
                </p>
                <p className={`text-caption ${styles.turnGloss}`}>{REPAIR.cutGloss}</p>
              </div>

              <div
                className={`slide-up ${styles.repairIn}`}
                style={{ "--i": 1 } as React.CSSProperties}
              >
                <span className={`text-caption ${styles.turnWho}`}>Caller</span>
                <p className={styles.repairText} lang="ha">
                  {REPAIR.interrupt}
                </p>
                <p className={`text-caption ${styles.turnGloss}`}>
                  {REPAIR.interruptGloss}
                </p>
              </div>

              <div
                className={`slide-up ${styles.repairBack}`}
                style={{ "--i": 2 } as React.CSSProperties}
              >
                <span className={`text-caption ${styles.turnWho}`}>Namu</span>
                <p className={styles.repairText} lang="ha">
                  {REPAIR.recover}
                </p>
                <p className={`text-caption ${styles.turnGloss}`}>
                  {REPAIR.recoverGloss}
                </p>
              </div>
            </ScrollObject>
          </div>
        </section>

        {/* ---- What it can do ------------------------------------------ */}
        <section className={styles.abilities}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.blockHead}>
              <h3 className={`h4 ${styles.blockTitle}`}>
                <SplitText text="Actions you define" />
              </h3>
              <p
                className={`text-large ds-span ${styles.blockLede}`}
                style={{ "--span": 12, marginInline: "auto" } as React.CSSProperties}
              >
                <SplitText
                  delay={0.2}
                  text="Namu-Agent answers from your own material and takes only the actions you have given it."
                />
              </p>
            </ScrollObject>

            <ScrollObject className={styles.abilityGrid}>
              {ABILITIES.map((a, i) => (
                <article
                  key={a.title}
                  className={`slide-up ${styles.ability}`}
                  style={{ "--i": i % 3 } as React.CSSProperties}
                >
                  <span className={styles.abilityNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className={`text-large ${styles.abilityTitle}`}>{a.title}</h4>
                  <p className={`text-regular ${styles.abilityBody}`}>{a.body}</p>
                </article>
              ))}
            </ScrollObject>
          </div>
        </section>

        {/* ---- Performance --------------------------------------------- */}
        <section id="performance" className={styles.section}>
          <div className="ds-container ds-outer">
            <ScrollObject className={styles.sectionHead}>
              <h2 className={`h4 ${styles.sectionTitle}`}>
                <SplitText text="Measured on completed calls" />
              </h2>
              <p
                className={`text-large ds-span ${styles.sectionLede}`}
                style={{ "--span": 14, marginInline: "auto" } as React.CSSProperties}
              >
                <SplitText
                  delay={0.2}
                  text="Namu-Agent is scored on whether the caller got what they rang for, not on how natural a single turn sounds."
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
              <SplitText text="Try Namu-Agent" />
            </h2>

            <ScrollObject className={styles.tryRow}>
              {[
                {
                  title: "Namu Playground",
                  body: "Talk to it in Hausa and watch the turn play out.",
                  cta: "Try in playground",
                  href: "/playground?model=agent",
                },
                {
                  title: "Namu API",
                  body: "Put it on a phone line, with your own material behind it.",
                  cta: "Contact sales",
                  href: "mailto:contact@namuai.org",
                },
                {
                  title: "All Namu models",
                  body: "Interpretation, speech recognition and speech synthesis.",
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
