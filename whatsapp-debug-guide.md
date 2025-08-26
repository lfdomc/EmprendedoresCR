# Guía de Diagnóstico: WhatsApp Link Preview

## Estado Actual de la Configuración ✅

### Metadatos Verificados
- ✅ `og:image`: `https://www.costaricaemprende.com/logonew.jpeg`
- ✅ `og:image:type`: `image/jpeg` (corregido)
- ✅ `og:image:width`: `1200`
- ✅ `og:image:height`: `630`
- ✅ `twitter:image`: configurado correctamente
- ✅ Imagen accesible: HTTP 200, Content-Type: `image/jpeg`, Tamaño: 45KB

## Métodos de Diagnóstico

### 1. Verificar si es Problema de Caché

#### Método A: Modificar URL temporalmente
```
# En lugar de compartir:
https://www.costaricaemprende.com

# Comparte temporalmente:
https://Www.costaricaemprende.com
# (nota la 'W' mayúscula)
```

#### Método B: Agregar parámetro temporal
```
https://www.costaricaemprende.com?test=123
```

#### Método C: Usar Facebook Sharing Debugger
1. Ir a: https://developers.facebook.com/tools/debug/
2. Ingresar: `https://www.costaricaemprende.com`
3. Hacer clic en "Debug" o "Scrape Again"
4. Verificar si muestra la imagen correctamente

### 2. Verificar Configuración del Dispositivo

#### En WhatsApp móvil:
1. **Verificar configuración de previews:**
   - Android: Configuración → Privacidad → Avanzado → "Desactivar vista previa de enlaces" (debe estar DESACTIVADO)
   - iPhone: Configuración → Privacidad → Avanzado → "Desactivar vista previa de enlaces" (debe estar DESACTIVADO)

2. **Limpiar caché de WhatsApp:**
   - Android: Configuración → Aplicaciones → WhatsApp → Almacenamiento → Limpiar caché
   - iPhone: Desinstalar y reinstalar WhatsApp (hacer backup primero)

3. **Verificar conexión a internet:**
   - Probar con WiFi y datos móviles
   - Verificar velocidad de conexión

### 3. Pruebas de Diagnóstico

#### Test 1: Verificar en diferentes plataformas
- [ ] WhatsApp móvil
- [ ] WhatsApp Web
- [ ] Facebook
- [ ] Twitter
- [ ] LinkedIn

#### Test 2: Verificar con diferentes usuarios
- [ ] Compartir el enlace a otro contacto
- [ ] Pedir a alguien más que comparta el enlace

#### Test 3: Verificar timing
- [ ] Probar inmediatamente después de pegar el enlace
- [ ] Esperar 10-15 segundos antes de enviar
- [ ] Reformatear el enlace (borrar y volver a escribir los últimos caracteres)

## Limitaciones Conocidas de WhatsApp

1. **Tamaño de imagen:** WhatsApp muestra previews para imágenes hasta 300KB (tu imagen: 45KB ✅)
2. **Caché persistente:** WhatsApp puede mantener caché por 24-48 horas
3. **Formato de imagen:** Debe ser JPEG, PNG, GIF (tu imagen: JPEG ✅)
4. **Dimensiones:** Recomendado 1200x630px (tu imagen: 1200x630px ✅)

## Resultados del Diagnóstico

### Si el método de URL modificada funciona:
**→ Es problema de CACHÉ**
- Solución: Esperar 24-48 horas o usar Facebook Debugger para forzar actualización

### Si ningún método funciona:
**→ Posible problema de CONFIGURACIÓN**
- Verificar que la imagen sea accesible públicamente
- Revisar configuraciones de privacidad del sitio
- Verificar que no haya redirects o autenticación

### Si funciona en otras plataformas pero no en WhatsApp:
**→ Problema específico de WhatsApp**
- Limpiar caché de la aplicación
- Verificar configuraciones de privacidad
- Reinstalar WhatsApp si es necesario

## Comandos de Verificación Técnica

```powershell
# Verificar metadatos actuales
Invoke-WebRequest -Uri "https://www.costaricaemprende.com" | Select-Object -ExpandProperty Content | Select-String -Pattern 'og:image'

# Verificar accesibilidad de imagen
Invoke-WebRequest -Uri "https://www.costaricaemprende.com/logonew.jpeg" -Method HEAD

# Verificar headers de imagen
$response = Invoke-WebRequest -Uri "https://www.costaricaemprende.com/logonew.jpeg" -Method HEAD
$response.Headers['Content-Type']
$response.Headers['Content-Length']
```

## Próximos Pasos Recomendados

1. **Inmediato:** Probar método de URL modificada
2. **Si no funciona:** Usar Facebook Sharing Debugger
3. **Si persiste:** Verificar configuraciones de WhatsApp
4. **Último recurso:** Esperar 24-48 horas para que el caché expire naturalmente

---

**Nota:** Todos los metadatos están correctamente configurados. El problema más probable es el caché de WhatsApp que puede tardar hasta 48 horas en actualizarse.