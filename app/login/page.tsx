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

interface LoginPageProps {
  searchParams: Promise<{
    redirect_to?: string;
  }>;
}

function LoginContent({ searchParams }: { searchParams: Promise<{ redirect_to?: string; }> }) {
  const [params, setParams] = useState<{ redirect_to?: string; }>({});
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

// Metadata moved to layout.tsx since this is now a client component