# Inventario Aduanero — Solución del Problema
### Sistema Integral de Gestión de Operaciones Aduaneras, Almacenes e Inteligencia Artificial

Aplicación full-stack corporativa desarrollada con **React 19 + Vite 8** en el frontend, **Node.js + Express** en el backend REST, **PostgreSQL 17** como motor relacional transaccional, y automatización con **n8n + Agente Gemini** para consultas en lenguaje natural con permisos de solo lectura.

Diseñada bajo una estética moderna y profesional con paleta en **blanco y rojo elegante (`#b91c1c`)**, texto oscuro de alto contraste y componentes modulares.

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

## Arquitectura General del Sistema

```text
┌────────────────────────────────────────────────────────┐
│               FRONTEND WEB (React 19 + Vite 8)         │
│  - 10 Vistas operativas y analíticas                   │
│  - CustomsContext + apiService                         │
│  - Indicador dinámico de estado en vivo                │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON (Port 5000)
                            ▼
┌────────────────────────────────────────────────────────┐
│             BACKEND REST (Node.js + Express)           │
│  - Pool de conexiones pg (pooling)                     │
│  - Rutas parametrizadas (Evita SQL Injection)          │
│  - Transacciones ACID (BEGIN...COMMIT en movimientos)  │
│  - Manejo centralizado de errores                      │
└─────────────┬──────────────────────────┬───────────────┘
              │                          │
              │ Pool Read/Write          │ Webhook HTTP
              ▼                          ▼
┌───────────────────────────┐  ┌───────────────────────────────────┐
│     POSTGRESQL 17         │  │             N8N ENGINE            │
│  Base: aduana             │  │  - Webhook /aduanas-ai             │
│  - 13 Tablas oficiales    │  │  - Agente IA (LangChain / Tools)  │
│  - Usuario admin/app      │  │  - Gemini LLM                      │
│  - Rol agente_aduanero_ro │◄─┤  - Tool PostgreSQL (Solo lectura)  │
│    (SELECT estricto)      │  └───────────────────────────────────┘
└───────────────────────────┘
```

---

## Estructura de Carpetas

