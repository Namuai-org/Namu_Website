import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Lora } from "next/font/google";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://namu.ai"),
  title: "Namu - AI in the languages of Africa",
  description:
    "Namu builds AI tools for Hausa speakers. Write, plan, code, and create using AI in your own language.",
  openGraph: {
    title: "Namu - AI in the languages of Africa",
    description:
      "Namu builds AI tools for Hausa speakers. Write, plan, code, and create using AI in your own language.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Namu - AI in the languages of Africa",
    description:
      "Namu builds AI tools for Hausa speakers. Write, plan, code, and create using AI in your own language.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ha">
      <body className={`${lora.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>{children}</body>
    </html>
  );
}
