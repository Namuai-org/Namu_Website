import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/components/legal/PrivacyPolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Namu",
  description:
    "How Namu collects, uses, and protects your information across namu-ai.org and our Playground demo.",
};

export default function PrivacyPageRoute() {
  return <PrivacyPolicyPage />;
}
