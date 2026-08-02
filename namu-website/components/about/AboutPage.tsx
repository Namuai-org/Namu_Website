"use client";

import type { ReactNode } from "react";
import { BgFade } from "@/components/editorial/BgFade";
import { Button } from "@/components/editorial/Button";
import { Footer } from "@/components/editorial/Footer";
import { ScrollObject } from "@/components/editorial/ScrollObject";
import { SplitText } from "@/components/editorial/SplitText";
import styles from "./about.module.css";

/* Page colour per section. Every section declares one so the handover is
   always defined, and the run darkens as the argument gets harder: paper for
   the premise, harmattan once we are running things, clay once other people
   are building on it, forest for the section that takes it all apart. */
const PAPER = "#FFFAF1";
const HARMATTAN = "#F7F0E3";
const CLAY = "#EDD9B0";
const CLAY_TEXT = "#4A2A12";
const FOREST = "#1A3A2E";

/* ── The load path ────────────────────────────────────────────────────────
   A hairline down the left margin, drawn top to bottom as each chapter
   arrives. It stops dead before every hinge clause, and the gap is markup
   rather than motion — so the break is still there in a screenshot, under
   reduced motion, and at any scroll speed. The page's own structure visibly
   waits on the sentence that justifies the next layer. */
function Spine({ capped = false }: { capped?: boolean }) {
  return (
    <span className={styles.spine} aria-hidden="true">
      <i className={styles.spineLine} />
      {capped ? <i className={styles.spineCap} /> : null}
    </span>
  );
}

/* ── A numbered chapter ───────────────────────────────────────────────────
   Heading top left, body dropped low and right. The chapters are full
   spreads, never adjacent columns: three things side by side would read as a
   menu of services, and the whole point is that each one is worthless
   without the next. */
function Chapter({
  index,
  name,
  heading,
  children,
  capped,
}: {
  index: string;
  name: string;
  heading: string;
  children: ReactNode;
  capped?: boolean;
}) {
  return (
    <ScrollObject as="section" className={styles.chapter}>
      <Spine capped={capped} />

      <div className={styles.chapterHead}>
        <p className={`text-small ${styles.marker}`} data-fade>
          <span className={styles.markerNum}>{index}</span>
          <span className={styles.markerName}>{name}</span>
        </p>
        <h2 className={`h3 ${styles.chapterTitle}`}>
          <SplitText text={heading} />
        </h2>
      </div>

      <div className={styles.chapterBody}>{children}</div>
    </ScrollObject>
  );
}

/* ── A hinge ──────────────────────────────────────────────────────────────
   The three sentences that ARE the argument. They are set larger than the
   chapter headings they follow, which is the inversion the page runs on:
   the claim is smaller than the reason it holds. */
function Hinge({ children }: { children: ReactNode }) {
  return (
    <ScrollObject as="section" className={styles.hinge}>
      <p className={`h2 ${styles.hingeText}`}>
        <SplitText text={String(children)} />
      </p>
    </ScrollObject>
  );
}

const LEDGER: [string, string][] = [
  ["A day of travel and a day of waiting", "A question asked from where you already are"],
  ["A form in a language you do not write", "A sentence in the language you speak"],
  ["A document someone else has to read to you", "An answer you receive directly"],
  ["An interface nobody ever taught you", "A way in you already know how to use"],
];

const REMOVALS: [string, string][] = [
  [
    "Without the models",
    "you are translating in and out of English, and the answer arrives thinner than the question.",
  ],
  [
    "Without the infrastructure",
    "you are renting someone else's priorities, and the cost of an answer decides who is allowed to have one.",
  ],
  [
    "Without the organizations",
    "you have a very good system that reaches whoever already had a laptop and a connection.",
  ],
];

