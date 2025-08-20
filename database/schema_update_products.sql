-- Script SQL para actualizar la tabla products
-- Elimina: is_featured, stock_quantity, images
-- Agrega: sku, image_url, image_url_2

-- PASO 1: Agregar nuevas columnas
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sku VARCHAR(100),
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_url_2 TEXT;

-- PASO 2: Migrar datos de images a image_url (si existe data)
-- Solo si hay productos con imágenes existentes
UPDATE products 
SET image_url = images[1]
WHERE images IS NOT NULL AND array_length(images, 1) >= 1;

UPDATE products 
SET image_url_2 = images[2]
WHERE images IS NOT NULL AND array_length(images, 1) >= 2;

-- PASO 3: Eliminar columnas antiguas
ALTER TABLE products 
DROP COLUMN IF EXISTS is_featured,
DROP COLUMN IF EXISTS stock_quantity,
DROP COLUMN IF EXISTS images;

-- PASO 4: Eliminar índices antiguos (si existen)
DROP INDEX IF EXISTS idx_products_is_featured;
DROP INDEX IF EXISTS idx_products_stock_quantity;
DROP INDEX IF EXISTS idx_products_images;

-- PASO 5: Crear nuevos índices
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_image_url ON products(image_url);

-- PASO 6: Agregar restricción única para SKU por negocio
ALTER TABLE products 
ADD CONSTRAINT uq_products_sku_business 
UNIQUE (sku, business_id);

-- PASO 7: Agregar comentarios descriptivos
COMMENT ON COLUMN products.sku IS 'Código único de producto (Stock Keeping Unit)';
COMMENT ON COLUMN products.image_url IS 'URL de la imagen principal del producto';
COMMENT ON COLUMN products.image_url_2 IS 'URL de la imagen secundaria del producto';

-- Verificar la estructura final
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'products' 
-- ORDER BY ordinal_position;