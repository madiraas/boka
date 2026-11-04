"use client";

import { createClient } from "@/lib/supabase/client";

/** Read one saved block of site content (the content_blocks table). */
export async function readBlock<T = unknown>(key: string): Promise<T | null> {
  const { data } = await createClient().from("content_blocks").select("value").eq("key", key).maybeSingle();
  return (data?.value as T) ?? null;
}

/** Save one block. Returns an error message, or null when it worked. */
export async function saveBlock(key: string, value: unknown): Promise<string | null> {
  const { error } = await createClient()
    .from("content_blocks")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  return error ? error.message : null;
}
