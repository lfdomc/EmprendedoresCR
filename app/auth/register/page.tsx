'use client';

import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Lazy loading del formulario de autenticación
const AuthForm = dynamic(() => import('@/components/auth/auth-form').then(mod => ({ default: mod.AuthForm })), {
  loading: () => (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  ),
  ssr: false,
});

interface RegisterPageProps {
  searchParams: Promise<{
    redirect_to?: string;
    tab?: string;
  }>;
}

function RegisterContent({ searchParams }: { searchParams: Promise<{ redirect_to?: string; tab?: string; }> }) {
  const [params, setParams] = useState<{ redirect_to?: string; tab?: string; }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchParams.then((resolvedParams) => {
      setParams(resolvedParams);
      setLoading(false);
    });
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

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

// Metadata moved to layout.tsx since this is now a client component