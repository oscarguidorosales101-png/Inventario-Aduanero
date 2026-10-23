-- ==============================================================================
-- LABORATORIO #3 · SISTEMA DE INVENTARIO ADUANERO
-- Gestor: PostgreSQL 17
-- Fecha: 23 de Octubre de 2026
-- Integrantes: Solución Integral Aduanera
-- ==============================================================================

-- 1. TABLA: pais
CREATE TABLE IF NOT EXISTS pais (
    id_pais     SERIAL PRIMARY KEY,
    nombre      VARCHAR(60) NOT NULL UNIQUE,
    codigo_iso  CHAR(2) NOT NULL UNIQUE
);

-- 2. TABLA: importador
CREATE TABLE IF NOT EXISTS importador (
    id_importador        SERIAL PRIMARY KEY,
    nombre_razon_social  VARCHAR(120) NOT NULL,
    nit_ruc              VARCHAR(20) NOT NULL UNIQUE,
    direccion            TEXT NOT NULL,
    telefono             VARCHAR(20) NOT NULL,
    correo               VARCHAR(100) NOT NULL UNIQUE
);

-- 3. TABLA: agente_aduanal
CREATE TABLE IF NOT EXISTS agente_aduanal (
    id_agente   SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    licencia    VARCHAR(30) NOT NULL UNIQUE,
    telefono    VARCHAR(20) NOT NULL
);

-- 4. TABLA: categoria_partida
CREATE TABLE IF NOT EXISTS categoria_partida (
    id_categoria        SERIAL PRIMARY KEY,
    codigo_partida      VARCHAR(20) NOT NULL UNIQUE,
    descripcion         TEXT NOT NULL,
    porcentaje_arancel  NUMERIC(5,2) NOT NULL CHECK (porcentaje_arancel >= 0)
);

-- 5. TABLA: mercancia
CREATE TABLE IF NOT EXISTS mercancia (
    id_mercancia    SERIAL PRIMARY KEY,
    descripcion     VARCHAR(150) NOT NULL,
    unidad_medida   VARCHAR(30) NOT NULL,
    valor_unitario  NUMERIC(12,2) NOT NULL CHECK (valor_unitario > 0),
    id_categoria    INT NOT NULL REFERENCES categoria_partida(id_categoria) ON DELETE RESTRICT
);

-- 6. TABLA: declaracion_aduanera (DUA)
CREATE TABLE IF NOT EXISTS declaracion_aduanera (
    id_declaracion      SERIAL PRIMARY KEY,
    numero_declaracion  VARCHAR(30) NOT NULL UNIQUE,
    fecha               DATE NOT NULL,
    regimen             VARCHAR(20) NOT NULL CHECK (regimen IN ('Importacion', 'Exportacion', 'Transito', 'Deposito')),
    estado              VARCHAR(25) NOT NULL DEFAULT 'Retenida' CHECK (estado IN ('Retenida', 'En Inspeccion', 'Liberada', 'Pendiente Pago')),
    id_importador       INT NOT NULL REFERENCES importador(id_importador) ON DELETE RESTRICT,
    id_agente           INT NOT NULL REFERENCES agente_aduanal(id_agente) ON DELETE RESTRICT,
    id_pais_origen      INT NOT NULL REFERENCES pais(id_pais) ON DELETE RESTRICT
);

-- 7. TABLA INTERMEDIA N:M: detalle_declaracion
CREATE TABLE IF NOT EXISTS detalle_declaracion (
    id_detalle      SERIAL PRIMARY KEY,
    id_declaracion  INT NOT NULL REFERENCES declaracion_aduanera(id_declaracion) ON DELETE CASCADE,
    id_mercancia    INT NOT NULL REFERENCES mercancia(id_mercancia) ON DELETE RESTRICT,
    cantidad        INT NOT NULL CHECK (cantidad > 0),
    valor_declarado NUMERIC(14,2) NOT NULL CHECK (valor_declarado >= 0)
);

