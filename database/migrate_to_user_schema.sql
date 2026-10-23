BEGIN;

-- 1. importador: agregar razon_social, identificacion, id_pais
ALTER TABLE importador ADD COLUMN IF NOT EXISTS razon_social VARCHAR(150);
UPDATE importador SET razon_social = nombre_razon_social WHERE razon_social IS NULL;

ALTER TABLE importador ADD COLUMN IF NOT EXISTS identificacion VARCHAR(30);
UPDATE importador SET identificacion = nit_ruc WHERE identificacion IS NULL;

ALTER TABLE importador ADD COLUMN IF NOT EXISTS id_pais INTEGER REFERENCES pais(id_pais);
UPDATE importador SET id_pais = 1 WHERE id_pais IS NULL;

-- 2. categoria_partida: agregar tasa_arancelaria
ALTER TABLE categoria_partida ADD COLUMN IF NOT EXISTS tasa_arancelaria NUMERIC(5,2);
UPDATE categoria_partida SET tasa_arancelaria = porcentaje_arancel WHERE tasa_arancelaria IS NULL;

-- 3. mercancia: agregar valor_fob
ALTER TABLE mercancia ADD COLUMN IF NOT EXISTS valor_fob NUMERIC(12,2);
UPDATE mercancia SET valor_fob = valor_unitario WHERE valor_fob IS NULL;

-- 4. declaracion_aduanera: agregar numero_dua, id_pais
ALTER TABLE declaracion_aduanera ADD COLUMN IF NOT EXISTS numero_dua VARCHAR(30);
UPDATE declaracion_aduanera SET numero_dua = numero_declaracion WHERE numero_dua IS NULL;

ALTER TABLE declaracion_aduanera ADD COLUMN IF NOT EXISTS id_pais INTEGER REFERENCES pais(id_pais);
UPDATE declaracion_aduanera SET id_pais = id_pais_origen WHERE id_pais IS NULL;

-- 5. contenedor: agregar codigo, peso_kg
ALTER TABLE contenedor ADD COLUMN IF NOT EXISTS codigo VARCHAR(30);
UPDATE contenedor SET codigo = numero_contenedor WHERE codigo IS NULL;

ALTER TABLE contenedor ADD COLUMN IF NOT EXISTS peso_kg NUMERIC(12,2);
UPDATE contenedor SET peso_kg = peso WHERE peso_kg IS NULL;

-- 6. bodega: agregar tipo
ALTER TABLE bodega ADD COLUMN IF NOT EXISTS tipo VARCHAR(30) DEFAULT 'Fiscal';
UPDATE bodega SET tipo = 'Fiscal' WHERE tipo IS NULL;

-- 7. movimiento_inventario: agregar id_inventario
ALTER TABLE movimiento_inventario ADD COLUMN IF NOT EXISTS id_inventario INTEGER REFERENCES inventario_bodega(id_inventario);
UPDATE movimiento_inventario mi
SET id_inventario = ib.id_inventario
FROM inventario_bodega ib
WHERE mi.id_bodega = ib.id_bodega AND mi.id_mercancia = ib.id_mercancia
  AND mi.id_inventario IS NULL;
UPDATE movimiento_inventario SET id_inventario = 1 WHERE id_inventario IS NULL;

-- 8. Actualizar permisos para el rol de solo lectura
GRANT SELECT ON ALL TABLES IN SCHEMA public TO agente_aduanero_ro;

COMMIT;
