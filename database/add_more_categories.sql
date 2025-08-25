-- Script para agregar categorías adicionales de emprendimientos
-- Complementa las categorías existentes sin duplicar

-- Agregar nuevas categorías específicas para Costa Rica
INSERT INTO categories (name, description) VALUES
('Agricultura y Ganadería', 'Productos agrícolas, ganadería, cultivos orgánicos'),
('Artesanía Costarricense', 'Productos artesanales típicos, souvenirs, arte local'),
('Café y Productos del Café', 'Café gourmet, tours de café, productos derivados'),
('Ecoturismo', 'Tours ecológicos, aventura, turismo sostenible'),
('Finanzas y Seguros', 'Servicios financieros, seguros, inversiones'),
('Inmobiliaria', 'Venta y alquiler de propiedades, administración'),
('Joyería y Orfebrería', 'Joyas artesanales, reparación, diseño personalizado'),
('Legal y Notarial', 'Servicios legales, notariales, trámites'),
('Logística y Envíos', 'Courier, paquetería, importación y exportación'),
('Manufactura', 'Producción industrial, maquila, fabricación'),
('Medicina Alternativa', 'Terapias naturales, homeopatía, acupuntura'),
('Panadería y Repostería', 'Pan artesanal, pasteles, productos horneados'),
('Productos del Mar', 'Pescados, mariscos, productos marinos'),
('Reciclaje y Sostenibilidad', 'Gestión de residuos, productos reciclados, eco-friendly'),
('Servicios Automotrices', 'Mecánica, lavado, repuestos, talleres'),
('Telecomunicaciones', 'Servicios de internet, telefonía, comunicaciones'),
('Textiles y Bordados', 'Productos textiles, bordados tradicionales, uniformes'),
('Veterinaria y Agropecuaria', 'Servicios veterinarios, productos agropecuarios');

-- Verificar el total de categorías después de la inserción
SELECT COUNT(*) as total_categories FROM categories;

-- Mostrar las últimas categorías agregadas
SELECT name, description FROM categories 
ORDER BY created_at DESC 
LIMIT 18;