-- 8. TABLA: contenedor
CREATE TABLE IF NOT EXISTS contenedor (
    id_contenedor       SERIAL PRIMARY KEY,
    numero_contenedor   VARCHAR(30) NOT NULL UNIQUE,
    tipo                VARCHAR(40) NOT NULL,
    peso                NUMERIC(10,2) NOT NULL CHECK (peso > 0),
    id_declaracion      INT NOT NULL REFERENCES declaracion_aduanera(id_declaracion) ON DELETE CASCADE
);

-- 9. TABLA: bodega
CREATE TABLE IF NOT EXISTS bodega (
    id_bodega   SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL UNIQUE,
    ubicacion   VARCHAR(150) NOT NULL,
    capacidad   INT NOT NULL CHECK (capacidad > 0)
);

-- 10. TABLA: inventario_bodega (Stock actual)
CREATE TABLE IF NOT EXISTS inventario_bodega (
    id_inventario   SERIAL PRIMARY KEY,
    id_bodega       INT NOT NULL REFERENCES bodega(id_bodega) ON DELETE RESTRICT,
    id_mercancia    INT NOT NULL REFERENCES mercancia(id_mercancia) ON DELETE RESTRICT,
    cantidad        INT NOT NULL CHECK (cantidad >= 0),
    fecha_ingreso   DATE NOT NULL,
    estado          VARCHAR(25) NOT NULL DEFAULT 'Retenido' CHECK (estado IN ('Retenido', 'Liberado', 'En Cuarentena'))
);

-- 11. TABLA: movimiento_inventario (Historial de flujo)
CREATE TABLE IF NOT EXISTS movimiento_inventario (
    id_movimiento   SERIAL PRIMARY KEY,
    tipo            VARCHAR(20) NOT NULL CHECK (tipo IN ('Entrada', 'Salida', 'Traslado')),
    fecha           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cantidad        INT NOT NULL CHECK (cantidad > 0),
    id_mercancia    INT NOT NULL REFERENCES mercancia(id_mercancia) ON DELETE RESTRICT,
    id_bodega       INT NOT NULL REFERENCES bodega(id_bodega) ON DELETE RESTRICT,
    motivo          TEXT
);

-- 12. TABLA: funcionario (Jerarquía recursiva de supervisión)
CREATE TABLE IF NOT EXISTS funcionario (
    id_funcionario  SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    cargo           VARCHAR(80) NOT NULL,
    id_supervisor   INT REFERENCES funcionario(id_funcionario) ON DELETE SET NULL
);

-- 13. TABLA: inspeccion
CREATE TABLE IF NOT EXISTS inspeccion (
    id_inspeccion   SERIAL PRIMARY KEY,
    fecha           DATE NOT NULL,
    resultado       VARCHAR(30) NOT NULL CHECK (resultado IN ('Aprobada', 'Con Observaciones', 'Retenida')),
    observaciones   TEXT NOT NULL,
    id_declaracion  INT NOT NULL REFERENCES declaracion_aduanera(id_declaracion) ON DELETE CASCADE,
    id_funcionario  INT NOT NULL REFERENCES funcionario(id_funcionario) ON DELETE RESTRICT
);

-- ==============================================================================
-- INSERCIÓN DE DATOS REALISTAS (MÍNIMO 15 REGISTROS POR TABLA PRINCIPAL)
-- ==============================================================================

-- 1. PAÍSES
INSERT INTO pais (nombre, codigo_iso) VALUES
('China', 'CN'),
('Estados Unidos', 'US'),
('Alemania', 'DE'),
('Japón', 'JP'),
('Corea del Sur', 'KR'),
('México', 'MX'),
('Brasil', 'BR'),
('España', 'ES'),
('Colombia', 'CO'),
('Vietnam', 'VN'),
('India', 'IN'),
('Italia', 'IT'),
('Países Bajos', 'NL'),
('Taiwán', 'TW'),
('Canadá', 'CA'),
('Chile', 'CL')
ON CONFLICT (nombre) DO NOTHING;

