import { createClient } from '@supabase/supabase-js';

// Note: This requires SUPABASE_SERVICE_ROLE_KEY to be set in your .env file
// This client bypasses Row Level Security (RLS) - use with caution, server-side only.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
