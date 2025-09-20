"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";
console.log("SupabaseProvider mounted");

const Context = createContext(null);

export default function SupabaseProvider({ children, initialSession }) {
  const [supabase] = useState(() => createClient());
  const [session, setSession] = useState(initialSession ?? null);

  useEffect(() => {
    // 1. Get current session (from localStorage if available)
    supabase.auth.getSession().then(({ data, error }) => {
      console.log("Initial session:", data, error);
      setSession(data.session);
    });

    // 2. Subscribe to changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <Context.Provider value={{ supabase, session }}>
      {children}
    </Context.Provider>
  );
}

export function useSupabase() {
  const context = useContext(Context);
  if (!context) throw new Error("SupabaseProvider is missing");
  return context;
}
