-- =====================================================
-- MIGRACIÓN: Agregar campos de fotos adicionales
-- Fecha: 2024-01-15
-- Descripción: Agrega 3 campos adicionales para fotos
--              en las tablas products y services
-- =====================================================

-- Verificar que las tablas existen antes de modificarlas
DO $$
BEGIN
    -- Verificar tabla products
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        RAISE EXCEPTION 'La tabla products no existe';
    END IF;
    
    -- Verificar tabla services
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'services') THEN
        RAISE EXCEPTION 'La tabla services no existe';
    END IF;
END $$;

-- =====================================================
-- AGREGAR CAMPOS A LA TABLA PRODUCTS
-- =====================================================

-- Verificar si las columnas ya existen antes de agregarlas
DO $$
BEGIN
    -- Agregar additional_photo_1 si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'additional_photo_1') THEN
        ALTER TABLE products ADD COLUMN additional_photo_1 TEXT;
        RAISE NOTICE 'Columna additional_photo_1 agregada a products';
    ELSE
        RAISE NOTICE 'Columna additional_photo_1 ya existe en products';
    END IF;
    
    -- Agregar additional_photo_2 si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'additional_photo_2') THEN
        ALTER TABLE products ADD COLUMN additional_photo_2 TEXT;
        RAISE NOTICE 'Columna additional_photo_2 agregada a products';
    ELSE
        RAISE NOTICE 'Columna additional_photo_2 ya existe en products';
    END IF;
    
    -- Agregar additional_photo_3 si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'additional_photo_3') THEN
        ALTER TABLE products ADD COLUMN additional_photo_3 TEXT;
        RAISE NOTICE 'Columna additional_photo_3 agregada a products';
    ELSE
        RAISE NOTICE 'Columna additional_photo_3 ya existe en products';
    END IF;
END $$;

-- =====================================================
-- AGREGAR CAMPOS A LA TABLA SERVICES
-- =====================================================

-- Verificar si las columnas ya existen antes de agregarlas
DO $$
BEGIN
    -- Agregar additional_photo_1 si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'services' AND column_name = 'additional_photo_1') THEN
        ALTER TABLE services ADD COLUMN additional_photo_1 TEXT;
        RAISE NOTICE 'Columna additional_photo_1 agregada a services';
    ELSE
        RAISE NOTICE 'Columna additional_photo_1 ya existe en services';
    END IF;
    
    -- Agregar additional_photo_2 si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'services' AND column_name = 'additional_photo_2') THEN
        ALTER TABLE services ADD COLUMN additional_photo_2 TEXT;
        RAISE NOTICE 'Columna additional_photo_2 agregada a services';
    ELSE
        RAISE NOTICE 'Columna additional_photo_2 ya existe en services';
    END IF;
    
    -- Agregar additional_photo_3 si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'services' AND column_name = 'additional_photo_3') THEN
        ALTER TABLE services ADD COLUMN additional_photo_3 TEXT;
        RAISE NOTICE 'Columna additional_photo_3 agregada a services';
    ELSE
        RAISE NOTICE 'Columna additional_photo_3 ya existe en services';
    END IF;
END $$;

-- =====================================================
-- COMENTARIOS SOBRE LOS NUEVOS CAMPOS
-- =====================================================

-- Los campos additional_photo_1, additional_photo_2, additional_photo_3:
-- - Almacenan URLs públicas de Supabase Storage
-- - Son opcionales (pueden ser NULL)
-- - Tipo TEXT para soportar URLs largas
-- - Se utilizan para mostrar galerías de imágenes en productos y servicios

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Mostrar todas las columnas agregadas para verificar
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('products', 'services') 
  AND column_name LIKE 'additional_photo_%'
ORDER BY table_name, column_name;

-- Contar registros en cada tabla para referencia
SELECT 
    'products' as tabla,
    COUNT(*) as total_registros
FROM products
UNION ALL
SELECT 
    'services' as tabla,
    COUNT(*) as total_registros
FROM services;

-- =====================================================
-- INSTRUCCIONES DE USO
-- =====================================================

/*
PARA EJECUTAR ESTE SCRIPT EN SUPABASE:

1. Accede a tu proyecto de Supabase
2. Ve a la sección "SQL Editor"
3. Copia y pega todo este script
4. Haz clic en "Run" para ejecutar
5. Verifica que aparezcan los mensajes de confirmación
6. Revisa los resultados de la consulta de verificación

Este script es seguro de ejecutar múltiples veces ya que:
- Verifica que las tablas existan antes de modificarlas
- Solo agrega columnas si no existen previamente
- Proporciona mensajes informativos sobre cada acción
- Incluye verificaciones finales

DESPUÉS DE EJECUTAR:
- Las aplicaciones podrán usar los nuevos campos inmediatamente
- Los formularios de productos y servicios ya están configurados
- Las pantallas de visualización mostrarán las fotos adicionales
*/