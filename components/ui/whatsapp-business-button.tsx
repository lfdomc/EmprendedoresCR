'use client';

import { Button } from '@/components/ui/button';
import { FaWhatsapp } from 'react-icons/fa';

interface WhatsAppBusinessButtonProps {
  whatsappNumber?: string;
  businessName: string;
  businessDescription?: string;
  className?: string;
  showShortText?: boolean;
}

export function WhatsAppBusinessButton({ 
  whatsappNumber, 
  businessName, 
  businessDescription,
  className,
  showShortText = false
}: WhatsAppBusinessButtonProps) {
  const handleWhatsAppContact = async () => {
    if (whatsappNumber) {
      // Nota: Temporalmente no registramos estadísticas para contactos directos del negocio
      // hasta que se corrija la restricción de la base de datos
      // TODO: Habilitar cuando se modifique whatsapp_stats_target_check
      /*
      try {
        await recordWhatsAppContact(businessId);
      } catch (error) {
        console.error('Error recording WhatsApp contact:', error);
      }
      */
      
      // Generar fecha y hora actual
      const now = new Date();
      const dateTime = now.toLocaleString('es-CR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      const businessUrl = typeof window !== 'undefined' ? window.location.href : 'https://costaricaemprende.com';
      const message = `🌟 *¡Hola! Me interesa conocer más sobre su emprendimiento* 🌟

` +
        `🏢 *Emprendimiento:* ${businessName}
` +
        `${businessDescription ? `📝 *Descripción:* ${businessDescription.substring(0, 100)}${businessDescription.length > 100 ? '...' : ''}
` : ''}
` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━

` +
        `🔗 *Ver perfil completo:*
${businessUrl}

` +
        `📅 *Fecha de consulta:* ${dateTime}

` +
        `¡Me gustaría conocer más sobre sus productos y servicios! 😊`;
      
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank');
      }
    }
  };

  if (!whatsappNumber) {
    return null;
  }

  return (
    <Button 
      onClick={handleWhatsAppContact}
      className={`bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${className}`}
    >
      <FaWhatsapp className={showShortText ? "h-4 w-4 mr-0 sm:mr-1" : "h-5 w-5 mr-2"} />
      {showShortText && (
        <span className="hidden sm:inline">WhatsApp</span>
      )}
      {!showShortText && (
        <span className="hidden sm:inline text-base">Contactar por WhatsApp</span>
      )}
      {!showShortText && (
        <span className="sm:hidden text-sm font-bold">WhatsApp</span>
      )}
    </Button>
  );
}