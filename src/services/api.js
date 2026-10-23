/**
 * SERVICIO CENTRALIZADO DE API (REST + POSTGRESQL + N8N)
 * Conexión directa con el backend Express y soporte de desarrollo local.
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

// Estado de la conexión
export const connectionStatus = {
  isLiveBackend: false,
  isPostgresConnected: false,
  isN8nLive: false,
  lastChecked: null,
  error: null
};

/**
 * Cliente HTTP para comunicarse con la API REST de PostgreSQL
 */
async function apiRequest(endpoint, mockFallbackData, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

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
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    connectionStatus.isLiveBackend = true;
    connectionStatus.isPostgresConnected = true;
    connectionStatus.lastChecked = new Date().toISOString();
    connectionStatus.error = null;
    return { data, isLive: true, error: null };
  } catch (err) {
    connectionStatus.isLiveBackend = false;
    connectionStatus.lastChecked = new Date().toISOString();
    connectionStatus.error = err.message;

    // Retorna datos de fallback pero señalando explícitamente el estado offline
    return {
      data: mockFallbackData,
      isLive: false,
      error: err.message
    };
  }
}

export const apiService = {
  // Comprobación de salud de los servicios
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const json = await res.json();
        connectionStatus.isLiveBackend = true;
        connectionStatus.isPostgresConnected = json.postgres === 'connected';
        return {
          status: 'online',
          postgres: json.postgres || 'connected',
          database: json.database || 'aduana',
          n8n: json.n8n || 'unreachable',
          timestamp: json.timestamp || new Date().toISOString()
        };
      }
    } catch {
      // Backend desconectado
    }
    return {
      status: 'offline',
      postgres: 'disconnected',
      database: 'aduana',
      n8n: 'unreachable',
      mode: 'Demostración Local (Backend Inactivo)',
      timestamp: new Date().toISOString()
    };
  },

  // Declaraciones Aduaneras (DUA)
  async getDeclaraciones() {
    return apiRequest('/declaraciones', mockDeclaraciones);
  },

  async getDeclaracionById(id) {
    const fallback = mockDeclaraciones.find(d => d.id_declaracion === Number(id));
    return apiRequest(`/declaraciones/${id}`, fallback);
  },

  async createDeclaracion(duaData) {
    return apiRequest('/declaraciones', null, {
      method: 'POST',
      body: JSON.stringify(duaData)
    });
  },

  async updateDeclaracionEstado(id, nuevoEstado) {
    return apiRequest(`/declaraciones/${id}/estado`, null, {
      method: 'PATCH',
      body: JSON.stringify({ estado: nuevoEstado })
    });
  },

  // Mercancías y Productos
  async getMercancias() {
    return apiRequest('/mercancias', mockMercancias);
  },

  async createMercancia(mercData) {
    return apiRequest('/mercancias', null, {
      method: 'POST',
      body: JSON.stringify(mercData)
    });
  },

  // Categorías y Partidas Arancelarias
  async getCategorias() {
    return apiRequest('/categorias', mockCategorias);
  },

  // Inventario y Stock en Bodegas
  async getInventario() {
    return apiRequest('/inventario', mockInventarioBodega);
  },

  // Bodegas y Depósitos Fiscales
  async getBodegas() {
    return apiRequest('/bodegas', mockBodegas);
  },

  // Movimientos de Inventario
  async getMovimientos() {
    return apiRequest('/movimientos', mockMovimientos);
  },

  async createMovimiento(movData) {
    return apiRequest('/movimientos', null, {
      method: 'POST',
      body: JSON.stringify(movData)
    });
  },

  // Contenedores
  async getContenedores() {
    return apiRequest('/contenedores', mockContenedores);
  },

  // Inspecciones Aduaneras
  async getInspecciones() {
    return apiRequest('/inspecciones', mockInspecciones);
  },

  async createInspeccion(inspData) {
    return apiRequest('/inspecciones', null, {
      method: 'POST',
      body: JSON.stringify(inspData)
    });
  },

  // Entidades auxiliares
  async getImportadores() {
    return apiRequest('/entidades/importadores', mockImportadores);
  },

  async getAgentes() {
    return apiRequest('/entidades/agentes', mockAgentes);
  },

  async getPaises() {
    return apiRequest('/entidades/paises', mockPaises);
  },

  async getFuncionarios() {
    return apiRequest('/entidades/funcionarios', mockFuncionarios);
  },

  // Consultas analíticas SQL reales (1 a 8)
  async getInforme(id) {
    return apiRequest(`/informes/${id}`, null);
  },

  // Asistente de IA (vía API backend / n8n / PostgreSQL de solo lectura)
  async askAIAssistant(prompt, conversationHistory = []) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

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
          source: json.source || 'Backend API + Agente PostgreSQL'
        };
      }
    } catch {
      // Backend no disponible
    }

    // Fallback documentado para entorno sin backend
    return {
      answer: `El servicio de backend no se encuentra disponible actualmente. Verifica que la API de Node.js esté iniciada en http://localhost:5000 para procesar tu consulta.`,
      sqlQuery: null,
      source: 'Aviso de Desconexión'
    };
  }
};
