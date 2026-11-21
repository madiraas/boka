import { createServerClient } from "@supabase/ssr";

/**
 * For pages every visitor sees. It never reads cookies, so Next.js can keep a ready-made copy
 * of the page and serve it instantly instead of asking the database on every visit.
 * (The admin pages keep using ./server, which knows who is logged in.)
 */
export function createPublicClient() {
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}
