# Configuración SEO - Costa Rica Emprende

Esta guía explica cómo configurar y optimizar el SEO para el marketplace de emprendimientos.

## 🎯 Características SEO Implementadas

### ✅ SEO Técnico
- **Metadatos dinámicos** para todas las páginas
- **Datos estructurados** (Schema.org) para productos, servicios y emprendimientos
- **Sitemap XML** generado automáticamente
- **Robots.txt** optimizado
- **URLs canónicas** en todas las páginas
- **Open Graph** y **Twitter Cards** configurados
- **Imágenes optimizadas** para redes sociales

### ✅ Contenido Optimizado
- **Títulos únicos** para cada página
- **Meta descripciones** descriptivas y atractivas
- **Keywords relevantes** para el mercado costarricense
- **Contenido localizado** para Costa Rica
- **Breadcrumbs** para navegación

### ✅ Performance
- **Imágenes optimizadas** con Next.js Image
- **Lazy loading** implementado
- **Core Web Vitals** optimizados
- **Compresión** de assets

### ✅ Analytics y Seguimiento
- **Google Analytics 4** configurado
- **Eventos personalizados** para tracking
- **Conversiones** de WhatsApp rastreadas
- **Search Console** preparado

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Copia el archivo `.env.seo.example` como `.env.local` y completa:

```bash
cp .env.seo.example .env.local
```

**Variables críticas:**
```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Verificación de sitios
GOOGLE_SITE_VERIFICATION=tu-codigo-verificacion
BING_SITE_VERIFICATION=tu-codigo-bing

# Dominio principal
NEXT_PUBLIC_SITE_URL=https://tudominio.com
```

### 2. Google Search Console

1. Ve a [Google Search Console](https://search.google.com/search-console)
2. Agrega tu propiedad (dominio)
3. Verifica la propiedad usando el meta tag
4. Envía el sitemap: `https://tudominio.com/sitemap.xml`

### 3. Google Analytics

1. Crea una propiedad en [Google Analytics](https://analytics.google.com)
2. Obtén tu ID de medición (G-XXXXXXXXXX)
3. Agrégalo a las variables de entorno

### 4. Bing Webmaster Tools

1. Ve a [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Agrega tu sitio
3. Verifica usando el meta tag
4. Envía el sitemap

## 📊 Monitoreo y Métricas

### Eventos de Google Analytics Configurados

- **view_item**: Visualización de productos
- **view_service**: Visualización de servicios
- **view_business**: Visualización de emprendimientos
- **whatsapp_click**: Clics en botones de WhatsApp
- **search**: Búsquedas realizadas

### Métricas Clave a Monitorear

1. **Tráfico orgánico** desde Google
2. **Posiciones** en resultados de búsqueda
3. **CTR** (Click Through Rate)
4. **Tiempo en página**
5. **Conversiones** vía WhatsApp
6. **Core Web Vitals**

## 🎨 Optimización de Imágenes Sociales

### OpenGraph y Twitter Cards

Las imágenes se generan automáticamente con:
- **Logo prominente** de Costa Rica Emprende
- **Información del producto/servicio**
- **Badges** de características (Productos, Servicios, WhatsApp)
- **Diseño consistente** con la marca

### Personalización

Para personalizar las imágenes, edita:
- `app/opengraph-image.tsx`
- `app/twitter-image.tsx`

## 🔍 Keywords y Contenido

### Keywords Principales
- emprendimientos Costa Rica
- marketplace Costa Rica
- productos locales Costa Rica
- servicios Costa Rica
- emprendedores costarricenses
- pymes Costa Rica
- comercio local

### Estrategia de Contenido

1. **Páginas de productos**: Optimizadas para búsquedas específicas
2. **Páginas de servicios**: Incluyen ubicación y especialización
3. **Perfiles de emprendimientos**: Destacan la historia y valores
4. **Página principal**: Optimizada para términos generales

## 🛠️ Datos Estructurados

### Tipos Implementados

- **WebSite**: Para la página principal
- **Product**: Para páginas de productos
- **Service**: Para páginas de servicios
- **LocalBusiness**: Para emprendimientos
- **Organization**: Para la empresa

### Validación

Usa [Google Rich Results Test](https://search.google.com/test/rich-results) para validar.

## 📱 Optimización Móvil

- **Responsive design** implementado
- **Touch-friendly** botones de WhatsApp
- **Velocidad optimizada** para móviles
- **AMP** (opcional, no implementado)

## 🌐 Internacionalización

### Configuración Actual
- **Idioma principal**: Español (Costa Rica)
- **Locale**: es_CR
- **Moneda**: Colones costarricenses (CRC)

### Expansión Futura
- Soporte para inglés (en_US)
- Otros países de Centroamérica

## 🔧 Herramientas de Desarrollo

### Testing SEO
```bash
# Verificar metadatos
npm run build
npm run start

# Usar herramientas:
# - Lighthouse
# - PageSpeed Insights
# - SEO Site Checkup
```

### Debugging
```bash
# Ver sitemap generado
curl https://localhost:3000/sitemap.xml

# Ver robots.txt
curl https://localhost:3000/robots.txt

# Verificar datos estructurados
# Usar Google Rich Results Test
```

## 📈 Mejores Prácticas

### Contenido
1. **Títulos únicos** de 50-60 caracteres
2. **Meta descripciones** de 150-160 caracteres
3. **URLs descriptivas** y amigables
4. **Contenido original** y valioso
5. **Imágenes con alt text** descriptivo

### Técnico
1. **HTTPS** habilitado
2. **Velocidad** optimizada
3. **Mobile-first** design
4. **Estructura** clara de headings
5. **Enlaces internos** estratégicos

### Local SEO
1. **Información de ubicación** consistente
2. **Google My Business** (recomendado)
3. **Reviews** y testimonios
4. **Contenido local** relevante

## 🚨 Checklist de Lanzamiento

- [ ] Variables de entorno configuradas
- [ ] Google Analytics instalado
- [ ] Search Console verificado
- [ ] Sitemap enviado
- [ ] Robots.txt verificado
- [ ] Datos estructurados validados
- [ ] Imágenes sociales funcionando
- [ ] Core Web Vitals optimizados
- [ ] URLs canónicas configuradas
- [ ] Meta tags únicos en todas las páginas

## 📞 Soporte

Para dudas sobre la configuración SEO:
1. Revisa la documentación de Next.js
2. Consulta Google Search Central
3. Usa las herramientas de desarrollo del navegador

---

**Nota**: El SEO es un proceso continuo. Monitorea regularmente las métricas y ajusta la estrategia según los resultados.