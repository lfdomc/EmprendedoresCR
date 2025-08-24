-- Script para agregar campos de fotos adicionales a las tablas products y services
-- Cada producto y servicio podrá tener hasta 3 fotos adicionales

-- Agregar campos de fotos adicionales a la tabla products
ALTER TABLE products 
ADD COLUMN additional_photo_1 TEXT,
ADD COLUMN additional_photo_2 TEXT,
ADD COLUMN additional_photo_3 TEXT;

-- Agregar campos de fotos adicionales a la tabla services
ALTER TABLE services 
ADD COLUMN additional_photo_1 TEXT,
ADD COLUMN additional_photo_2 TEXT,
ADD COLUMN additional_photo_3 TEXT;

-- Comentarios sobre los campos:
-- additional_photo_1, additional_photo_2, additional_photo_3: URLs de las fotos adicionales
-- Estos campos son opcionales (pueden ser NULL)
-- Las fotos se almacenarán en Supabase Storage y aquí se guardará la URL pública

-- Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name IN ('products', 'services') 
AND column_name LIKE 'additional_photo_%'
ORDER BY table_name, column_name;