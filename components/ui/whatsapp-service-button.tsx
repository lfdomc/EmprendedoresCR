'use client';

import { Button } from '@/components/ui/button';
import { FaWhatsapp } from 'react-icons/fa';
import { recordWhatsAppContact } from '@/lib/supabase/database';

interface WhatsAppServiceButtonProps {
  whatsappNumber?: string;
  serviceName: string;
  price?: number;
  currency?: string;
  className?: string;
  showShortText?: boolean;
  businessId: string;
  serviceId: string;
  serviceSlug?: string;
  serviceImageUrl?: string;
}

export function WhatsAppServiceButton({ 
  whatsappNumber, 
  serviceName, 
  price, 
  currency = 'CRC',
  className,
  showShortText = false,
  businessId,
  serviceId,
  serviceSlug,
  serviceImageUrl
}: WhatsAppServiceButtonProps) {
  const formatPrice = (price?: number) => {
    if (!price) return 'Precio a consultar';
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleWhatsAppContact = async () => {
    if (whatsappNumber) {
      // Registrar estadística de contacto
      try {
        await recordWhatsAppContact(businessId, undefined, serviceId);
      } catch (error) {
        console.error('Error recording WhatsApp contact:', error);
      }
      
      const now = new Date();
      const dateTime = now.toLocaleString('es-CR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      const serviceUrl = serviceSlug ? `${typeof window !== 'undefined' ? window.location.origin : 'https://costaricaemprende.com'}/services/${serviceSlug}` : 'https://costaricaemprende.com';
      
      // Construir el mensaje
      let message = ` *¡Hola! Me interesa este servicio* 

`;
      
      // Agregar imagen si está disponible (solo para que WhatsApp la muestre)
      if (serviceImageUrl) {
        message += `${serviceImageUrl}

`;
      }
      
      message += `🛠️ *Servicio:* ${serviceName}
` +
        `💰 *Precio:* ${formatPrice(price)}

` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━

` +
        `🔗 *Ver información completa:*
${serviceUrl}

` +
        `📅 *Fecha de consulta:* ${dateTime}

` +
        `¡Espero poder coordinar! 🤝`;
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
      className={`bg-green-600 hover:bg-green-700 ${className}`}
    >
      <FaWhatsapp className={showShortText ? "h-4 w-4 mr-0 sm:mr-1" : "h-5 w-5"} />
      {showShortText && (
        <span className="hidden sm:inline">WhatsApp</span>
      )}
      {!showShortText && className?.includes('w-full') && (
        'Contactar por WhatsApp'
      )}
    </Button>
  );
}