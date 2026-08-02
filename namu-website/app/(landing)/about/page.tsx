import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

const DESCRIPTION =
  "Namu builds models that understand African languages, runs the infrastructure that serves them, and lets organizations reach the people they are already trying to serve. Starting with Hausa.";

export const metadata: Metadata = {
  title: "About | Namu",
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Namu",
    description: DESCRIPTION,
    type: "website",
    url: "/about",
    images: ["/namu.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Namu",
    description: DESCRIPTION,
    images: ["/namu.jpeg"],
  },
};

/* Server shell, so the route can export metadata and emit structured data —
   a client component can do neither. */
export default function AboutRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        // Built from our own copy, never user input.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Namu",
            description: DESCRIPTION,
            url: "https://namu.ai/about",
            mainEntity: {
              "@type": "Organization",
              name: "Namu",
              url: "https://namu.ai",
              description: DESCRIPTION,
              foundingLocation: { "@type": "Place", name: "Niger" },
            },
          }),
        }}
      />
      <AboutPage />
    </>
  );
}
