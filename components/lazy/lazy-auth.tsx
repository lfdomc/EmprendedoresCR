'use client';

import dynamic from 'next/dynamic';

// Lazy loading de componentes de autenticación
const LoginForm = dynamic(() => import('@/components/login-form').then(mod => ({ default: mod.LoginForm })), {
  loading: () => (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  ),
  ssr: false,
});

const SignUpForm = dynamic(() => import('@/components/sign-up-form').then(mod => ({ default: mod.SignUpForm })), {
  loading: () => (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  ),
  ssr: false,
});

const ForgotPasswordForm = dynamic(() => import('@/components/forgot-password-form').then(mod => ({ default: mod.ForgotPasswordForm })), {
  loading: () => (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  ),
  ssr: false,
});

export { LoginForm, SignUpForm, ForgotPasswordForm };