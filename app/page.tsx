import Landing from "@/components/Landing";
import { createPublicClient as createClient } from "@/lib/supabase/public";
import { getSite } from "@/lib/site";

export const revalidate = 60; // a ready copy is reused for a minute, so the site stays fast; admin edits show within a minute

export default async function HomePage() {
  const site = await getSite(createClient());
  const name = site.settings.name?.trim() || "Madhura Padman";
  const intro = site.videos.showHome ? site.videos.intro : null;
  return (
    <Landing
      name={name}
      content={site.landing}
      lanes={site.lanes}
      copy={site.copy}
      contact={site.contact}
      intro={intro}
    />
  );
}
