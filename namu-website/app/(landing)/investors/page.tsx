import type { Metadata } from "next";
import { InvestorsPage } from "@/components/investors/InvestorsPage";

const DESCRIPTION =
  "Namu builds speech models for African languages, starting with Hausa, and delivers them on the channels people already have.";

export const metadata: Metadata = {
  title: "Investors | Namu",
  description: DESCRIPTION,
  alternates: { canonical: "/investors" },
  openGraph: {
    title: "Investors | Namu",
    description: DESCRIPTION,
    type: "website",
    url: "/investors",
  },
  twitter: {
    card: "summary_large_image",
    title: "Investors | Namu",
    description: DESCRIPTION,
  },
};

export default function InvestorsRoute() {
  return <InvestorsPage />;
}