-- 2. IMPORTADORES
INSERT INTO importador (nombre_razon_social, nit_ruc, direccion, telefono, correo) VALUES
('Importaciones Tecnológicas del Valle S.A.', '3101-789456', 'Zona Industrial Pavas, Bodega 4', '+506 2220-4500', 'logistica@tecdelvalle.com'),
('Distribuidora Automotriz Central Ltda.', '3101-654123', 'La Uruca, Frente a Bomberos', '+506 2256-8800', 'aduanas@autocentral.cr'),
('Consorcio Farmacéutico Continental', '3101-112233', 'Parque Empresarial Forum 1, Santa Ana', '+506 2205-3000', 'import@farmacontinental.com'),
('Agroinsumos del Pacífico S.A.', '3101-998877', 'Puntarenas Centro, Av. Central', '+506 2661-1200', 'compras@agropacifico.cr'),
('Textiles y Modas de Oriente S.A.', '3101-334455', 'Calle Blancos, Complejo Textil', '+506 2240-9911', 'comercio@textilesoriente.com'),
('Alimentos y Bebidas del Caribe S.A.', '3101-556677', 'Puerto Limón, Terminal de Carga', '+506 2758-4433', 'despachos@alimentoscaribe.cr'),
('Electrónica Moderna & Retail', '3101-889900', 'Curridabat, San José', '+506 2272-1010', 'aduanas@electronicamoderna.com'),
('Equipos Médicos Especializados S.A.', '3101-445566', 'Heredia, Zona Franca Metropolitana', '+506 2293-8080', 'regulatorio@medicoscr.com'),
('Materiales Pesados e Ingeniería Civil', '3101-223344', 'Alajuela, San Rafael', '+506 2439-5566', 'operaciones@materialespesados.com'),
('Química Industrial Global S.A.', '3101-778899', 'Cartago, Parque Industrial', '+506 2573-2000', 'logistica@quimicaglobal.cr'),
('Cereales y Granos de América', '3101-123789', 'Muelle Caldera, Esparza', '+506 2634-9000', 'granos@cerealesamerica.com'),
('Calzado & Marroquinería Fina', '3101-987321', 'Desamparados, Centro', '+506 2259-7744', 'contacto@calzadofina.cr'),
('Maquinaria Agrícola del Norte', '3101-543210', 'San Carlos, Ciudad Quesada', '+506 2460-6677', 'ventas@maquinarianorte.com'),
('Ferretería y Herramientas Titán', '3101-678901', 'Tibás, San José', '+506 2241-1122', 'importaciones@titanferre.cr'),
('Plásticos y Polímeros Avanzados', '3101-234567', 'Santo Domingo, Heredia', '+506 2244-3322', 'aduanas@polimeroscr.com')
ON CONFLICT (nit_ruc) DO NOTHING;

-- 3. AGENTES ADUANALES
INSERT INTO agente_aduanal (nombre, licencia, telefono) VALUES
('Lic. Rodrigo Soto Fonseca', 'AG-2015-089', '+506 8845-1234'),
('Licda. María Elena Campos V.', 'AG-2018-142', '+506 8712-4567'),
('Lic. Esteban Vargas Morales', 'AG-2012-045', '+506 8933-7788'),
('Licda. Adriana Jiménez Rojas', 'AG-2020-210', '+506 8321-9900'),
('Lic. Carlos Monge Alvarado', 'AG-2011-032', '+506 8876-5432'),
('Licda. Marcela Solís Cordero', 'AG-2017-178', '+506 8901-2345'),
('Lic. Daniel Brenes Mora', 'AG-2019-195', '+506 8456-7890'),
('Licda. Laura Castro Quirós', 'AG-2021-230', '+506 8654-3210'),
('Lic. Federico Navarro Peña', 'AG-2014-071', '+506 8765-4321'),
('Licda. Patricia Ureña Vega', 'AG-2016-119', '+506 8345-6789'),
('Lic. Gustavo Zúñiga Fallas', 'AG-2013-059', '+506 8890-1234'),
('Licda. Silvia Méndez Arroyo', 'AG-2022-255', '+506 8923-4567'),
('Lic. Jorge Chaves Retana', 'AG-2010-018', '+506 8789-0123'),
('Licda. Gabriela Ruiz Chacón', 'AG-2023-280', '+506 8432-1098'),
('Lic. Andrés Gamboa Pérez', 'AG-2016-133', '+506 8567-8901')
ON CONFLICT (licencia) DO NOTHING;

