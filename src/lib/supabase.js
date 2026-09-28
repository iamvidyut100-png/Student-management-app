import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wcbkpwmlztkdafiucjni.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_T1nh8kXAVGa2RQGbe56h1g_Tv1foc5t";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});
