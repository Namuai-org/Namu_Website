"use client";

/* eslint-disable @next/next/no-img-element -- static assets in /public; the
   founder portraits and the brand plate are already sized for their frames. */

import type { ReactNode } from "react";
import { BgFade } from "@/components/editorial/BgFade";
import { Button } from "@/components/editorial/Button";
import { Footer } from "@/components/editorial/Footer";
import { ScrollObject } from "@/components/editorial/ScrollObject";
import { SplitText } from "@/components/editorial/SplitText";
import styles from "./about.module.css";

/* Page background per section, so the handover is always defined and the page
   keeps the same slow colour rhythm as the homepage. */
const PAPER = "#FFFAF1";
const HARMATTAN = "#F7F0E3";
const CLAY = "#EDD9B0";
const CLAY_TEXT = "#4A2A12";

function Section({
  id,
  index,
  kicker,
  title,
  intro,
  bg,
  text,
  children,
}: {
  id: string;
  index: string;
  kicker: string;
  title: string;
  intro?: string;
  bg: string;
  text?: string;
  children?: ReactNode;
}) {
  return (
    <BgFade bg={bg} text={text}>
      <section id={id} className={styles.section}>
        <div className="ds-container ds-outer">
          <ScrollObject className={styles.head}>
            <div className={styles.headMeta}>
              <span className={`text-small ${styles.index}`}>{index}</span>
              <span className={`text-small ${styles.kicker}`}>{kicker}</span>
            </div>
            <div className={styles.headBody}>
              <h2 className={`h5 ${styles.title}`}>
                <SplitText text={title} />
              </h2>
              {intro ? (
                <p className={`text-regular ${styles.intro}`} data-fade>
                  {intro}
                </p>
              ) : null}
            </div>
          </ScrollObject>
          {children ? <div className={styles.body}>{children}</div> : null}
        </div>
      </section>
    </BgFade>
  );
}

/* ── The closed loop ──────────────────────────────────────────────────────
   Four arcs on one circle, drawn on in sequence when the section arrives —
   the same stroke-dashoffset technique the homepage annotations use. The
   point of drawing it rather than listing it is that the argument *is* the
   shape: each condition causes the next, and the last causes the first. */
const R = 140;
const C = 200;
const pt = (deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [C + R * Math.cos(a), C + R * Math.sin(a)] as const;
};
const arc = (from: number, to: number) => {
  const [x1, y1] = pt(from);
  const [x2, y2] = pt(to);
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${R} ${R} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
};

const LOOP_NODES = [
  { at: -90, label: "No data" },
  { at: 0, label: "Weak models" },
  { at: 90, label: "No tools" },
  { at: 180, label: "No usage" },
];