-- 4. CATEGORÍAS / PARTIDAS ARANCELARIAS
INSERT INTO categoria_partida (codigo_partida, descripcion, porcentaje_arancel) VALUES
('8471.30.00', 'Máquinas automáticas para tratamiento de datos portátiles (Laptops)', 5.0),
('8517.13.00', 'Teléfonos inteligentes (Smartphones)', 8.0),
('8703.23.10', 'Vehículos automóviles de turismo cilindraje >1500cc pero <=3000cc', 25.0),
('3004.90.99', 'Medicamentos dosificados para uso terapéutico humano', 1.0),
('3105.20.00', 'Abonos y fertilizantes minerales químicos', 3.0),
('6109.10.00', 'Prendas de vestir: Camisetas de algodón de punto', 14.0),
('0901.11.00', 'Café sin tostar ni descafeinar', 9.0),
('9018.90.00', 'Instrumentos y aparatos de medicina y cirugía', 2.0),
('7214.20.00', 'Barras de hierro o acero sin alear con estrías (Varilla)', 12.0),
('3901.10.00', 'Polietileno de densidad inferior a 0.94 en formas primarias', 6.0),
('1006.30.00', 'Arroz semiblanqueado o blanqueado, pulido o glaseado', 35.0),
('6403.99.90', 'Calzado con suela de caucho y parte superior de cuero', 15.0),
('8432.29.00', 'Maquinaria agrícola: Gradas, escarificadores y cultivadores', 4.0),
('8205.59.00', 'Herramientas de mano de uso común no especificadas', 10.0),
('2204.21.00', 'Vino de uvas frescas en recipientes <= 2 litros', 20.0)
ON CONFLICT (codigo_partida) DO NOTHING;

-- 5. MERCANCÍAS
INSERT INTO mercancia (descripcion, unidad_medida, valor_unitario, id_categoria) VALUES
('Laptops Ultrabook 14" Intel Core i7 16GB', 'Unidades', 850.00, 1),
('Smartphones 5G 128GB Pantalla AMOLED', 'Unidades', 420.00, 2),
('Vehículo Sedán Gasolina 1800cc Automático', 'Unidades', 16500.00, 3),
('Amoxicilina 500mg Frasco 100 Cápsulas', 'Cajas', 14.50, 4),
('Fertilizante NPK 10-30-10 Saco 50kg', 'Sacos', 38.00, 5),
('Camisetas Algodón Cuello Redondo Pack x12', 'Docenas', 32.00, 6),
('Café Grano Verde Especialidad Tarrazú', 'Sacos 46kg', 195.00, 7),
('Monitor Signos Vitales Multiparámetro Clínico', 'Unidades', 2450.00, 8),
('Varilla Corrugada Grado 60 3/8" x 6m', 'Toneladas', 880.00, 9),
('Resina Polietileno Lineal Saco 25kg', 'Sacos', 42.50, 10),
('Arroz Grano Entero 99% Saco 50kg', 'Quintales', 48.00, 11),
('Zapato Ejecutivo Cuero Genuino Hombre', 'Pares', 55.00, 12),
('Tractor Agrícola 4x4 Diésel 75 HP', 'Unidades', 28500.00, 13),
('Juego de Herramientas Mecánicas 120 piezas', 'Sets', 75.00, 14),
('Vino Tinto Reserva Valle Central Caja x6', 'Cajas', 84.00, 15),
('Tablets Gráficas 10" con Stylus Digital', 'Unidades', 180.00, 1)
ON CONFLICT DO NOTHING;

