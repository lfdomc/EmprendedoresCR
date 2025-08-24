'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Removed Tabs import - converting to separate visible components

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
  Loader2,
  Facebook,
  Instagram
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Business, Product, Service } from '@/lib/types/database';
import { UniversalCard } from '@/components/ui/universal-card';
import { ResponsiveGrid } from '@/components/ui/responsive-grid';
import { deleteBusiness, isBusinessOwner } from '@/lib/supabase/database';
import { WhatsAppBusinessButton } from '@/components/ui/whatsapp-business-button';

interface BusinessProfileProps {
  business: Business;
  products: Product[];
  services: Service[];
}

export function BusinessProfile({ business, products, services }: BusinessProfileProps) {
  const [isOwner, setIsOwner] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const activeProducts = products.filter(p => p.is_active);
  const activeServices = services.filter(s => s.is_active);

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
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://costaricaemprende.com';
    const shareData = {
      title: `${business.name} - Emprendimiento en Costa Rica`,
      text: `🌟 ¡Descubre ${business.name}! ${business.description ? business.description.substring(0, 100) + '...' : 'Un increíble emprendimiento costarricense.'} 🇨🇷`,
      url: currentUrl
    };

    try {
      // Verificar si el navegador soporta la Web Share API
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('¡Compartido exitosamente!');
      } else {
        // Fallback: copiar al portapapeles si está disponible
        const shareText = `🌟 ¡Descubre ${business.name}! 🌟\n\n${business.description || 'Un increíble emprendimiento costarricense.'} 🇨🇷\n\n🔗 Ver más: ${currentUrl}\n\n#CostaRicaEmprende #CostaRica`;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareText);
          toast.success('¡Enlace copiado al portapapeles! 📋');
        } else {
          // Fallback final: mostrar el texto para copiar manualmente
          toast.info('Copia este enlace: ' + currentUrl);
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback de emergencia
      toast.info('Copia este enlace: ' + currentUrl);
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
              <WhatsAppBusinessButton
                whatsappNumber={business.whatsapp}
                businessName={business.name}
                businessDescription={business.description}
                className="flex-1 sm:flex-none"
              />
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
          <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6">
            {/* Logo and Info Section */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 flex-1">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center overflow-hidden mx-auto sm:mx-0 border border-gray-200 shadow-sm">
                {business.logo_url ? (
                  <Image
                    src={business.logo_url}
                    alt={`Logo de ${business.name}`}
                    width={160}
                    height={160}
                    className="w-full h-full object-contain p-4 rounded-xl hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                    priority
                  />
                ) : (
                  <Store className="h-16 w-16 sm:h-20 sm:w-20 text-primary/70" />
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

            {/* Quick Stats - Right side on large screens */}
            <div className="grid grid-cols-2 lg:grid-cols-1 lg:w-48 gap-2 sm:gap-3">
              <Card>
                <CardContent className="p-2 sm:p-3 text-center">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 text-blue-600" />
                  <p className="text-base sm:text-xl font-bold">{activeProducts.length}</p>
                  <p className="text-xs text-muted-foreground">Productos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-2 sm:p-3 text-center">
                  <Wrench className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 text-green-600" />
                  <p className="text-base sm:text-xl font-bold">{activeServices.length}</p>
                  <p className="text-xs text-muted-foreground">Servicios</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Main Content - All sections visible */}
        <div className="space-y-8">

          {/* Overview Section */}
          <div className="space-y-8">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Información de Contacto Principal */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mb-2 sm:mb-3">Contacto</h4>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base">Teléfono</p>
                        <p className="text-muted-foreground text-sm sm:text-base truncate">{business.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base">Email</p>
                        <p className="text-muted-foreground text-sm sm:text-base break-all">{business.email}</p>
                      </div>
                    </div>
                    {business.whatsapp && (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base">WhatsApp</p>
                          <p className="text-muted-foreground text-sm sm:text-base truncate">{business.whatsapp}</p>
                        </div>
                      </div>
                    )}
                    {business.website && (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base">Sitio Web</p>
                          <a 
                            href={business.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 text-sm sm:text-base"
                          >
                            <span className="truncate">Visitar sitio</span>
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ubicación y Horarios */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mb-2 sm:mb-3">Ubicación</h4>
                    {(business.provincia || business.canton) && (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base">Provincia y Cantón</p>
                          <p className="text-muted-foreground text-sm sm:text-base">
                            {[business.canton, business.provincia].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      </div>
                    )}
                    {business.google_maps_link && (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base">Google Maps</p>
                          <a 
                            href={business.google_maps_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 text-sm sm:text-base"
                          >
                            <span className="truncate">Ver ubicación</span>
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          </a>
                        </div>
                      </div>
                    )}
                    {business.opening_hours && (
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base">Horarios</p>
                          <p className="text-muted-foreground whitespace-pre-line text-xs sm:text-sm">
                            {business.opening_hours}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Redes Sociales */}
                  {(business.facebook || business.instagram) && (
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mb-2 sm:mb-3">Redes Sociales</h4>
                      {business.facebook && (
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Facebook className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm sm:text-base">Facebook</p>
                            <a 
                              href={business.facebook} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 text-sm sm:text-base"
                            >
                              <span className="truncate">Visitar página</span>
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          </div>
                        </div>
                      )}
                      {business.instagram && (
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Instagram className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm sm:text-base">Instagram</p>
                            <a 
                              href={business.instagram} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 text-sm sm:text-base"
                            >
                              <span className="truncate">Visitar perfil</span>
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>


          </div>

          {/* Products Section */}
          <div id="products-section" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Productos ({activeProducts.length})</h2>
            </div>
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
              <ResponsiveGrid variant="products">
                {activeProducts.map((product) => (
                  <UniversalCard 
                     key={product.id} 
                     data={{
                       type: 'product',
                       data: product
                     }} 
                     viewMode="grid" 
                   />
                ))}
              </ResponsiveGrid>
            )}
          </div>

          {/* Services Section */}
          <div id="services-section" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Servicios ({activeServices.length})</h2>
            </div>
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
              <ResponsiveGrid variant="services">
                {activeServices.map((service) => (
                  <UniversalCard 
                     key={service.id} 
                     data={{
                       type: 'service',
                       data: service
                     }} 
                     viewMode="grid" 
                   />
                ))}
              </ResponsiveGrid>
            )}
          </div>
        </div>

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