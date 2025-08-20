-- Script para crear el bucket 'service-images' y resolver el error
-- Ejecutar en el SQL Editor de Supabase

-- 1. Crear bucket para imágenes de servicios (si no existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Eliminar políticas existentes si existen (para evitar conflictos)
DROP POLICY IF EXISTS "Usuarios autenticados pueden subir imágenes de servicios" ON storage.objects;
DROP POLICY IF EXISTS "Imágenes de servicios son públicamente visibles" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propias imágenes de servicios" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propias imágenes de servicios" ON storage.objects;

-- 3. Crear políticas para bucket 'service-images'
-- Permitir subida a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden subir imágenes de servicios" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'service-images' AND 
  auth.role() = 'authenticated'
);

-- Permitir lectura pública
CREATE POLICY "Imágenes de servicios son públicamente visibles" ON storage.objects
FOR SELECT USING (
  bucket_id = 'service-images'
);

-- Permitir actualización de imágenes propias
CREATE POLICY "Usuarios pueden actualizar sus propias imágenes de servicios" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'service-images' AND 
  auth.role() = 'authenticated'
);

-- Permitir eliminación de imágenes propias
CREATE POLICY "Usuarios pueden eliminar sus propias imágenes de servicios" ON storage.objects
FOR DELETE USING (
  bucket_id = 'service-images' AND 
  auth.role() = 'authenticated'
);

-- 4. Verificar que el bucket se creó correctamente
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets 
WHERE id = 'service-images';

-- 5. Verificar que las políticas se crearon correctamente
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%service%'
ORDER BY policyname;