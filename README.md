# Inventario Aduanero — Solución del Problema
### Sistema Integral de Gestión de Operaciones Aduaneras, Almacenes e Inteligencia Artificial

Aplicación web administrativa desarrollada con **React 19 + Vite 8**, diseñada bajo una estética moderna y profesional con paleta en **blanco y rojo elegante (`#b91c1c`)**, texto oscuro de alto contraste y componentes modulares.

El sistema modela fielmente las **13 entidades relacionales** y las reglas del negocio establecidas en los requerimientos del **Laboratorio #3 (Sistema de Inventario Aduanero)**:

1. **`pais`** (Países de origen y tránsito con código ISO)
2. **`importador`** (Importadores y exportadores con NIT/RUC, razón social y contactos)
3. **`agente_aduanal`** (Agentes fiscales autorizados con código de licencia)
4. **`categoria_partida`** (Partidas del Sistema Armonizado y porcentajes de arancel)
5. **`mercancia`** (Catálogo de productos, unidades de medida y valor unitario FOB)
6. **`declaracion_aduanera`** (DUA con régimen, fecha, importador, agente y estado)
7. **`detalle_declaracion`** (Tabla intermedia N:M con cantidades y valores declarados)
8. **`contenedor`** (Unidades de carga marítima/terrestre con tipo, peso y DUA)
9. **`bodega`** (Almacenes y depósitos fiscales con ubicación y capacidad)
10. **`inventario_bodega`** (Custodia de existencias con estado Retenido vs Liberado)
11. **`movimiento_inventario`** (Trazabilidad estricta de Entradas, Salidas y Traslados)
12. **`funcionario`** (Padrón de oficiales con jerarquía recursiva de supervisión)
13. **`inspeccion`** (Actas de aforo físico/documental con resultados y observaciones)

---

## Estructura del Proyecto

```text
Inventario-Aduanero/
├── .env.example               # Plantilla segura de variables de entorno
├── .gitignore                  # Protección de dependencias y archivos .env
├── index.html                 # Punto de entrada con tipografía Plus Jakarta Sans
├── package.json               # Dependencias: React 19, React Router 7, Lucide React
├── vite.config.js             # Configuración de compilación Vite
├── dist/                      # Bundle de producción optimizado (0 errores)
└── src/
    ├── main.jsx               # Renderizado del root
    ├── App.jsx                # Enrutador BrowserRouter y CustomsProvider
    ├── App.css                # Micro-animaciones y utilidades de tablas
    ├── index.css              # Sistema de diseño (paleta rojo elegante y layout)
    ├── context/
    │   └── CustomsContext.jsx # Estado global, operaciones de negocio y toasts
    ├── services/
    │   └── api.js             # Cliente API con fallback transparente a datos demo
    ├── data/
    │   └── mockData.js        # Datos de prueba realistas para las 13 entidades
    ├── components/
    │   └── common/
    │       ├── Navbar.jsx     # Encabezado con estado de conexión y accesos rápidos
    │       ├── Sidebar.jsx    # Navegación con badges contadores y branding
    │       ├── StatCard.jsx   # Tarjetas métricas (KPIs)
    │       ├── Badge.jsx      # Etiquetas de estado aduanero (Retenido, Liberado, etc.)
    │       ├── Modal.jsx      # Modales accesibles para detalles y formularios
    │       └── Toast.jsx      # Notificaciones flotantes de retroalimentación
    ├── pages/
    │   ├── DashboardPage.jsx    # Panel principal con KPIs, resumen y accesos
    │   ├── DeclaracionesPage.jsx# Gestión de DUAs, filtros, detalle modal y registro
    │   ├── MercanciasPage.jsx   # Catálogo clasificado con cálculo de aranceles
    │   ├── InventarioPage.jsx   # Control de existencias vs historial de movimientos
    │   ├── BodegasPage.jsx      # Almacenes, capacidad y ocupación
    │   ├── ContenedoresPage.jsx # Unidades de carga asociadas a DUAs
    │   ├── InspeccionesPage.jsx # Actas de aforo físico y funcionarios
    │   ├── EntidadesPage.jsx    # Directorio (Importadores, Agentes, Países, Funcionarios)
    │   ├── InformesPage.jsx     # 8 Consultas analíticas SQL del laboratorio con visor
    │   ├── AsistenteIAPage.jsx  # Chat aduanero interactivo con sugerencias y traza SQL
    │   └── ConfiguracionPage.jsx# Monitor de salud de API, PostgreSQL, n8n y variables
    └── routes/
        └── AppRoutes.jsx      # Definición de las 10 rutas de la aplicación
```

---

## Cómo Iniciar la Aplicación

### 1. Requisitos Previos
- **Node.js** (v18 o superior, se comprobó v24.13.0).
- **npm** (v9 o superior).

### 2. Instalación de Dependencias
Si clonas o abres el proyecto por primera vez:
```bash
npm install
```

### 3. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
La aplicación arrancará inmediatamente en:
👉 `http://localhost:5173/` (o el puerto disponible que asigne Vite, por ejemplo `http://localhost:5174/`).

