-- =====================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS
-- Aplicación de Emprendimientos Costa Rica
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- TABLAS PRINCIPALES
-- =====================================================

-- Tabla de categorías para productos y servicios
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de emprendimientos
CREATE TABLE businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  logo_url TEXT,
  email VARCHAR(255),
  phone VARCHAR(20),
  website VARCHAR(255),
  whatsapp VARCHAR(20),
  facebook VARCHAR(255),
  instagram VARCHAR(255),
  address TEXT,
  canton VARCHAR(100),
  provincia VARCHAR(100),
  google_maps_link TEXT,
  opening_hours TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'CRC',
  stock_quantity INTEGER DEFAULT 0,
  sku VARCHAR(100),
  images TEXT[], -- Array de URLs de imágenes
  canton VARCHAR(100), -- Heredado del emprendimiento
  provincia VARCHAR(100), -- Heredado del emprendimiento
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de servicios
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'CRC',
  duration_minutes INTEGER, -- Duración del servicio en minutos
  images TEXT[], -- Array de URLs de imágenes
  canton VARCHAR(100), -- Heredado del emprendimiento
  provincia VARCHAR(100), -- Heredado del emprendimiento
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de horarios de servicios
CREATE TABLE service_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Domingo, 6 = Sábado
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true
);

-- Tabla de reseñas
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT review_target_check CHECK (
    (product_id IS NOT NULL AND service_id IS NULL) OR
    (product_id IS NULL AND service_id IS NOT NULL)
  )
);

-- Tabla para estadísticas de WhatsApp
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

-- =====================================================
-- ÍNDICES PARA MEJORAR EL RENDIMIENTO
-- =====================================================

-- Índices para businesses
CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_businesses_is_active ON businesses(is_active);
CREATE INDEX idx_businesses_canton ON businesses(canton);
CREATE INDEX idx_businesses_provincia ON businesses(provincia);
CREATE INDEX idx_businesses_category_id ON businesses(category_id);

