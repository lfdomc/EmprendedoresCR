-- Script completo para resolver errores de servicios
-- Ejecutar en el SQL Editor de Supabase

-- ========================================
-- PARTE 1: VERIFICAR ESTADO ACTUAL
-- ========================================

-- Verificar si existe la tabla services
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'services'
) as tabla_services_existe;

-- Verificar columnas actuales de services
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'services' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar buckets existentes
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets 
ORDER BY created_at;

-- ========================================
-- PARTE 2: CREAR/ACTUALIZAR TABLA SERVICES
-- ========================================

-- Crear tabla services si no existe
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'CRC',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar columna image_url si no existe
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Agregar comentarios
COMMENT ON TABLE services IS 'Tabla de servicios ofrecidos por los emprendimientos';
COMMENT ON COLUMN services.image_url IS 'URL de la imagen del servicio almacenada en Supabase Storage';

-- ========================================
-- PARTE 3: CREAR ÍNDICES
-- ========================================

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_services_business_id ON services(business_id);
CREATE INDEX IF NOT EXISTS idx_services_category_id ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at);

-- ========================================
-- PARTE 4: CONFIGURAR RLS (ROW LEVEL SECURITY)
-- ========================================

-- Habilitar RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
DROP POLICY IF EXISTS "Users can insert their own services" ON services;
DROP POLICY IF EXISTS "Users can update their own services" ON services;
DROP POLICY IF EXISTS "Users can delete their own services" ON services;

-- Política para lectura pública
CREATE POLICY "Services are viewable by everyone" ON services
FOR SELECT USING (true);

-- Política para inserción (solo propietarios del negocio)
CREATE POLICY "Users can insert their own services" ON services
FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM businesses WHERE id = business_id
  )
);

-- Política para actualización (solo propietarios del negocio)
CREATE POLICY "Users can update their own services" ON services
FOR UPDATE USING (
  auth.uid() IN (
    SELECT user_id FROM businesses WHERE id = business_id
  )
);

-- Política para eliminación (solo propietarios del negocio)
CREATE POLICY "Users can delete their own services" ON services
FOR DELETE USING (
  auth.uid() IN (
    SELECT user_id FROM businesses WHERE id = business_id
  )
);

-- ========================================
-- PARTE 5: TRIGGER PARA UPDATED_AT
-- ========================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para services
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- PARTE 6: CONFIGURAR STORAGE
-- ========================================

-- Crear bucket para imágenes de servicios
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Eliminar políticas existentes de storage
DROP POLICY IF EXISTS "Usuarios autenticados pueden subir imágenes de servicios" ON storage.objects;
DROP POLICY IF EXISTS "Imágenes de servicios son públicamente visibles" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propias imágenes de servicios" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propias imágenes de servicios" ON storage.objects;

-- Políticas para bucket service-images
CREATE POLICY "Usuarios autenticados pueden subir imágenes de servicios" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'service-images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Imágenes de servicios son públicamente visibles" ON storage.objects
FOR SELECT USING (
  bucket_id = 'service-images'
);

CREATE POLICY "Usuarios pueden actualizar sus propias imágenes de servicios" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'service-images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Usuarios pueden eliminar sus propias imágenes de servicios" ON storage.objects
FOR DELETE USING (
  bucket_id = 'service-images' AND 
  auth.role() = 'authenticated'
);

-- ========================================
-- PARTE 7: VERIFICACIONES FINALES
-- ========================================

-- Verificar tabla services
SELECT 'Tabla services:' as verificacion;
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'services' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar bucket service-images
SELECT 'Bucket service-images:' as verificacion;
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets 
WHERE id = 'service-images';

-- Verificar políticas de services
SELECT 'Políticas de services:' as verificacion;
SELECT 
  policyname,
  cmd
FROM pg_policies 
WHERE tablename = 'services' 
AND schemaname = 'public'
ORDER BY policyname;

-- Verificar políticas de storage
SELECT 'Políticas de storage:' as verificacion;
SELECT 
  policyname,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%service%'
ORDER BY policyname;

-- Verificar índices
SELECT 'Índices de services:' as verificacion;
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'services' 
AND schemaname = 'public'
ORDER BY indexname;

SELECT '✅ Script completado exitosamente' as resultado;