/**
 * SERVICIO CENTRALIZADO DE API (REST + N8N)
 * Conexión con el backend Node/Express y fallback transparente a datos de demostración.
 */

import {
  mockPaises,
  mockImportadores,
  mockAgentes,
  mockCategorias,
  mockMercancias,
  mockDeclaraciones,
  mockDetalles,
  mockContenedores,
  mockBodegas,
  mockInventarioBodega,
  mockMovimientos,
  mockFuncionarios,
  mockInspecciones
} from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/aduanas-ai';

// Estado de la conexión
export const connectionStatus = {
  isLiveBackend: false,
  isPostgresConnected: false,
  isN8nLive: false,
  lastChecked: null
};

/**
 * Cliente HTTP seguro con timeout y fallback automático
 */
async function fetchWithFallback(endpoint, mockFallbackData, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error en servidor: HTTP ${response.status}`);
    }

    const data = await response.json();
    connectionStatus.isLiveBackend = true;
    connectionStatus.lastChecked = new Date().toISOString();
    return { data, isLive: true, error: null };
  } catch (err) {
    // Si la API no está en línea (Fase 1 o backend detenido), retornar datos de demostración
    connectionStatus.isLiveBackend = false;
    connectionStatus.lastChecked = new Date().toISOString();
    return {
      data: mockFallbackData,
      isLive: false,
      warning: `Usando datos locales de demostración (${err.message})`
    };
  }
}

export const apiService = {
  // Comprobación de salud de los servicios
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const json = await res.json();
        return {
          status: 'online',
          postgres: json.postgres || 'unknown',
          n8n: json.n8n || 'unknown',
          timestamp: new Date().toISOString()
        };
      }
    } catch {
      // Backend offline
    }
    return {
      status: 'offline',
      postgres: 'disconnected',
      n8n: 'unreachable',
      mode: 'Demostración Frontend',
      timestamp: new Date().toISOString()
    };
  },

  // Declaraciones Aduaneras (DUA)
  async getDeclaraciones() {
    return fetchWithFallback('/declaraciones', mockDeclaraciones);
  },

  async getDeclaracionById(id) {
    const fallback = mockDeclaraciones.find(d => d.id_declaracion === Number(id));
    return fetchWithFallback(`/declaraciones/${id}`, fallback);
  },

  // Mercancías y Productos
  async getMercancias() {
    return fetchWithFallback('/mercancias', mockMercancias);
  },

  // Categorías y Partidas Arancelarias
  async getCategorias() {
    return fetchWithFallback('/categorias', mockCategorias);
  },

  // Inventario y Stock en Bodegas
  async getInventario() {
    return fetchWithFallback('/inventario', mockInventarioBodega);
  },

  // Bodegas y Depósitos Fiscales
  async getBodegas() {
    return fetchWithFallback('/bodegas', mockBodegas);
  },

  // Movimientos de Inventario
  async getMovimientos() {
    return fetchWithFallback('/movimientos', mockMovimientos);
  },

  // Contenedores
  async getContenedores() {
    return fetchWithFallback('/contenedores', mockContenedores);
  },

  // Inspecciones Aduaneras
  async getInspecciones() {
    return fetchWithFallback('/inspecciones', mockInspecciones);
  },

  // Entidades auxiliares
  async getImportadores() {
    return fetchWithFallback('/importadores', mockImportadores);
  },

  async getAgentes() {
    return fetchWithFallback('/agentes', mockAgentes);
  },

  async getPaises() {
    return fetchWithFallback('/paises', mockPaises);
  },

  async getFuncionarios() {
    return fetchWithFallback('/funcionarios', mockFuncionarios);
  },

  async getDetallesDeclaracion() {
    return fetchWithFallback('/detalles', mockDetalles);
  },

  // Asistente de IA (vía API backend o directo webhook n8n)
  async askAIAssistant(prompt, conversationHistory = []) {
    try {
      // Primero intentar vía Backend `/api/ai/chat`
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: prompt, history: conversationHistory }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        return {
          answer: json.answer || json.response,
          sqlQuery: json.sqlQuery || null,
          data: json.data || null,
          source: 'Backend API + AI Agent'
        };
      }
    } catch {
      // Continuar a fallback
    }

    // Respuesta inteligente basada en el modelo aduanero para el Asistente en modo Frontend
    return simulateCustomsAI(prompt);
  }
};

/**
 * Motor de respuestas contextuales de demostración para el Asistente Aduanero
 * cuando la API backend aún no está encendida.
 */
function simulateCustomsAI(question) {
  const q = question.toLowerCase();

  if (q.includes('cuántas declaraciones') || q.includes('total de declaraciones') || q.includes('declaraciones registradas')) {
    return {
      answer: `Actualmente se encuentran registradas un total de **16 declaraciones aduaneras (DUA)** en el sistema, de las cuales 12 corresponden al régimen de Importación, 2 a Exportación, 1 a Tránsito Internacional y 1 a Depósito Fiscal.`,
      sqlQuery: `SELECT regimen, COUNT(*) AS total FROM declaracion_aduanera GROUP BY regimen;`,
      data: [
        { regimen: 'Importacion', total: 12 },
        { regimen: 'Exportacion', total: 2 },
        { regimen: 'Transito', total: 1 },
        { regimen: 'Deposito', total: 1 }
      ],
      source: 'Asistente de Demostración (Simulado)'
    };
  }

  if (q.includes('retenida') || q.includes('retenidas') || q.includes('mercancías retenidas')) {
    return {
      answer: `Existen **7 lotes de mercancías retenidas** en diferentes depósitos fiscales por motivos de aforo físico, falta de documentación o discrepancias arancelarias:\n- **Laptops Ultrabook 14"** (80 uds en Bodega Central Caldera)\n- **Vehículos Sedán Gasolina** (5 uds en Bodega Central Caldera)\n- **Camisetas de Algodón** (300 docenas en Bodega de Decomisos)\n- **Polietileno Lineal** (950 sacos en Almacén Fiscal La Uruca)\n- **Calzado Ejecutivo** (600 pares en Bodega de Decomisos)\n- **Maquinaria Agrícola** (3 unidades en Almacén La Uruca)\n- **Juegos de Herramientas** (220 sets en Depósito Santamaría)`,
      sqlQuery: `SELECT b.nombre AS bodega, m.descripcion, ib.cantidad, ib.estado
FROM inventario_bodega ib
JOIN bodega b ON ib.id_bodega = b.id_bodega
JOIN mercancia m ON ib.id_mercancia = m.id_mercancia
WHERE ib.estado = 'Retenido';`,
      source: 'Asistente de Demostración (Simulado)'
    };
  }

  if (q.includes('país') || q.includes('mas contenedores') || q.includes('más contenedores')) {
    return {
      answer: `El país de origen con mayor flujo de contenedores recibidos es **China (CN)**, seguido por **Estados Unidos (US)** y **Alemania (DE)**. La mayoría de contenedores transportan equipos electrónicos, repuestos automotrices y materias primas.`,
      sqlQuery: `SELECT p.nombre AS pais, COUNT(c.id_contenedor) AS total_contenedores
FROM pais p
JOIN declaracion_aduanera d ON p.id_pais = d.id_pais_origen
JOIN contenedor c ON d.id_declaracion = c.id_declaracion
GROUP BY p.nombre
ORDER BY total_contenedores DESC;`,
      source: 'Asistente de Demostración (Simulado)'
    };
  }

  if (q.includes('inspección') || q.includes('inspecciones') || q.includes('observaciones')) {
    return {
      answer: `Se registran **5 inspecciones con observaciones o retenciones**:\n1. **DUA-2026-0001**: Discrepancia en números de serie de laptops (Insp. Roberto Méndez).\n2. **DUA-2026-0003**: Pendiente autorización sanitaria (Insp. Mariela Vega).\n3. **DUA-2026-0005**: Incumplimiento de norma de etiquetado textil (Insp. Rolando Solano).\n4. **DUA-2026-0008**: Calibración técnica de equipo médico requerida (Insp. Mariela Vega).\n5. **DUA-2026-0012**: Falta de registro de marca de calzado (Insp. Gabriela Núñez).`,
      sqlQuery: `SELECT d.numero_declaracion, i.resultado, f.nombre, i.observaciones
FROM inspeccion i
JOIN declaracion_aduanera d ON i.id_declaracion = d.id_declaracion
JOIN funcionario f ON i.id_funcionario = f.id_funcionario
WHERE i.resultado IN ('Con Observaciones', 'Retenida');`,
      source: 'Asistente de Demostración (Simulado)'
    };
  }

  // Respuesta general de aduana
  return {
    answer: `He analizado la base de datos aduanera respecto a tu consulta ("${question}"). En el sistema se registran 16 declaraciones, 8 bodegas fiscales activas y un control estricto de existencias e inspecciones por funcionario asignado. Puedes consultar las tablas de declaraciones, bodegas o el centro de informes para visualizar los registros completos.`,
    sqlQuery: `SELECT COUNT(*) FROM declaracion_aduanera;`,
    source: 'Asistente de Demostración (Simulado)'
  };
}
