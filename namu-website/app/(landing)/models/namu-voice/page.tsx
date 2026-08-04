import type { Metadata } from "next";
import { NamuVoicePage } from "@/components/models/voice/NamuVoicePage";

const DESCRIPTION =
  "Namu-Voice turns Hausa text into natural, expressive speech — four voices, five emotional registers, and eight dialects, built for radio, classrooms and long-form audio.";

export const metadata: Metadata = {
  title: "Namu-Voice | Namu",
  description: DESCRIPTION,
  alternates: { canonical: "/models/namu-voice" },
  openGraph: {
    title: "Namu-Voice",
    description: DESCRIPTION,
    type: "website",
    url: "/models/namu-voice",
    images: ["/modim/tts.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Namu-Voice",
    description: DESCRIPTION,
    images: ["/modim/tts.png"],
  },
};

export default function NamuVoiceRoute() {
  return <NamuVoicePage />;
}
