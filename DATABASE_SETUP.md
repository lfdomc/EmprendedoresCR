# Configuración de Base de Datos - Emprendimientos CR

## Error Actual
Si estás viendo el error `Could not find the table 'public.services' in the schema cache`, significa que las tablas de la base de datos no han sido creadas en tu proyecto de Supabase.

## Solución: Ejecutar el Esquema de Base de Datos

### Paso 1: Acceder al Editor SQL de Supabase
1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. En el menú lateral, haz clic en **"SQL Editor"**
3. Haz clic en **"New Query"** para crear una nueva consulta

### Paso 2: Ejecutar el Esquema
1. Copia todo el contenido del archivo `database/schema.sql`
2. Pégalo en el editor SQL de Supabase
3. Haz clic en **"RUN"** para ejecutar el esquema

### Paso 3: Verificar la Creación de Tablas
Después de ejecutar el esquema, deberías ver las siguientes tablas creadas:
- `categories` - Categorías de productos y servicios
- `businesses` - Emprendimientos
- `products` - Productos
- `services` - Servicios
- `service_schedules` - Horarios de servicios
- `reviews` - Reseñas

### Paso 4: Verificar Datos Iniciales
El esquema también inserta categorías iniciales como:
- Alimentación 🍽️
- Tecnología 💻
- Salud y Belleza 💄
- Educación 📚
- Y más...

## Alternativa: Ejecutar desde la Terminal

Si prefieres usar la CLI de Supabase:

```bash
# Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# Inicializar proyecto local
supabase init

# Vincular con tu proyecto remoto
supabase link --project-ref YOUR_PROJECT_REF

# Aplicar migraciones
supabase db push
```

## Verificación

Después de ejecutar el esquema, reinicia tu aplicación Next.js:

```bash
npm run dev
```

El error `Could not find the table 'public.services'` debería desaparecer y la aplicación debería funcionar correctamente.

## Notas Importantes

- ✅ El esquema incluye políticas de seguridad RLS (Row Level Security)
- ✅ Se crean índices para mejorar el rendimiento
- ✅ Se incluyen triggers para actualizar automáticamente `updated_at`
- ✅ Se insertan categorías iniciales para empezar a usar la aplicación

## Soporte

Si tienes problemas:
1. Verifica que las variables de entorno en `.env.local` sean correctas
2. Asegúrate de que tu proyecto de Supabase esté activo
3. Revisa que tengas permisos de administrador en el proyecto de Supabase