"use client";

import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "@/lib/supabase/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables.\nCopy .env.example to .env.local and fill in your Supabase project credentials."
  );
}

export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
