'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  MessageSquare,
  ExternalLink,
  ArrowLeft,
  Trash2,
  Package,
  Wrench,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Business, Product, Service } from '@/lib/types/database';
import { ProductCard } from '@/components/marketplace/product-card';
import { ServiceCard } from '@/components/marketplace/service-card';
import { deleteBusiness, isBusinessOwner } from '@/lib/supabase/database';

interface BusinessProfileProps {
  business: Business;
  products: Product[];
  services: Service[];
}

export function BusinessProfile({ business, products, services }: BusinessProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isOwner, setIsOwner] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const activeProducts = products.filter(p => p.is_active);
  const activeServices = services.filter(s => s.is_active);
  // Featured functionality removed - showing all active products/services
  const featuredProducts = activeProducts;
  const featuredServices = activeServices;

  // Verificar si el usuario actual es propietario del emprendimiento
  useEffect(() => {
    const checkOwnership = async () => {
      try {
        console.log('Checking ownership for business:', business.id);
        const ownershipResult = await isBusinessOwner(business.id);
        console.log('Ownership result:', ownershipResult);
        setIsOwner(ownershipResult);
      } catch (error) {
        console.error('Error checking ownership:', error);
      }
    };

    checkOwnership();
  }, [business.id]);

  // Debug: mostrar el estado actual
  console.log('Current isOwner state:', isOwner);
  console.log('Business user_id:', business.user_id);

  // Función para manejar la eliminación del emprendimiento
  const handleDeleteBusiness = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteBusiness(business.id);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Emprendimiento eliminado exitosamente');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error deleting business:', error);
      toast.error('Error al eliminar el emprendimiento');
    } finally {
      setIsDeleting(false);
    }
  };

  // Función para manejar el compartir
  const handleShare = async () => {
    const shareData = {
      title: `${business.name} - Emprendimiento en Costa Rica`,
      text: `🌟 ¡Descubre ${business.name}! ${business.description ? business.description.substring(0, 100) + '...' : 'Un increíble emprendimiento costarricense.'} 🇨🇷`,
      url: window.location.href
    };

    try {
      // Verificar si el navegador soporta la Web Share API
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('¡Compartido exitosamente!');
      } else {
        // Fallback: copiar al portapapeles si está disponible
        const shareText = `🌟 ¡Descubre ${business.name}! 🌟\n\n${business.description || 'Un increíble emprendimiento costarricense.'} 🇨🇷\n\n🔗 Ver más: ${window.location.href}\n\n#EmprendimientosCR #CostaRica`;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareText);
          toast.success('¡Enlace copiado al portapapeles! 📋');
        } else {
          // Fallback final: mostrar el texto para copiar manualmente
          toast.info('Copia este enlace: ' + window.location.href);
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback de emergencia
      toast.info('Copia este enlace: ' + window.location.href);
     }
   };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Volver al marketplace</span>
              <span className="sm:hidden">Inicio</span>
            </Link>
            <div className="flex items-center gap-2">

              <Button 
                variant="default" 
                size="lg" 
                className="flex-1 sm:flex-none bg-yellow-700 hover:bg-yellow-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={handleShare}
              >
                <span className="hidden sm:inline text-base">Compartir Negocio</span>
                <span className="sm:hidden text-sm font-bold">Compartir</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Business Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-xl flex items-center justify-center overflow-hidden mx-auto sm:mx-0">
              {business.logo_url ? (
                <Image
                  src={business.logo_url}
                  alt={`Logo de ${business.name}`}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Store className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{business.name}</h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-4">{business.description}</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-1 text-muted-foreground justify-center sm:justify-start">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm sm:text-base">{business.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-lg sm:text-2xl font-bold">{activeProducts.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Productos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <Wrench className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-green-600" />
                <p className="text-lg sm:text-2xl font-bold">{activeServices.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Servicios</p>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 gap-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Resumen</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Productos ({activeProducts.length})</span>
              <span className="sm:hidden">Prod. ({activeProducts.length})</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Servicios ({activeServices.length})</span>
              <span className="sm:hidden">Serv. ({activeServices.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm sm:text-base">Teléfono</p>
                        <p className="text-muted-foreground text-sm sm:text-base">{business.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm sm:text-base">Email</p>
                        <p className="text-muted-foreground text-sm sm:text-base break-all">{business.email}</p>
                      </div>
                    </div>
                    {business.whatsapp && (
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">WhatsApp</p>
                          <p className="text-muted-foreground text-sm sm:text-base">{business.whatsapp}</p>
                        </div>
                      </div>
                    )}
                    {(business.provincia || business.canton) && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">Ubicación</p>
                          <p className="text-muted-foreground text-sm sm:text-base">
                            {[business.canton, business.provincia].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {business.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Sitio Web</p>
                          <a 
                            href={business.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            Visitar sitio web
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}
                    {business.opening_hours && (
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Horarios de Atención</p>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {business.opening_hours}
                          </p>
                        </div>
                      </div>
                    )}
                    {business.google_maps_link && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Ubicación en Google Maps</p>
                          <a 
                            href={business.google_maps_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            Ver en Google Maps
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Productos Destacados</h2>
                  {activeProducts.length > featuredProducts.length && (
                    <Button variant="outline" onClick={() => setActiveTab('products')}>
                      Ver todos los productos
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {featuredProducts.slice(0, 6).map((product) => (
                    <ProductCard key={product.id} product={product} viewMode="grid" />
                  ))}
                </div>
              </div>
            )}

            {/* Featured Services */}
            {featuredServices.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Servicios Destacados</h2>
                  {activeServices.length > featuredServices.length && (
                    <Button variant="outline" onClick={() => setActiveTab('services')}>
                      Ver todos los servicios
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {featuredServices.slice(0, 6).map((service) => (
                    <ServiceCard key={service.id} service={service} viewMode="grid" />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            {activeProducts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay productos disponibles</h3>
                  <p className="text-muted-foreground text-center">
                    Este emprendimiento aún no ha publicado productos.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {activeProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode="grid" />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            {activeServices.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay servicios disponibles</h3>
                  <p className="text-muted-foreground text-center">
                    Este emprendimiento aún no ha publicado servicios.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {activeServices.map((service) => (
                  <ServiceCard key={service.id} service={service} viewMode="grid" />
                ))}
              </div>
            )}
          </TabsContent>


        </Tabs>

        {/* Botón de eliminar emprendimiento (solo para propietarios) */}
        {isOwner && (
          <div className="mt-12 pt-8 border-t">
            <div className="flex justify-center">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="lg"
                    disabled={isDeleting}
                    className="min-w-[200px]"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar Emprendimiento
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará permanentemente tu emprendimiento 
                      &quot;{business.name}&quot; junto con todos sus productos y servicios asociados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteBusiness}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Eliminando...
                        </>
                      ) : (
                        'Sí, eliminar'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}