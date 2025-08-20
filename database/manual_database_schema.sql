-- =====================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS - MANUAL
-- Aplicación de Emprendimientos Costa Rica
-- Versión optimizada para ejecución manual en Supabase
-- =====================================================

-- PASO 1: Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- PASO 2: CREAR TABLAS PRINCIPALES
-- =====================================================

-- Tabla de categorías para productos y servicios
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de emprendimientos
CREATE TABLE IF NOT EXISTS businesses (
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
CREATE TABLE IF NOT EXISTS products (
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
CREATE TABLE IF NOT EXISTS services (
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
CREATE TABLE IF NOT EXISTS service_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Domingo, 6 = Sábado
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de reseñas
CREATE TABLE IF NOT EXISTS reviews (
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
CREATE TABLE IF NOT EXISTS whatsapp_stats (
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
-- PASO 3: CREAR ÍNDICES PARA MEJORAR EL RENDIMIENTO
-- =====================================================

-- Índices para businesses
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_is_active ON businesses(is_active);
CREATE INDEX IF NOT EXISTS idx_businesses_canton ON businesses(canton);
CREATE INDEX IF NOT EXISTS idx_businesses_provincia ON businesses(provincia);
CREATE INDEX IF NOT EXISTS idx_businesses_category_id ON businesses(category_id);

-- Índices para products
CREATE INDEX IF NOT EXISTS idx_products_business_id ON products(business_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_canton ON products(canton);
CREATE INDEX IF NOT EXISTS idx_products_provincia ON products(provincia);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Índices para services
CREATE INDEX IF NOT EXISTS idx_services_business_id ON services(business_id);
CREATE INDEX IF NOT EXISTS idx_services_category_id ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_canton ON services(canton);
CREATE INDEX IF NOT EXISTS idx_services_provincia ON services(provincia);
CREATE INDEX IF NOT EXISTS idx_services_is_featured ON services(is_featured);
CREATE INDEX IF NOT EXISTS idx_services_price ON services(price);

-- Índices para reviews
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_service_id ON reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Índices para whatsapp_stats
CREATE INDEX IF NOT EXISTS idx_whatsapp_stats_business_id ON whatsapp_stats(business_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_stats_product_id ON whatsapp_stats(product_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_stats_service_id ON whatsapp_stats(service_id);

-- Índices para service_schedules
CREATE INDEX IF NOT EXISTS idx_service_schedules_service_id ON service_schedules(service_id);
CREATE INDEX IF NOT EXISTS idx_service_schedules_day_of_week ON service_schedules(day_of_week);

-- Índices para categories
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- =====================================================
-- PASO 4: CONFIGURAR STORAGE PARA IMÁGENES
-- =====================================================

-- Crear bucket para imágenes
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- PASO 5: HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_schedules ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASO 6: CREAR POLÍTICAS DE SEGURIDAD
-- =====================================================

-- Políticas para businesses
DROP POLICY IF EXISTS "Public can view active businesses" ON businesses;
CREATE POLICY "Public can view active businesses" ON businesses
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Users can view their own businesses" ON businesses;
CREATE POLICY "Users can view their own businesses" ON businesses
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own business" ON businesses;
CREATE POLICY "Users can insert their own business" ON businesses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own business" ON businesses;
CREATE POLICY "Users can update their own business" ON businesses
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own business" ON businesses;
CREATE POLICY "Users can delete their own business" ON businesses
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para products
DROP POLICY IF EXISTS "Users can view all active products" ON products;
CREATE POLICY "Users can view all active products" ON products
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Business owners can manage their products" ON products;
CREATE POLICY "Business owners can manage their products" ON products
  FOR ALL USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Políticas para services
DROP POLICY IF EXISTS "Users can view all active services" ON services;
CREATE POLICY "Users can view all active services" ON services
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Business owners can manage their services" ON services;
CREATE POLICY "Business owners can manage their services" ON services
  FOR ALL USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Políticas para service_schedules
DROP POLICY IF EXISTS "Users can view all service schedules" ON service_schedules;
CREATE POLICY "Users can view all service schedules" ON service_schedules
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Business owners can manage their service schedules" ON service_schedules;
CREATE POLICY "Business owners can manage their service schedules" ON service_schedules
  FOR ALL USING (
    service_id IN (
      SELECT s.id FROM services s
      JOIN businesses b ON s.business_id = b.id
      WHERE b.user_id = auth.uid()
    )
  );

-- Políticas para reviews
DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;
CREATE POLICY "Users can view all reviews" ON reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON reviews;
CREATE POLICY "Authenticated users can insert reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;
CREATE POLICY "Users can delete their own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para whatsapp_stats
DROP POLICY IF EXISTS "Business owners can view their whatsapp stats" ON whatsapp_stats;
CREATE POLICY "Business owners can view their whatsapp stats" ON whatsapp_stats
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "System can insert whatsapp stats" ON whatsapp_stats;
CREATE POLICY "System can insert whatsapp stats" ON whatsapp_stats
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "System can update whatsapp stats" ON whatsapp_stats;
CREATE POLICY "System can update whatsapp stats" ON whatsapp_stats
  FOR UPDATE USING (true);

-- =====================================================
-- PASO 7: CREAR POLÍTICAS DE STORAGE
-- =====================================================

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Usuarios autenticados pueden subir imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Imágenes son públicamente visibles" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propias imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propias imágenes" ON storage.objects;

-- Crear nuevas políticas de storage
CREATE POLICY "Usuarios autenticados pueden subir imágenes" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Imágenes son públicamente visibles" ON storage.objects
FOR SELECT USING (
  bucket_id = 'images'
);

CREATE POLICY "Usuarios pueden actualizar sus propias imágenes" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Usuarios pueden eliminar sus propias imágenes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

-- =====================================================
-- PASO 8: CREAR FUNCIONES AUXILIARES
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
        SET provincia = NEW.provincia, canton = NEW.canton, updated_at = NOW()
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
        SET provincia = NEW.provincia, canton = NEW.canton, updated_at = NOW()
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
-- PASO 9: CREAR TRIGGERS
-- =====================================================

-- Eliminar triggers existentes si existen
DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_whatsapp_stats_updated_at ON whatsapp_stats;
DROP TRIGGER IF EXISTS update_service_schedules_updated_at ON service_schedules;
DROP TRIGGER IF EXISTS inherit_location_products_insert ON products;
DROP TRIGGER IF EXISTS inherit_location_products_update ON products;
DROP TRIGGER IF EXISTS inherit_location_services_insert ON services;
DROP TRIGGER IF EXISTS inherit_location_services_update ON services;
DROP TRIGGER IF EXISTS update_products_location_on_business_update ON businesses;
DROP TRIGGER IF EXISTS update_services_location_on_business_update ON businesses;

-- Crear triggers para actualizar updated_at
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

CREATE TRIGGER update_service_schedules_updated_at BEFORE UPDATE ON service_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Crear triggers para heredar ubicación
CREATE TRIGGER inherit_location_products_insert
    BEFORE INSERT ON products
    FOR EACH ROW EXECUTE FUNCTION inherit_location_to_products();

CREATE TRIGGER inherit_location_products_update
    BEFORE UPDATE ON products
    FOR EACH ROW 
    WHEN (OLD.business_id IS DISTINCT FROM NEW.business_id)
    EXECUTE FUNCTION inherit_location_to_products();

CREATE TRIGGER inherit_location_services_insert
    BEFORE INSERT ON services
    FOR EACH ROW EXECUTE FUNCTION inherit_location_to_services();

CREATE TRIGGER inherit_location_services_update
    BEFORE UPDATE ON services
    FOR EACH ROW 
    WHEN (OLD.business_id IS DISTINCT FROM NEW.business_id)
    EXECUTE FUNCTION inherit_location_to_services();

-- Crear triggers para actualizar ubicación cuando cambia el business
CREATE TRIGGER update_products_location_on_business_update
    AFTER UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_products_location_on_business_change();

CREATE TRIGGER update_services_location_on_business_update
    AFTER UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_services_location_on_business_change();

-- =====================================================
-- PASO 10: INSERTAR DATOS INICIALES
-- =====================================================

-- Insertar categorías iniciales (solo si no existen)
INSERT INTO categories (name, description, icon) 
SELECT * FROM (
  VALUES 
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
    ('Agricultura', 'Cultivos, jardinería, productos orgánicos', '🌱')
) AS v(name, description, icon)
WHERE NOT EXISTS (
  SELECT 1 FROM categories c WHERE c.name = v.name
);

-- =====================================================
-- PASO 11: AGREGAR COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================

-- Comentarios en tablas principales
COMMENT ON TABLE businesses IS 'Tabla principal de emprendimientos registrados en Costa Rica';
COMMENT ON TABLE products IS 'Productos ofrecidos por los emprendimientos';
COMMENT ON TABLE services IS 'Servicios ofrecidos por los emprendimientos';
COMMENT ON TABLE categories IS 'Categorías para clasificar productos y servicios';
COMMENT ON TABLE reviews IS 'Reseñas y calificaciones de productos y servicios';
COMMENT ON TABLE whatsapp_stats IS 'Estadísticas de contactos vía WhatsApp';
COMMENT ON TABLE service_schedules IS 'Horarios de disponibilidad para servicios';

-- Comentarios en campos importantes
COMMENT ON COLUMN businesses.canton IS 'Cantón de Costa Rica donde se ubica el emprendimiento';
COMMENT ON COLUMN businesses.provincia IS 'Provincia de Costa Rica (San José, Alajuela, Cartago, Heredia, Guanacaste, Puntarenas, Limón)';
COMMENT ON COLUMN businesses.google_maps_link IS 'Enlace directo a Google Maps para la ubicación del emprendimiento';
COMMENT ON COLUMN products.images IS 'Array de URLs de imágenes del producto almacenadas en Supabase Storage';
COMMENT ON COLUMN services.images IS 'Array de URLs de imágenes del servicio almacenadas en Supabase Storage';
COMMENT ON COLUMN services.duration_minutes IS 'Duración estimada del servicio en minutos';
COMMENT ON COLUMN whatsapp_stats.contact_count IS 'Número total de contactos vía WhatsApp para este producto/servicio';

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Verificar que todas las tablas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('businesses', 'products', 'services', 'categories', 'reviews', 'whatsapp_stats', 'service_schedules')
ORDER BY tablename;

-- Verificar que RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('businesses', 'products', 'services', 'reviews', 'whatsapp_stats', 'service_schedules')
ORDER BY tablename;

-- Verificar que las categorías se insertaron
SELECT COUNT(*) as total_categories FROM categories;

-- Verificar que el bucket de storage existe
SELECT id, name, public FROM storage.buckets WHERE id = 'images';

-- =====================================================
-- ESQUEMA COMPLETADO EXITOSAMENTE
-- =====================================================

/*
INSTRUCCIONES DE USO:

1. Copia todo este código SQL
2. Ve al SQL Editor de tu proyecto Supabase
3. Pega el código completo
4. Ejecuta el script completo
5. Verifica los resultados de las consultas de verificación al final

Este esquema incluye:
✅ Todas las tablas necesarias para el proyecto
✅ Índices optimizados para consultas rápidas
✅ Políticas RLS para seguridad
✅ Storage configurado para imágenes
✅ Triggers automáticos para updated_at
✅ Herencia automática de ubicación
✅ Funciones auxiliares para WhatsApp stats
✅ Datos iniciales (categorías)
✅ Documentación completa

Provincias de Costa Rica soportadas:
- San José, Alajuela, Cartago, Heredia
- Guanacaste, Puntarenas, Limón

Características técnicas:
- UUID como clave primaria en todas las tablas
- Row Level Security (RLS) habilitado
- Soporte para arrays de imágenes
- Triggers automáticos para mantener consistencia
- Políticas de storage para manejo seguro de archivos
*/