import { AuthForm } from '@/components/auth/auth-form';
import { Suspense } from 'react';

interface RegisterPageProps {
  searchParams: Promise<{
    redirect_to?: string;
    tab?: string;
  }>;
}

async function RegisterContent({ searchParams }: { searchParams: Promise<{ redirect_to?: string; tab?: string; }> }) {
  const params = await searchParams;
  const redirectTo = params.redirect_to || '/dashboard';
  const initialTab = params.tab === 'login' ? 'login' : 'signup';
  
  return <AuthForm redirectTo={redirectTo} initialTab={initialTab} />;
}

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <RegisterContent searchParams={searchParams} />
    </Suspense>
  );
}

export const metadata = {
  title: 'Registrarse - Costa Rica Emprende',
  description: 'Crea tu cuenta en Costa Rica Emprende',
};