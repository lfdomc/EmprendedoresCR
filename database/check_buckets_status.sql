-- Script para verificar el estado actual de los buckets de storage
-- Ejecutar en el SQL Editor de Supabase

-- 1. Verificar buckets existentes
SELECT 
  id,
  name,
  public,
  created_at,
  updated_at
FROM storage.buckets 
ORDER BY created_at;

-- 2. Verificar políticas existentes para storage.objects
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

-- 3. Verificar si RLS está habilitado en storage.objects
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'storage' 
AND tablename = 'objects';

-- 4. Contar objetos por bucket (si existen)
SELECT 
  bucket_id,
  COUNT(*) as object_count
FROM storage.objects 
GROUP BY bucket_id
ORDER BY bucket_id;

-- 5. Verificar permisos del usuario actual
SELECT 
  current_user as usuario_actual,
  session_user as usuario_sesion,
  current_setting('role') as rol_actual;

-- Resultado esperado:
-- - Debe existir bucket 'images'
-- - Debe existir bucket 'service-images' 
-- - Deben existir políticas para ambos buckets
-- - RLS debe estar habilitado (rowsecurity = true)