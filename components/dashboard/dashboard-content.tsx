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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/" className="inline-flex items-center text-xs sm:text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Volver al marketplace</span>
                <span className="sm:hidden">Inicio</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm" asChild>
                <Link href={`/businesses/${business.id}`}>
                  <span className="hidden sm:inline">Ver perfil público</span>
                  <span className="sm:hidden">Ver perfil</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Business Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
              {business.logo_url ? (
                <Image 
                  src={business.logo_url} 
                  alt={`Logo de ${business.name}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded-lg"
                  priority
                />
              ) : (
                <Store className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">{business.name}</h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">{business.description}</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Badge variant={business.is_active ? 'default' : 'secondary'} className="w-fit">
                  {business.is_active ? 'Activo' : 'Inactivo'}
                </Badge>

              </div>
            </div>
          </div>
        </div>

        {/* Compact Stats & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start" 
                onClick={() => setActiveTab('products')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start" 
                onClick={() => setActiveTab('services')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Servicio
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start" 
                asChild
              >
                <Link href={`/businesses/${business.id}`}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Ver Perfil Público
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Business Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <p className="text-muted-foreground">Estado</p>
                <Badge variant={business.is_active ? 'default' : 'secondary'} className="text-xs">
                  {business.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              {business.phone && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Teléfono</p>
                  <p className="truncate">{business.phone}</p>
                </div>
              )}
              {business.email && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Email</p>
                  <p className="truncate">{business.email}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
            <TabsTrigger value="overview" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Resumen</span>
              <span className="sm:hidden">Inicio</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Package className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Productos</span>
              <span className="sm:hidden">Prod.</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Wrench className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Servicios</span>
              <span className="sm:hidden">Serv.</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Configuración</span>
              <span className="sm:hidden">Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardStats business={business} stats={stats} />
          </TabsContent>

          <TabsContent value="products" className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Gestión de Productos</h2>
                <p className="text-sm sm:text-base text-muted-foreground">Administra tu catálogo de productos</p>
              </div>
            </div>
            <ProductsManager businessId={business.id} />
          </TabsContent>

          <TabsContent value="services" className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Gestión de Servicios</h2>
                <p className="text-sm sm:text-base text-muted-foreground">Administra tu catálogo de servicios</p>
              </div>
            </div>
            <ServicesManager businessId={business.id} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 sm:space-y-6">
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