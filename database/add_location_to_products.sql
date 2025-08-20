-- Agregar campos de ubicación a la tabla de productos
-- Los productos heredarán automáticamente el cantón y provincia del emprendimiento

ALTER TABLE products 
ADD COLUMN canton VARCHAR(100),
ADD COLUMN provincia VARCHAR(100);

-- Crear índices para mejorar las consultas por ubicación
CREATE INDEX idx_products_canton ON products(canton);
CREATE INDEX idx_products_provincia ON products(provincia);

-- Función para actualizar automáticamente la ubicación de los productos
-- cuando se inserta o actualiza un producto
CREATE OR REPLACE FUNCTION update_product_location()
RETURNS TRIGGER AS $$
BEGIN
    -- Obtener el cantón y provincia del emprendimiento
    SELECT canton, provincia 
    INTO NEW.canton, NEW.provincia
    FROM businesses 
    WHERE id = NEW.business_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar automáticamente la ubicación
CREATE TRIGGER trigger_update_product_location
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_product_location();

-- Actualizar productos existentes con la ubicación de su emprendimiento
UPDATE products 
SET canton = b.canton, provincia = b.provincia
FROM businesses b
WHERE products.business_id = b.id;

-- Verificar los cambios
SELECT 
    p.name as producto,
    b.name as emprendimiento,
    p.canton,
    p.provincia
FROM products p
JOIN businesses b ON p.business_id = b.id
LIMIT 10;