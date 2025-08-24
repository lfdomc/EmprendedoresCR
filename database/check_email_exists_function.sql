-- Función para verificar si un email existe en auth.users
-- Esta función debe ejecutarse en Supabase SQL Editor

CREATE OR REPLACE FUNCTION check_email_exists(email_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar si el email existe en la tabla auth.users
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE email = email_to_check
  );
END;
$$;

-- Otorgar permisos para que los usuarios autenticados puedan ejecutar esta función
GRANT EXECUTE ON FUNCTION check_email_exists(text) TO authenticated;
GRANT EXECUTE ON FUNCTION check_email_exists(text) TO anon;

-- Comentario explicativo
COMMENT ON FUNCTION check_email_exists(text) IS 'Verifica si un email existe en la tabla auth.users';