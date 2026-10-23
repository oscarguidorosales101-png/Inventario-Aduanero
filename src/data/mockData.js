/**
 * DATOS DE DEMOSTRACIÓN — INVENTARIO ADUANERO (LABORATORIO #3)
 * Modelado según el esquema relacional de 13 tablas del Laboratorio #3.
 * NOTA: Estos datos son exclusivamente para demostración y pruebas del frontend
 * antes de la conexión activa con la API REST y PostgreSQL en la siguiente fase.
 */

export const IS_DEMO_DATA = true;

// 1. Países de Origen y Destino
export const mockPaises = [
  { id_pais: 1, nombre: 'China', codigo_iso: 'CN' },
  { id_pais: 2, nombre: 'Estados Unidos', codigo_iso: 'US' },
  { id_pais: 3, nombre: 'Alemania', codigo_iso: 'DE' },
  { id_pais: 4, nombre: 'Japón', codigo_iso: 'JP' },
  { id_pais: 5, nombre: 'Corea del Sur', codigo_iso: 'KR' },
  { id_pais: 6, nombre: 'México', codigo_iso: 'MX' },
  { id_pais: 7, nombre: 'Brasil', codigo_iso: 'BR' },
  { id_pais: 8, nombre: 'España', codigo_iso: 'ES' },
  { id_pais: 9, nombre: 'Colombia', codigo_iso: 'CO' },
  { id_pais: 10, nombre: 'Vietnam', codigo_iso: 'VN' },
  { id_pais: 11, nombre: 'India', codigo_iso: 'IN' },
  { id_pais: 12, nombre: 'Italia', codigo_iso: 'IT' },
  { id_pais: 13, nombre: 'Países Bajos', codigo_iso: 'NL' },
  { id_pais: 14, nombre: 'Taiwán', codigo_iso: 'TW' },
  { id_pais: 15, nombre: 'Canadá', codigo_iso: 'CA' },
  { id_pais: 16, nombre: 'Chile', codigo_iso: 'CL' }
];

// 2. Importadores y Exportadores Registrados
export const mockImportadores = [
  { id_importador: 1, nombre_razon_social: 'Importaciones Tecnológicas del Valle S.A.', nit_ruc: '3101-789456', direccion: 'Zona Industrial Pavas, Bodega 4', telefono: '+506 2220-4500', correo: 'logistica@tecdelvalle.com' },
  { id_importador: 2, nombre_razon_social: 'Distribuidora Automotriz Central Ltda.', nit_ruc: '3101-654123', direccion: 'La Uruca, Frente a Bomberos', telefono: '+506 2256-8800', correo: 'aduanas@autocentral.cr' },
  { id_importador: 3, nombre_razon_social: 'Consorcio Farmacéutico Continental', nit_ruc: '3101-112233', direccion: 'Parque Empresarial Forum 1, Santa Ana', telefono: '+506 2205-3000', correo: 'import@farmacontinental.com' },
  { id_importador: 4, nombre_razon_social: 'Agroinsumos del Pacífico S.A.', nit_ruc: '3101-998877', direccion: 'Puntarenas Centro, Av. Central', telefono: '+506 2661-1200', correo: 'compras@agropacifico.cr' },
  { id_importador: 5, nombre_razon_social: 'Textiles y Modas de Oriente S.A.', nit_ruc: '3101-334455', direccion: 'Calle Blancos, Complejo Textil', telefono: '+506 2240-9911', correo: 'comercio@textilesoriente.com' },
  { id_importador: 6, nombre_razon_social: 'Alimentos y Bebidas del Caribe S.A.', nit_ruc: '3101-556677', direccion: 'Puerto Limón, Terminal de Carga', telefono: '+506 2758-4433', correo: 'despachos@alimentoscaribe.cr' },
  { id_importador: 7, nombre_razon_social: 'Electrónica Moderna & Retail', nit_ruc: '3101-889900', direccion: 'Curridabat, San José', telefono: '+506 2272-1010', correo: 'aduanas@electronicamoderna.com' },
  { id_importador: 8, nombre_razon_social: 'Equipos Médicos Especializados S.A.', nit_ruc: '3101-445566', direccion: 'Heredia, Zona Franca Metropolitana', telefono: '+506 2293-8080', correo: 'regulatorio@medicoscr.com' },
  { id_importador: 9, nombre_razon_social: 'Materiales Pesados e Ingeniería Civil', nit_ruc: '3101-223344', direccion: 'Alajuela, San Rafael', telefono: '+506 2439-5566', correo: 'operaciones@materialespesados.com' },
  { id_importador: 10, nombre_razon_social: 'Química Industrial Global S.A.', nit_ruc: '3101-778899', direccion: 'Cartago, Parque Industrial', telefono: '+506 2573-2000', correo: 'logistica@quimicaglobal.cr' },
  { id_importador: 11, nombre_razon_social: 'Cereales y Granos de América', nit_ruc: '3101-123789', direccion: 'Muelle Caldera, Esparza', telefono: '+506 2634-9000', correo: 'granos@cerealesamerica.com' },
  { id_importador: 12, nombre_razon_social: 'Calzado & Marroquinería Fina', nit_ruc: '3101-987321', direccion: 'Desamparados, Centro', telefono: '+506 2259-7744', correo: 'contacto@calzadofina.cr' },
  { id_importador: 13, nombre_razon_social: 'Maquinaria Agrícola del Norte', nit_ruc: '3101-543210', direccion: 'San Carlos, Ciudad Quesada', telefono: '+506 2460-6677', correo: 'ventas@maquinarianorte.com' },
  { id_importador: 14, nombre_razon_social: 'Ferretería y Herramientas Titán', nit_ruc: '3101-678901', direccion: 'Tibás, San José', telefono: '+506 2241-1122', correo: 'importaciones@titanferre.cr' },
  { id_importador: 15, nombre_razon_social: 'Plásticos y Polímeros Avanzados', nit_ruc: '3101-234567', direccion: 'Santo Domingo, Heredia', telefono: '+506 2244-3322', correo: 'aduanas@polimeroscr.com' }
];

