import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase Admin Client.
 * Uses SUPABASE_SERVICE_ROLE_KEY to bypass RLS for administrative operations,
 * webhook processing, atomic inventory deducts, and audit logging.
 *
 * CRITICAL: Never import or execute this file in client-side code.
 */
if (typeof window !== "undefined") {
  throw new Error("CRITICAL SECURITY ERROR: supabaseAdmin must only be used in server-side environments.");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-domain.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
