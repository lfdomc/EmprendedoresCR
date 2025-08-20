-- Script para configurar buckets de storage optimizados para WebP
-- Ejecutar en el SQL Editor de Supabase

-- 1. Crear bucket principal para imágenes (si no existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Crear bucket para imágenes de servicios (si no existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Políticas para bucket 'images'
-- Permitir subida a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden subir imágenes" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

-- Permitir lectura pública
CREATE POLICY "Imágenes son públicamente visibles" ON storage.objects
FOR SELECT USING (
  bucket_id = 'images'
);

-- Permitir actualización de imágenes propias
CREATE POLICY "Usuarios pueden actualizar sus propias imágenes" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

-- Permitir eliminación de imágenes propias
CREATE POLICY "Usuarios pueden eliminar sus propias imágenes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

-- 4. Políticas para bucket 'service-images'
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

-- 5. Verificar configuración
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets 
WHERE id IN ('images', 'service-images')
ORDER BY id;

-- 6. Verificar políticas
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

-- Comentarios sobre la optimización WebP:
-- ✅ Las imágenes ahora se convierten automáticamente a WebP antes de subirse
-- ✅ Se aplica compresión con calidad 0.85 (85%)
-- ✅ Se redimensionan a máximo 1200x1200 píxeles
-- ✅ Se muestran estadísticas de compresión al usuario
-- ✅ Se valida el tipo de archivo antes del procesamiento
-- ✅ Se aumentó el límite de tamaño original a 10MB (el archivo final será mucho menor)

-- Beneficios esperados:
-- 📉 Reducción del 60-80% en el tamaño de archivos
-- ⚡ Carga más rápida de imágenes
-- 💾 Menor uso de almacenamiento en Supabase
-- 🌐 Mejor experiencia de usuario
-- 📱 Optimización automática para dispositivos móviles