function Loop() {
  return (
    <svg
      className={styles.loop}
      viewBox="0 0 400 400"
      role="img"
      aria-label="A closed cycle: no data leads to weak models, weak models to no usable tools, no tools to no usage, and no usage back to no data."
    >
      <defs>
        <marker
          id="loop-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ds-accent)" />
        </marker>
      </defs>

      {[
        arc(-82, -12),
        arc(8, 78),
        arc(98, 168),
        arc(188, 258),
      ].map((d, i) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
          markerEnd="url(#loop-arrow)"
          style={{ transitionDelay: `${0.15 + i * 0.22}s` }}
        />
      ))}

      {LOOP_NODES.map((n, i) => {
        const [x, y] = pt(n.at);
        return (
          <g key={n.label} style={{ transitionDelay: `${0.3 + i * 0.22}s` }} className={styles.loopNode}>
            <circle cx={x} cy={y} r="7" />
            <text x={x} y={n.at === 90 ? y + 30 : n.at === -90 ? y - 20 : y - 20} textAnchor="middle">
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Language roadmap ────────────────────────────────────────────────── */
const LANGUAGES = [
  {
    name: "Hausa",
    status: "In build",
    note: "Tens of millions of speakers across northern Nigeria, Niger and beyond, and centuries of written scholarship. Almost nothing built for it.",
  },
  {
    name: "Zarma",
    status: "Next",
    note: "Spoken widely along the Niger river in the southwest, and a first language for millions who have no tools in it at all.",
  },
  {
    name: "Fulfulde",
    status: "After that",
    note: "Runs in a band across the Sahel from Senegal to Cameroon. It has always crossed borders, which is exactly what makes it hard and worth doing.",
  },
];

/* ── The people ───────────────────────────────────────────────────────── */
const PEOPLE = [
  {
    name: "Mouhamad Mamane",
    role: "Co-founder",
    photo: "/mouhamad.jpeg",
    alt: "Mouhamad Mamane speaking at a podium",
  },
  {
    name: "Co-founder",
    role: "Co-founder",
    photo: "/editorial/panel-cofounder.jpg",
    alt: "Namu co-founder portrait",
  },
];

const PRINCIPLES = [
  ["Language", "We start from the language, not from a translation layer bolted onto something built elsewhere."],
  ["Consent", "Voices that train a system should know it, agree to it, and be able to change their mind."],
  ["Depth", "One language done properly is worth more than ten announced."],
  ["Proximity", "We build close to the people we build for, and we are wrong less often because of it."],
  ["Rigour", "We say what a model can and cannot do, and we publish how we measured it."],
  ["Openness", "The layer beneath should be something others can build on."],
];

export function AboutPage() {
  return (
    <>
      <main id="main-content" className={styles.page}>
        {/* ── Hero ── */}
        <BgFade bg={PAPER}>
          <header className={styles.hero}>
            <div className="ds-container ds-outer">
              <p className={`text-small ${styles.heroEyebrow}`}>About Namu</p>

              <h1 className={`h1 ${styles.heroTitle}`}>
                <SplitText
                  immediate
                  srText="Our language. Our future."
                  lines={["Our language.", <em key="f">Our future.</em>]}
                />
              </h1>

              <ScrollObject className={styles.heroLead}>
                <p className="text-large" data-fade>
                  Namu is an African AI research and technology company. We build
                  speech-native models, datasets and products so that people can
                  use technology by talking to it, in the language they already
                  think in.
                </p>
              </ScrollObject>

              <ScrollObject className={styles.heroStage}>
                <div className={styles.heroFrame}>
                  <img
                    src="/namu.jpeg"
                    alt="The Namu mark over an acacia at dusk"
                    className="scale-out"
                  />
                </div>
              </ScrollObject>
            </div>
          </header>
        </BgFade>

        {/* ── 01 The gap ── */}
        <Section
          id="gap"
          index="01"
          kicker="Why we exist"
          title="The gap is not talent. It is infrastructure."
          intro="More than seventy million people speak Hausa. The language carries centuries of written scholarship. What it does not carry is presence in the datasets, models and benchmarks that decide what modern AI can do — and that absence compounds."
          bg={PAPER}
        >
          <ScrollObject className={styles.gap}>
            <div className={styles.gapDiagram}>
              <Loop />
            </div>

            <div className={styles.gapNote}>
              <p className={`text-regular ${styles.gapP} slide-up`}>
                No data means weak models. Weak models mean no usable tools. No
                tools mean no usage — and no usage means no new data. The loop
                closes on itself, and it stays closed until someone deliberately
                breaks it.
              </p>
              <p
                className={`text-regular ${styles.gapP} slide-up`}
                style={{ "--i": 1 } as React.CSSProperties}
              >
                Breaking it is not a feature you can add to somebody else&apos;s
                system. It has to be built from the language outward, and it has
                to be built on purpose.
              </p>
            </div>
          </ScrollObject>
        </Section>

        {/* ── 02 What we build ── */}
        <Section
          id="what"
          index="02"
          kicker="What we build"
          title="Speech first, because that is how the language is actually used."
          intro="Most of the world's languages are spoken far more than they are typed. Building text-first and adding voice later inherits every assumption text made — so we start at the other end."
          bg={HARMATTAN}
        >
          <ScrollObject className={styles.pillars}>
            {[
              { idx: "01", title: "Models", body: "Speech-native models that hear and answer in the language, without routing through English on the way." },
              { idx: "02", title: "Data", body: "Consented, documented corpora of how people actually speak — conversational, code-switched, across dialects." },
              { idx: "03", title: "Products", body: "Tools ordinary people and institutions can use: writing, translation, voice interfaces, and the plumbing beneath them." },
            ].map((c, i) => (
              <article
                key={c.idx}
                className={`${styles.pillar} slide-up`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <span className={`text-small ${styles.pillarIdx}`}>{c.idx}</span>
                <h3 className="h7">{c.title}</h3>
                <p className={`text-regular ${styles.pillarBody}`}>{c.body}</p>
              </article>
            ))}
          </ScrollObject>
        </Section>

        {/* ── 03 Languages ── */}
        <Section
          id="languages"
          index="03"
          kicker="Where we start"
          title="Depth before breadth."
          intro="Announcing support for fifty languages is easy and mostly meaningless. Supporting a language and serving it are different claims, and everything that makes the difference is language-specific and slow to build."
          bg={PAPER}
        >
          <ScrollObject className={styles.languages}>
            {LANGUAGES.map((l, i) => (
              <article
                key={l.name}
                className={`${styles.language} slide-up`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className={styles.languageTop}>
                  <h3 className="h6">{l.name}</h3>
                  <span className={`text-small ${styles.status}`}>{l.status}</span>
                </div>
                <p className={`text-regular ${styles.languageNote}`}>{l.note}</p>
              </article>
            ))}
          </ScrollObject>
        </Section>

        {/* ── 04 Principles ── */}
        <Section
          id="principles"
          index="04"
          kicker="How we work"
          title="Six commitments we can be held to."
          bg={CLAY}
          text={CLAY_TEXT}
        >
          <ScrollObject className={styles.principles}>
            {PRINCIPLES.map(([name, body], i) => (
              <div
                key={name}
                className={`${styles.principle} slide-up`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <h3 className={`h7 ${styles.principleName}`}>{name}</h3>
                <p className={`text-regular ${styles.principleBody}`}>{body}</p>
              </div>
            ))}
          </ScrollObject>
        </Section>

        {/* ── 05 People ── */}
        <Section
          id="people"
          index="05"
          kicker="The people"
          title="Small on purpose, and close to the work."
          intro="We are a small team of researchers, engineers and builders, working close to the communities the system is for. That proximity is not sentiment — it is why we are wrong less often."
          bg={PAPER}
        >
          <ScrollObject className={styles.people}>
            {PEOPLE.map((p, i) => (
              <figure
                key={p.name}
                className={`${styles.person} slide-up`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className={styles.personFrame}>
                  <img src={p.photo} alt={p.alt} loading="lazy" />
                </div>
                <figcaption className={styles.personMeta}>
                  <strong className="text-large-alt">{p.name}</strong>
                  <span className={`text-small ${styles.personRole}`}>
                    {p.role}
                  </span>
                </figcaption>
              </figure>
            ))}
          </ScrollObject>

          <ScrollObject className={styles.quote}>
            <blockquote className={`h6 ${styles.quoteText}`} data-fade>
              &ldquo;Language should never be a barrier to accessing the
              world&apos;s most powerful tools.&rdquo;
            </blockquote>
            <p className={`text-small ${styles.quoteAttr}`} data-fade>
              Mouhamad Mamane — Co-founder, Namu
            </p>
          </ScrollObject>
        </Section>

        {/* ── 06 Work with us ── */}
        <Section
          id="work-with-us"
          index="06"
          kicker="Work with us"
          title="If this is your problem too, come and build it."
          bg={HARMATTAN}
        >
          <ScrollObject className={styles.cta}>
            <p className={`text-regular ${styles.ctaP}`} data-fade>
              We are looking for people who want to work on hard problems in
              speech, language, data and product — and for partners in health,
              finance, education and government who need to reach people in the
              language they speak.
            </p>
            <div className={styles.ctaActions} data-fade>
              <Button href="mailto:contact@namuai.org">Get in touch</Button>
              <Button href="/blog" variant="invert" simple>
                Read the journal
              </Button>
            </div>
          </ScrollObject>
        </Section>
      </main>

      <Footer />
    </>
  );
}
