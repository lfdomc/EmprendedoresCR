-- Crear bucket para imágenes
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir que usuarios autenticados suban imágenes
CREATE POLICY "Usuarios autenticados pueden subir imágenes" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

-- Política para permitir que todos vean las imágenes públicas
CREATE POLICY "Imágenes son públicamente visibles" ON storage.objects
FOR SELECT USING (
  bucket_id = 'images'
);

-- Política para permitir que usuarios autenticados actualicen sus propias imágenes
CREATE POLICY "Usuarios pueden actualizar sus propias imágenes" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

-- Política para permitir que usuarios autenticados eliminen sus propias imágenes
CREATE POLICY "Usuarios pueden eliminar sus propias imágenes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

-- Nota: RLS ya está habilitado por defecto en storage.objects en Supabase
-- Si necesitas habilitarlo manualmente, ejecuta como superusuario:
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Comentarios para documentación
COMMENT ON POLICY "Usuarios autenticados pueden subir imágenes" ON storage.objects IS 'Permite a usuarios autenticados subir imágenes al bucket images';
COMMENT ON POLICY "Imágenes son públicamente visibles" ON storage.objects IS 'Permite que todas las imágenes en el bucket images sean públicamente visibles';
COMMENT ON POLICY "Usuarios pueden actualizar sus propias imágenes" ON storage.objects IS 'Permite a usuarios autenticados actualizar imágenes que han subido';
COMMENT ON POLICY "Usuarios pueden eliminar sus propias imágenes" ON storage.objects IS 'Permite a usuarios autenticados eliminar imágenes que han subido';