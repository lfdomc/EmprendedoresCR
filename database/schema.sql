-- Esquema de base de datos para la aplicación de emprendimientos

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

-- Índices para mejorar el rendimiento
CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_businesses_is_active ON businesses(is_active);
CREATE INDEX idx_products_business_id ON products(business_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_canton ON products(canton);
CREATE INDEX idx_products_provincia ON products(provincia);
CREATE INDEX idx_services_business_id ON services(business_id);
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_reviews_business_id ON reviews(business_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_service_id ON reviews(service_id);

-- Políticas de seguridad RLS (Row Level Security)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Políticas para businesses
-- Política para que todos puedan ver emprendimientos activos
CREATE POLICY "Public can view active businesses" ON businesses
  FOR SELECT USING (is_active = true);

-- Política para que los propietarios puedan ver sus propios emprendimientos (activos o inactivos)
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

-- Políticas para reviews
CREATE POLICY "Users can view all reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

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
('Servicios Profesionales', 'Contabilidad, legal, consultoría', '💼');

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

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