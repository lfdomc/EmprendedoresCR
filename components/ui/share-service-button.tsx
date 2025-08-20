'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareServiceButtonProps {
  serviceName: string;
  serviceDescription: string;
  className?: string;
}

export function ShareServiceButton({ 
  serviceName, 
  serviceDescription, 
  className = "" 
}: ShareServiceButtonProps) {
  const handleShare = async () => {
    const shareData = {
      title: `${serviceName} - Servicio en Costa Rica`,
      text: `🌟 ¡Descubre ${serviceName}! ${serviceDescription ? serviceDescription.substring(0, 100) + '...' : 'Un increíble servicio costarricense.'} 🇨🇷`,
      url: window.location.href
    };

    try {
      // Verificar si el navegador soporta la Web Share API
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('¡Compartido exitosamente!');
      } else {
        // Fallback: copiar al portapapeles si está disponible
        const shareText = `🌟 ¡Descubre ${serviceName}! 🌟\n\n${serviceDescription || 'Un increíble servicio costarricense.'} 🇨🇷\n\n🔗 Ver más: ${window.location.href}\n\n#CostaRicaEmprende #CostaRica`;
        
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
    <Button 
      size="lg" 
      className={`w-full bg-yellow-700 hover:bg-yellow-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${className}`}
      onClick={handleShare}
    >
      <span className="hidden sm:inline text-base">Compartir Servicio</span>
      <span className="sm:hidden text-sm font-bold">Compartir</span>
    </Button>
  );
}