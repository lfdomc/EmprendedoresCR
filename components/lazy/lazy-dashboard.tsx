'use client';

import dynamic from 'next/dynamic';

// Lazy loading de componentes del dashboard
const DashboardContent = dynamic(() => import('@/components/dashboard/dashboard-content').then(mod => ({ default: mod.DashboardContent })), {
  loading: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  ),
  ssr: false,
});

const BusinessSetup = dynamic(() => import('@/components/dashboard/business-setup').then(mod => ({ default: mod.BusinessSetup })), {
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
  ssr: false,
});

const DashboardStats = dynamic(() => import('@/components/dashboard/dashboard-stats').then(mod => ({ default: mod.DashboardStats })), {
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
  ssr: false,
});

export { DashboardContent, BusinessSetup, DashboardStats };