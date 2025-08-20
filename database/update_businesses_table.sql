-- Script para actualizar la tabla businesses con los campos faltantes

-- Agregar columna category_id
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id);

-- Agregar columnas de redes sociales
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);

ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS facebook VARCHAR(255);

ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS instagram VARCHAR(255);

-- Agregar columna de horarios
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS opening_hours TEXT;

-- Crear índice para category_id
CREATE INDEX IF NOT EXISTS idx_businesses_category_id ON businesses(category_id);