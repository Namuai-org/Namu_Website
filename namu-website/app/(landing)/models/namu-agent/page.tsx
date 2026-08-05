import type { Metadata } from "next";
import { NamuAgentPage } from "@/components/models/agent/NamuAgentPage";

const DESCRIPTION =
  "Namu-Agent handles a whole conversation in Hausa over an ordinary phone call, from the first question to the thing being done.";

export const metadata: Metadata = {
  title: "Namu-Agent | Namu",
  description: DESCRIPTION,
  alternates: { canonical: "/models/namu-agent" },
  openGraph: {
    title: "Namu-Agent",
    description: DESCRIPTION,
    type: "website",
    url: "/models/namu-agent",
    images: ["/modim/voice-agent.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Namu-Agent",
    description: DESCRIPTION,
    images: ["/modim/voice-agent.png"],
  },
};

export default function NamuAgentRoute() {
  return <NamuAgentPage />;
}
