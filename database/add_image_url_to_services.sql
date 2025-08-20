-- Script para agregar la columna 'image_url' a la tabla 'services'
-- Ejecutar en el SQL Editor de Supabase

-- 1. Verificar estructura actual de la tabla services
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'services' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Agregar la columna image_url si no existe
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 3. Agregar comentario a la columna
COMMENT ON COLUMN services.image_url IS 'URL de la imagen del servicio almacenada en Supabase Storage';

-- 4. Opcional: Migrar datos de la columna 'images' si existe
-- Descomenta las siguientes líneas si tienes datos en una columna 'images' tipo array
/*
UPDATE services 
SET image_url = images[1] 
WHERE images IS NOT NULL 
AND array_length(images, 1) > 0 
AND image_url IS NULL;
*/

-- 5. Verificar que la columna se agregó correctamente
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'services' 
AND table_schema = 'public'
AND column_name = 'image_url';

-- 6. Verificar estructura completa actualizada
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'services' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 7. Mostrar algunos registros para verificar
SELECT 
  id,
  name,
  image_url,
  created_at
FROM services 
LIMIT 5;