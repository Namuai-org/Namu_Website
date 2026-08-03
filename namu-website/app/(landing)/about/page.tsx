import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

/* The route stays so the homepage lead card and the sitemap keep resolving,
   but the page itself is empty for now. Metadata is trimmed to match: a rich
   description and an AboutPage/Organization block would be describing content
   that is not on the page, which is worse than describing nothing. Both come
   back with the page. */
export const metadata: Metadata = {
  title: "About | Namu",
  description: "About Namu.",
  alternates: { canonical: "/about" },
  robots: { index: false, follow: true },
};

export default function AboutRoute() {
  return <AboutPage />;
}
