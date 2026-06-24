import type { ReactNode } from "react";
import { Footer } from "@/components/landing/Footer";
import styles from "./legal.module.css";

export type LegalTocItem = { id: string; label: string };

export function LegalDocLayout({
  kicker,
  title,
  lastUpdated,
  intro,
  toc,
  children,
}: {
  kicker: string;
  title: string;
  lastUpdated: string;
  intro: string;
  toc: LegalTocItem[];
  children: ReactNode;
}) {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>{kicker}</p>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.meta}>
          <span>Last updated: {lastUpdated}</span>
          <span>Namu AI</span>
        </div>
        <p className={styles.intro}>{intro}</p>
      </section>

      <div className={styles.layout}>
        <nav className={styles.toc} aria-label={`${title} sections`}>
          <p className={styles.tocLabel}>On this page</p>
          {toc.map((item) => (
            <a key={item.id} href={`#${item.id}`} className={styles.tocLink}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.content}>{children}</div>
      </div>

      <Footer />
    </div>
  );
}

export function Entry({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article id={id} className={styles.entry}>
      <div className={styles.entryHead}>
        <span className={styles.entryNum}>{num}</span>
        <h2 className={styles.entryTitle}>{title}</h2>
      </div>
      {children}
    </article>
  );
}

export function EntryP({ children }: { children: ReactNode }) {
  return <p className={styles.entryP}>{children}</p>;
}

export function EntryUl({ items }: { items: ReactNode[] }) {
  return (
    <ul className={styles.entryUl}>
      {items.map((item, i) => (
        <li key={i} className={styles.entryLi}>{item}</li>
      ))}
    </ul>
  );
}

export function EntryA({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className={styles.entryA}>
      {children}
    </a>
  );
}

export function FootNote({ children }: { children: ReactNode }) {
  return <p className={styles.footNote}>{children}</p>;
}
