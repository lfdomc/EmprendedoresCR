import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client that throws meaningful errors
    return {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: new Error('Supabase no configurado: Variables de entorno faltantes') }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado: Variables de entorno faltantes') }),
        update: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado: Variables de entorno faltantes') }),
        delete: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado: Variables de entorno faltantes') }),
        upsert: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado: Variables de entorno faltantes') })
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase no configurado: Variables de entorno faltantes') }),
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado: Variables de entorno faltantes') }),
        signUp: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado: Variables de entorno faltantes') }),
        signOut: () => Promise.resolve({ error: new Error('Supabase no configurado: Variables de entorno faltantes') }),
        onAuthStateChange: () => {
          // Return a mock subscription object
          return {
            data: { subscription: { unsubscribe: () => {} } },
            error: null
          };
        }
      },
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado: Variables de entorno faltantes') }),
          download: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado: Variables de entorno faltantes') })
        })
      }
    } as unknown as SupabaseClient;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
