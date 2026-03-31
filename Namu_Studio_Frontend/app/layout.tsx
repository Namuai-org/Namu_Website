import type { Metadata, Viewport } from "next";
import { Barlow, DM_Sans, Inter, JetBrains_Mono, Lora } from "next/font/google";

import "@/app/globals.css";
import { Providers } from "@/components/shared/Providers";

const lora = Lora({
  subsets: ["latin", "latin-ext"],
  variable: "--font-lora",
  weight: ["400", "600", "700"],
  display: "swap",
  preload: true
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true
});

const barlow = Barlow({
  subsets: ["latin", "latin-ext"],
  variable: "--font-barlow",
  weight: ["700", "800"],
  display: "swap",
  preload: true
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Namu AI-Studio",
  description: "AI workspace for Hausa speakers",
  icons: {
    icon: "/favicon.ico"
  }
};

export const viewport: Viewport = {
  themeColor: "#DA7756"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var theme=localStorage.getItem('namu_theme')||'namu';document.documentElement.setAttribute('data-theme',theme);var s=localStorage.getItem('namu_language');var lang;if(s==='en'||s==='ha'||s==='fr'){lang=s;}else{var b=((navigator.languages&&navigator.languages[0])||navigator.language||'en').split('-')[0].toLowerCase();if(b==='ha')lang='ha';else if(b==='fr')lang='fr';else lang='en';}document.documentElement.lang=lang==='ha'?'ha':lang==='fr'?'fr':'en';}catch(e){document.documentElement.setAttribute('data-theme','namu');document.documentElement.lang='en';}})();"
          }}
        />
      </head>
      <body
        className={`${lora.variable} ${dmSans.variable} ${barlow.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
