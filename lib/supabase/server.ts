import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
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
        upsert: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado: Variables de entorno faltantes') }),
        single: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado: Variables de entorno faltantes') })
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase no configurado: Variables de entorno faltantes') }),
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado: Variables de entorno faltantes') }),
        signUp: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado: Variables de entorno faltantes') }),
        signOut: () => Promise.resolve({ error: new Error('Supabase no configurado: Variables de entorno faltantes') }),
        exchangeCodeForSession: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado: Variables de entorno faltantes') }),
        getClaims: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado: Variables de entorno faltantes') })
      },
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado: Variables de entorno faltantes') }),
          download: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado: Variables de entorno faltantes') })
        })
      }
    } as unknown as SupabaseClient;
  }

  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
