'use client';

import { Button } from '@/components/ui/button';
import { FaWhatsapp } from 'react-icons/fa';
import { recordWhatsAppContact } from '@/lib/supabase/database';

interface WhatsAppButtonProps {
  whatsappNumber?: string;
  productName: string;
  price?: number;
  currency?: string;
  className?: string;
  businessId: string;
  productId: string;
  productSlug?: string;
}

export function WhatsAppButton({ 
  whatsappNumber, 
  productName, 
  price, 
  currency = 'CRC',
  className,
  businessId,
  productId,
  productSlug
}: WhatsAppButtonProps) {
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
        await recordWhatsAppContact(businessId, productId);
      } catch (error) {
        console.error('Error recording WhatsApp contact:', error);
      }
      
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
      
      const productUrl = productSlug ? `${window.location.origin}/products/${productSlug}` : 'https://emprendimientoscr.com';
      const message = `🌟 *¡Hola! Estoy interesado/a en este producto* 🌟\n\n` +
        `📦 *Producto:* ${productName}\n` +
        `💰 *Precio:* ${formatPrice(price)}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `🔗 *Ver detalles completos:*\n${productUrl}\n\n` +
        `📅 *Fecha de consulta:* ${dateTime}\n\n` +
        `¡Espero tu respuesta! 😊`;
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
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
      <FaWhatsapp className="mr-2 h-4 w-4" />
      Contactar por WhatsApp
    </Button>
  );
}