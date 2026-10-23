import React, { useState, useEffect } from 'react';
import {
  Settings,
  Server,
  Database,
  Bot,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Code2,
  Shield,
  Layers,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { apiService } from '../services/api';
import { useCustoms } from '../context/CustomsContext';

export default function ConfiguracionPage() {
  const { isLiveBackend, refreshData } = useCustoms();
  const [checking, setChecking] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);

  const performHealthCheck = async () => {
    setChecking(true);
    const result = await apiService.checkHealth();
    setHealthStatus(result);
    setChecking(false);
  };

  useEffect(() => {
    performHealthCheck();
  }, []);

  const components = [
    {
      name: 'Frontend Web (React + Vite)',
      type: 'Cliente SPA',
      status: 'online',
      description: 'Interfaz administrativa con identidad rojo elegante, sistema de diseño, 10 vistas y enrutador React Router.',
      details: 'Vite 8 · React 19 · Lucide React'
    },
    {
      name: 'API Backend (Node.js / Express)',
      type: 'Servidor REST',
      status: isLiveBackend ? 'online' : 'offline',
      description: isLiveBackend
        ? 'Servidor API respondiendo en puerto configurado con pool pg y rutas normalizadas.'
        : 'Backend en espera para Fase 2/3. El frontend funciona actualmente en modo demostración local seguro.',
      details: 'Puerto sugerido: 5000 · CORS habilitado'
    },
    {
      name: 'Base de Datos (PostgreSQL 17)',
      type: 'SGBD Relacional',
      status: isLiveBackend ? 'online' : 'standby',
      description: 'Esquema relacional de 13 tablas (DUA, Mercancías, Bodegas, Contenedores, Inspecciones, etc.) conforme a Laboratorio #3.',
      details: 'Servidor local PostgreSQL · Puerto 5432'
    },
    {
      name: 'Automatización & Agente IA (n8n)',
      type: 'Workflow Engine',
      status: 'standby',
      description: 'Flujo con nodo Webhook, AI Agent y LLM (Gemini / DeepSeek) para consultas aduaneras en lenguaje natural.',
      details: 'Puerto estándar: 5678 · Webhook /aduanas-ai'
    }
  ];

  return (
    <div className="fade-in">
      {/* Botón de Diagnóstico */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-main)' }}>
            Monitor de Conectividad y Arquitectura de la Solución
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
            Supervisa el estado de enlace entre Frontend, Backend REST, PostgreSQL y n8n sin exponer credenciales.
          </div>
        </div>

        <button
          onClick={performHealthCheck}
          className="btn btn-secondary btn-sm"
          disabled={checking}
        >
          <RefreshCw size={14} className={checking ? 'spin-animation' : ''} />
          <span>{checking ? 'Comprobando...' : 'Comprobar Enlaces'}</span>
        </button>
      </div>

      {/* Grid de Estado de Componentes */}
      <div className="kpi-grid" style={{ marginBottom: 28 }}>
        {components.map((comp, idx) => {
          const isOnline = comp.status === 'online';
          const isStandby = comp.status === 'standby';

          return (
            <div key={idx} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                  {comp.type}
                </span>
                <span
                  className="badge"
                  style={{
                    backgroundColor: isOnline ? 'var(--status-success-bg)' : isStandby ? '#fffbeb' : 'var(--status-danger-bg)',
                    color: isOnline ? 'var(--status-success)' : isStandby ? '#b45309' : 'var(--status-danger)',
                    borderColor: isOnline ? 'var(--status-success-border)' : isStandby ? '#fde68a' : 'var(--status-danger-border)'
                  }}
                >
                  {isOnline ? <CheckCircle2 size={12} /> : isStandby ? <AlertTriangle size={12} /> : <XCircle size={12} />}
                  <span>{isOnline ? 'En Línea' : isStandby ? 'Preparado / Fase Sig.' : 'Desconectado'}</span>
                </span>
              </div>

              <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text-main)', marginBottom: 6 }}>
                {comp.name}
              </div>

              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: 12 }}>
                {comp.description}
              </div>

              <div style={{ fontSize: 11.5, color: 'var(--text-subtle)', borderTop: '1px solid var(--border-subtle)', paddingTop: 10, fontFamily: 'var(--font-mono)' }}>
                {comp.details}
              </div>
            </div>
          );
        })}
      </div>

      {/* Arquitectura Técnica y Configuración de Entorno */}
      <div className="grid-2">
        {/* Variables de Entorno (Plantilla segura sin secretos) */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title" style={{ fontSize: 15 }}>
                <Code2 size={17} style={{ color: 'var(--primary)' }} />
                <span>Configuración de Variables de Entorno (.env)</span>
              </div>
              <div className="card-subtitle">Estructura preparada para la conexión en fases 2 y 3</div>
            </div>
          </div>

          <div style={{ padding: 18 }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
              Las siguientes variables están centralizadas en el servicio API para evitar datos quemados en el código:
            </p>

            <div style={{ padding: 14, backgroundColor: '#0f172a', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
              <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 12, color: '#f8fafc', lineHeight: 1.5 }}>
{`# Backend API (Node.js / Express)
PORT=5000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173

# PostgreSQL Database Connection
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=********
DB_NAME=aduana

# n8n Automation & AI Webhook
N8N_WEBHOOK_URL=http://localhost:5678/webhook/aduanas-ai
AI_PROVIDER=gemini`}
              </pre>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-subtle)', marginTop: 8 }}>
              * Por seguridad, el frontend nunca almacena contraseñas ni credenciales maestras.
            </div>
          </div>
        </div>

        {/* Modelo de Datos de 13 Tablas del Laboratorio #3 */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title" style={{ fontSize: 15 }}>
                <Layers size={17} style={{ color: 'var(--primary)' }} />
                <span>Entidades Implementadas del Laboratorio #3</span>
              </div>
              <div className="card-subtitle">Esquema relacional íntegro sin tablas inventadas</div>
            </div>
          </div>

          <div style={{ padding: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {[
                'pais (id_pais, nombre, iso)',
                'importador (id_imp, razon, ruc)',
                'agente_aduanal (id_ag, lic)',
                'categoria_partida (arancel)',
                'mercancia (producto, valor)',
                'declaracion_aduanera (DUA)',
                'detalle_declaracion (N:M)',
                'contenedor (peso, tipo)',
                'bodega (depósito, capacidad)',
                'inventario_bodega (stock)',
                'movimiento_inventario (flujo)',
                'funcionario (jerarquía recursiva)',
                'inspeccion (actas de aforo)'
              ].map((ent, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-surface-alt)',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{ent}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
