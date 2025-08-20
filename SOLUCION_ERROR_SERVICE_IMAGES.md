# Solución: Error "Bucket not found" para service-images

## 🚨 Descripción del Error

Estás experimentando el siguiente error:
```
Error saving service: Error: Error al subir la imagen: Bucket not found
```

Esto indica que el bucket `service-images` no existe en tu proyecto de Supabase Storage.

## 🔍 Diagnóstico

### Paso 1: Verificar Estado Actual

1. Ve a tu [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Ejecuta el script de diagnóstico:

```sql
-- Copiar y pegar el contenido de: database/check_buckets_status.sql
```

### Paso 2: Identificar el Problema

El script anterior te mostrará:
- ✅ Buckets existentes (debería incluir `service-images`)
- ✅ Políticas de seguridad configuradas
- ✅ Estado de RLS (Row Level Security)

## 🛠️ Solución

### Opción A: Solución Rápida (Recomendada)

1. Ve a **SQL Editor** en Supabase
2. Ejecuta el script de corrección:

```sql
-- Copiar y pegar el contenido de: database/fix_service_images_bucket.sql
```

### Opción B: Solución Manual

#### 1. Crear el Bucket
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;
```

#### 2. Configurar Políticas de Seguridad
```sql
-- Lectura pública
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'service-images');

-- Subida para usuarios autenticados
CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'service-images' AND 
  auth.role() = 'authenticated'
);

-- Actualización para usuarios autenticados
CREATE POLICY "Authenticated update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'service-images' AND 
  auth.role() = 'authenticated'
);

-- Eliminación para usuarios autenticados
CREATE POLICY "Authenticated delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'service-images' AND 
  auth.role() = 'authenticated'
);
```

## ✅ Verificación

### 1. Verificar en Supabase Dashboard

1. Ve a **Storage** en tu dashboard
2. Deberías ver el bucket `service-images`
3. Verifica que esté marcado como "Public"

### 2. Probar en la Aplicación

1. Reinicia tu servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve al dashboard de servicios
3. Intenta crear un nuevo servicio con una imagen
4. El error debería desaparecer

## 🔧 Configuración Adicional

### Variables de Entorno (Ya Configuradas)

Tus variables de entorno están correctamente configuradas:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ixvflrcixadtyxgufozg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Optimización WebP

Tu aplicación ya incluye optimización automática de imágenes:
- ✅ Conversión automática a WebP
- ✅ Compresión con calidad 85%
- ✅ Redimensionamiento a máximo 1200x1200px
- ✅ Validación de tipos de archivo

## 🚨 Troubleshooting

### Si el Error Persiste

1. **Verificar Autenticación**:
   - Asegúrate de estar logueado en la aplicación
   - El error puede ocurrir si no hay usuario autenticado

2. **Verificar Permisos**:
   - Confirma que tienes permisos de administrador en Supabase
   - Verifica que las políticas se crearon correctamente

3. **Limpiar Cache**:
   ```bash
   # Limpiar cache de Next.js
   rm -rf .next
   npm run dev
   ```

4. **Verificar Logs**:
   - Revisa la consola del navegador
   - Revisa los logs del servidor de desarrollo

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Bucket not found` | Bucket no existe | Ejecutar script de corrección |
| `403 Forbidden` | Políticas mal configuradas | Revisar políticas RLS |
| `401 Unauthorized` | Usuario no autenticado | Verificar login |
| `413 Payload Too Large` | Imagen muy grande | Reducir tamaño < 10MB |

## 📞 Soporte

Si necesitas ayuda adicional:
1. Verifica que seguiste todos los pasos
2. Ejecuta el script de diagnóstico
3. Revisa los logs de error específicos
4. Contacta al equipo de desarrollo con los detalles del error

---

**Nota**: Este error es común cuando se configura Storage por primera vez. Una vez resuelto, no debería volver a ocurrir.