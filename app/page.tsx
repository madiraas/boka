import Landing from "@/components/Landing";
import { createClient } from "@/lib/supabase/server";
import { getLanding, visibleLanes } from "@/lib/landing";

export const revalidate = 0;

export default async function HomePage() {
  let name = "Madhura Padman";
  const supabase = createClient();
  try {
    const { data } = await supabase
      .from("content_blocks")
      .select("value")
      .eq("key", "settings")
      .maybeSingle();
    const n = (data?.value as { name?: string } | undefined)?.name;
    if (n) name = n;
  } catch {}
  const content = await getLanding(supabase);
  return <Landing name={name} content={content} lanes={visibleLanes(content)} />;
}