// 3. Agentes Aduanales Autorizados
export const mockAgentes = [
  { id_agente: 1, nombre: 'Lic. Rodrigo Soto Fonseca', licencia: 'AG-2015-089', telefono: '+506 8845-1234' },
  { id_agente: 2, nombre: 'Licda. María Elena Campos V.', licencia: 'AG-2018-142', telefono: '+506 8712-4567' },
  { id_agente: 3, nombre: 'Lic. Esteban Vargas Morales', licencia: 'AG-2012-045', telefono: '+506 8933-7788' },
  { id_agente: 4, nombre: 'Licda. Adriana Jiménez Rojas', licencia: 'AG-2020-210', telefono: '+506 8321-9900' },
  { id_agente: 5, nombre: 'Lic. Carlos Monge Alvarado', licencia: 'AG-2011-032', telefono: '+506 8876-5432' },
  { id_agente: 6, nombre: 'Licda. Marcela Solís Cordero', licencia: 'AG-2017-178', telefono: '+506 8901-2345' },
  { id_agente: 7, nombre: 'Lic. Daniel Brenes Mora', licencia: 'AG-2019-195', telefono: '+506 8456-7890' },
  { id_agente: 8, nombre: 'Licda. Laura Castro Quirós', licencia: 'AG-2021-230', telefono: '+506 8654-3210' },
  { id_agente: 9, nombre: 'Lic. Federico Navarro Peña', licencia: 'AG-2014-071', telefono: '+506 8765-4321' },
  { id_agente: 10, nombre: 'Licda. Patricia Ureña Vega', licencia: 'AG-2016-119', telefono: '+506 8345-6789' },
  { id_agente: 11, nombre: 'Lic. Gustavo Zúñiga Fallas', licencia: 'AG-2013-059', telefono: '+506 8890-1234' },
  { id_agente: 12, nombre: 'Licda. Silvia Méndez Arroyo', licencia: 'AG-2022-255', telefono: '+506 8923-4567' },
  { id_agente: 13, nombre: 'Lic. Jorge Chaves Retana', licencia: 'AG-2010-018', telefono: '+506 8789-0123' },
  { id_agente: 14, nombre: 'Licda. Gabriela Ruiz Chacón', licencia: 'AG-2023-280', telefono: '+506 8432-1098' },
  { id_agente: 15, nombre: 'Lic. Andrés Gamboa Pérez', licencia: 'AG-2016-133', telefono: '+506 8567-8901' }
];

// 4. Categorías / Partidas Arancelarias (Sistema Armonizado)
export const mockCategorias = [
  { id_categoria: 1, codigo_partida: '8471.30.00', descripcion: 'Máquinas automáticas para tratamiento de datos portátiles (Laptops)', porcentaje_arancel: 5.0 },
  { id_categoria: 2, codigo_partida: '8517.13.00', descripcion: 'Teléfonos inteligentes (Smartphones)', porcentaje_arancel: 8.0 },
  { id_categoria: 3, codigo_partida: '8703.23.10', descripcion: 'Vehículos automóviles de turismo cilindraje >1500cc pero <=3000cc', porcentaje_arancel: 25.0 },
  { id_categoria: 4, codigo_partida: '3004.90.99', descripcion: 'Medicamentos dosificados para uso terapéutico humano', porcentaje_arancel: 1.0 },
  { id_categoria: 5, codigo_partida: '3105.20.00', descripcion: 'Abonos y fertilizantes minerales químicos', porcentaje_arancel: 3.0 },
  { id_categoria: 6, codigo_partida: '6109.10.00', descripcion: 'Prendas de vestir: Camisetas de algodón de punto', porcentaje_arancel: 14.0 },
  { id_categoria: 7, codigo_partida: '0901.11.00', descripcion: 'Café sin tostar ni descafeinar', porcentaje_arancel: 9.0 },
  { id_categoria: 8, codigo_partida: '9018.90.00', descripcion: 'Instrumentos y aparatos de medicina y cirugía', porcentaje_arancel: 2.0 },
  { id_categoria: 9, codigo_partida: '7214.20.00', descripcion: 'Barras de hierro o acero sin alear con estrías (Varilla)', porcentaje_arancel: 12.0 },
  { id_categoria: 10, codigo_partida: '3901.10.00', descripcion: 'Polietileno de densidad inferior a 0.94 en formas primarias', porcentaje_arancel: 6.0 },
  { id_categoria: 11, codigo_partida: '1006.30.00', descripcion: 'Arroz semiblanqueado o blanqueado, pulido o glaseado', porcentaje_arancel: 35.0 },
  { id_categoria: 12, codigo_partida: '6403.99.90', descripcion: 'Calzado con suela de caucho y parte superior de cuero', porcentaje_arancel: 15.0 },
  { id_categoria: 13, codigo_partida: '8432.29.00', descripcion: 'Maquinaria agrícola: Gradas, escarificadores y cultivadores', porcentaje_arancel: 4.0 },
  { id_categoria: 14, codigo_partida: '8205.59.00', descripcion: 'Herramientas de mano de uso común no especificadas', porcentaje_arancel: 10.0 },
  { id_categoria: 15, codigo_partida: '2204.21.00', descripcion: 'Vino de uvas frescas en recipientes <= 2 litros', porcentaje_arancel: 20.0 }
];

