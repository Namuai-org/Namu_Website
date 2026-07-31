import type { Metadata } from "next";
import { Footer } from "@/components/editorial/Footer";
import { postsByDate } from "@/lib/blog";
import { blogIndexJsonLd } from "@/lib/structuredData";
import { BlogIndex } from "./BlogIndex";

const DESCRIPTION =
  "Research, language and progress notes from Namu — speech-native AI for African languages, starting with Hausa.";

export const metadata: Metadata = {
  title: "Journal | Namu",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Namu Journal",
    description: DESCRIPTION,
    type: "website",
    url: "/blog",
    images: [postsByDate[0]?.image ?? "/editorial/canyon-ochre-wide.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Namu Journal",
    description: DESCRIPTION,
    images: [postsByDate[0]?.image ?? "/editorial/canyon-ochre-wide.jpg"],
  },
};

/**
 * Server shell. The interactive index is a client child, which keeps this
 * route able to export metadata and render structured data — a client
 * component can do neither.
 */
export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Content is built from our own data, never user input.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogIndexJsonLd(postsByDate)),
        }}
      />
      <BlogIndex />
      <Footer />
    </>
  );
}
