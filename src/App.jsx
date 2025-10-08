import React, { useEffect, useState } from "react";
import { supabase } from "./supabase/client";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch current session (async for Supabase v2.x)
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup
    return () => {
      subscription?.subscription?.unsubscribe?.();
    };
  }, []);

  if (!user) return <Login />;
  return <Dashboard user={user} />;
}

export default App;
