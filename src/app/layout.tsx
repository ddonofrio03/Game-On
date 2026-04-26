import type { Metadata } from "next";
import { Inter, Silkscreen } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gameon.donofr.io"),
  title: {
    default: "Game On!",
    template: "%s · Game On!",
  },
  description: "Live sports scores, schedules, and where to watch every game across MLB, NFL, NBA, NHL, EPL, UCL, and MLS.",
  applicationName: "Game On!",
  openGraph: {
    title: "Game On!",
    description: "Live sports scores, schedules, and where to watch every game.",
    url: "https://gameon.donofr.io",
    siteName: "Game On!",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game On!",
    description: "Live sports scores, schedules, and where to watch every game.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${silkscreen.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
