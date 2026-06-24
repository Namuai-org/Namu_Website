import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-pd",
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
    images: ["/brand/namu%20branding/png/icon/namu-icon-app-on-ink_1024px.png"],
  },
  twitter: {
    card: "summary",
    title: "Namu - AI in the languages of Africa",
    description:
      "Namu builds AI tools for Hausa speakers. Write, plan, code, and create using AI in your own language.",
    images: ["/brand/namu%20branding/png/icon/namu-icon-app-on-ink_1024px.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ha">
      <body className={`${dmSans.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable}`}>{children}</body>
    </html>
  );
}
