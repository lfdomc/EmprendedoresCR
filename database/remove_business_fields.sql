-- Script para eliminar campos de la tabla businesses
-- Ejecutar este script en Supabase SQL Editor para eliminar las columnas no deseadas

-- Eliminar columnas de ubicación extendida
ALTER TABLE businesses 
DROP COLUMN IF EXISTS city,
DROP COLUMN IF EXISTS state,
DROP COLUMN IF EXISTS country,
DROP COLUMN IF EXISTS postal_code;

-- Eliminar columnas de coordenadas
ALTER TABLE businesses 
DROP COLUMN IF EXISTS latitude,
DROP COLUMN IF EXISTS longitude;

-- Eliminar columna de imagen de portada
ALTER TABLE businesses 
DROP COLUMN IF EXISTS cover_image_url;

-- Eliminar índices relacionados (si existen)
DROP INDEX IF EXISTS idx_businesses_city;
DROP INDEX IF EXISTS idx_businesses_state;
DROP INDEX IF EXISTS idx_businesses_country;
DROP INDEX IF EXISTS idx_businesses_postal_code;
DROP INDEX IF EXISTS idx_businesses_latitude;
DROP INDEX IF EXISTS idx_businesses_longitude;
DROP INDEX IF EXISTS idx_businesses_cover_image_url;

-- Verificar la estructura final de la tabla
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'businesses' 
-- ORDER BY ordinal_position;