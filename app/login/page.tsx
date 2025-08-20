import { AuthForm } from '@/components/auth/auth-form';
import { Suspense } from 'react';

interface LoginPageProps {
  searchParams: Promise<{
    redirect_to?: string;
  }>;
}

async function LoginContent({ searchParams }: { searchParams: Promise<{ redirect_to?: string; }> }) {
  const params = await searchParams;
  const redirectTo = params.redirect_to || '/dashboard';
  
  return <AuthForm redirectTo={redirectTo} />;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}

export const metadata = {
  title: 'Iniciar Sesión - EmprendimientosCR',
  description: 'Inicia sesión en tu cuenta de EmprendimientosCR',
};