// 5. Productos / Mercancías Registradas
export const mockMercancias = [
  { id_mercancia: 1, descripcion: 'Laptops Ultrabook 14" Intel Core i7 16GB', unidad_medida: 'Unidades', valor_unitario: 850.00, id_categoria: 1 },
  { id_mercancia: 2, descripcion: 'Smartphones 5G 128GB Pantalla AMOLED', unidad_medida: 'Unidades', valor_unitario: 420.00, id_categoria: 2 },
  { id_mercancia: 3, descripcion: 'Vehículo Sedán Gasolina 1800cc Automático', unidad_medida: 'Unidades', valor_unitario: 16500.00, id_categoria: 3 },
  { id_mercancia: 4, descripcion: 'Amoxicilina 500mg Frasco 100 Cápsulas', unidad_medida: 'Cajas', valor_unitario: 14.50, id_categoria: 4 },
  { id_mercancia: 5, descripcion: 'Fertilizante NPK 10-30-10 Saco 50kg', unidad_medida: 'Sacos', valor_unitario: 38.00, id_categoria: 5 },
  { id_mercancia: 6, descripcion: 'Camisetas Algodón Cuello Redondo Pack x12', unidad_medida: 'Docenas', valor_unitario: 32.00, id_categoria: 6 },
  { id_mercancia: 7, descripcion: 'Café Grano Verde Especialidad Tarrazú', unidad_medida: 'Sacos 46kg', valor_unitario: 195.00, id_categoria: 7 },
  { id_mercancia: 8, descripcion: 'Monitor Signos Vitales Multiparámetro Clínico', unidad_medida: 'Unidades', valor_unitario: 2450.00, id_categoria: 8 },
  { id_mercancia: 9, descripcion: 'Varilla Corrugada Grado 60 3/8" x 6m', unidad_medida: 'Toneladas', valor_unitario: 880.00, id_categoria: 9 },
  { id_mercancia: 10, descripcion: 'Resina Polietileno Lineal Saco 25kg', unidad_medida: 'Sacos', valor_unitario: 42.50, id_categoria: 10 },
  { id_mercancia: 11, descripcion: 'Arroz Grano Entero 99% Saco 50kg', unidad_medida: 'Quintales', valor_unitario: 48.00, id_categoria: 11 },
  { id_mercancia: 12, descripcion: 'Zapato Ejecutivo Cuero Genuino Hombre', unidad_medida: 'Pares', valor_unitario: 55.00, id_categoria: 12 },
  { id_mercancia: 13, descripcion: 'Tractor Agrícola 4x4 Diésel 75 HP', unidad_medida: 'Unidades', valor_unitario: 28500.00, id_categoria: 13 },
  { id_mercancia: 14, descripcion: 'Juego de Herramientas Mecánicas 120 piezas', unidad_medida: 'Sets', valor_unitario: 75.00, id_categoria: 14 },
  { id_mercancia: 15, descripcion: 'Vino Tinto Reserva Valle Central Caja x6', unidad_medida: 'Cajas', valor_unitario: 84.00, id_categoria: 15 },
  { id_mercancia: 16, descripcion: 'Tablets Gráficas 10" con Stylus Digital', unidad_medida: 'Unidades', valor_unitario: 180.00, id_categoria: 1 }
];

