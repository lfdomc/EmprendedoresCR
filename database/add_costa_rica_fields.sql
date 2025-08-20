-- Script para agregar campos específicos de Costa Rica a la tabla businesses

-- Agregar columna canton
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS canton VARCHAR(100);

-- Agregar columna provincia
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS provincia VARCHAR(100);

-- Agregar columna google_maps_link
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS google_maps_link TEXT;

-- Crear índices para mejorar las consultas por ubicación
CREATE INDEX IF NOT EXISTS idx_businesses_canton ON businesses(canton);
CREATE INDEX IF NOT EXISTS idx_businesses_provincia ON businesses(provincia);

-- Comentarios para documentar los campos
COMMENT ON COLUMN businesses.canton IS 'Cantón de Costa Rica donde se ubica el emprendimiento';
COMMENT ON COLUMN businesses.provincia IS 'Provincia de Costa Rica donde se ubica el emprendimiento';
COMMENT ON COLUMN businesses.google_maps_link IS 'Enlace directo a Google Maps para la ubicación del emprendimiento';

-- Datos de referencia: Provincias de Costa Rica
-- San José, Alajuela, Cartago, Heredia, Guanacaste, Puntarenas, Limón

-- Nota: Los cantones se pueden agregar según sea necesario
-- Algunos cantones principales por provincia:
-- San José: San José, Escazú, Desamparados, Puriscal, Tarrazú, Aserrí, Mora, Goicoechea, Santa Ana, Alajuelita, Vásquez de Coronado, Acosta, Tibás, Moravia, Montes de Oca, Turrubares, Dota, Curridabat, Pérez Zeledón
-- Alajuela: Alajuela, San Ramón, Grecia, San Mateo, Atenas, Naranjo, Palmares, Poás, Orotina, San Carlos, Zarcero, Valverde Vega, Upala, Los Chiles, Guatuso
-- Cartago: Cartago, Paraíso, La Unión, Jiménez, Turrialba, Alvarado, Oreamuno, El Guarco
-- Heredia: Heredia, Barva, Santo Domingo, Santa Bárbara, San Rafael, San Isidro, Belén, Flores, San Pablo, Sarapiquí
-- Guanacaste: Liberia, Nicoya, Santa Cruz, Bagaces, Carrillo, Cañas, Abangares, Tilarán, Nandayure, La Cruz, Hojancha
-- Puntarenas: Puntarenas, Esparza, Buenos Aires, Montes de Oro, Osa, Quepos, Golfito, Coto Brus, Parrita, Corredores, Garabito
-- Limón: Limón, Pococí, Siquirres, Talamanca, Matina, Guácimo