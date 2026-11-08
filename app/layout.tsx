import type { Metadata, Viewport } from "next";
import { Rozha_One, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";
import "./site.css";
import { createClient } from "@/lib/supabase/server";
import { getSite } from "@/lib/site";
import SoundToggle from "@/components/SoundToggle";

// Three voices: a warm display serif for headlines, a plain friendly sans for reading, a handwriting for little notes.
const disp = Rozha_One({ subsets: ["latin"], weight: "400", variable: "--font-disp", display: "swap" });
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite(createClient());
  return { title: site.t("site.title"), description: site.t("site.description") };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#D90F10",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${disp.variable} ${sans.variable} ${hand.variable}`}>
        {children}
        <SoundToggle />
      </body>
    </html>
  );
}