```text
Inventario-Aduanero/
├── .env                       # Variables de entorno reales (excluido en .gitignore)
├── .env.example               # Plantilla segura de variables de entorno
├── .gitignore                 # Protección de dependencias y secretos (.env)
├── index.html                 # Punto de entrada con tipografía Plus Jakarta Sans
├── package.json               # Dependencias: React 19, Express, pg, dotenv, cors
├── vite.config.js             # Configuración de compilación Vite
├── dist/                      # Bundle de producción optimizado (0 errores)
├── database/
│   └── init_aduana.sql        # Script DDL + DML con las 13 tablas y datos del Laboratorio #3
├── workflow_n8n/
│   └── workflow_inventario_aduanero_gemini.json # Workflow exportado listo para n8n
├── server/                    # Servidor Backend REST (Fase 3)
│   ├── index.js               # Entrada de la API Express con CORS y prefijo /api
│   ├── config/
│   │   └── db.js              # Pool de conexiones a PostgreSQL y pool de solo lectura
│   └── routes/
│       ├── health.js          # GET /api/health (estado de API, PG y n8n)
│       ├── declaraciones.js   # CRUD y cambio de estado de DUAs
│       ├── mercancias.js      # Catálogo de productos y cálculo arancelario
│       ├── categorias.js      # Partidas arancelarias
│       ├── inventario.js      # Existencias por bodega fiscal
│       ├── movimientos.js     # Entradas/Salidas con ajuste transaccional de stock
│       ├── bodegas.js         # Depósitos y cálculo real de ocupación
│       ├── contenedores.js    # Unidades de carga y peso acumulado
│       ├── inspecciones.js    # Actas de aforo y funcionarios
│       ├── entidades.js       # Importadores, Agentes, Países y Funcionarios
│       ├── informes.js        # Las 8 Consultas analíticas reales en PostgreSQL
│       └── ai.js              # Enrutador inteligente con n8n y agente PostgreSQL RO
└── src/                       # Frontend SPA (Fases 1, 2 y 3)
    ├── main.jsx               # Renderizado del root
    ├── App.jsx                # Enrutador BrowserRouter y CustomsProvider
    ├── App.css                # Micro-animaciones y utilidades de tablas
    ├── index.css              # Sistema de diseño (paleta blanco y rojo elegante)
    ├── context/
    │   └── CustomsContext.jsx # Estado global, sincronización con API y toasts
    ├── services/
    │   └── api.js             # Cliente API con endpoints reales a PostgreSQL
    ├── data/
    │   └── mockData.js        # Estructura y datos de referencia del laboratorio
    ├── components/
    │   └── common/
    │       ├── Navbar.jsx     # Encabezado con estado dinámico ("API Activa")
    │       ├── Sidebar.jsx    # Navegación con badges contadores y branding
    │       ├── StatCard.jsx   # Tarjetas métricas (KPIs)
    │       ├── Badge.jsx      # Etiquetas de estado aduanero (Retenido, Liberado, etc.)
    │       ├── Modal.jsx      # Modales accesibles para detalles y formularios
    │       └── Toast.jsx      # Notificaciones flotantes de retroalimentación
    ├── pages/
    │   ├── DashboardPage.jsx    # Panel principal con KPIs reales de PostgreSQL
    │   ├── DeclaracionesPage.jsx# Gestión de DUAs con persistencia y cambio de estado
    │   ├── MercanciasPage.jsx   # Catálogo clasificado con cálculo de aranceles
    │   ├── InventarioPage.jsx   # Existencias vs Historial de movimientos
    │   ├── BodegasPage.jsx      # Almacenes, capacidad y ocupación calculada
    │   ├── ContenedoresPage.jsx # Unidades de carga asociadas a DUAs
    │   ├── InspeccionesPage.jsx # Actas de aforo físico y funcionarios
    │   ├── EntidadesPage.jsx    # Directorio (Importadores, Agentes, Países, Funcionarios)
    │   ├── InformesPage.jsx     # Ejecución y visor en vivo de las 8 consultas SQL
    │   ├── AsistenteIAPage.jsx  # Chat de IA conectado al backend y PostgreSQL
    │   └── ConfiguracionPage.jsx# Diagnóstico de enlaces (Frontend, API, PG, n8n)
    └── routes/
        └── AppRoutes.jsx      # Definición de las 10 rutas de la aplicación
```

---

## Fase 2 — Base de Datos PostgreSQL

### 1. Configuración de la Base de Datos
- **Instalación:** PostgreSQL 17 local en el puerto `5432`.
- **Base de datos:** `aduana` (creada y vinculada a la conexión guardada como `Aduana` en pgAdmin).
- **Esquema:** 13 tablas normalizadas respetando todas las llaves primarias, foráneas, restricciones `CHECK`, índices y relaciones jerárquicas.
- **Datos iniciales:** Poblada con los registros oficiales del Laboratorio #3 (más de 15 registros por tabla, asegurando integridad referencial en cascada).

### 2. Seguridad y Permisos del Agente de IA
Para garantizar que el Agente de Inteligencia Artificial (n8n / Gemini) no pueda ejecutar operaciones destructivas (`DROP`, `DELETE`, `TRUNCATE`, `ALTER`), se configuró un rol de base de datos específico con permisos mínimos:

```sql
-- Creación del rol de solo lectura para el Asistente de IA
CREATE ROLE agente_aduanero_ro WITH LOGIN PASSWORD 'AduanaAgent2026_SecureRO';
GRANT CONNECT ON DATABASE aduana TO agente_aduanero_ro;
GRANT USAGE ON SCHEMA public TO agente_aduanero_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO agente_aduanero_ro;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO agente_aduanero_ro;
```

**Verificación de Seguridad:** Se comprobó mediante pruebas de inyección y permisos que cualquier intento de `INSERT`, `UPDATE` o `DROP` por parte de este rol es rechazado inmediatamente con error `42501 (permission denied)`.

---

## Fase 3 — Backend REST

El backend fue desarrollado modularmente en **Node.js** con **Express 5** y el driver nativo **`pg`**.

### Endpoints Principales

