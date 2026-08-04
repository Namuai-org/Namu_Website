import type { Metadata } from "next";
import { PlaygroundPage } from "@/components/playground/PlaygroundPage";

const DESCRIPTION =
  "Try Namu's speech models in the browser: Hausa–French interpretation both ways, Hausa transcription, Hausa speech synthesis, and the end-to-end voice agent.";

export const metadata: Metadata = {
  title: "Playground | Namu",
  description: DESCRIPTION,
  alternates: { canonical: "/playground" },
  openGraph: {
    title: "Namu Playground",
    description: DESCRIPTION,
    type: "website",
    url: "/playground",
    images: ["/modim/hausa-french.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Namu Playground",
    description: DESCRIPTION,
    images: ["/modim/hausa-french.png"],
  },
};

export default function PlaygroundRoute() {
  return <PlaygroundPage />;
}
