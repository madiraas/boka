import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./site.css";
import { createClient } from "@/lib/supabase/server";
import { getSite } from "@/lib/site";
import SoundToggle from "@/components/SoundToggle";

// One font file for the whole site: lighter on phones than two families.
const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

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
      <body className={display.variable}>
        {children}
        <SoundToggle />
      </body>
    </html>
  );
}
