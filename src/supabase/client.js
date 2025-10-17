import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://naupxtislsuwarnvxzax.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdXB4dGlzbHN1d2FybnZ4emF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDAwODIsImV4cCI6MjA3NTQ3NjA4Mn0.Swjnu1by9OBJUSY57FAcbMqFk-b5uAtgfJTfy7AvxG0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
