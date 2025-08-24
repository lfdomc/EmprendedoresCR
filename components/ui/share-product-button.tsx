'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareProductButtonProps {
  productName: string;
  productDescription?: string;
  className?: string;
}

export function ShareProductButton({ 
  productName, 
  productDescription, 
  className = "" 
}: ShareProductButtonProps) {
  const handleShare = async () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://costaricaemprende.com';
    const shareData = {
      title: `${productName} - Producto en Costa Rica`,
      text: `🌟 ¡Descubre ${productName}! ${productDescription ? productDescription.substring(0, 100) + '...' : 'Un increíble producto costarricense.'} 🇨🇷`,
      url: currentUrl
    };

    try {
      // Verificar si el navegador soporta la Web Share API
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('¡Compartido exitosamente!');
      } else {
        // Fallback: copiar al portapapeles si está disponible
        const shareText = `🌟 ¡Descubre ${productName}! 🌟

${productDescription || 'Un increíble producto costarricense.'} 🇨🇷

🔗 Ver más: ${currentUrl}

#CostaRicaEmprende #CostaRica`;
        
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
    <Button 
      size="lg" 
      className={`w-full bg-yellow-700 hover:bg-yellow-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${className}`}
      onClick={handleShare}
    >
      <span className="hidden sm:inline text-base">Compartir Producto</span>
      <span className="sm:hidden text-sm font-bold">Compartir</span>
    </Button>
  );
}