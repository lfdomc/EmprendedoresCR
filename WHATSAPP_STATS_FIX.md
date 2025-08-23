# Corrección del Error de WhatsApp Stats

## Problema
El botón de WhatsApp para contacto directo del negocio está generando el siguiente error:

```
Error recording WhatsApp contact: {
  code: 23514, 
  details: null, 
  hint: null, 
  message: "new row for relation 'whatsapp_stats' violates check constraint 'whatsapp_stats_target_check'"
}
```

## Causa
La restricción `whatsapp_stats_target_check` en la tabla `whatsapp_stats` actualmente requiere que **exactamente uno** de `product_id` o `service_id` sea NOT NULL:

```sql
CONSTRAINT whatsapp_stats_target_check CHECK (
  (product_id IS NOT NULL AND service_id IS NULL) OR
  (product_id IS NULL AND service_id IS NOT NULL)
)
```

Sin embargo, para contactos directos del negocio (sin producto o servicio específico), ambos campos son NULL, lo que viola esta restricción.

## Solución

### Paso 1: Ejecutar en Supabase SQL Editor
Ejecuta el siguiente SQL en el editor SQL de tu proyecto Supabase:

```sql
-- Eliminar la restricción actual
ALTER TABLE whatsapp_stats 
DROP CONSTRAINT whatsapp_stats_target_check;

-- Crear nueva restricción que permite contactos directos del negocio
ALTER TABLE whatsapp_stats 
ADD CONSTRAINT whatsapp_stats_target_check CHECK (
  (product_id IS NOT NULL AND service_id IS NULL) OR     -- Contacto por producto
  (product_id IS NULL AND service_id IS NOT NULL) OR     -- Contacto por servicio  
  (product_id IS NULL AND service_id IS NULL)            -- Contacto directo del negocio
);
```

### Paso 2: Habilitar el registro de estadísticas
Una vez aplicada la corrección en la base de datos, descomenta el código en `components/ui/whatsapp-business-button.tsx`:

```typescript
// Cambiar de:
/*
try {
  await recordWhatsAppContact(businessId);
} catch (error) {
  console.error('Error recording WhatsApp contact:', error);
}
*/

// A:
try {
  await recordWhatsAppContact(businessId);
} catch (error) {
  console.error('Error recording WhatsApp contact:', error);
}
```

## Estado Actual
- ✅ Botón de WhatsApp funciona correctamente
- ⚠️ Estadísticas de contacto temporalmente deshabilitadas
- 📋 Archivo SQL de corrección creado: `database/fix_whatsapp_stats_constraint.sql`

## Tipos de Contacto Soportados
Después de la corrección, la tabla `whatsapp_stats` soportará:

1. **Contactos por producto específico**: `product_id` NOT NULL, `service_id` NULL
2. **Contactos por servicio específico**: `product_id` NULL, `service_id` NOT NULL  
3. **Contactos directos del negocio**: `product_id` NULL, `service_id` NULL

Esto permitirá un seguimiento completo de todos los tipos de interacciones por WhatsApp en la plataforma.