import { Footer } from "@/components/editorial/Footer";

/**
 * Deliberately empty.
 *
 * The content and the design were both removed at the founder's request; the
 * route stays because the homepage lead card and the sitemap point at it, and
 * deleting it would 404 both. What is left is the bare frame — the container,
 * one heading, and the shared footer — so there is somewhere to build.
 *
 * The previous version is in git if any of it is wanted back:
 *   git show f2f6202 -- components/about/
 */
export function AboutPage() {
  return (
    <>
      <main id="main-content" className="ds-container ds-outer">
        <h1 className="h3" style={{ paddingBlock: "calc(240 * var(--unit-fx))" }}>
          About
        </h1>
      </main>

      <Footer />
    </>
  );
}
