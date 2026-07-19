const fallbackSupabaseUrl = "https://jcteqdvkviodempumgqp.supabase.co";
const fallbackSupabasePublishableKey =
  "sb_publishable_Y-iUfbILAJvfmDGQ-J1djg_wBN-ud3J";

export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackSupabaseUrl;

export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  fallbackSupabasePublishableKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
);