// 6. Declaraciones Aduaneras (DUA)
export const mockDeclaraciones = [
  { id_declaracion: 1, numero_declaracion: 'DUA-2026-0001', fecha: '2026-10-02', regimen: 'Importacion', estado: 'Retenida', id_importador: 1, id_agente: 1, id_pais_origen: 1 },
  { id_declaracion: 2, numero_declaracion: 'DUA-2026-0002', fecha: '2026-10-04', regimen: 'Importacion', estado: 'Liberada', id_importador: 2, id_agente: 2, id_pais_origen: 4 },
  { id_declaracion: 3, numero_declaracion: 'DUA-2026-0003', fecha: '2026-10-05', regimen: 'Importacion', estado: 'En Inspeccion', id_importador: 3, id_agente: 3, id_pais_origen: 3 },
  { id_declaracion: 4, numero_declaracion: 'DUA-2026-0004', fecha: '2026-10-08', regimen: 'Transito', estado: 'Liberada', id_importador: 4, id_agente: 4, id_pais_origen: 2 },
  { id_declaracion: 5, numero_declaracion: 'DUA-2026-0005', fecha: '2026-10-10', regimen: 'Importacion', estado: 'Retenida', id_importador: 5, id_agente: 5, id_pais_origen: 10 },
  { id_declaracion: 6, numero_declaracion: 'DUA-2026-0006', fecha: '2026-10-11', regimen: 'Exportacion', estado: 'Liberada', id_importador: 6, id_agente: 6, id_pais_origen: 7 },
  { id_declaracion: 7, numero_declaracion: 'DUA-2026-0007', fecha: '2026-10-13', regimen: 'Importacion', estado: 'Pendiente Pago', id_importador: 7, id_agente: 7, id_pais_origen: 5 },
  { id_declaracion: 8, numero_declaracion: 'DUA-2026-0008', fecha: '2026-10-14', regimen: 'Importacion', estado: 'En Inspeccion', id_importador: 8, id_agente: 8, id_pais_origen: 8 },
  { id_declaracion: 9, numero_declaracion: 'DUA-2026-0009', fecha: '2026-10-15', regimen: 'Importacion', estado: 'Liberada', id_importador: 9, id_agente: 9, id_pais_origen: 6 },
  { id_declaracion: 10, numero_declaracion: 'DUA-2026-0010', fecha: '2026-10-16', regimen: 'Deposito', estado: 'Retenida', id_importador: 10, id_agente: 10, id_pais_origen: 2 },
  { id_declaracion: 11, numero_declaracion: 'DUA-2026-0011', fecha: '2026-10-17', regimen: 'Importacion', estado: 'Liberada', id_importador: 11, id_agente: 11, id_pais_origen: 2 },
  { id_declaracion: 12, numero_declaracion: 'DUA-2026-0012', fecha: '2026-10-18', regimen: 'Importacion', estado: 'Retenida', id_importador: 12, id_agente: 12, id_pais_origen: 12 },
  { id_declaracion: 13, numero_declaracion: 'DUA-2026-0013', fecha: '2026-10-19', regimen: 'Importacion', estado: 'Pendiente Pago', id_importador: 13, id_agente: 13, id_pais_origen: 3 },
  { id_declaracion: 14, numero_declaracion: 'DUA-2026-0014', fecha: '2026-10-20', regimen: 'Importacion', estado: 'En Inspeccion', id_importador: 14, id_agente: 14, id_pais_origen: 1 },
  { id_declaracion: 15, numero_declaracion: 'DUA-2026-0015', fecha: '2026-10-21', regimen: 'Importacion', estado: 'Liberada', id_importador: 15, id_agente: 15, id_pais_origen: 14 },
  { id_declaracion: 16, numero_declaracion: 'DUA-2026-0016', fecha: '2026-10-22', regimen: 'Exportacion', estado: 'Liberada', id_importador: 1, id_agente: 1, id_pais_origen: 1 }
];

// 7. Detalle de Declaraciones (Relación N:M DUA <-> Mercancía)
export const mockDetalles = [
  { id_detalle: 1, id_declaracion: 1, id_mercancia: 1, cantidad: 120, valor_declarado: 102000.00 },
  { id_detalle: 2, id_declaracion: 1, id_mercancia: 2, cantidad: 250, valor_declarado: 105000.00 },
  { id_detalle: 3, id_declaracion: 2, id_mercancia: 3, cantidad: 8, valor_declarado: 132000.00 },
  { id_detalle: 4, id_declaracion: 3, id_mercancia: 4, cantidad: 2500, valor_declarado: 36250.00 },
  { id_detalle: 5, id_declaracion: 4, id_mercancia: 5, cantidad: 600, valor_declarado: 22800.00 },
  { id_detalle: 6, id_declaracion: 5, id_mercancia: 6, cantidad: 450, valor_declarado: 14400.00 },
  { id_detalle: 7, id_declaracion: 6, id_mercancia: 7, cantidad: 300, valor_declarado: 58500.00 },
  { id_detalle: 8, id_declaracion: 7, id_mercancia: 2, cantidad: 400, valor_declarado: 168000.00 },
  { id_detalle: 9, id_declaracion: 8, id_mercancia: 8, cantidad: 25, valor_declarado: 61250.00 },
  { id_detalle: 10, id_declaracion: 9, id_mercancia: 9, cantidad: 80, valor_declarado: 70400.00 },
  { id_detalle: 11, id_declaracion: 10, id_mercancia: 10, cantidad: 1200, valor_declarado: 51000.00 },
  { id_detalle: 12, id_declaracion: 11, id_mercancia: 11, cantidad: 900, valor_declarado: 43200.00 },
  { id_detalle: 13, id_declaracion: 12, id_mercancia: 12, cantidad: 800, valor_declarado: 44000.00 },
  { id_detalle: 14, id_declaracion: 13, id_mercancia: 13, cantidad: 4, valor_declarado: 114000.00 },
  { id_detalle: 15, id_declaracion: 14, id_mercancia: 14, cantidad: 350, valor_declarado: 26250.00 },
  { id_detalle: 16, id_declaracion: 15, id_mercancia: 16, cantidad: 500, valor_declarado: 90000.00 }
];

