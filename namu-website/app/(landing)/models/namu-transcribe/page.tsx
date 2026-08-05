import type { Metadata } from "next";
import { NamuTranscribePage } from "@/components/models/transcribe/NamuTranscribePage";

const DESCRIPTION =
  "Namu-Transcribe turns noisy Hausa audio into accurate, domain-aware transcripts — measured separately across eight of Niger's Hausa dialects.";

export const metadata: Metadata = {
  title: "Namu-Transcribe | Namu",
  description: DESCRIPTION,
  alternates: { canonical: "/models/namu-transcribe" },
  openGraph: {
    title: "Namu-Transcribe",
    description: DESCRIPTION,
    type: "website",
    url: "/models/namu-transcribe",
    images: ["/modim/asr.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Namu-Transcribe",
    description: DESCRIPTION,
    images: ["/modim/asr.png"],
  },
};

export default function NamuTranscribeRoute() {
  return <NamuTranscribePage />;
}
