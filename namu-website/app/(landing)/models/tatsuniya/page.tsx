import type { Metadata } from "next";
import { TatsuniyaPage } from "@/components/models/transcribe/TatsuniyaPage";

const DESCRIPTION =
  "Tatsuniya turns noisy Hausa audio into accurate, domain-aware transcripts — measured separately across eight of Niger's Hausa dialects.";

export const metadata: Metadata = {
  title: "Tatsuniya | Namu",
  description: DESCRIPTION,
  alternates: { canonical: "/models/tatsuniya" },
  openGraph: {
    title: "Tatsuniya",
    description: DESCRIPTION,
    type: "website",
    url: "/models/tatsuniya",
    images: ["/modim/asr.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tatsuniya",
    description: DESCRIPTION,
    images: ["/modim/asr.png"],
  },
};

export default function NamuTranscribeRoute() {
  return <TatsuniyaPage />;
}