// 8. Contenedores Asociados a Operaciones Aduaneras
export const mockContenedores = [
  { id_contenedor: 1, numero_contenedor: 'MSCU-819203-4', tipo: 'Dry 40ft High Cube', peso: 24500.00, id_declaracion: 1 },
  { id_contenedor: 2, numero_contenedor: 'CMAU-491029-8', tipo: 'Dry 40ft', peso: 22100.00, id_declaracion: 2 },
  { id_contenedor: 3, numero_contenedor: 'HLCU-920192-1', tipo: 'Reefer 40ft', peso: 19800.00, id_declaracion: 3 },
  { id_contenedor: 4, numero_contenedor: 'MAEU-102938-5', tipo: 'Dry 20ft', peso: 14200.00, id_declaracion: 4 },
  { id_contenedor: 5, numero_contenedor: 'COSCO-551092-3', tipo: 'Dry 40ft High Cube', peso: 26100.00, id_declaracion: 5 },
  { id_contenedor: 6, numero_contenedor: 'ONEU-772819-0', tipo: 'Dry 20ft', peso: 16400.00, id_declaracion: 6 },
  { id_contenedor: 7, numero_contenedor: 'EGLV-301928-7', tipo: 'Dry 40ft High Cube', peso: 23900.00, id_declaracion: 7 },
  { id_contenedor: 8, numero_contenedor: 'ZIMU-661928-2', tipo: 'Reefer 40ft', peso: 18500.00, id_declaracion: 8 },
  { id_contenedor: 9, numero_contenedor: 'YMLU-992019-4', tipo: 'Open Top 40ft', peso: 27800.00, id_declaracion: 9 },
  { id_contenedor: 10, numero_contenedor: 'MSCU-334910-6', tipo: 'Dry 40ft', peso: 21500.00, id_declaracion: 10 },
  { id_contenedor: 11, numero_contenedor: 'CMAU-119283-9', tipo: 'Bulk 40ft', peso: 28400.00, id_declaracion: 11 },
  { id_contenedor: 12, numero_contenedor: 'HLCU-440291-7', tipo: 'Dry 20ft', peso: 13900.00, id_declaracion: 12 },
  { id_contenedor: 13, numero_contenedor: 'MAEU-882910-1', tipo: 'Flat Rack 40ft', peso: 29500.00, id_declaracion: 13 },
  { id_contenedor: 14, numero_contenedor: 'COSCO-192837-5', tipo: 'Dry 40ft High Cube', peso: 25000.00, id_declaracion: 14 },
  { id_contenedor: 15, numero_contenedor: 'ONEU-902817-3', tipo: 'Dry 40ft', peso: 20700.00, id_declaracion: 15 },
  { id_contenedor: 16, numero_contenedor: 'EGLV-882917-0', tipo: 'Dry 20ft', peso: 12800.00, id_declaracion: 16 }
];

// 9. Bodegas y Depósitos Fiscales Disponibles
export const mockBodegas = [
  { id_bodega: 1, nombre: 'Bodega Fiscal Central Caldera', ubicacion: 'Puerto Caldera, Esparza, Sector A', capacidad: 5000 },
  { id_bodega: 2, nombre: 'Depósito Aduanero Santamaría', ubicacion: 'Alajuela, Terminal de Carga Aérea', capacidad: 3200 },
  { id_bodega: 3, nombre: 'Terminal Fiscal Caribe Limón', ubicacion: 'Moín, Puerto Limón, Muelle APM', capacidad: 8500 },
  { id_bodega: 4, nombre: 'Almacén Fiscal La Uruca', ubicacion: 'San José, La Uruca Zona Industrial', capacidad: 4000 },
  { id_bodega: 5, nombre: 'Bodega de Decomisos y Retenidos', ubicacion: 'San José, Calle Blancos DGA', capacidad: 1800 },
  { id_bodega: 6, nombre: 'Depósito Frío Especializado Moín', ubicacion: 'Limón, Zona Portuaria Refrigerada', capacidad: 2500 },
  { id_bodega: 7, nombre: 'Bodega Fronteriza Peñas Blancas', ubicacion: 'Frontera Norte Peñas Blancas', capacidad: 2200 },
  { id_bodega: 8, nombre: 'Bodega Aduana Paso Canoas', ubicacion: 'Frontera Sur Corredores', capacidad: 2000 }
];

// 10. Inventario / Stock Actual en Bodega
export const mockInventarioBodega = [
  { id_inventario: 1, id_bodega: 1, id_mercancia: 1, cantidad: 80, fecha_ingreso: '2026-10-03', estado: 'Retenido' },
  { id_inventario: 2, id_bodega: 2, id_mercancia: 2, cantidad: 150, fecha_ingreso: '2026-10-04', estado: 'Liberado' },
  { id_inventario: 3, id_bodega: 1, id_mercancia: 3, cantidad: 5, fecha_ingreso: '2026-10-06', estado: 'Retenido' },
  { id_inventario: 4, id_bodega: 6, id_mercancia: 4, cantidad: 1800, fecha_ingreso: '2026-10-07', estado: 'En Cuarentena' },
  { id_inventario: 5, id_bodega: 4, id_mercancia: 5, cantidad: 450, fecha_ingreso: '2026-10-09', estado: 'Liberado' },
  { id_inventario: 6, id_bodega: 5, id_mercancia: 6, cantidad: 300, fecha_ingreso: '2026-10-11', estado: 'Retenido' },
  { id_inventario: 7, id_bodega: 3, id_mercancia: 7, cantidad: 200, fecha_ingreso: '2026-10-12', estado: 'Liberado' },
  { id_inventario: 8, id_bodega: 2, id_mercancia: 8, cantidad: 18, fecha_ingreso: '2026-10-14', estado: 'En Cuarentena' },
  { id_inventario: 9, id_bodega: 1, id_mercancia: 9, cantidad: 60, fecha_ingreso: '2026-10-16', estado: 'Liberado' },
  { id_inventario: 10, id_bodega: 4, id_mercancia: 10, cantidad: 950, fecha_ingreso: '2026-10-17', estado: 'Retenido' },
  { id_inventario: 11, id_bodega: 3, id_mercancia: 11, cantidad: 700, fecha_ingreso: '2026-10-18', estado: 'Liberado' },
  { id_inventario: 12, id_bodega: 5, id_mercancia: 12, cantidad: 600, fecha_ingreso: '2026-10-19', estado: 'Retenido' },
  { id_inventario: 13, id_bodega: 4, id_mercancia: 13, cantidad: 3, fecha_ingreso: '2026-10-20', estado: 'Retenido' },
  { id_inventario: 14, id_bodega: 2, id_mercancia: 14, cantidad: 220, fecha_ingreso: '2026-10-21', estado: 'Retenido' },
  { id_inventario: 15, id_bodega: 2, id_mercancia: 16, cantidad: 350, fecha_ingreso: '2026-10-22', estado: 'Liberado' },
  { id_inventario: 16, id_bodega: 1, id_mercancia: 1, cantidad: 40, fecha_ingreso: '2026-10-22', estado: 'Liberado' }
];