### 4. Compilar para Producción
Para validar que no existan errores de sintaxis ni dependencias rotas:
```bash
npm run build
```

---

## Vistas Implementadas (Fase 1)

1. **Inicio / Panel Principal (`/`)**:
   - 4 Tarjetas KPI: Total de DUAs, Existencias en Bodegas, Contenedores Activos y Bodegas Fiscales.
   - Alerta destacada cuando existen declaraciones retenidas.
   - Listado de declaraciones recientes con insignias de estado.
   - Monitor de inspecciones con observaciones técnicas.
   - Barras de capacidad y ocupación por depósito fiscal.
   - Accesos directos a los módulos esenciales.

2. **Declaraciones Aduaneras DUA (`/declaraciones`)**:
   - Listado paginado de declaraciones con buscador en tiempo real.
   - Filtros combinados por Régimen (*Importación, Exportación, Tránsito, Depósito*) y por Estado (*Retenida, En Inspección, Liberada, Pendiente Pago*).
   - **Modal de Detalle Completo**: Despliega importador (con NIT), agente aduanal (con licencia), país de origen (código ISO), líneas de mercancías con valor FOB, contenedor asignado y resultado de inspección física.
   - Botones operativos para **Autorizar Levante (Liberar)** o **Retener** con notificación toast reactiva.
   - Formulario controlado para registrar una nueva DUA con validaciones de campos.

3. **Mercancías y Productos (`/mercancias`)**:
   - Catálogo clasificado por partida arancelaria (Sistema Armonizado).
   - Cálculo automático en tiempo real del arancel estimado en base a la tasa arancelaria y valor unitario.
   - Formulario modal para registrar nuevas mercancías.

4. **Inventario y Almacenes (`/inventario`)**:
   - **Separación arquitectónica estricta** requerida por las reglas de negocio:
     - **Pestaña 1 (Existencias Actuales / Stock)**: Muestra la mercancía custodiada en cada bodega con su estado (*Retenido, Liberado, En Cuarentena*).
     - **Pestaña 2 (Historial de Movimientos)**: Registro cronológico de Entradas, Salidas y Traslados con motivos operativos.
   - Formulario para registrar movimientos que actualiza reactivamente el stock disponible.

5. **Bodegas y Depósitos Fiscales (`/bodegas`)**:
   - Monitoreo de depósitos marítimos, aéreos y fronterizos.
   - Indicadores visuales de capacidad máxima vs ocupada y listado de lotes en custodia.

6. **Contenedores (`/contenedores`)**:
   - Control de unidades de carga marítima y terrestre (*Dry 20ft, Dry 40ft, High Cube, Reefer*).
   - Pesaje en kilogramos y vinculación directa con la DUA de importación.

7. **Inspecciones y Aforos (`/inspecciones`)**:
   - Registro de actas de inspección física con dictámenes de semáforo fiscal (*Aprobada, Con Observaciones, Retenida*).
   - Funcionario inspector actuante y observaciones de hallazgos.

8. **Directorio Aduanero (`/entidades`)**:
   - Padrón organizado en pestañas para Importadores/Exportadores, Agentes Aduanales con licencia, Países y Funcionarios Oficiales con supervisión jerárquica.

9. **Consultas e Informes del Negocio (`/informes`)**:
   - Ejecución interactiva de las **8 consultas SQL del Laboratorio #3**:
     1. Declaraciones por mes y régimen.
     2. Mercancías retenidas en bodegas.
     3. Países con mayor volumen de contenedores.
     4. Ranking de importadores por valor total declarado.
     5. Inspecciones con observaciones o rechazos.
     6. Stock consolidado por producto en todas las bodegas.
     7. Historial de movimientos de inventario por período.
     8. Eficiencia de agentes aduanales.
   - Visor de código SQL en sintaxis PostgreSQL con botón de copiado al portapapeles y exportación a CSV.

10. **Asistente de IA Aduanero (`/asistente`)**:
    - Interfaz de chat interactiva integrada.
    - Sugerencias rápidas basadas en preguntas frecuentes del laboratorio.
    - Indicador visual de consulta en proceso y tarjeta de traza SQL que muestra la sentencia ejecutada.

11. **Configuración y Diagnóstico (`/configuracion`)**:
    - Monitor de enlaces para Frontend, API REST, PostgreSQL y n8n.
    - Guía de variables de entorno y mapeo de las 13 entidades del modelo.

---

## Separación de Datos de Demostración y Preparación de API

- En esta Fase 1, la aplicación utiliza el módulo `src/data/mockData.js`, el cual contiene más de 15 registros coherentes y realistas por entidad, respetando claves foráneas y restricciones.
- El servicio `src/services/api.js` está configurado con **fallback automático**: intenta conectarse al backend en `http://localhost:5000/api` y, al no estar en ejecución todavía, conmuta de forma segura a los datos locales sin romper la interfaz.
- Cuando en las Fases 2 y 3 se levante la API Express con PostgreSQL, el frontend se conectará de manera transparente sin necesidad de refactorizar las vistas.