-- 6. DECLARACIONES ADUANERAS (DUA)
INSERT INTO declaracion_aduanera (numero_declaracion, fecha, regimen, estado, id_importador, id_agente, id_pais_origen) VALUES
('DUA-2026-0001', '2026-10-02', 'Importacion', 'Retenida', 1, 1, 1),
('DUA-2026-0002', '2026-10-04', 'Importacion', 'Liberada', 2, 2, 4),
('DUA-2026-0003', '2026-10-05', 'Importacion', 'En Inspeccion', 3, 3, 3),
('DUA-2026-0004', '2026-10-08', 'Transito', 'Liberada', 4, 4, 2),
('DUA-2026-0005', '2026-10-10', 'Importacion', 'Retenida', 5, 5, 10),
('DUA-2026-0006', '2026-10-11', 'Exportacion', 'Liberada', 6, 6, 7),
('DUA-2026-0007', '2026-10-13', 'Importacion', 'Pendiente Pago', 7, 7, 5),
('DUA-2026-0008', '2026-10-14', 'Importacion', 'En Inspeccion', 8, 8, 8),
('DUA-2026-0009', '2026-10-15', 'Importacion', 'Liberada', 9, 9, 6),
('DUA-2026-0010', '2026-10-16', 'Deposito', 'Retenida', 10, 10, 2),
('DUA-2026-0011', '2026-10-17', 'Importacion', 'Liberada', 11, 11, 2),
('DUA-2026-0012', '2026-10-18', 'Importacion', 'Retenida', 12, 12, 12),
('DUA-2026-0013', '2026-10-19', 'Importacion', 'Pendiente Pago', 13, 13, 3),
('DUA-2026-0014', '2026-10-20', 'Importacion', 'En Inspeccion', 14, 14, 1),
('DUA-2026-0015', '2026-10-21', 'Importacion', 'Liberada', 15, 15, 14),
('DUA-2026-0016', '2026-10-22', 'Exportacion', 'Liberada', 1, 1, 1)
ON CONFLICT (numero_declaracion) DO NOTHING;

-- 7. DETALLE DE DECLARACIÓN
INSERT INTO detalle_declaracion (id_declaracion, id_mercancia, cantidad, valor_declarado) VALUES
(1, 1, 120, 102000.00),
(1, 2, 250, 105000.00),
(2, 3, 8, 132000.00),
(3, 4, 2500, 36250.00),
(4, 5, 600, 22800.00),
(5, 6, 450, 14400.00),
(6, 7, 300, 58500.00),
(7, 2, 400, 168000.00),
(8, 8, 25, 61250.00),
(9, 9, 80, 70400.00),
(10, 10, 1200, 51000.00),
(11, 11, 900, 43200.00),
(12, 12, 800, 44000.00),
(13, 13, 4, 114000.00),
(14, 14, 350, 26250.00),
(15, 16, 500, 90000.00)
ON CONFLICT DO NOTHING;

-- 8. CONTENEDORES
INSERT INTO contenedor (numero_contenedor, tipo, peso, id_declaracion) VALUES
('MSCU-819203-4', 'Dry 40ft High Cube', 24500.00, 1),
('CMAU-491029-8', 'Dry 40ft', 22100.00, 2),
('HLCU-920192-1', 'Reefer 40ft', 19800.00, 3),
('MAEU-102938-5', 'Dry 20ft', 14200.00, 4),
('COSCO-551092-3', 'Dry 40ft High Cube', 26100.00, 5),
('ONEU-772819-0', 'Dry 20ft', 16400.00, 6),
('EGLV-301928-7', 'Dry 40ft High Cube', 23900.00, 7),
('ZIMU-661928-2', 'Reefer 40ft', 18500.00, 8),
('YMLU-992019-4', 'Open Top 40ft', 27800.00, 9),
('MSCU-334910-6', 'Dry 40ft', 21500.00, 10),
('CMAU-119283-9', 'Bulk 40ft', 28400.00, 11),
('HLCU-440291-7', 'Dry 20ft', 13900.00, 12),
('MAEU-882910-1', 'Flat Rack 40ft', 29500.00, 13),
('COSCO-192837-5', 'Dry 40ft High Cube', 25000.00, 14),
('ONEU-902817-3', 'Dry 40ft', 20700.00, 15),
('EGLV-882917-0', 'Dry 20ft', 12800.00, 16)
ON CONFLICT (numero_contenedor) DO NOTHING;

