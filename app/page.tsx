import Landing from "@/components/Landing";
import { createClient } from "@/lib/supabase/server";
import { getSite } from "@/lib/site";

export const revalidate = 0;

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
