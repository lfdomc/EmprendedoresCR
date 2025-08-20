-- Script para migrar el campo 'images' (text[]) a 'image_url' (text) en la tabla products
-- Ejecutar manualmente en Supabase SQL Editor o psql

-- Paso 1: Agregar la nueva columna image_url
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Paso 2: Migrar datos del campo images al nuevo campo image_url
-- Toma el primer elemento del array images si existe
UPDATE products 
SET image_url = CASE 
    WHEN images IS NOT NULL AND array_length(images, 1) > 0 
    THEN images[1]
    ELSE NULL
END
WHERE image_url IS NULL;

-- Paso 3: Verificar la migración (opcional - para revisar los datos)
-- SELECT id, name, images, image_url FROM products LIMIT 10;

-- Paso 4: Eliminar la columna images antigua
-- IMPORTANTE: Descomenta la siguiente línea solo después de verificar que la migración fue exitosa
-- ALTER TABLE products DROP COLUMN IF EXISTS images;

-- Paso 5: Agregar índice para mejorar performance (opcional)
-- CREATE INDEX IF NOT EXISTS idx_products_image_url ON products(image_url) WHERE image_url IS NOT NULL;

-- Verificación final
SELECT 
    COUNT(*) as total_products,
    COUNT(image_url) as products_with_image_url,
    COUNT(*) - COUNT(image_url) as products_without_image_url
FROM products;

-- Mostrar algunos ejemplos de la migración
SELECT id, name, image_url 
FROM products 
WHERE image_url IS NOT NULL 
LIMIT 5;