-- 9. BODEGAS
INSERT INTO bodega (nombre, ubicacion, capacidad) VALUES
('Bodega Fiscal Central Caldera', 'Puerto Caldera, Esparza, Sector A', 5000),
('Depósito Aduanero Santamaría', 'Alajuela, Terminal de Carga Aérea', 3200),
('Terminal Fiscal Caribe Limón', 'Moín, Puerto Limón, Muelle APM', 8500),
('Almacén Fiscal La Uruca', 'San José, La Uruca Zona Industrial', 4000),
('Bodega de Decomisos y Retenidos', 'San José, Calle Blancos DGA', 1800),
('Depósito Frío Especializado Moín', 'Limón, Zona Portuaria Refrigerada', 2500),
('Bodega Fronteriza Peñas Blancas', 'Frontera Norte Peñas Blancas', 2200),
('Bodega Aduana Paso Canoas', 'Frontera Sur Corredores', 2000)
ON CONFLICT (nombre) DO NOTHING;

-- 10. INVENTARIO EN BODEGA
INSERT INTO inventario_bodega (id_bodega, id_mercancia, cantidad, fecha_ingreso, estado) VALUES
(1, 1, 80, '2026-10-03', 'Retenido'),
(2, 2, 150, '2026-10-04', 'Liberado'),
(1, 3, 5, '2026-10-06', 'Retenido'),
(6, 4, 1800, '2026-10-07', 'En Cuarentena'),
(4, 5, 450, '2026-10-09', 'Liberado'),
(5, 6, 300, '2026-10-11', 'Retenido'),
(3, 7, 200, '2026-10-12', 'Liberado'),
(2, 8, 18, '2026-10-14', 'En Cuarentena'),
(1, 9, 60, '2026-10-16', 'Liberado'),
(4, 10, 950, '2026-10-17', 'Retenido'),
(3, 11, 700, '2026-10-18', 'Liberado'),
(5, 12, 600, '2026-10-19', 'Retenido'),
(4, 13, 3, '2026-10-20', 'Retenido'),
(2, 14, 220, '2026-10-21', 'Retenido'),
(2, 16, 350, '2026-10-22', 'Liberado'),
(1, 1, 40, '2026-10-22', 'Liberado')
ON CONFLICT DO NOTHING;

-- 11. MOVIMIENTOS DE INVENTARIO
INSERT INTO movimiento_inventario (tipo, fecha, cantidad, id_mercancia, id_bodega, motivo) VALUES
('Entrada', '2026-10-03 08:30:00', 120, 1, 1, 'Recepción inicial descarga DUA-2026-0001'),
('Traslado', '2026-10-04 14:15:00', 40, 1, 1, 'Traslado preventivo para aforo físico'),
('Entrada', '2026-10-04 09:40:00', 250, 2, 2, 'Ingreso carga aérea DUA-2026-0002'),
('Salida', '2026-10-05 16:20:00', 100, 2, 2, 'Despacho aduanero autorizado con levante'),
('Entrada', '2026-10-06 11:00:00', 8, 3, 1, 'Descarga patio automotriz DUA-2026-0003'),
('Salida', '2026-10-07 10:15:00', 3, 3, 1, 'Entrega parcial importador'),
('Entrada', '2026-10-07 13:00:00', 2500, 4, 6, 'Ingreso cámara fría DUA-2026-0004'),
('Salida', '2026-10-08 15:30:00', 700, 4, 6, 'Muestra a laboratorio de control fiscal'),
('Entrada', '2026-10-09 08:00:00', 600, 5, 4, 'Almacenaje temporal DUA-2026-0005'),
('Salida', '2026-10-10 17:00:00', 150, 5, 4, 'Retiro autorizado'),
('Entrada', '2026-10-11 10:45:00', 450, 6, 5, 'Custodia fiscal DUA-2026-0006'),
('Traslado', '2026-10-12 11:20:00', 150, 6, 5, 'Reubicación pasillo 4 a bodega 5'),
('Entrada', '2026-10-12 14:00:00', 300, 7, 3, 'Recepción muelle limón'),
('Salida', '2026-10-13 09:10:00', 100, 7, 3, 'Embarque a exportación'),
('Entrada', '2026-10-14 16:40:00', 25, 8, 2, 'Ingreso equipo médico de alta precisión'),
('Entrada', '2026-10-16 08:20:00', 80, 9, 1, 'Descarga grúa caldera')
ON CONFLICT DO NOTHING;

