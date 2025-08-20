-- Script para aplicar en el panel de Supabase SQL Editor
-- Este script corrige las políticas para permitir que los usuarios vean sus propios emprendimientos

-- Eliminar la política existente
DROP POLICY IF EXISTS "Users can view all active businesses" ON businesses;

-- Crear nuevas políticas
-- Política para que todos puedan ver emprendimientos activos
CREATE POLICY "Public can view active businesses" ON businesses
  FOR SELECT USING (is_active = true);

-- Política para que los propietarios puedan ver sus propios emprendimientos (activos o inactivos)
CREATE POLICY "Users can view their own businesses" ON businesses
  FOR SELECT USING (auth.uid() = user_id);

-- Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'businesses';