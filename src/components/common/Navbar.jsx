import React from 'react';
import { Menu, Bot, Server, RefreshCw, UserCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCustoms } from '../../context/CustomsContext';

export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();
  const { isLiveBackend, refreshData, loading } = useCustoms();

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Panel Principal de Operaciones', subtitle: 'Monitoreo en tiempo real de declaraciones, bodegas y contenedores' };
      case '/declaraciones':
        return { title: 'Declaraciones Aduaneras (DUA)', subtitle: 'Registro, control de régimen, inspección y estado de despacho' };
      case '/mercancias':
        return { title: 'Mercancías & Partidas Arancelarias', subtitle: 'Catálogo clasificado según el Sistema Armonizado y tasas arancelarias' };
      case '/inventario':
        return { title: 'Control de Inventario & Existencias', subtitle: 'Custodia fiscal por bodega, estado retenido/liberado y movimientos' };
      case '/bodegas':
        return { title: 'Bodegas & Depósitos Fiscales', subtitle: 'Capacidad, ubicación y distribución de mercancías en almacenes' };
      case '/contenedores':
        return { title: 'Control de Contenedores', subtitle: 'Manifiestos de carga, tipo de unidad, pesaje y trazabilidad' };
      case '/inspecciones':
        return { title: 'Inspecciones Físicas & Aforos', subtitle: 'Actas de fiscalización, funcionarios actuantes y observaciones' };
      case '/entidades':
        return { title: 'Directorio Aduanero', subtitle: 'Padrón de importadores, agentes aduanales, países y funcionarios' };
      case '/informes':
        return { title: 'Consultas & Reportes del Negocio', subtitle: 'Consultas SQL analíticas del Laboratorio #3 con filtros parametrizados' };
      case '/asistente':
        return { title: 'Asistente de IA Aduanero', subtitle: 'Consultas en lenguaje natural con acceso a la base de datos' };
      case '/configuracion':
        return { title: 'Configuración & Diagnóstico del Sistema', subtitle: 'Estado de la API backend, PostgreSQL, variables y n8n' };
      default:
        return { title: 'Inventario Aduanero', subtitle: 'Sistema de Gestión de Operaciones Aduaneras' };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          onClick={onToggleSidebar}
          className="btn-icon-toggle"
          aria-label="Abrir Menú"
        >
          <Menu size={20} />
        </button>
        <div className="topbar-title-section">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="topbar-actions">
        {/* Botón de refrescar */}
        <button
          onClick={refreshData}
          className="btn btn-secondary btn-sm"
          title="Recargar datos"
          disabled={loading}
          style={{ display: 'inline-flex', padding: '8px 12px' }}
        >
          <RefreshCw size={15} className={loading ? 'spin-animation' : ''} />
          <span style={{ display: 'none' }} className="d-sm-inline">Actualizar</span>
        </button>

        {/* Indicador de conexión */}
        <Link
          to="/configuracion"
          style={{ textDecoration: 'none' }}
          title={isLiveBackend ? 'Conectado a PostgreSQL vía API' : 'Ejecutando en Modo Demostración Local (Fase 1)'}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isLiveBackend ? 'var(--status-success-bg)' : '#fffbeb',
              border: `1px solid ${isLiveBackend ? 'var(--status-success-border)' : '#fde68a'}`,
              color: isLiveBackend ? 'var(--status-success)' : '#b45309',
              fontSize: 12,
              fontWeight: 600
            }}
          >
            <Server size={14} />
            <span>{isLiveBackend ? 'API Activa' : 'Modo Demo (Fase 1)'}</span>
          </div>
        </Link>

        {/* Acceso Rápido al Asistente IA */}
        <Link to="/asistente" className="btn btn-primary btn-sm">
          <Bot size={16} />
          <span>Preguntar a IA</span>
        </Link>

        {/* Perfil del Operador */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            paddingLeft: 12,
            borderLeft: '1px solid var(--border-subtle)'
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}
          >
            <UserCheck size={18} />
          </div>
          <div style={{ lineHeight: 1.2, display: 'none' }} className="d-md-block">
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>Oficial Aduanal</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Operaciones & Fiscalización</div>
          </div>
        </div>
      </div>
    </header>
  );
}
