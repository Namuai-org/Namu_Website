import type { Metadata } from "next";
import { BrandPage } from "@/components/brand/BrandPage";

export const metadata: Metadata = {
  title: "Namu Brand — Design Guidelines",
  description:
    "Logo assets, color palette, typography, and usage guidelines for the Namu brand identity.",
};

export default function BrandPageRoute() {
  return <BrandPage />;
}
