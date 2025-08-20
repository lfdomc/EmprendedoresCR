-- Script para actualizar la base de datos de servicios
-- Ejecutar este script en Supabase SQL Editor

-- 1. Crear bucket para imágenes de servicios si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Configurar políticas de storage para service-images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'service-images');
CREATE POLICY "Authenticated users can upload service images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'service-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own service images" ON storage.objects FOR UPDATE USING (bucket_id = 'service-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete their own service images" ON storage.objects FOR DELETE USING (bucket_id = 'service-images' AND auth.role() = 'authenticated');

-- 3. Agregar columna image_url a la tabla services
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 4. Actualizar la tabla services para remover duration_minutes
-- IMPORTANTE: Esto eliminará permanentemente los datos de duration_minutes
-- Hacer backup antes si es necesario
ALTER TABLE services DROP COLUMN IF EXISTS duration_minutes;

-- 5. Opcional: Migrar datos de images array a image_url (tomar la primera imagen)
-- UPDATE services SET image_url = images[1] WHERE images IS NOT NULL AND array_length(images, 1) > 0;

-- 6. Verificar la estructura actualizada de la tabla
-- Ejecutar este SELECT para confirmar los cambios
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'services' 
ORDER BY ordinal_position;

-- Comentarios:
-- - El bucket 'service-images' permitirá almacenar las imágenes de los servicios
-- - Las políticas de storage permiten acceso público para lectura y acceso autenticado para escritura
-- - Se agrega la columna image_url a la tabla services para almacenar URLs de imágenes individuales
-- - La columna duration_minutes se elimina completamente de la tabla services
-- - Opcionalmente se pueden migrar datos del array images a la nueva columna image_url