| Método | Endpoint | Descripción | Persistencia |
|---|---|---|---|
| `GET` | `/api/health` | Estado del servidor, conexión a PostgreSQL y estado de n8n | Solo lectura |
| `GET` | `/api/declaraciones` | Listado de DUAs con importador, agente y país | Solo lectura |
| `GET` | `/api/declaraciones/:id` | Detalle íntegro de la DUA con contenedor e inspección | Solo lectura |
| `POST` | `/api/declaraciones` | Creación de nueva DUA con validaciones de claves foráneas | `INSERT` en PostgreSQL |
| `PATCH` | `/api/declaraciones/:id/estado` | Cambio de estado de DUA (`Liberada`, `Retenida`, etc.) | `UPDATE` en PostgreSQL |
| `GET` | `/api/mercancias` | Catálogo de mercancías con su partida arancelaria | Solo lectura |
| `POST` | `/api/mercancias` | Creación de nueva mercancía | `INSERT` en PostgreSQL |
| `GET` | `/api/categorias` | Partidas arancelarias y porcentaje de arancel | Solo lectura |
| `GET` | `/api/inventario` | Existencias actuales en bodegas con estado de custodia | Solo lectura |
| `GET` | `/api/movimientos` | Historial cronológico de movimientos de inventario | Solo lectura |
| `POST` | `/api/movimientos` | Registro de movimiento con ajuste automático de stock | Transacción `BEGIN...COMMIT` |
| `GET` | `/api/bodegas` | Almacenes con ocupación calculada dinámicamente | Solo lectura |
| `GET` | `/api/contenedores` | Unidades de carga asociadas a declaraciones | Solo lectura |
| `GET` | `/api/inspecciones` | Actas de inspección física y funcionarios | Solo lectura |
| `POST` | `/api/inspecciones` | Registro de nueva acta de inspección | `INSERT` en PostgreSQL |
| `GET` | `/api/entidades/importadores` | Catálogo de importadores y exportadores | Solo lectura |
| `GET` | `/api/entidades/agentes` | Catálogo de agentes aduanales con licencia | Solo lectura |
| `GET` | `/api/entidades/paises` | Países con código ISO | Solo lectura |
| `GET` | `/api/entidades/funcionarios`| Padrón oficial con supervisor jerárquico | Solo lectura |
| `GET` | `/api/informes/:id` | Ejecución real de las 8 consultas analíticas (1 a 8) | Solo lectura |
| `POST` | `/api/ai/chat` | Enrutamiento de consultas en lenguaje natural | n8n / PostgreSQL RO |

---

## Las 8 Consultas Analíticas del Negocio (Laboratorio #3)

Las 8 consultas analíticas requeridas por el laboratorio se ejecutan directamente contra PostgreSQL mediante endpoints dedicados en `/api/informes/:id`:

1. **Declaraciones por mes y régimen:** Agrupación cronológica mediante `TO_CHAR(fecha, 'YYYY-MM')` y conteo de DUAs.
2. **Mercancías retenidas en bodegas:** Cruce entre `inventario_bodega`, `bodega`, `mercancia` y `categoria_partida` con filtro `WHERE estado = 'Retenido'`.
3. **Países con mayor volumen de contenedores:** Cruce de `pais`, `declaracion_aduanera` y `contenedor` con sumatoria de peso bruto (`peso_total_kg`).
4. **Ranking de importadores por valor total:** Cruce entre `importador`, `declaracion_aduanera` y `detalle_declaracion` ordenado descendente por `SUM(valor_declarado)`.
5. **Inspecciones con observaciones o rechazos:** Filtro por estados `Con Observaciones` o `Retenida`, detallando el funcionario y sus hallazgos.
6. **Stock consolidado por producto en todas las bodegas:** Cálculo de existencias totales, discriminando existencias en estado `Liberado` y `Retenido`.
7. **Historial de movimientos por período y tipo:** Trazabilidad completa con fecha, tipo (`Entrada`, `Salida`, `Traslado`), bodega y motivo.
8. **Eficiencia de agentes aduanales:** Conteo total de trámites gestionados, segregando DUAs liberadas y retenidas.

