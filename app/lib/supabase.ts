"use client";

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const globalSupabaseKey = "__mrsa_supabase_browser_client__";

type SupabaseGlobal = typeof globalThis & {
  [globalSupabaseKey]?: SupabaseClient;
};

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  const supabaseGlobal = globalThis as SupabaseGlobal;
  if (!supabaseGlobal[globalSupabaseKey]) {
    supabaseGlobal[globalSupabaseKey] = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true
      }
    });
  }

  return supabaseGlobal[globalSupabaseKey];
}
