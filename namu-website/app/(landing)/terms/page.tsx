import type { Metadata } from "next";
import { TermsOfServicePage } from "@/components/legal/TermsOfServicePage";

export const metadata: Metadata = {
  title: "Terms of Service — Namu",
  description: "The terms that govern your use of namu-ai.org and Namu's Playground demo.",
};

export default function TermsPageRoute() {
  return <TermsOfServicePage />;
}
