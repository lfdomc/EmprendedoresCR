-- Script para actualizar categorías: agregar más opciones y quitar iconos

-- Primero, quitar los iconos de las categorías existentes
UPDATE categories SET icon = NULL;

-- Agregar nuevas categorías sin iconos
INSERT INTO categories (name, description) VALUES
('Arte y Manualidades', 'Artesanías, pintura, escultura, trabajos manuales'),
('Construcción y Remodelación', 'Albañilería, plomería, electricidad, carpintería'),
('Consultoría Empresarial', 'Asesoría de negocios, estrategia, marketing'),
('Cuidado de Mascotas', 'Veterinaria, peluquería canina, cuidado de animales'),
('Diseño Gráfico', 'Diseño de logos, publicidad, material gráfico'),
('Eventos y Celebraciones', 'Organización de bodas, fiestas, eventos corporativos'),
('Fotografía y Video', 'Sesiones fotográficas, videos promocionales, eventos'),
('Gastronomía Especializada', 'Catering, repostería, comida gourmet'),
('Idiomas y Traducción', 'Clases de idiomas, traducción de documentos'),
('Jardinería y Paisajismo', 'Diseño de jardines, mantenimiento de áreas verdes'),
('Limpieza Especializada', 'Limpieza de oficinas, hogares, post-construcción'),
('Marketing Digital', 'Redes sociales, SEO, publicidad online'),
('Música y Audio', 'Clases de música, producción musical, sonido'),
('Nutrición y Dietética', 'Planes alimentarios, asesoría nutricional'),
('Organización y Productividad', 'Organización de espacios, consultoría de procesos'),
('Psicología y Bienestar', 'Terapia psicológica, coaching, bienestar mental'),
('Reparación y Mantenimiento', 'Reparación de electrodomésticos, mantenimiento general'),
('Seguridad', 'Sistemas de seguridad, vigilancia, protección'),
('Textiles y Confección', 'Costura, bordado, reparación de ropa'),
('Turismo y Viajes', 'Guías turísticos, planificación de viajes, tours'),
('Venta de Productos Naturales', 'Productos orgánicos, medicina natural, cosmética natural'),
('Wellness y Spa', 'Masajes, relajación, tratamientos de bienestar');

-- Verificar que las categorías se insertaron correctamente
SELECT COUNT(*) as total_categories FROM categories;