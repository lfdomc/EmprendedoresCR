-- Script simplificado para crear bucket de imágenes
-- Ejecutar en el SQL Editor de Supabase

-- 1. Crear bucket para imágenes (público)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Política básica para permitir subida de imágenes a usuarios autenticados
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

-- 3. Política para permitir lectura pública de imágenes
CREATE POLICY "Allow public read access to images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'images'
);

-- 4. Política para permitir actualización de imágenes propias
CREATE POLICY "Allow users to update own images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

-- 5. Política para permitir eliminación de imágenes propias
CREATE POLICY "Allow users to delete own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

-- Verificar que el bucket se creó correctamente
SELECT * FROM storage.buckets WHERE id = 'images';