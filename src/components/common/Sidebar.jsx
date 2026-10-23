import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Package,
  Boxes,
  Warehouse,
  Container,
  ClipboardCheck,
  Users,
  BarChart3,
  Bot,
  Settings,
  ShieldCheck,
  X
} from 'lucide-react';
import { useCustoms } from '../../context/CustomsContext';

export default function Sidebar({ isOpen, onClose }) {
  const { declaraciones, inventario, inspecciones, contenedores, isLiveBackend } = useCustoms();

  const retenidasCount = inventario.filter(i => i.estado === 'Retenido').length;
  const pendientesInspeccion = inspecciones.filter(i => i.resultado !== 'Aprobada').length;

  const navItems = [
    { to: '/', label: 'Panel Principal', icon: LayoutDashboard, end: true },
    { to: '/declaraciones', label: 'Declaraciones (DUA)', icon: FileText, badge: declaraciones.length },
    { to: '/mercancias', label: 'Mercancías & Partidas', icon: Package },
    { to: '/inventario', label: 'Inventario & Stock', icon: Boxes, badge: retenidasCount > 0 ? `${retenidasCount} ret.` : null },
    { to: '/bodegas', label: 'Bodegas & Depósitos', icon: Warehouse },
    { to: '/contenedores', label: 'Contenedores', icon: Container, badge: contenedores.length },
    { to: '/inspecciones', label: 'Inspecciones & Aforos', icon: ClipboardCheck, badge: pendientesInspeccion > 0 ? pendientesInspeccion : null },
    { to: '/entidades', label: 'Directorio Aduanero', icon: Users },
    { to: '/informes', label: 'Consultas & Reportes', icon: BarChart3 },
    { to: '/asistente', label: 'Asistente de IA', icon: Bot, isSpecial: true },
    { to: '/configuracion', label: 'Configuración & Estado', icon: Settings }
  ];

  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            zIndex: 45
          }}
        />
      )}

      <aside
        className="sidebar"
        style={{
          transform: isOpen || window.innerWidth > 992 ? 'translateX(0)' : 'translateX(-100%)'
        }}
      >
        <div className="sidebar-header">
          <div className="sidebar-brand-badge">
            <ShieldCheck size={24} strokeWidth={2.4} />
          </div>
          <div className="sidebar-brand-text">
            <h1>Inventario Aduanero</h1>
            <p>Solución del Problema</p>
          </div>
          {isOpen && (
            <button
              onClick={onClose}
              className="btn-icon-toggle"
              style={{ marginLeft: 'auto', display: 'flex' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Operaciones Aduaneras</div>
          {navItems.slice(0, 7).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} strokeWidth={2} />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge !== null && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </NavLink>
          ))}

          <div className="nav-section-title" style={{ marginTop: 12 }}>Análisis & Inteligencia</div>
          {navItems.slice(7).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} ${item.isSpecial ? 'ai-special-link' : ''}`}
            >
              <item.icon size={18} strokeWidth={2} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-status-box">
            <span
              className="status-dot-pulse"
              style={{
                backgroundColor: isLiveBackend ? 'var(--status-success)' : '#d97706',
                boxShadow: isLiveBackend ? '0 0 0 3px rgba(5, 150, 105, 0.2)' : '0 0 0 3px rgba(217, 119, 6, 0.2)'
              }}
            ></span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 11.5 }}>
                {isLiveBackend ? 'PostgreSQL En Línea' : 'Fase 1: Demo / Frontend'}
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
                {isLiveBackend ? 'API REST Conectada' : 'Modo Demostración Local'}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
