import { Business } from '@/lib/types/database';

/**
 * Envía un recordatorio por email al emprendedor para que agregue productos/servicios
 */
export async function sendBusinessReminderEmail(
  business: Business,
  hasProducts: boolean,
  hasServices: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    // En un entorno de producción, aquí se integraría con un servicio de email
    // como SendGrid, Resend, o el servicio de email de Supabase
    
    const missingItems = [];
    if (!hasProducts) missingItems.push('productos');
    if (!hasServices) missingItems.push('servicios');
    
    if (missingItems.length === 0) {
      return { success: true };
    }

    const emailData = {
      to: business.email,
      subject: `¡Completa tu emprendimiento "${business.name}"! 🚀`,
      html: generateReminderEmailHTML(business, hasProducts, hasServices),
      text: generateReminderEmailText(business, hasProducts, hasServices)
    };

    // TODO: Implementar envío real de email
    // Por ahora, solo simulamos el envío
    console.log('Email reminder would be sent:', emailData);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending business reminder email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}

/**
 * Genera el contenido HTML del email de recordatorio
 */
function generateReminderEmailHTML(
  business: Business,
  hasProducts: boolean,
  hasServices: boolean
): string {
  const missingItems = [];
  if (!hasProducts) missingItems.push('📦 Productos de tu emprendimiento');
  if (!hasServices) missingItems.push('🔧 Servicios que ofreces');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Completa tu emprendimiento</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        .missing-list { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 ¡Felicidades por crear tu emprendimiento!</h1>
          <p>"${business.name}" ya está registrado en Costa Rica Emprende</p>
        </div>
        
        <div class="content">
          <h2>¡Solo falta un paso más! 🚀</h2>
          <p>Tu emprendimiento está creado, pero para comenzar a atraer clientes necesitas agregar:</p>
          
          <div class="missing-list">
            <h3>📋 Elementos faltantes:</h3>
            <ul>
              ${missingItems.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
          
          <p>Agregar estos elementos te ayudará a:</p>
          <ul>
            <li>✅ Aparecer en las búsquedas de clientes</li>
            <li>✅ Mostrar tu catálogo completo</li>
            <li>✅ Generar más contactos por WhatsApp</li>
            <li>✅ Aumentar la confianza de tus clientes</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://costaricaemprende.com/dashboard" class="button">
              🎯 Completar mi emprendimiento
            </a>
          </div>
          
          <p><strong>💡 Consejo:</strong> Los emprendimientos con productos y servicios reciben 5x más contactos que los que no los tienen.</p>
        </div>
        
        <div class="footer">
          <p>¿Necesitas ayuda? Contáctanos respondiendo a este email.</p>
          <p>Saludos,<br>El equipo de <strong>Costa Rica Emprende</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Genera el contenido de texto plano del email de recordatorio
 */
function generateReminderEmailText(
  business: Business,
  hasProducts: boolean,
  hasServices: boolean
): string {
  const missingItems = [];
  if (!hasProducts) missingItems.push('• Productos de tu emprendimiento');
  if (!hasServices) missingItems.push('• Servicios que ofreces');

  return `
¡Felicidades por crear tu emprendimiento!

"${business.name}" ya está registrado en Costa Rica Emprende.

¡Solo falta un paso más!

Tu emprendimiento está creado, pero para comenzar a atraer clientes necesitas agregar:

Elementos faltantes:
${missingItems.join('\n')}

Agregar estos elementos te ayudará a:
• Aparecer en las búsquedas de clientes
• Mostrar tu catálogo completo
• Generar más contactos por WhatsApp
• Aumentar la confianza de tus clientes

Completa tu emprendimiento aquí:
https://costaricaemprende.com/dashboard

Consejo: Los emprendimientos con productos y servicios reciben 5x más contactos que los que no los tienen.

¿Necesitas ayuda? Contáctanos respondiendo a este email.

Saludos,
El equipo de Costa Rica Emprende
  `.trim();
}

/**
 * Genera un mensaje de WhatsApp para recordar al emprendedor
 */
export function generateWhatsAppReminderMessage(
  business: Business,
  hasProducts: boolean,
  hasServices: boolean
): string {
  const missingItems = [];
  if (!hasProducts) missingItems.push('📦 Productos');
  if (!hasServices) missingItems.push('🔧 Servicios');

  if (missingItems.length === 0) {
    return '';
  }

  return `¡Hola! 👋

¡Felicidades por crear tu emprendimiento "${business.name}"! 🎉

Para completar tu perfil y comenzar a vender, te recomendamos agregar:

${missingItems.join('\n')}

Puedes hacerlo fácilmente desde tu dashboard:
https://costaricaemprende.com/dashboard

¡Esto te ayudará a atraer más clientes! 🚀

Saludos,
Costa Rica Emprende`;
}

/**
 * Abre WhatsApp con un mensaje pre-escrito
 */
export function openWhatsAppWithMessage(phoneNumber: string, message: string): void {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}

/**
 * Abre el cliente de email con un mensaje pre-escrito
 */
export function openEmailWithMessage(
  email: string,
  subject: string,
  body: string
): void {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const emailUrl = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
  window.open(emailUrl, '_blank');
}