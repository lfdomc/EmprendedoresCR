-- Script SQL para eliminar la columna image_url_2 de la tabla products
-- Ejecutar en el SQL Editor de Supabase

-- 1. Eliminar la columna image_url_2 de la tabla products
ALTER TABLE products DROP COLUMN IF EXISTS image_url_2;

-- 2. Verificar que la columna fue eliminada
-- Ejecutar esta consulta para confirmar que la columna ya no existe:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'products' 
-- ORDER BY ordinal_position;

-- 3. Comentario de confirmación
-- La columna image_url_2 ha sido eliminada exitosamente de la tabla products
-- Los productos ahora solo tendrán una imagen principal (image_url)