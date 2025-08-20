'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      // Use local scope to only sign out from current session
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error('Logout error:', error);
        // Still redirect even if there's an error, as the session might be invalid
        toast.error('Sesión cerrada (con advertencias)');
      } else {
        toast.success('Sesión cerrada exitosamente');
      }
      // Always redirect regardless of error status
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error('Error inesperado, redirigiendo...');
      // Still redirect even on unexpected errors
      router.push('/');
      router.refresh();
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center w-full px-2 py-1.5 text-sm bg-white text-black hover:bg-yellow-700 hover:text-white rounded-sm transition-colors group"
    >
      <LogOut className="mr-2 h-4 w-4 text-black group-hover:text-white transition-colors" />
      <span>Cerrar Sesión</span>
    </button>
  );
}