export function AboutPage() {
  return (
    <>
      <main id="main-content" className={styles.page}>
        {/* ── Hero ── */}
        <BgFade bg={PAPER}>
          <header className={styles.hero}>
            <div className="ds-container ds-outer">
              <ScrollObject className={styles.heroInner}>
                <p className={`text-small ${styles.heroKicker}`} data-fade>
                  About Namu
                </p>

                {/* The line break is a design decision, so the lines are
                    authored rather than measured. */}
                <h1 className={`h1 ${styles.heroTitle}`}>
                  <SplitText
                    immediate
                    srText="AI is only useful if it can reach you."
                    lines={[
                      "AI is only useful",
                      <>
                        if it can <em>reach</em> you.
                      </>,
                    ]}
                  />
                </h1>

                <p className={`text-large ${styles.heroSub}`} data-fade>
                  Namu builds models that understand African languages, runs the
                  infrastructure that serves them, and lets organizations reach
                  the people they are already trying to serve. We start with
                  Hausa, the language we speak.
                </p>
              </ScrollObject>
            </div>
          </header>
        </BgFade>

        {/* ── The premise ── */}
        <BgFade bg={PAPER}>
          <ScrollObject as="section" className={styles.gap} id="gap">
            <div className={styles.gapHead}>
              <h2 className="h3">
                <SplitText text="The gap is not talent." />
              </h2>
            </div>
            <div className={styles.gapBody}>
              <p className="text-large" data-fade>
                There is no shortage of people here who could use this
                technology. There is a shortage of technology that can be used
                by them.
              </p>
              <p
                className={`text-large ${styles.soft}`}
                data-fade
                style={{ transitionDelay: "0.12s" }}
              >
                Most AI assumes a steady connection, a recent phone, money for
                data, and someone comfortable reading and typing in English.
                Remove any one of those and it breaks. For many people, none of
                the four are there to begin with.
              </p>
            </div>
          </ScrollObject>
        </BgFade>

        {/* ── 01 ── */}
        <BgFade bg={PAPER}>
          <Chapter index="01" name="Models" heading="We build the models." capped>
            <p className="text-large" data-fade>
              Most AI treats an African language as something to translate into.
              We build the other way around. Our models learn Hausa from the way
              people actually speak it — the dialect, the code-switching, the
              regional accent, and the ordinary phrasing that never reaches a
              benchmark.
            </p>
            <p
              className={`text-large ${styles.soft}`}
              data-fade
              style={{ transitionDelay: "0.12s" }}
            >
              Speech comes first, because for most people the first and most
              natural way to use a machine is to talk to it.
            </p>
          </Chapter>
        </BgFade>

        <BgFade bg={PAPER}>
          <Hinge>A model nobody can run is a research result.</Hinge>
        </BgFade>

        {/* ── 02 ── */}
        <BgFade bg={HARMATTAN}>
          <Chapter
            index="02"
            name="Infrastructure"
            heading="We run the infrastructure."
            capped
          >
            <p className="text-large" data-fade>
              A model is not a product until something can run it. We build the
              systems that carry ours into the places they are needed, on
              foundations we control and can take apart when they are wrong.
            </p>
            <p
              className={`text-large ${styles.soft}`}
              data-fade
              style={{ transitionDelay: "0.12s" }}
            >
              Running it ourselves also decides what a single answer costs. And
              cost decides how many people ever get one.
            </p>
          </Chapter>
        </BgFade>

        <BgFade bg={HARMATTAN}>
          <Hinge>Infrastructure with nothing running on it is a bill.</Hinge>
        </BgFade>

        {/* ── 03 ── */}
        <BgFade bg={CLAY} text={CLAY_TEXT}>
          <Chapter
            index="03"
            name="Organizations"
            heading="Organizations build on both."
          >
            <p className="text-large" data-fade>
              We do not reach everyone ourselves. The clinics, banks, schools and
              government offices already serving these communities do that, and
              they already know where they lose people. They build on what we
              run.
            </p>
            <p
              className="text-large"
              data-fade
              style={{ transitionDelay: "0.12s" }}
            >
              What that looks like depends on who is on the other end. Sometimes
              it is a message in an app they already keep open. Sometimes it is a
              phone call, because a call is what the person has. Sometimes it has
              to keep working when the signal drops, or never ask anyone to read
              at all.
            </p>
            <p
              className="text-large"
              data-fade
              style={{ transitionDelay: "0.24s" }}
            >
              The list is open. Whatever that person can actually reach is the
              right way in, and there will be more of them next year.
            </p>
          </Chapter>
        </BgFade>

        {/* ── What it removes ── */}
        <BgFade bg={CLAY} text={CLAY_TEXT}>
          <ScrollObject as="section" className={styles.ledger}>
            <div className={styles.ledgerHead}>
              <p className={`text-small ${styles.marker}`} data-fade>
                <span className={styles.markerName}>What it takes away</span>
              </p>
              <h2 className="h3">
                <SplitText text="Access is what it takes away." />
              </h2>
              <p className={`text-regular ${styles.ledgerIntro}`} data-fade>
                Every line below is a cost someone pays today to get an answer.
              </p>
            </div>

            <ul className={styles.ledgerRows}>
              {LEDGER.map(([cost, instead], i) => (
                <li
                  key={cost}
                  className={styles.ledgerRow}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <span className={`text-regular ${styles.ledgerCost}`}>
                    {cost}
                  </span>
                  <span className={`text-regular ${styles.ledgerInstead}`}>
                    {instead}
                  </span>
                </li>
              ))}
            </ul>

            <p className={`h3 ${styles.ledgerLanding}`} data-fade>
              Enough of those, and the language a person speaks no longer
              decides the technology they are allowed to use.
            </p>
          </ScrollObject>
        </BgFade>

        {/* ── The proof ── */}
        <BgFade bg={FOREST} text={PAPER}>
          <ScrollObject as="section" className={styles.remove}>
            <h2 className={`h3 ${styles.removeTitle}`}>
              <SplitText text="Remove one layer." />
            </h2>

            <ul className={styles.removeRows}>
              {REMOVALS.map(([label, consequence], i) => (
                <li
                  key={label}
                  className={styles.removeRow}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <span className={`text-small ${styles.removeLabel}`}>
                    {label}
                  </span>
                  <span className={`text-regular ${styles.removeText}`}>
                    {consequence}
                  </span>
                </li>
              ))}
            </ul>

            <p className={`h2 ${styles.removeLanding}`} data-fade>
              That is why it is one job and not three.
            </p>
          </ScrollObject>
        </BgFade>

        {/* ── Close ── */}
        <BgFade bg={PAPER}>
          <ScrollObject as="section" className={styles.close}>
            <h2 className="h3">
              <SplitText text="Namu is early." />
            </h2>

            <div className={styles.closeBody}>
              <p className="text-large" data-fade>
                It is built in Niger and the United States, by people who speak
                the language the work is for. The team is small on purpose and
                close to the problem.
              </p>
              <p
                className={`text-large ${styles.soft}`}
                data-fade
                style={{ transitionDelay: "0.12s" }}
              >
                We are looking for organizations that already carry the last
                stretch — the ones with people to reach and no good way to reach
                them in the right language. We are also looking for people who
                want to build the models and the infrastructure underneath.
              </p>
              <p
                className={`h5 ${styles.closeLine}`}
                data-fade
                style={{ transitionDelay: "0.24s" }}
              >
                If either is you, write to us.
              </p>
              <div data-fade style={{ transitionDelay: "0.36s" }}>
                <Button href="mailto:contact@namuai.org">Get in touch</Button>
              </div>
            </div>
          </ScrollObject>
        </BgFade>
      </main>

      <Footer />
    </>
  );
}
