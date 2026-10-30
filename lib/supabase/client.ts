import { createBrowserClient } from "@supabase/ssr";

// Used from Client Components (admin dashboard, forms, uploads).
// The anon key is safe to expose - every table is protected by the
// RLS policies defined in supabase/schema.sql.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
