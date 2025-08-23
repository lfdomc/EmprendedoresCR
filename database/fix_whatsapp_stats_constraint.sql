-- Modificar la restricción de whatsapp_stats para permitir contactos directos del negocio
-- Esto permite que tanto product_id como service_id sean NULL para contactos generales del negocio

ALTER TABLE whatsapp_stats 
DROP CONSTRAINT whatsapp_stats_target_check;

-- Crear nueva restricción que permite:
-- 1. Solo product_id (service_id NULL) - contacto por producto
-- 2. Solo service_id (product_id NULL) - contacto por servicio  
-- 3. Ambos NULL - contacto directo del negocio
ALTER TABLE whatsapp_stats 
ADD CONSTRAINT whatsapp_stats_target_check CHECK (
  (product_id IS NOT NULL AND service_id IS NULL) OR
  (product_id IS NULL AND service_id IS NOT NULL) OR
  (product_id IS NULL AND service_id IS NULL)
);

-- Comentario explicativo
COMMENT ON CONSTRAINT whatsapp_stats_target_check ON whatsapp_stats IS 
'Permite contactos por producto específico, servicio específico, o contacto directo del negocio';