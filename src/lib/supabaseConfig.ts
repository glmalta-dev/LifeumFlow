const fallbackSupabaseUrl = "https://jcteqdvkviodempumgqp.supabase.co";
const fallbackSupabasePublishableKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjdGVxZHZrdmlvZGVtcHVtZ3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMzc2NjMsImV4cCI6MjA5OTgxMzY2M30.-8fRGSopeWzulNdSJ6WgDe5hZ7tPOTkYvTpGhWSmohU";

export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackSupabaseUrl;

export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  fallbackSupabasePublishableKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
);