La página de **Informes y Consultas (`/informes`)** muestra la sentencia SQL ejecutada, la tabla de resultados en vivo y permite la exportación instantánea a archivo CSV.

---

## Automatización con n8n y Gemini

### 1. Archivo del Workflow
El workflow fue diseñado y exportado en:
📁 `workflow_n8n/workflow_inventario_aduanero_gemini.json`

Además, fue registrado directamente en la base de datos de n8n (`$env:USERPROFILE\.n8n\database.sqlite`) bajo el identificador **`AduanaGemini2026`**.

### 2. Estructura del Workflow
- **Nodo Webhook (`POST /webhook/aduanas-ai`):** Recibe la pregunta `{ question, history }` desde el backend.
- **Nodo AI Agent:** Orquestador de razonamiento basado en LangChain.
- **Nodo Google Gemini Chat Model:** Modelo configurado (`gemini-1.5-flash` o `gemini-pro`).
- **Nodo PostgreSQL Tool:** Herramienta conectada a la base de datos `aduana` utilizando exclusivamente el rol de solo lectura `agente_aduanero_ro`.
- **Nodo Respond to Webhook:** Devuelve la respuesta en formato estructurado:
  ```json
  {
    "answer": "Respuesta en lenguaje natural...",
    "sqlQuery": "SELECT ...",
    "source": "n8n + Gemini AI Agent (PostgreSQL)"
  }
  ```

### 3. Cómo Activar el Workflow en n8n
1. Inicia n8n en tu terminal:
   ```bash
   npx n8n
   ```
2. Abre en tu navegador `http://localhost:5678`.
3. Si el workflow `AduanaGemini2026` ya aparece en tu lista, ábrelo. De lo contrario, haz clic en **Add workflow** > **Import from File...** y selecciona `workflow_n8n/workflow_inventario_aduanero_gemini.json`.
4. En el nodo **Google Gemini Model**, asocia tu credencial de Gemini (o agrégala si no la tienes creada).
5. En el nodo **PostgreSQL Tool**, verifica que las credenciales apunten a `localhost:5432`, base `aduana`, usuario `agente_aduanero_ro`.
6. Haz clic en **Publish / Active** (arriba a la derecha) para dejar el webhook escuchando.

---

## Guía de Ejecución del Sistema

### 1. Requisitos
- **Node.js** (v18 o superior).
- **PostgreSQL 17** activo en el puerto 5432.

### 2. Configurar Variables de Entorno
Verifica que el archivo `.env` en la raíz del proyecto contenga las variables correctas (ver `.env.example`).

### 3. Iniciar el Backend REST
Abre una terminal en `Inventario-Aduanero`:
```bash
npm run server
```
El servidor responderá en `http://localhost:5000`. Puedes verificar su salud en `http://localhost:5000/api/health`.

### 4. Iniciar el Frontend Web
En otra terminal en `Inventario-Aduanero`:
```bash
npm run dev
```
Abre la URL proporcionada por Vite (por ejemplo `http://localhost:5173/` o `http://localhost:5174/`).

En la barra superior, verás la insignia verde **"API Activa"**, confirmando que el frontend está conectado a PostgreSQL a través de la API.

---

## Pruebas y Verificaciones Realizadas

1. **PostgreSQL:**
   - Creación de la base de datos `aduana` completada.
   - 13 tablas creadas con llaves primarias, foráneas y restricciones.
   - 195 registros totales cargados del Laboratorio #3.
   - Creación y verificación del rol de solo lectura `agente_aduanero_ro`.
2. **Backend REST:**
   - Servidor Express iniciado y respondiendo en el puerto 5000.
   - Pool de conexiones `pg` verificado con reconexión automática.
   - Las 8 consultas analíticas probadas con resultados exitosos.
   - Transacción ACID de inventario verificada (creación de movimiento y descuento de stock simultáneo).
   - Actualización de estado de DUA persistida en PostgreSQL.
3. **Frontend:**
   - Compilación de producción (`npm run build`) validada con **0 errores**.
   - Conexión reactiva del estado global `CustomsContext` con la API.
   - Pruebas en navegador de Dashboard, Declaraciones, Informes y Asistente IA.
   - Exportación de informes en formato CSV funcionando.