-- Índices para products
CREATE INDEX idx_products_business_id ON products(business_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_canton ON products(canton);
CREATE INDEX idx_products_provincia ON products(provincia);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_price ON products(price);

-- Índices para services
CREATE INDEX idx_services_business_id ON services(business_id);
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_services_canton ON services(canton);
CREATE INDEX idx_services_provincia ON services(provincia);
CREATE INDEX idx_services_is_featured ON services(is_featured);
CREATE INDEX idx_services_price ON services(price);

-- Índices para reviews
CREATE INDEX idx_reviews_business_id ON reviews(business_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_service_id ON reviews(service_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Índices para whatsapp_stats
CREATE INDEX idx_whatsapp_stats_business_id ON whatsapp_stats(business_id);
CREATE INDEX idx_whatsapp_stats_product_id ON whatsapp_stats(product_id);
CREATE INDEX idx_whatsapp_stats_service_id ON whatsapp_stats(service_id);

-- Índices para service_schedules
CREATE INDEX idx_service_schedules_service_id ON service_schedules(service_id);
CREATE INDEX idx_service_schedules_day_of_week ON service_schedules(day_of_week);

-- Índices para categories
CREATE INDEX idx_categories_name ON categories(name);

-- =====================================================
-- CONFIGURACIÓN DE STORAGE PARA IMÁGENES
-- =====================================================

-- Crear bucket para imágenes
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- POLÍTICAS DE SEGURIDAD RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_schedules ENABLE ROW LEVEL SECURITY;

-- Políticas para businesses
CREATE POLICY "Public can view active businesses" ON businesses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their own businesses" ON businesses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business" ON businesses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business" ON businesses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business" ON businesses
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para products
CREATE POLICY "Users can view all active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Business owners can manage their products" ON products
  FOR ALL USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Políticas para services
CREATE POLICY "Users can view all active services" ON services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Business owners can manage their services" ON services
  FOR ALL USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Políticas para service_schedules
CREATE POLICY "Users can view all service schedules" ON service_schedules
  FOR SELECT USING (true);

CREATE POLICY "Business owners can manage their service schedules" ON service_schedules
  FOR ALL USING (
    service_id IN (
      SELECT s.id FROM services s
      JOIN businesses b ON s.business_id = b.id
      WHERE b.user_id = auth.uid()
    )
  );

-- Políticas para reviews
CREATE POLICY "Users can view all reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

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

-- =====================================================
-- POLÍTICAS DE STORAGE
-- =====================================================

-- Política para permitir que usuarios autenticados suban imágenes
CREATE POLICY "Usuarios autenticados pueden subir imágenes" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

-- Política para permitir que todos vean las imágenes públicas
CREATE POLICY "Imágenes son públicamente visibles" ON storage.objects
FOR SELECT USING (
  bucket_id = 'images'
);

-- Política para permitir que usuarios autenticados actualicen sus propias imágenes
CREATE POLICY "Usuarios pueden actualizar sus propias imágenes" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

-- Política para permitir que usuarios autenticados eliminen sus propias imágenes
CREATE POLICY "Usuarios pueden eliminar sus propias imágenes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para heredar provincia y cantón desde businesses a products
CREATE OR REPLACE FUNCTION inherit_location_to_products()
RETURNS TRIGGER AS $$
BEGIN
    -- Obtener provincia y cantón del business
    SELECT provincia, canton INTO NEW.provincia, NEW.canton
    FROM businesses 
    WHERE id = NEW.business_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

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

-- Función para actualizar ubicación de products cuando se actualiza el business
CREATE OR REPLACE FUNCTION update_products_location_on_business_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo actualizar si provincia o cantón cambiaron
    IF OLD.provincia IS DISTINCT FROM NEW.provincia OR OLD.canton IS DISTINCT FROM NEW.canton THEN
        UPDATE products 
        SET provincia = NEW.provincia, canton = NEW.canton
        WHERE business_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para actualizar ubicación de services cuando se actualiza el business
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

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Triggers para actualizar updated_at
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_stats_updated_at BEFORE UPDATE ON whatsapp_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers para heredar ubicación al insertar products
CREATE TRIGGER inherit_location_products_insert
    BEFORE INSERT ON products
    FOR EACH ROW EXECUTE FUNCTION inherit_location_to_products();

-- Triggers para heredar ubicación al actualizar products (solo si business_id cambia)
CREATE TRIGGER inherit_location_products_update
    BEFORE UPDATE ON products
    FOR EACH ROW 
    WHEN (OLD.business_id IS DISTINCT FROM NEW.business_id)
    EXECUTE FUNCTION inherit_location_to_products();

-- Triggers para heredar ubicación al insertar services
CREATE TRIGGER inherit_location_services_insert
    BEFORE INSERT ON services
    FOR EACH ROW EXECUTE FUNCTION inherit_location_to_services();

-- Triggers para heredar ubicación al actualizar services (solo si business_id cambia)
CREATE TRIGGER inherit_location_services_update
    BEFORE UPDATE ON services
    FOR EACH ROW 
    WHEN (OLD.business_id IS DISTINCT FROM NEW.business_id)
    EXECUTE FUNCTION inherit_location_to_services();

-- Triggers para actualizar products cuando cambia la ubicación del business
CREATE TRIGGER update_products_location_on_business_update
    AFTER UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_products_location_on_business_change();

-- Triggers para actualizar services cuando cambia la ubicación del business
CREATE TRIGGER update_services_location_on_business_update
    AFTER UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_services_location_on_business_change();

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar categorías iniciales
INSERT INTO categories (name, description, icon) VALUES
('Alimentación', 'Restaurantes, cafeterías, comida rápida', '🍽️'),
('Tecnología', 'Servicios de IT, desarrollo, soporte técnico', '💻'),
('Salud y Belleza', 'Spa, salones de belleza, servicios médicos', '💄'),
('Educación', 'Cursos, tutorías, capacitaciones', '📚'),
('Hogar y Jardín', 'Limpieza, jardinería, reparaciones', '🏠'),
('Transporte', 'Taxi, delivery, mudanzas', '🚗'),
('Entretenimiento', 'Eventos, música, fotografía', '🎉'),
('Deportes y Fitness', 'Gimnasios, entrenadores, deportes', '💪'),
('Moda y Accesorios', 'Ropa, zapatos, accesorios', '👗'),
('Servicios Profesionales', 'Contabilidad, legal, consultoría', '💼'),
('Construcción', 'Albañilería, electricidad, plomería', '🔨'),
('Automotriz', 'Mecánica, repuestos, lavado de autos', '🚙'),
('Mascotas', 'Veterinaria, grooming, accesorios', '🐕'),
('Arte y Manualidades', 'Pintura, escultura, artesanías', '🎨'),
('Agricultura', 'Cultivos, jardinería, productos orgánicos', '🌱');

-- =====================================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================

-- Comentarios en tablas principales
COMMENT ON TABLE businesses IS 'Tabla principal de emprendimientos registrados';
COMMENT ON TABLE products IS 'Productos ofrecidos por los emprendimientos';
COMMENT ON TABLE services IS 'Servicios ofrecidos por los emprendimientos';
COMMENT ON TABLE categories IS 'Categorías para clasificar productos y servicios';
COMMENT ON TABLE reviews IS 'Reseñas y calificaciones de productos y servicios';
COMMENT ON TABLE whatsapp_stats IS 'Estadísticas de contactos vía WhatsApp';
COMMENT ON TABLE service_schedules IS 'Horarios de disponibilidad para servicios';

-- Comentarios en campos importantes
COMMENT ON COLUMN businesses.canton IS 'Cantón de Costa Rica donde se ubica el emprendimiento';
COMMENT ON COLUMN businesses.provincia IS 'Provincia de Costa Rica donde se ubica el emprendimiento';
COMMENT ON COLUMN businesses.google_maps_link IS 'Enlace directo a Google Maps para la ubicación';
COMMENT ON COLUMN products.images IS 'Array de URLs de imágenes del producto';
COMMENT ON COLUMN services.images IS 'Array de URLs de imágenes del servicio';
COMMENT ON COLUMN services.duration_minutes IS 'Duración estimada del servicio en minutos';
COMMENT ON COLUMN whatsapp_stats.contact_count IS 'Número total de contactos vía WhatsApp';

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================

/*
PROVINCIAS DE COSTA RICA:
- San José
- Alajuela  
- Cartago
- Heredia
- Guanacaste
- Puntarenas
- Limón

CANTONES PRINCIPALES POR PROVINCIA:

San José: San José, Escazú, Desamparados, Puriscal, Tarrazú, Aserrí, Mora, 
         Goicoechea, Santa Ana, Alajuelita, Vásquez de Coronado, Acosta, 
         Tibás, Moravia, Montes de Oca, Turrubares, Dota, Curridabat, Pérez Zeledón

Alajuela: Alajuela, San Ramón, Grecia, San Mateo, Atenas, Naranjo, Palmares, 
         Poás, Orotina, San Carlos, Zarcero, Valverde Vega, Upala, Los Chiles, Guatuso

Cartago: Cartago, Paraíso, La Unión, Jiménez, Turrialba, Alvarado, Oreamuno, El Guarco

Heredia: Heredia, Barva, Santo Domingo, Santa Bárbara, San Rafael, San Isidro, 
        Belén, Flores, San Pablo, Sarapiquí

Guanacaste: Liberia, Nicoya, Santa Cruz, Bagaces, Carrillo, Cañas, Abangares, 
           Tilarán, Nandayure, La Cruz, Hojancha

Puntarenas: Puntarenas, Esparza, Buenos Aires, Montes de Oro, Osa, Quepos, 
           Golfito, Coto Brus, Parrita, Corredores, Garabito

Limón: Limón, Pococí, Siquirres, Talamanca, Matina, Guácimo

CARACTERÍSTICAS TÉCNICAS:
- Todas las tablas usan UUID como clave primaria
- RLS (Row Level Security) habilitado para seguridad
- Triggers automáticos para updated_at
- Herencia automática de ubicación desde businesses
- Soporte para imágenes múltiples en arrays
- Estadísticas de WhatsApp integradas
- Políticas de storage para manejo de imágenes
- Índices optimizados para consultas frecuentes
*/

-- =====================================================
-- FIN DEL ESQUEMA
-- =====================================================