// 11. Movimientos de Inventario (Entrada / Salida / Traslado)
export const mockMovimientos = [
  { id_movimiento: 1, tipo: 'Entrada', fecha: '2026-10-03 08:30:00', cantidad: 120, id_mercancia: 1, id_bodega: 1, motivo: 'Recepción inicial descarga DUA-2026-0001' },
  { id_movimiento: 2, tipo: 'Traslado', fecha: '2026-10-04 14:15:00', cantidad: 40, id_mercancia: 1, id_bodega: 1, motivo: 'Traslado preventivo para aforo físico' },
  { id_movimiento: 3, tipo: 'Entrada', fecha: '2026-10-04 09:40:00', cantidad: 250, id_mercancia: 2, id_bodega: 2, motivo: 'Ingreso carga aérea DUA-2026-0002' },
  { id_movimiento: 4, tipo: 'Salida', fecha: '2026-10-05 16:20:00', cantidad: 100, id_mercancia: 2, id_bodega: 2, motivo: 'Despacho aduanero autorizado con levante' },
  { id_movimiento: 5, tipo: 'Entrada', fecha: '2026-10-06 11:00:00', cantidad: 8, id_mercancia: 3, id_bodega: 1, motivo: 'Descarga patio automotriz DUA-2026-0003' },
  { id_movimiento: 6, tipo: 'Salida', fecha: '2026-10-07 10:15:00', cantidad: 3, id_mercancia: 3, id_bodega: 1, motivo: 'Entrega parcial importador' },
  { id_movimiento: 7, tipo: 'Entrada', fecha: '2026-10-07 13:00:00', cantidad: 2500, id_mercancia: 4, id_bodega: 6, motivo: 'Ingreso cámara fría DUA-2026-0004' },
  { id_movimiento: 8, tipo: 'Salida', fecha: '2026-10-08 15:30:00', cantidad: 700, id_mercancia: 4, id_bodega: 6, motivo: 'Muestra a laboratorio de control fiscal' },
  { id_movimiento: 9, tipo: 'Entrada', fecha: '2026-10-09 08:00:00', cantidad: 600, id_mercancia: 5, id_bodega: 4, motivo: 'Almacenaje temporal DUA-2026-0005' },
  { id_movimiento: 10, tipo: 'Salida', fecha: '2026-10-10 17:00:00', cantidad: 150, id_mercancia: 5, id_bodega: 4, motivo: 'Retiro autorizado' },
  { id_movimiento: 11, tipo: 'Entrada', fecha: '2026-10-11 10:45:00', cantidad: 450, id_mercancia: 6, id_bodega: 5, motivo: 'Custodia fiscal DUA-2026-0006' },
  { id_movimiento: 12, tipo: 'Traslado', fecha: '2026-10-12 11:20:00', cantidad: 150, id_mercancia: 6, id_bodega: 5, motivo: 'Reubicación pasillo 4 a bodega 5' },
  { id_movimiento: 13, tipo: 'Entrada', fecha: '2026-10-12 14:00:00', cantidad: 300, id_mercancia: 7, id_bodega: 3, motivo: 'Recepción muelle limón' },
  { id_movimiento: 14, tipo: 'Salida', fecha: '2026-10-13 09:10:00', cantidad: 100, id_mercancia: 7, id_bodega: 3, motivo: 'Embarque a exportación' },
  { id_movimiento: 15, tipo: 'Entrada', fecha: '2026-10-14 16:40:00', cantidad: 25, id_mercancia: 8, id_bodega: 2, motivo: 'Ingreso equipo médico de alta precisión' },
  { id_movimiento: 16, tipo: 'Entrada', fecha: '2026-10-16 08:20:00', cantidad: 80, id_mercancia: 9, id_bodega: 1, motivo: 'Descarga grúa caldera' }
];

