-- Agregar campos de provincia y cantón a la tabla de servicios
ALTER TABLE services 
ADD COLUMN canton VARCHAR(100),
ADD COLUMN provincia VARCHAR(100);

-- Crear tabla para estadísticas de WhatsApp
CREATE TABLE whatsapp_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  contact_count INTEGER DEFAULT 1,
  last_contact_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT whatsapp_stats_target_check CHECK (
    (product_id IS NOT NULL AND service_id IS NULL) OR
    (product_id IS NULL AND service_id IS NOT NULL)
  )
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_whatsapp_stats_business_id ON whatsapp_stats(business_id);
CREATE INDEX idx_whatsapp_stats_product_id ON whatsapp_stats(product_id);
CREATE INDEX idx_whatsapp_stats_service_id ON whatsapp_stats(service_id);
CREATE INDEX idx_services_canton ON services(canton);
CREATE INDEX idx_services_provincia ON services(provincia);

-- Habilitar RLS para la tabla de estadísticas
ALTER TABLE whatsapp_stats ENABLE ROW LEVEL SECURITY;

-- Políticas para whatsapp_stats
CREATE POLICY "Business owners can view their whatsapp stats" ON whatsapp_stats
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert whatsapp stats" ON whatsapp_stats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update whatsapp stats" ON whatsapp_stats
  FOR UPDATE USING (true);

-- Función para heredar provincia y cantón desde businesses a services
CREATE OR REPLACE FUNCTION inherit_location_to_services()
RETURNS TRIGGER AS $$
BEGIN
    -- Obtener provincia y cantón del business
    SELECT provincia, canton INTO NEW.provincia, NEW.canton
    FROM businesses 
    WHERE id = NEW.business_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para heredar ubicación al insertar servicios
CREATE TRIGGER inherit_location_services_insert
    BEFORE INSERT ON services
    FOR EACH ROW EXECUTE FUNCTION inherit_location_to_services();

-- Trigger para heredar ubicación al actualizar servicios (solo si business_id cambia)
CREATE TRIGGER inherit_location_services_update
    BEFORE UPDATE ON services
    FOR EACH ROW 
    WHEN (OLD.business_id IS DISTINCT FROM NEW.business_id)
    EXECUTE FUNCTION inherit_location_to_services();

-- Función para actualizar ubicación de servicios cuando se actualiza el business
CREATE OR REPLACE FUNCTION update_services_location_on_business_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo actualizar si provincia o cantón cambiaron
    IF OLD.provincia IS DISTINCT FROM NEW.provincia OR OLD.canton IS DISTINCT FROM NEW.canton THEN
        UPDATE services 
        SET provincia = NEW.provincia, canton = NEW.canton
        WHERE business_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar servicios cuando cambia la ubicación del business
CREATE TRIGGER update_services_location_on_business_update
    AFTER UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_services_location_on_business_change();

-- Actualizar servicios existentes con la ubicación de sus businesses
UPDATE services 
SET provincia = b.provincia, canton = b.canton
FROM businesses b
WHERE services.business_id = b.id;

-- Función para registrar o incrementar estadísticas de WhatsApp
CREATE OR REPLACE FUNCTION record_whatsapp_contact(
    p_business_id UUID,
    p_product_id UUID DEFAULT NULL,
    p_service_id UUID DEFAULT NULL
)
RETURNS void AS $$
DECLARE
    existing_record whatsapp_stats%ROWTYPE;
BEGIN
    -- Buscar registro existente
    SELECT * INTO existing_record
    FROM whatsapp_stats
    WHERE business_id = p_business_id
    AND (
        (p_product_id IS NOT NULL AND product_id = p_product_id) OR
        (p_service_id IS NOT NULL AND service_id = p_service_id)
    );
    
    IF FOUND THEN
        -- Incrementar contador existente
        UPDATE whatsapp_stats
        SET contact_count = contact_count + 1,
            last_contact_at = NOW(),
            updated_at = NOW()
        WHERE id = existing_record.id;
    ELSE
        -- Crear nuevo registro
        INSERT INTO whatsapp_stats (business_id, product_id, service_id)
        VALUES (p_business_id, p_product_id, p_service_id);
    END IF;
END;
$$ language 'plpgsql';

-- Trigger para updated_at en whatsapp_stats
CREATE TRIGGER update_whatsapp_stats_updated_at BEFORE UPDATE ON whatsapp_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();