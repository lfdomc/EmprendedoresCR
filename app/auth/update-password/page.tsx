'use client';

import dynamic from 'next/dynamic';

// Lazy loading del formulario de actualización de contraseña
const UpdatePasswordForm = dynamic(() => import('@/components/update-password-form').then(mod => ({ default: mod.UpdatePasswordForm })), {
  loading: () => (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  ),
  ssr: false,
});

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
