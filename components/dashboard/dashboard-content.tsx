'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { User } from '@supabase/supabase-js';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

import dynamic from 'next/dynamic';
import { 
  Store, 
  Package, 
  Wrench, 
  BarChart3, 
  Plus, 
  Settings,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

// Lazy loading del componente de configuración de negocio
const BusinessSetup = dynamic(() => import('@/components/dashboard/business-setup').then(mod => ({ default: mod.BusinessSetup })), {
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
  ssr: false,
});

// Lazy loading de componentes pesados del dashboard
const ProductsManager = dynamic(() => import('./products-manager').then(mod => ({ default: mod.ProductsManager })), {
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
  ssr: false,
});

const ServicesManager = dynamic(() => import('@/components/dashboard/services-manager').then(mod => ({ default: mod.ServicesManager })), {
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
  ssr: false,
});
// DashboardStats component removed
import { getBusinessByUserId, getDashboardStats } from '@/lib/supabase/database';
import { Business } from '@/lib/types/database';

interface DashboardContentProps {
  user: User;
}

function DashboardContentComponent({ user }: DashboardContentProps) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    totalProducts: 0, 
    totalServices: 0,
    whatsappStats: {
      totalContacts: 0,
      productContacts: 0,
      serviceContacts: 0
    }
  });
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [isProductsExpanded, setIsProductsExpanded] = useState(false);
  const [isServicesExpanded, setIsServicesExpanded] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);

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
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm mx-auto sm:mx-0">
              {business.logo_url ? (
                <Image 
                  src={business.logo_url} 
                  alt={`Logo de ${business.name}`}
                  width={160}
                  height={160}
                  className="w-full h-full object-contain p-3 sm:p-4 rounded-xl hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                  priority
                />
              ) : (
                <Store className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-primary/70" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 break-words">{business.name}</h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-3 line-clamp-2">{business.description}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
                <Badge variant={business.is_active ? 'default' : 'secondary'} className="text-xs sm:text-sm px-2 sm:px-3 py-1">
                  {business.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </div>
        </div>



        {/* Main Content - Modules */}
        <div className="space-y-8">
          {/* Productos Module */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base lg:text-lg">
                      <Package className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="break-words text-xs sm:text-sm lg:text-base">Gestión de Productos</span>
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Administra tu catálogo de productos</p>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 self-end xs:self-auto">
                    <Button 
                      onClick={() => {
                        setIsProductsExpanded(true);
                        setIsProductDialogOpen(true);
                      }}
                      className="flex-1 xs:flex-none h-8 sm:h-9 px-2 sm:px-3"
                      size="sm"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">Agregar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsProductsExpanded(!isProductsExpanded)}
                      className="bg-gray-600 hover:bg-gray-700 text-white flex-shrink-0 h-8 sm:h-9 px-2 sm:px-3"
                    >
                      {isProductsExpanded ? (
                        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                      ) : (
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            {isProductsExpanded && (
              <CardContent>
                <ProductsManager 
                  businessId={business.id} 
                  hideAddButton={true}
                  isDialogOpen={isProductDialogOpen}
                  setIsDialogOpen={setIsProductDialogOpen}
                />
              </CardContent>
            )}
          </Card>

          {/* Servicios Module */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base lg:text-lg">
                      <Wrench className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="break-words text-xs sm:text-sm lg:text-base">Gestión de Servicios</span>
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Administra tu catálogo de servicios</p>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 self-end xs:self-auto">
                    <Button 
                      onClick={() => {
                        setIsServicesExpanded(true);
                        setIsServiceDialogOpen(true);
                      }}
                      className="flex-1 xs:flex-none h-8 sm:h-9 px-2 sm:px-3"
                      size="sm"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">Agregar</span>
                    </Button>
                    <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => setIsServicesExpanded(!isServicesExpanded)}
                       className="bg-gray-600 hover:bg-gray-700 text-white flex-shrink-0 h-8 sm:h-9 px-2 sm:px-3"
                     >
                       {isServicesExpanded ? (
                         <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                       ) : (
                         <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                       )}
                     </Button>
                   </div>
                 </div>
               </div>
            </CardHeader>
            {isServicesExpanded && (
              <CardContent>
                <ServicesManager 
                  businessId={business.id} 
                  hideAddButton={true}
                  isDialogOpen={isServiceDialogOpen}
                  setIsDialogOpen={setIsServiceDialogOpen}
                />
              </CardContent>
            )}
          </Card>

          {/* Configuración Module */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="break-words">Configuración del Emprendimiento</span>
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Actualiza la información de tu emprendimiento</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsConfigExpanded(!isConfigExpanded)}
                  className="bg-gray-600 hover:bg-gray-700 text-white self-end sm:self-auto flex-shrink-0 h-8 px-3"
                >
                  {isConfigExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            {isConfigExpanded && (
              <CardContent>
                <BusinessSetup 
                  existingBusiness={business} 
                  onBusinessCreated={handleBusinessCreated}
                />
              </CardContent>
            )}
          </Card>

          {/* WhatsApp Statistics Module */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Estadísticas de WhatsApp
              </CardTitle>
              <CardDescription>
                Solicitudes de información recibidas por WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{stats.whatsappStats.totalContacts}</p>
                  <p className="text-sm text-muted-foreground">Total Contactos</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{stats.whatsappStats.productContacts}</p>
                  <p className="text-sm text-muted-foreground">Por Productos</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Wrench className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{stats.whatsappStats.serviceContacts}</p>
                  <p className="text-sm text-muted-foreground">Por Servicios</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Module */}
          <Card>
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
        </div>
      </div>
    </div>
  );
}

export const DashboardContent = memo(DashboardContentComponent);