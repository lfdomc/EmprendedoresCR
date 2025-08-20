# Despliegue en Vercel - Emprendimientos CR

## Configuración de Variables de Entorno para Producción

### 1. Variables Requeridas

Para que la aplicación funcione correctamente en Vercel, necesitas configurar las siguientes variables de entorno:

#### Variables de Supabase (Obligatorias)
- `NEXT_PUBLIC_SUPABASE_URL`: URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave pública/anon de Supabase

### 2. Cómo Configurar en Vercel

#### Opción A: Desde el Dashboard de Vercel
1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Navega a **Settings** > **Environment Variables**
3. Agrega cada variable:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Tu URL de Supabase (ej: `https://ixvflrcixadtyxgufozg.supabase.co`)
   - **Environments**: Selecciona `Production`, `Preview`, y `Development`
   - Haz clic en **Save**
4. Repite para `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Opción B: Usando Vercel CLI
```bash
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Configurar variables de entorno
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
```

### 3. Obtener las Credenciales de Supabase

1. Ve a [app.supabase.com](https://app.supabase.com)
2. Selecciona tu proyecto
3. Navega a **Settings** > **API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Verificación del Despliegue

Después de configurar las variables:
1. Haz un nuevo deploy o redeploy desde Vercel
2. Verifica que la aplicación se conecte correctamente a Supabase
3. Prueba las funcionalidades principales:
   - Carga de emprendimientos
   - Carga de productos
   - Funcionalidad de compartir

### 5. Variables Opcionales

Si en el futuro necesitas agregar más funcionalidades, podrías necesitar:

- `SUPABASE_SERVICE_ROLE_KEY`: Para operaciones del servidor
- `NEXTAUTH_SECRET`: Si implementas autenticación
- `NEXTAUTH_URL`: URL de producción para NextAuth

### 6. Seguridad

⚠️ **Importante**: 
- Nunca commits archivos `.env.local` al repositorio
- Las variables que empiezan con `NEXT_PUBLIC_` son visibles en el cliente
- Usa variables sin `NEXT_PUBLIC_` para secretos del servidor

### 7. Troubleshooting

Si tienes problemas:
1. Verifica que las variables estén configuradas correctamente en Vercel
2. Asegúrate de que las URLs de Supabase sean correctas
3. Revisa los logs de Vercel en la sección **Functions**
4. Verifica que tu proyecto de Supabase esté activo

---

**Nota**: Este archivo contiene las instrucciones para configurar el entorno de producción. Para desarrollo local, usa el archivo `.env.local`.