// 12. Funcionarios Aduaneros (Estructura Jerárquica con Supervisor)
export const mockFuncionarios = [
  { id_funcionario: 1, nombre: 'Ing. Carlos Alvarado Brenes', cargo: 'Director General de Aduanas', id_supervisor: null },
  { id_funcionario: 2, nombre: 'Licda. Xinia Montero Solano', cargo: 'Jefa de Operaciones Caldera', id_supervisor: 1 },
  { id_funcionario: 3, nombre: 'Lic. Guillermo Castro Vargas', cargo: 'Jefe de Operaciones Santamaría', id_supervisor: 1 },
  { id_funcionario: 4, nombre: 'Licda. Karen Salas Porras', cargo: 'Jefa de Fiscalización Portuaria Limón', id_supervisor: 1 },
  { id_funcionario: 5, nombre: 'Insp. Roberto Méndez Cordero', cargo: 'Aforador Técnico Especialista', id_supervisor: 2 },
  { id_funcionario: 6, nombre: 'Insp. Daniela Quirós Fallas', cargo: 'Inspectora de Carga General', id_supervisor: 2 },
  { id_funcionario: 7, nombre: 'Insp. Javier Mora Esquivel', cargo: 'Aforador Electrónica y Vehículos', id_supervisor: 3 },
  { id_funcionario: 8, nombre: 'Insp. Mariela Vega Jiménez', cargo: 'Inspectora Fito-Sanitaria y Química', id_supervisor: 3 },
  { id_funcionario: 9, nombre: 'Insp. Rolando Solano Morales', cargo: 'Auditor Fiscal Contenedores', id_supervisor: 4 },
  { id_funcionario: 10, nombre: 'Insp. Gabriela Núñez Chacón', cargo: 'Inspectora Documental DUA', id_supervisor: 4 },
  { id_funcionario: 11, nombre: 'Insp. Mauricio Peña Ureña', cargo: 'Inspector de Seguridad y Escáner', id_supervisor: 2 },
  { id_funcionario: 12, nombre: 'Insp. Viviana Rojas Delgado', cargo: 'Inspectora Auxiliar de Depósito', id_supervisor: 3 }
];

// 13. Inspecciones Físicas y Documentales
export const mockInspecciones = [
  { id_inspeccion: 1, fecha: '2026-10-03', resultado: 'Con Observaciones', observaciones: 'Discrepancia en el número de serie de 10 laptops. Retenidas hasta rectificación de factura.', id_declaracion: 1, id_funcionario: 5 },
  { id_inspeccion: 2, fecha: '2026-10-04', resultado: 'Aprobada', observaciones: 'Aforo documental y físico completado satisfactoriamente sin irregularidades.', id_declaracion: 2, id_funcionario: 7 },
  { id_inspeccion: 3, fecha: '2026-10-05', resultado: 'Con Observaciones', observaciones: 'Pendiente visto bueno del Ministerio de Salud para lote farmacológico.', id_declaracion: 3, id_funcionario: 8 },
  { id_inspeccion: 4, fecha: '2026-10-08', resultado: 'Aprobada', observaciones: 'Mercancía en tránsito internacional verificada con precinto intacto.', id_declaracion: 4, id_funcionario: 6 },
  { id_inspeccion: 5, fecha: '2026-10-10', resultado: 'Retenida', observaciones: 'Etiquetado no cumple con norma técnica centroamericana de origen textil.', id_declaracion: 5, id_funcionario: 9 },
  { id_inspeccion: 6, fecha: '2026-10-11', resultado: 'Aprobada', observaciones: 'Certificado de origen y sello de exportación validados.', id_declaracion: 6, id_funcionario: 10 },
  { id_inspeccion: 7, fecha: '2026-10-13', resultado: 'Aprobada', observaciones: 'Liquidación arancelaria comprobada. Se autoriza retiro previo pago.', id_declaracion: 7, id_funcionario: 7 },
  { id_inspeccion: 8, fecha: '2026-10-14', resultado: 'Con Observaciones', observaciones: 'Equipo médico requiere calibración técnica en almacén fiscal.', id_declaracion: 8, id_funcionario: 8 },
  { id_inspeccion: 9, fecha: '2026-10-15', resultado: 'Aprobada', observaciones: 'Varillas de acero con peso neto coincidente con manifiesto de carga.', id_declaracion: 9, id_funcionario: 5 },
  { id_inspeccion: 10, fecha: '2026-10-16', resultado: 'Con Observaciones', observaciones: 'Muestra enviada a laboratorio fiscal para certificar grado de pureza polimérica.', id_declaracion: 10, id_funcionario: 11 },
  { id_inspeccion: 11, fecha: '2026-10-17', resultado: 'Aprobada', observaciones: 'Inspección fitosanitaria de granos limpia y libre de plagas.', id_declaracion: 11, id_funcionario: 8 },
  { id_inspeccion: 12, fecha: '2026-10-18', resultado: 'Retenida', observaciones: 'Falta registro de marca de distribuidor autorizado para calzado italiano.', id_declaracion: 12, id_funcionario: 10 },
  { id_inspeccion: 13, fecha: '2026-10-19', resultado: 'Aprobada', observaciones: 'Número de chasis de maquinaria agrícola concuerda con DUA.', id_declaracion: 13, id_funcionario: 6 },
  { id_inspeccion: 14, fecha: '2026-10-20', resultado: 'Con Observaciones', observaciones: 'Cajas de herramientas con embalaje deteriorado. Inventario físico verificado.', id_declaracion: 14, id_funcionario: 11 },
  { id_inspeccion: 15, fecha: '2026-10-21', resultado: 'Aprobada', observaciones: 'Lote de tabletas revisado por escáner de alta densidad.', id_declaracion: 15, id_funcionario: 7 },
  { id_inspeccion: 16, fecha: '2026-10-22', resultado: 'Aprobada', observaciones: 'Contenedor liberado con semáforo verde en sistema aduanero.', id_declaracion: 16, id_funcionario: 9 }
];

