import type { Metadata } from "next";
import {
  DM_Sans,
  JetBrains_Mono,
  Newsreader,
  Playfair_Display,
  Red_Hat_Mono,
} from "next/font/google";
import "./globals.css";
import "./design-system.css";

/* Editorial pairing: one warm literary serif carries everything from the
   150px display down to body copy, with a mono reserved for UI and metadata. */
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const redHatMono = Red_Hat_Mono({
  subsets: ["latin"],
  variable: "--font-mono-ui",
  display: "swap",
});

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
  themeColor: "#FFFAF1",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://namu.ai"),
  title: "Namu - AI in the languages of Africa",
  description:
    "Namu builds speech-native AI for African languages \u2014 datasets, models, and a developer platform. Starting with Hausa.",
  openGraph: {
    title: "Namu - AI in the languages of Africa",
    description:
      "Namu builds speech-native AI for African languages \u2014 datasets, models, and a developer platform. Starting with Hausa.",
    images: ["/brand/namu%20branding/png/icon/namu-icon-app-on-ink_1024px.png"],
  },
  twitter: {
    card: "summary",
    title: "Namu - AI in the languages of Africa",
    description:
      "Namu builds speech-native AI for African languages \u2014 datasets, models, and a developer platform. Starting with Hausa.",
    images: ["/brand/namu%20branding/png/icon/namu-icon-app-on-ink_1024px.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${newsreader.variable} ${redHatMono.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
