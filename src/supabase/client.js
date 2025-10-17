import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "supabaseUrl";
const supabaseAnonKey = "supabaseAnonKey";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
