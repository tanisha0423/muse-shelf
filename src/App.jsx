import React, { useEffect, useState } from "react";
import { supabase } from "./supabase/client";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.subscription?.unsubscribe?.();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner for better UX
  }

  if (!user) return <Login />;
  return <Dashboard user={user} />;
}

export default App;
