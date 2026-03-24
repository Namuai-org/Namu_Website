import styles from "./brand.module.css";

export default function BrandPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <div className="hero-entrance">
            <div className={styles.eyebrow}>Namu Brand Exploration</div>
            <h1 className={styles.headline}>Three stronger logo directions, built before we choose one.</h1>
            <p className={styles.lede}>
              The live site has been reset to a simple text wordmark. This page is now the review room: three distinct
              identity directions with more authorship, more cultural intelligence, and a clearer emotional point of view.
            </p>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroQuote}>
              <p className={styles.heroQuoteText}>
                Namu means ours. The final logo should feel less like a startup monogram and more like a shared piece of
                cultural infrastructure.
              </p>
            </div>
            <div className={styles.heroMeta}>
              <div className={styles.heroMetaRow}>
                <span>Recommended path</span>
                <strong>Woven Belonging</strong>
              </div>
              <div className={styles.heroMetaRow}>
                <span>Creative brief</span>
                <strong>Warm, iconic, rooted, not folkloric</strong>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.grid}>
          <article className={styles.panel}>
            <header className={styles.panelHeader}>
              <div>
                <h2 className={styles.panelTitle}>Concept 1: Woven Belonging</h2>
                <p className={styles.panelHint}>The strongest strategic fit. Shared structure, human warmth, clear icon potential.</p>
              </div>
            </header>
            <div className={styles.stage}>
              <span className={styles.boardLabel}>Light Background</span>
              <div className={styles.boardLight}>
                <div className={styles.conceptFrame}>
                  <svg viewBox="0 0 420 160" className={styles.conceptLogo} aria-label="Woven Belonging logo">
                    <g fill="#D6703F">
                      <path d="M52 32H82V128H52C41 128 32 119 32 108V52C32 41 41 32 52 32Z" />
                      <path d="M180 32H210C221 32 230 41 230 52V108C230 119 221 128 210 128H180V32Z" />
                      <path d="M82 52C82 41 91 32 102 32H118L180 106V128H157L82 60V52Z" />
                      <path d="M82 128V106L144 32H170L95 128H82Z" />
                    </g>
                    <text x="262" y="102" fill="#171514" fontFamily="var(--font-body), sans-serif" fontSize="60" fontWeight="700" letterSpacing="-3">Namu</text>
                  </svg>
                </div>
              </div>
              <span className={`${styles.boardLabel} ${styles.darkLabel}`}>Dark Background</span>
              <div className={styles.boardDark}>
                <div className={styles.conceptFrame}>
                  <svg viewBox="0 0 420 160" className={styles.conceptLogo} aria-label="Woven Belonging logo dark">
                    <g fill="#D6703F">
                      <path d="M52 32H82V128H52C41 128 32 119 32 108V52C32 41 41 32 52 32Z" />
                      <path d="M180 32H210C221 32 230 41 230 52V108C230 119 221 128 210 128H180V32Z" />
                      <path d="M82 52C82 41 91 32 102 32H118L180 106V128H157L82 60V52Z" />
                      <path d="M82 128V106L144 32H170L95 128H82Z" />
                    </g>
                    <text x="262" y="102" fill="#F5EFE6" fontFamily="var(--font-body), sans-serif" fontSize="60" fontWeight="700" letterSpacing="-3">Namu</text>
                  </svg>
                </div>
              </div>
              <p className={styles.conceptText}>Two forms interlock to create the whole. It expresses “ours” without becoming sentimental.</p>
            </div>
          </article>

          <article className={styles.panel}>
            <header className={styles.panelHeader}>
              <div>
                <h2 className={styles.panelTitle}>Concept 2: Sahel Signal</h2>
                <p className={styles.panelHint}>Sharper and more architectural, drawing from Sahel geometry and coded rhythm.</p>
              </div>
            </header>
            <div className={styles.stage}>
              <span className={styles.boardLabel}>Light Background</span>
              <div className={styles.boardLight}>
                <div className={styles.conceptFrame}>
                  <svg viewBox="0 0 420 160" className={styles.conceptLogo} aria-label="Sahel Signal logo">
                    <g fill="#D6703F">
                      <path d="M34 118L72 42H100L62 118H34Z" />
                      <path d="M108 42H138L176 118H146L108 42Z" />
                      <path d="M166 42H196L234 118H204L166 42Z" />
                      <circle cx="122" cy="80" r="12" fill="#171514" />
                    </g>
                    <text x="258" y="102" fill="#171514" fontFamily="var(--font-body), sans-serif" fontSize="60" fontWeight="700" letterSpacing="-3">Namu</text>
                  </svg>
                </div>
              </div>
              <span className={`${styles.boardLabel} ${styles.darkLabel}`}>Dark Background</span>
              <div className={styles.boardDark}>
                <div className={styles.conceptFrame}>
                  <svg viewBox="0 0 420 160" className={styles.conceptLogo} aria-label="Sahel Signal logo dark">
                    <g fill="#D6703F">
                      <path d="M34 118L72 42H100L62 118H34Z" />
                      <path d="M108 42H138L176 118H146L108 42Z" />
                      <path d="M166 42H196L234 118H204L166 42Z" />
                      <circle cx="122" cy="80" r="12" fill="#F5EFE6" />
                    </g>
                    <text x="258" y="102" fill="#F5EFE6" fontFamily="var(--font-body), sans-serif" fontSize="60" fontWeight="700" letterSpacing="-3">Namu</text>
                  </svg>
                </div>
              </div>
              <p className={styles.conceptText}>More editorial and premium. This one could feel world-class if refined carefully, but it is cooler and less intimate.</p>
            </div>
          </article>

          <article className={styles.panel}>
            <header className={styles.panelHeader}>
              <div>
                <h2 className={styles.panelTitle}>Concept 3: Human Voice</h2>
                <p className={styles.panelHint}>Language-first and softer, built around speech, exchange, and accessible intelligence.</p>
              </div>
            </header>
            <div className={styles.stage}>
              <span className={styles.boardLabel}>Light Background</span>
              <div className={styles.boardLight}>
                <div className={styles.conceptFrame}>
                  <svg viewBox="0 0 420 160" className={styles.conceptLogo} aria-label="Human Voice logo">
                    <g fill="none" stroke="#D6703F" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M48 110V50L120 110V50L192 110V50" />
                    </g>
                    <circle cx="120" cy="80" r="13" fill="#D6703F" />
                    <text x="242" y="102" fill="#171514" fontFamily="var(--font-body), sans-serif" fontSize="60" fontWeight="700" letterSpacing="-3">Namu</text>
                  </svg>
                </div>
              </div>
              <span className={`${styles.boardLabel} ${styles.darkLabel}`}>Dark Background</span>
              <div className={styles.boardDark}>
                <div className={styles.conceptFrame}>
                  <svg viewBox="0 0 420 160" className={styles.conceptLogo} aria-label="Human Voice logo dark">
                    <g fill="none" stroke="#D6703F" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M48 110V50L120 110V50L192 110V50" />
                    </g>
                    <circle cx="120" cy="80" r="13" fill="#D6703F" />
                    <text x="242" y="102" fill="#F5EFE6" fontFamily="var(--font-body), sans-serif" fontSize="60" fontWeight="700" letterSpacing="-3">Namu</text>
                  </svg>
                </div>
              </div>
              <p className={styles.conceptText}>Friendlier and more conversational, though it risks being less iconic than the woven direction.</p>
            </div>
          </article>

          <article className={styles.panel}>
            <header className={styles.panelHeader}>
              <div>
                <h2 className={styles.panelTitle}>Recommendation</h2>
                <p className={styles.panelHint}>What I would pursue if we were designing this like a real identity engagement.</p>
              </div>
            </header>
            <div className={styles.stage}>
              <div className={styles.noteCard}>
                <h3 className={styles.noteTitle}>Choose Woven Belonging</h3>
                <p className={styles.noteText}>
                  It has the clearest emotional truth: separate forms becoming whole together. That gives Namu a story-led
                  foundation that can scale from icon to product system without collapsing into generic AI branding.
                </p>
              </div>
              <div className={styles.noteCard}>
                <h3 className={styles.noteTitle}>What needs refinement next</h3>
                <p className={styles.noteText}>
                  Proportion, spacing, and typographic pairing. The next step should be to take one route and refine it to
                  true final-form quality instead of spreading effort across multiple half-finished marks.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className={styles.notes}>
          <article className={styles.noteCard}>
            <h2 className={styles.noteTitle}>What changed</h2>
            <p className={styles.noteText}>
              The first round tried to finish too early. This round is more honest: it treats the work as concept
              development, not fake certainty. Each direction has a distinct strategic voice so we can choose the right
              lane before polishing.
            </p>
          </article>

          <aside className={styles.noteCard}>
            <h2 className={styles.noteTitle}>Palette</h2>
            <div className={styles.palette}>
              <div className={styles.swatch}>
                <div className={styles.swatchChip} style={{ background: "#D6703F" }} />
                <div className={styles.swatchMeta}>
                  <strong>Terracotta</strong>
                  <span>#D6703F</span>
                </div>
              </div>
              <div className={styles.swatch}>
                <div className={styles.swatchChip} style={{ background: "#F5EFE6" }} />
                <div className={styles.swatchMeta}>
                  <strong>Parchment</strong>
                  <span>#F5EFE6</span>
                </div>
              </div>
              <div className={styles.swatch}>
                <div className={styles.swatchChip} style={{ background: "#171514" }} />
                <div className={styles.swatchMeta}>
                  <strong>Ink</strong>
                  <span>#171514</span>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
