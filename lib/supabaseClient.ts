import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  if (typeof window === "undefined") return null;

  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  client = createClient(url, anonKey);
  return client;
}

export async function getStudioTarget() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return "/login";

  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return "/login";
  return "/studio/dashboard";
}
