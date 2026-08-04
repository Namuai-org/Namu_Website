import type { Metadata } from "next";
import { ModelsPage } from "@/components/models/ModelsPage";

const DESCRIPTION =
  "Namu's speech-native models for African languages: Hausa–French interpretation both ways, Hausa transcription, Hausa speech synthesis, and an end-to-end Hausa voice agent.";

export const metadata: Metadata = {
  title: "Models | Namu",
  description: DESCRIPTION,
  alternates: { canonical: "/models" },
  openGraph: {
    title: "Namu Models",
    description: DESCRIPTION,
    type: "website",
    url: "/models",
    images: ["/modim/hausa-french.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Namu Models",
    description: DESCRIPTION,
    images: ["/modim/hausa-french.png"],
  },
};

export default function ModelsRoute() {
  return <ModelsPage />;
}
