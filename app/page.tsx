import Landing from "@/components/Landing";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function HomePage() {
  let name = "Madhura Padman";
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("content_blocks")
      .select("value")
      .eq("key", "settings")
      .maybeSingle();
    const n = (data?.value as { name?: string } | undefined)?.name;
    if (n) name = n;
  } catch {}
  return <Landing name={name} />;
}
