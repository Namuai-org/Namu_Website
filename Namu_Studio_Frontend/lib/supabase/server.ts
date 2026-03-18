import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import type { Database } from "@/lib/supabase/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables.\nCopy .env.example to .env.local and fill in your Supabase project credentials."
  );
}

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(supabaseUrl as string, supabaseAnonKey as string, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2]);
      },
      remove(name: string, options: Record<string, unknown>) {
        cookieStore.set(name, "", options as Parameters<typeof cookieStore.set>[2]);
      }
    }
  });
}
