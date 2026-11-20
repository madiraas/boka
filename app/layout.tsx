import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Newsreader } from "next/font/google";
import "./globals.css";
import "./site.css";
import { createClient } from "@/lib/supabase/server";
import { getSite } from "@/lib/site";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const body = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-body",
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
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
