import type { Metadata } from "next";
import { AirPage } from "@/components/models/agent/AirPage";

const DESCRIPTION =
  "Aïr handles a whole conversation in Hausa over an ordinary phone call, from the first question to the thing being done.";

export const metadata: Metadata = {
  title: "Aïr | Namu",
  description: DESCRIPTION,
  alternates: { canonical: "/models/air" },
  openGraph: {
    title: "Aïr",
    description: DESCRIPTION,
    type: "website",
    url: "/models/air",
    images: ["/modim/voice-agent.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aïr",
    description: DESCRIPTION,
    images: ["/modim/voice-agent.png"],
  },
};

export default function NamuAgentRoute() {
  return <AirPage />;
}
