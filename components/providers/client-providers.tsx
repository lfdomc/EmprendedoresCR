"use client";

import dynamic from "next/dynamic";

// Componentes que requieren renderizado solo en el cliente
const Toaster = dynamic(() => import("sonner").then(mod => ({ default: mod.Toaster })), {
  ssr: false,
});

const GoogleAnalytics = dynamic(() => import("@/components/analytics/google-analytics").then(mod => ({ default: mod.GoogleAnalytics })), {
  ssr: false,
});

const Analytics = dynamic(() => import("@vercel/analytics/next").then(mod => ({ default: mod.Analytics })), {
  ssr: false,
});

export function ClientProviders() {
  return (
    <>
      <Toaster 
        position="top-center"
        expand={true}
        richColors={true}
        closeButton={true}
        toastOptions={{
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            padding: '16px',
            borderRadius: '8px',
            maxWidth: '90vw',
            wordWrap: 'break-word'
          },
          className: 'mobile-toast'
        }}
        theme="light"
      />
      <GoogleAnalytics />
      <Analytics />
    </>
  );
}