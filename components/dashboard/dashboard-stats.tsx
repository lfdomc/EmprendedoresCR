'use client';

// No additional imports needed for this simplified component
import { Business } from '@/lib/types/database';

interface DashboardStatsProps {
  business: Business;
  stats: {
    totalProducts: number;
    totalServices: number;
    whatsappStats: {
      totalContacts: number;
      productContacts: number;
      serviceContacts: number;
    };
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="text-center p-4">
      <p className="text-sm text-muted-foreground mb-2">Información general del emprendimiento</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-lg font-semibold">{stats.totalProducts}</p>
          <p className="text-xs text-muted-foreground">Productos</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">{stats.totalServices}</p>
          <p className="text-xs text-muted-foreground">Servicios</p>
        </div>
      </div>
    </div>
  );
}