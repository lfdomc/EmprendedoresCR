'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

import { 
  Store, 
  Package, 
  Wrench, 
  BarChart3, 
  Plus, 
  Settings,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { BusinessSetup } from '@/components/dashboard/business-setup';
import { ProductsManager } from './products-manager';
import { ServicesManager } from '@/components/dashboard/services-manager';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { getBusinessByUserId, getDashboardStats } from '@/lib/supabase/database';
import { Business } from '@/lib/types/database';

interface DashboardContentProps {
  user: User;
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalServices: 0,
    whatsappStats: {
      totalContacts: 0,
      productContacts: 0,
      serviceContacts: 0
    }
  });

  const loadBusiness = useCallback(async () => {
    try {
      setLoading(true);
      const businessData = await getBusinessByUserId(user.id);
      setBusiness(businessData);
    } catch (error) {
      console.error('Error loading business:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  const loadStats = useCallback(async () => {
    if (!business) return;
    try {
      const statsData = await getDashboardStats(business.id);
        setStats({
          totalProducts: statsData.totalProducts,
          totalServices: statsData.totalServices,
          whatsappStats: statsData.whatsappStats
        });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, [business]);

  useEffect(() => {
    loadBusiness();
  }, [loadBusiness]);

  useEffect(() => {
    if (business) {
      loadStats();
    }
  }, [business, loadStats]);

  const handleBusinessCreated = (newBusiness: Business) => {
    setBusiness(newBusiness);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al inicio
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <Store className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold mb-2">¡Bienvenido a tu Dashboard!</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Para comenzar, necesitas configurar tu emprendimiento
          </p>
        </div>

        <BusinessSetup onBusinessCreated={handleBusinessCreated} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Volver al marketplace</span>
                <span className="sm:hidden">Inicio</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                <Link href={`/businesses/${business.id}`}>
                  <span className="hidden sm:inline">Ver perfil público</span>
                  <span className="sm:hidden">Ver perfil</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Business Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
              {business.logo_url ? (
                <Image 
                  src={business.logo_url} 
                  alt={`Logo de ${business.name}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-xl"
                  priority
                />
              ) : (
                <Store className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 truncate">{business.name}</h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-3 line-clamp-2">{business.description}</p>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={business.is_active ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                  {business.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Stats & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats */}
          <Card className="order-1">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Productos</span>
                </div>
                <span className="font-semibold">{stats.totalProducts}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Servicios</span>
                </div>
                <span className="font-semibold">{stats.totalServices}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total ofertas</span>
                  <span className="font-bold">{stats.totalProducts + stats.totalServices}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="order-2 md:order-3 lg:order-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                size="default" 
                className="w-full justify-start h-11" 
                onClick={() => setActiveTab('products')}
              >
                <Plus className="h-5 w-5 mr-3" />
                <span className="font-medium">Agregar Producto</span>
              </Button>
              <Button 
                variant="outline" 
                size="default" 
                className="w-full justify-start h-11" 
                onClick={() => setActiveTab('services')}
              >
                <Plus className="h-5 w-5 mr-3" />
                <span className="font-medium">Agregar Servicio</span>
              </Button>
              <Button 
                variant="outline" 
                size="default" 
                className="w-full justify-start h-11" 
                asChild
              >
                <Link href={`/businesses/${business.id}`}>
                  <BarChart3 className="h-5 w-5 mr-3" />
                  <span className="font-medium">Ver Perfil Público</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Business Info */}
          <Card className="order-3 md:order-2 lg:order-3">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Estado</p>
                <Badge variant={business.is_active ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                  {business.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              {business.phone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Teléfono</p>
                  <p className="text-base truncate">{business.phone}</p>
                </div>
              )}
              {business.email && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                  <p className="text-base truncate">{business.email}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-1 h-14 sm:h-10 p-2 sm:p-1 relative z-10 mb-12 sm:mb-8">
            <TabsTrigger value="overview" className="flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-sm px-2 py-2 sm:py-1.5 min-h-[40px] sm:min-h-[36px] font-medium">
              <BarChart3 className="h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Resumen</span>
              <span className="sm:hidden text-xs font-semibold">Inicio</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-sm px-2 py-2 sm:py-1.5 min-h-[40px] sm:min-h-[36px] font-medium">
              <Package className="h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Productos</span>
              <span className="sm:hidden text-xs font-semibold">Prod.</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-sm px-2 py-2 sm:py-1.5 min-h-[40px] sm:min-h-[36px] font-medium">
              <Wrench className="h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Servicios</span>
              <span className="sm:hidden text-xs font-semibold">Serv.</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-sm px-2 py-2 sm:py-1.5 min-h-[40px] sm:min-h-[36px] font-medium">
              <Settings className="h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Configuración</span>
              <span className="sm:hidden text-xs font-semibold">Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 relative z-0">
            <DashboardStats business={business} stats={stats} />
          </TabsContent>

          <TabsContent value="products" className="space-y-4 sm:space-y-6 relative z-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Gestión de Productos</h2>
                <p className="text-sm sm:text-base text-muted-foreground">Administra tu catálogo de productos</p>
              </div>
            </div>
            <ProductsManager businessId={business.id} />
          </TabsContent>

          <TabsContent value="services" className="space-y-4 sm:space-y-6 relative z-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Gestión de Servicios</h2>
                <p className="text-sm sm:text-base text-muted-foreground">Administra tu catálogo de servicios</p>
              </div>
            </div>
            <ServicesManager businessId={business.id} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 sm:space-y-6 relative z-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Configuración del Emprendimiento</h2>
                <p className="text-sm sm:text-base text-muted-foreground">Actualiza la información de tu emprendimiento</p>
              </div>
            </div>
            <BusinessSetup 
              existingBusiness={business} 
              onBusinessCreated={handleBusinessCreated}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}