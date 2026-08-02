"use client";

import { useRef, useState } from "react";
import { BgFade } from "@/components/editorial/BgFade";
import { Button } from "@/components/editorial/Button";
import { Footer } from "@/components/editorial/Footer";
import { ScrollObject } from "@/components/editorial/ScrollObject";
import { SplitText } from "@/components/editorial/SplitText";
import { clamp, useRafScroll } from "@/hooks/useRafScroll";
import styles from "./about.module.css";

const PAPER = "#FFFAF1";
const HARMATTAN = "#F7F0E3";
const CLAY = "#EDD9B0";
const CLAY_TEXT = "#4A2A12";
const FOREST = "#1A3A2E";

/* ── The stack ────────────────────────────────────────────────────────────
   The three things Namu does are not a list of services, they are a stack —
   each one only works because the one under it exists. So the page builds it
   in front of you rather than describing it: models land first, infrastructure
   settles on top, organizations last. The hinge line is what makes the next
   slab necessary, and it arrives as that slab does.

   Bottom to top, which is why `models` is first. */
const LAYERS = [
  {
    n: "01",
    name: "Models",
    heading: "We build the models.",
    body: "Most AI treats an African language as something to translate into. We build the other way around. Our models learn Hausa from the way people actually speak it — the dialect, the code-switching, the regional accent, and the ordinary phrasing that never reaches a benchmark.",
    hinge: "A model nobody can run is a research result.",
  },
  {
    n: "02",
    name: "Infrastructure",
    heading: "We run the infrastructure.",
    body: "A model is not a product until something can run it. We build the systems that carry ours into the places they are needed, on foundations we control and can take apart when they are wrong. Running it ourselves also decides what a single answer costs, and cost decides how many people ever get one.",
    hinge: "Infrastructure with nothing running on it is a bill.",
  },
  {
    n: "03",
    name: "Organizations",
    heading: "Organizations build on both.",
    body: "We do not reach everyone ourselves. The clinics, banks, schools and government offices already serving these communities do that, and they already know where they lose people. What it looks like depends on who is on the other end — a message in an app they already keep open, a phone call because a call is what the person has, something that keeps working when the signal drops, or something that never asks anyone to read at all. The list is open.",
    hinge: null,
  },
] as const;

function Stack() {
  const sectionRef = useRef<HTMLElement>(null);
  const slabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useRafScroll((scrollY, viewportH) => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.innerWidth <= 900) return;

    const rect = section.getBoundingClientRect();
    const top = rect.top + scrollY;
    const runway = section.offsetHeight - viewportH;
    if (runway <= 0) return;

    const p = clamp((scrollY - top) / runway);

    slabRefs.current.forEach((el, i) => {
      if (!el) return;
      // Each slab owns a third of the runway, with a little overlap so the
      // next one is already moving before the last has settled.
      const local = clamp((p - i * 0.3) / 0.34);
      const eased = local * local * (3 - 2 * local);

      // Drops in from below and settles onto the one beneath it.
      const y = (1 - eased) * 130;
      el.style.transform = `translate3d(0, ${y.toFixed(1)}%, 0)`;
      el.style.opacity = Math.min(1, local * 2.2).toFixed(3);
    });

    const i = Math.min(LAYERS.length - 1, Math.floor(p * LAYERS.length * 0.999));
    setActive((cur) => (cur === i ? cur : i));
  });

  return (
    <section ref={sectionRef} className={styles.stack} id="stack">
      <div className={styles.stackPin}>
        <div className={`ds-container ds-outer ${styles.stackGrid}`}>
          {/* Rendered bottom-first so the slab higher in the stack is later in
              the DOM and paints over the one beneath it — the way a real stack
              of sheets reads, and without needing z-index. */}
          <div className={styles.slabs} aria-hidden="true">
            {LAYERS.map((layer, i) => (
              <div
                key={layer.n}
                ref={(el) => {
                  slabRefs.current[i] = el;
                }}
                className={`${styles.slab} ${i === active ? styles.slabActive : ""}`}
                style={{ "--depth": i } as React.CSSProperties}
              >
                <span className={`text-small ${styles.slabNum}`}>{layer.n}</span>
                <span className={`text-large-alt ${styles.slabName}`}>
                  {layer.name}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.stackCopy}>
            {LAYERS.map((layer, i) => (
              <div
                key={layer.n}
                className={`${styles.panel} ${i === active ? styles.panelOn : ""}`}
                aria-hidden={i !== active}
              >
                <p className={`text-small ${styles.marker}`}>
                  <span className={styles.markerNum}>{layer.n}</span>
                  <span className={styles.markerName}>{layer.name}</span>
                </p>
                <h3 className={`h4 ${styles.panelTitle}`}>{layer.heading}</h3>
                <p className={`text-regular ${styles.panelBody}`}>{layer.body}</p>
                {layer.hinge ? (
                  <p className={`text-large ${styles.hinge}`}>{layer.hinge}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const REMOVALS: [string, string][] = [
  ["Without the models", "you are translating in and out of English, and the answer arrives thinner than the question."],
  ["Without the infrastructure", "you are renting someone else's priorities, and the cost of an answer decides who is allowed to have one."],
  ["Without the organizations", "you have a very good system that reaches whoever already had a laptop and a connection."],
];

const LEDGER: [string, string][] = [
  ["A day of travel and a day of waiting", "A question asked from where you already are"],
  ["A form in a language you do not write", "A sentence in the language you speak"],
  ["A document someone else has to read to you", "An answer you receive directly"],
  ["An interface nobody ever taught you", "A way in you already know how to use"],
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

        {/* ── The sentence ──
            The page turns on one spoken question. Everything after it is what
            has to exist for that sentence to get an answer — which reframes
            the whole page from "what we build" to "what this costs to
            answer". */}
        <BgFade bg={FOREST} text={PAPER}>
          <ScrollObject as="section" className={styles.utterance}>
            <p className={`text-small ${styles.utteranceKicker}`} data-fade>
              Someone says this out loud
            </p>
            <p className={`h2 ${styles.utteranceLine}`}>
              <SplitText text="Ina asibiti mafi kusa?" />
            </p>
            <p className={`text-regular ${styles.utteranceGloss}`} data-fade>
              Where is the nearest clinic?
            </p>
            <p
              className={`text-large ${styles.utteranceAfter}`}
              data-fade
              style={{ transitionDelay: "0.18s" }}
            >
              She does not type it. She has no reason to. Everything below is
              what has to exist before that sentence gets an answer.
            </p>
          </ScrollObject>
        </BgFade>

        {/* ── The stack builds ── */}
        <BgFade bg={HARMATTAN}>
          <Stack />
        </BgFade>

        {/* ── The proof ── */}
        <BgFade bg={FOREST} text={PAPER}>
          <ScrollObject as="section" className={styles.remove}>
            <h2 className={`h3 ${styles.removeTitle}`}>
              <SplitText text="Take one away." />
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

        {/* ── What it costs today ── */}
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
