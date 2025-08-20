import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { ConfigurationError } from '@/components/configuration-error';
import { hasEnvVars } from '@/lib/utils';

export default async function DashboardPage() {
  // Show configuration error if environment variables are missing
  if (!hasEnvVars) {
    return <ConfigurationError />;
  }

  const supabase = await createClient();
  
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  // Handle configuration errors gracefully
  if (error && error.message.includes('Variables de entorno faltantes')) {
    return <ConfigurationError />;
  }

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardContent user={user} />
    </div>
  );
}