// Consultas predefinidas del Laboratorio #3 para el Centro de Informes
export const mockConsultasLaboratorio = [
  {
    id: 1,
    titulo: 'Declaraciones registradas por mes y régimen',
    descripcion: 'Muestra el número total de DUAs emitidas agrupadas por mes y régimen aduanero (Importación, Tránsito, Depósito, Exportación).',
    sqlQuery: `SELECT TO_CHAR(fecha, 'YYYY-MM') AS mes, regimen, COUNT(*) AS total_declaraciones
FROM declaracion_aduanera
GROUP BY TO_CHAR(fecha, 'YYYY-MM'), regimen
ORDER BY mes DESC, total_declaraciones DESC;`
  },
  {
    id: 2,
    titulo: 'Mercancías retenidas en bodegas',
    descripcion: 'Lista todos los productos con estado Retenido en los almacenes fiscales, detallando bodega y cantidad en custodia.',
    sqlQuery: `SELECT b.nombre AS bodega, m.descripcion AS mercancia, cp.codigo_partida, ib.cantidad, ib.fecha_ingreso, ib.estado
FROM inventario_bodega ib
JOIN bodega b ON ib.id_bodega = b.id_bodega
JOIN mercancia m ON ib.id_mercancia = m.id_mercancia
JOIN categoria_partida cp ON m.id_categoria = cp.id_categoria
WHERE ib.estado = 'Retenido'
ORDER BY ib.cantidad DESC;`
  },
  {
    id: 3,
    titulo: 'Países de origen con mayor volumen de contenedores recibidos',
    descripcion: 'Identifica cuáles son las naciones de procedencia que concentran la mayor cantidad de contenedores ingresados.',
    sqlQuery: `SELECT p.nombre AS pais, p.codigo_iso, COUNT(c.id_contenedor) AS total_contenedores, SUM(c.peso) AS peso_total_kg
FROM pais p
JOIN declaracion_aduanera d ON p.id_pais = d.id_pais_origen
JOIN contenedor c ON d.id_declaracion = c.id_declaracion
GROUP BY p.nombre, p.codigo_iso
ORDER BY total_contenedores DESC;`
  },
  {
    id: 4,
    titulo: 'Ranking de importadores por valor total declarado',
    descripcion: 'Calcula el acumulado en valor declarado en USD por cada importador a través de las declaraciones registradas.',
    sqlQuery: `SELECT imp.nombre_razon_social, imp.nit_ruc, COUNT(DISTINCT d.id_declaracion) AS total_duas, SUM(dd.valor_declarado) AS valor_total_usd
FROM importador imp
JOIN declaracion_aduanera d ON imp.id_importador = d.id_importador
JOIN detalle_declaracion dd ON d.id_declaracion = dd.id_declaracion
GROUP BY imp.id_importador, imp.nombre_razon_social, imp.nit_ruc
ORDER BY valor_total_usd DESC;`
  },
  {
    id: 5,
    titulo: 'Inspecciones con observaciones o rechazos',
    descripcion: 'Reporte de fiscalización con actas no aprobadas, el funcionario responsable y las observaciones registradas.',
    sqlQuery: `SELECT i.fecha, d.numero_declaracion, i.resultado, f.nombre AS funcionario_inspector, f.cargo, i.observaciones
FROM inspeccion i
JOIN declaracion_aduanera d ON i.id_declaracion = d.id_declaracion
JOIN funcionario f ON i.id_funcionario = f.id_funcionario
WHERE i.resultado IN ('Con Observaciones', 'Retenida')
ORDER BY i.fecha DESC;`
  },
  {
    id: 6,
    titulo: 'Stock consolidado por producto en todas las bodegas',
    descripcion: 'Agrega las existencias actuales de cada mercancía sumando la totalidad de depósitos aduaneros.',
    sqlQuery: `SELECT m.descripcion, cp.codigo_partida, m.unidad_medida, SUM(ib.cantidad) AS stock_total,
       SUM(CASE WHEN ib.estado = 'Liberado' THEN ib.cantidad ELSE 0 END) AS stock_liberado,
       SUM(CASE WHEN ib.estado = 'Retenido' THEN ib.cantidad ELSE 0 END) AS stock_retenido
FROM mercancia m
JOIN categoria_partida cp ON m.id_categoria = cp.id_categoria
LEFT JOIN inventario_bodega ib ON m.id_mercancia = ib.id_mercancia
GROUP BY m.id_mercancia, m.descripcion, cp.codigo_partida, m.unidad_medida
ORDER BY stock_total DESC;`
  },
  {
    id: 7,
    titulo: 'Historial de movimientos de inventario por período y tipo',
    descripcion: 'Desglose cronológico de entradas, salidas y traslados de almacenes fiscales.',
    sqlQuery: `SELECT mi.fecha, mi.tipo, b.nombre AS bodega, m.descripcion AS producto, mi.cantidad, mi.motivo
FROM movimiento_inventario mi
JOIN bodega b ON mi.id_bodega = b.id_bodega
JOIN mercancia m ON mi.id_mercancia = m.id_mercancia
ORDER BY mi.fecha DESC;`
  },
  {
    id: 8,
    titulo: 'Eficiencia de agentes aduanales y régimen atendido',
    descripcion: 'Total de declaraciones gestionadas por cada agente aduanal autorizado.',
    sqlQuery: `SELECT a.nombre AS agente, a.licencia, COUNT(d.id_declaracion) AS total_tramites,
       SUM(CASE WHEN d.estado = 'Liberada' THEN 1 ELSE 0 END) AS duas_liberadas,
       SUM(CASE WHEN d.estado = 'Retenida' THEN 1 ELSE 0 END) AS duas_retenidas
FROM agente_aduanal a
LEFT JOIN declaracion_aduanera d ON a.id_agente = d.id_agente
GROUP BY a.id_agente, a.nombre, a.licencia
ORDER BY total_tramites DESC;`
  }
];
