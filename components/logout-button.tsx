"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    try {
      const supabase = createClient();
      // Use local scope to only sign out from current session
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error('Logout error:', error);
      }
      // Always redirect regardless of error status
      router.push("/auth/login");
    } catch (error) {
      console.error('Unexpected logout error:', error);
      // Still redirect even on unexpected errors
      router.push("/auth/login");
    }
  };

  return <Button onClick={logout}>Cerrar sesión</Button>;
}
