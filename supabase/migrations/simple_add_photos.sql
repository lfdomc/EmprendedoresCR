-- =====================================================
-- SCRIPT SIMPLE: Agregar fotos adicionales
-- Para ejecutar manualmente en Supabase SQL Editor
-- =====================================================

-- Agregar campos de fotos adicionales a la tabla products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS additional_photo_1 TEXT,
ADD COLUMN IF NOT EXISTS additional_photo_2 TEXT,
ADD COLUMN IF NOT EXISTS additional_photo_3 TEXT;

-- Agregar campos de fotos adicionales a la tabla services
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS additional_photo_1 TEXT,
ADD COLUMN IF NOT EXISTS additional_photo_2 TEXT,
ADD COLUMN IF NOT EXISTS additional_photo_3 TEXT;

-- Verificar que las columnas se agregaron correctamente
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('products', 'services') 
  AND column_name LIKE 'additional_photo_%'
ORDER BY table_name, column_name;

/*
INSTRUCCIONES:
1. Copia todo este código
2. Ve a Supabase Dashboard > SQL Editor
3. Pega el código y haz clic en "Run"
4. Verifica que aparezcan 6 filas en el resultado (3 por cada tabla)

Esto agregará 3 campos de fotos adicionales a productos y servicios.
Los campos almacenarán URLs de las imágenes subidas a Supabase Storage.
*/