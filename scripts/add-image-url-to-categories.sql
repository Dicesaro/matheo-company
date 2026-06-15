-- 1. Agregar columna image_url a la tabla categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. (Opcional) Verificar que se agregó correctamente
SELECT id, name, image_url, parent_id FROM categories ORDER BY name;