-- 12. FUNCIONARIOS
INSERT INTO funcionario (nombre, cargo, id_supervisor) VALUES
('Ing. Carlos Alvarado Brenes', 'Director General de Aduanas', NULL),
('Licda. Xinia Montero Solano', 'Jefa de Operaciones Caldera', 1),
('Lic. Guillermo Castro Vargas', 'Jefe de Operaciones Santamaría', 1),
('Licda. Karen Salas Porras', 'Jefa de Fiscalización Portuaria Limón', 1),
('Insp. Roberto Méndez Cordero', 'Aforador Técnico Especialista', 2),
('Insp. Daniela Quirós Fallas', 'Inspectora de Carga General', 2),
('Insp. Javier Mora Esquivel', 'Aforador Electrónica y Vehículos', 3),
('Insp. Mariela Vega Jiménez', 'Inspectora Fito-Sanitaria y Química', 3),
('Insp. Rolando Solano Morales', 'Auditor Fiscal Contenedores', 4),
('Insp. Gabriela Núñez Chacón', 'Inspectora Documental DUA', 4),
('Insp. Mauricio Peña Ureña', 'Inspector de Seguridad y Escáner', 2),
('Insp. Viviana Rojas Delgado', 'Inspectora Auxiliar de Depósito', 3)
ON CONFLICT DO NOTHING;

-- 13. INSPECCIONES
INSERT INTO inspeccion (fecha, resultado, observaciones, id_declaracion, id_funcionario) VALUES
('2026-10-03', 'Con Observaciones', 'Discrepancia en el número de serie de 10 laptops. Retenidas hasta rectificación de factura.', 1, 5),
('2026-10-04', 'Aprobada', 'Aforo documental y físico completado satisfactoriamente sin irregularidades.', 2, 7),
('2026-10-05', 'Con Observaciones', 'Pendiente visto bueno del Ministerio de Salud para lote farmacológico.', 3, 8),
('2026-10-08', 'Aprobada', 'Mercancía en tránsito internacional verificada con precinto intacto.', 4, 6),
('2026-10-10', 'Retenida', 'Etiquetado no cumple con norma técnica centroamericana de origen textil.', 5, 9),
('2026-10-11', 'Aprobada', 'Certificado de origen y sello de exportación validados.', 6, 10),
('2026-10-13', 'Aprobada', 'Liquidación arancelaria comprobada. Se autoriza retiro previo pago.', 7, 7),
('2026-10-14', 'Con Observaciones', 'Equipo médico requiere calibración técnica en almacén fiscal.', 8, 8),
('2026-10-15', 'Aprobada', 'Varillas de acero con peso neto coincidente con manifiesto de carga.', 9, 5),
('2026-10-16', 'Con Observaciones', 'Muestra enviada a laboratorio fiscal para certificar grado de pureza polimérica.', 10, 11),
('2026-10-17', 'Aprobada', 'Inspección fitosanitaria de granos limpia y libre de plagas.', 11, 8),
('2026-10-18', 'Retenida', 'Falta registro de marca de distribuidor autorizado para calzado italiano.', 12, 10),
('2026-10-19', 'Aprobada', 'Número de chasis de maquinaria agrícola concuerda con DUA.', 13, 6),
('2026-10-20', 'Con Observaciones', 'Cajas de herramientas con embalaje deteriorado. Inventario físico verificado.', 14, 11),
('2026-10-21', 'Aprobada', 'Lote de tabletas revisado por escáner de alta densidad.', 15, 7),
('2026-10-22', 'Aprobada', 'Contenedor liberado con semáforo verde en sistema aduanero.', 16, 9)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- USUARIO DE SOLO LECTURA PARA EL AGENTE DE IA (N8N)
-- ==============================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'agente_aduanero_ro') THEN
        CREATE ROLE agente_aduanero_ro WITH LOGIN PASSWORD 'AduanaAgent2026_SecureRO';
    END IF;
END
$$;

GRANT CONNECT ON DATABASE aduana TO agente_aduanero_ro;
GRANT USAGE ON SCHEMA public TO agente_aduanero_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO agente_aduanero_ro;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO agente_aduanero_ro;
