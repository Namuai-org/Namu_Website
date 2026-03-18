import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";

import "@/app/globals.css";
import { Providers } from "@/components/shared/Providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
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
  themeColor: "#D6703F"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var theme=localStorage.getItem('namu_theme')||'namu';document.documentElement.setAttribute('data-theme',theme);document.documentElement.lang=localStorage.getItem('namu_language')||'en';}catch(e){document.documentElement.setAttribute('data-theme','namu');document.documentElement.lang='en';}})();"
          }}
        />
      </head>
      <body className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
