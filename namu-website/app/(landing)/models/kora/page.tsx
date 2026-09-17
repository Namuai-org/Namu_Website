import type { Metadata } from "next";
import { KoraPage } from "@/components/models/interpret/KoraPage";

const DESCRIPTION =
  "Kora carries Hausa and French both ways in speech, fast enough to keep a conversation going.";

export const metadata: Metadata = {
  title: "Kora | Namu",
  description: DESCRIPTION,
  alternates: { canonical: "/models/kora" },
  openGraph: {
    title: "Kora",
    description: DESCRIPTION,
    type: "website",
    url: "/models/kora",
    images: ["/modim/hausa-french.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kora",
    description: DESCRIPTION,
    images: ["/modim/hausa-french.png"],
  },
};

export default function NamuInterpretRoute() {
  return <KoraPage />;
}
