import type { Metadata } from "next";
import { TafiyaPage } from "@/components/models/voice/TafiyaPage";

const DESCRIPTION =
  "Tafiya turns Hausa text into natural, expressive speech — four voices, five emotional registers, and eight dialects, built for radio, classrooms and long-form audio.";

export const metadata: Metadata = {
  title: "Tafiya | Namu",
  description: DESCRIPTION,
  alternates: { canonical: "/models/tafiya" },
  openGraph: {
    title: "Tafiya",
    description: DESCRIPTION,
    type: "website",
    url: "/models/tafiya",
    images: ["/modim/tts.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tafiya",
    description: DESCRIPTION,
    images: ["/modim/tts.png"],
  },
};

export default function NamuVoiceRoute() {
  return <TafiyaPage />;
}
