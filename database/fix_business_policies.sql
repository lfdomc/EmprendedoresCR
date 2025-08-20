-- Eliminar la política existente que solo permite ver emprendimientos activos
DROP POLICY IF EXISTS "Users can view all active businesses" ON businesses;

-- Crear nuevas políticas más específicas
-- Política para que todos puedan ver emprendimientos activos
CREATE POLICY "Public can view active businesses" ON businesses
  FOR SELECT USING (is_active = true);

-- Política para que los propietarios puedan ver sus propios emprendimientos (activos o inactivos)
CREATE POLICY "Users can view their own businesses" ON businesses
  FOR SELECT USING (auth.uid() = user_id);