import type { Metadata } from "next";
import { NamuInterpretPage } from "@/components/models/interpret/NamuInterpretPage";

const DESCRIPTION =
  "Namu-Interpret carries Hausa and French both ways in speech, fast enough to keep a conversation going.";

export const metadata: Metadata = {
  title: "Namu-Interpret | Namu",
  description: DESCRIPTION,
  alternates: { canonical: "/models/namu-interpret" },
  openGraph: {
    title: "Namu-Interpret",
    description: DESCRIPTION,
    type: "website",
    url: "/models/namu-interpret",
    images: ["/modim/hausa-french.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Namu-Interpret",
    description: DESCRIPTION,
    images: ["/modim/hausa-french.png"],
  },
};

export default function NamuInterpretRoute() {
  return <NamuInterpretPage />;
}
