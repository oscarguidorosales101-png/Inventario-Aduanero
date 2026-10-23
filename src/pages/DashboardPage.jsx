import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Boxes,
  Container,
  Warehouse,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useCustoms } from '../context/CustomsContext';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';

export default function DashboardPage() {
  const {
    declaraciones,
    inventario,
    contenedores,
    bodegas,
    inspecciones,
    mercancias,
    isLiveBackend
  } = useCustoms();

  // Métricas clave
  const totalDuas = declaraciones.length;
  const duasRetenidas = declaraciones.filter(d => d.estado === 'Retenida').length;
  const duasLiberadas = declaraciones.filter(d => d.estado === 'Liberada').length;
  const duasInspeccion = declaraciones.filter(d => d.estado === 'En Inspeccion').length;

  const totalStockItems = inventario.reduce((acc, curr) => acc + Number(curr.cantidad || 0), 0);
  const stockRetenido = inventario
    .filter(i => i.estado === 'Retenido' || i.estado === 'En Cuarentena')
    .reduce((acc, curr) => acc + Number(curr.cantidad || 0), 0);

  const totalContenedores = contenedores.length;
  const pesoTotalKg = contenedores.reduce((acc, curr) => acc + Number(curr.peso || 0), 0);

  // Declaraciones recientes
  const ultimasDeclaraciones = declaraciones.slice(0, 5);

  // Inspecciones recientes no conformes
  const inspeccionesAlerta = inspecciones.filter(i => i.resultado !== 'Aprobada').slice(0, 4);

  return (
    <div className="fade-in">
      {/* Banner explicativo del estado del proyecto */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: 24,
          backgroundColor: '#ffffff',
          borderLeft: '4px solid var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text-main)' }}>
              Sistema de Inventario Aduanero — Fase 1 (Frontend Administrativo)
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
              {isLiveBackend
                ? 'Conectado a PostgreSQL y API backend en tiempo real.'
                : 'Ejecutando con datos demostrativos estructurados según las 13 entidades del Laboratorio #3. Navegación completa habilitada.'}
            </div>
          </div>
        </div>
        <Link to="/configuracion" className="btn btn-outline-primary btn-sm">
          <span>Ver Estado del Sistema</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Grid de Indicadores Principales (KPIs) */}
      <div className="kpi-grid">
        <StatCard
          title="Declaraciones (DUA)"
          value={totalDuas}
          subtitle={`${duasLiberadas} liberadas · ${duasRetenidas} retenidas`}
          icon={FileText}
          color="var(--primary)"
        />
        <StatCard
          title="Stock en Bodegas"
          value={totalStockItems.toLocaleString()}
          subtitle={`${stockRetenido.toLocaleString()} unidades en custodia fiscal`}
          icon={Boxes}
          color="#d97706"
        />
        <StatCard
          title="Contenedores"
          value={totalContenedores}
          subtitle={`${(pesoTotalKg / 1000).toFixed(1)} toneladas registradas`}
          icon={Container}
          color="#2563eb"
        />
        <StatCard
          title="Bodegas Fiscales"
          value={bodegas.length}
          subtitle="Puertos, aeropuertos y zonas francas"
          icon={Warehouse}
          color="#059669"
        />
      </div>

      {/* Alerta de Mercancías Retenidas si existen */}
      {duasRetenidas > 0 && (
        <div
          style={{
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            marginBottom: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertOctagon size={22} style={{ color: 'var(--primary)' }} />
            <div>
              <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 14 }}>
                Atención Aduanera: {duasRetenidas} declaraciones tienen estado "Retenida"
              </span>
              <p style={{ fontSize: 12.5, color: '#991b1b', marginTop: 2 }}>
                Requieren revisión física, subsanación documental o aforo técnico antes de proceder con el levante.
              </p>
            </div>
          </div>
          <Link to="/declaraciones" className="btn btn-primary btn-sm">
            Ver Retenidas
          </Link>
        </div>
      )}

      {/* Sección en 2 Columnas */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* Columna Izquierda: Últimas Declaraciones */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <FileText size={18} style={{ color: 'var(--primary)' }} />
                <span>Últimas Declaraciones Aduaneras</span>
              </div>
              <div className="card-subtitle">Registros recientes de importación y tránsito</div>
            </div>
            <Link to="/declaraciones" className="btn btn-secondary btn-sm">
              <span>Ver Todas</span>
              <ExternalLink size={13} />
            </Link>
          </div>

          <div className="table-responsive" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Número DUA</th>
                  <th>Fecha</th>
                  <th>Régimen</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {ultimasDeclaraciones.map((d) => (
                  <tr key={d.id_declaracion}>
                    <td>
                      <span className="table-code-badge">{d.numero_declaracion}</span>
                    </td>
                    <td>{d.fecha}</td>
                    <td>{d.regimen}</td>
                    <td>
                      <Badge status={d.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Columna Derecha: Inspecciones Pendientes / Observaciones */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <AlertOctagon size={18} style={{ color: '#d97706' }} />
                <span>Inspecciones con Observaciones</span>
              </div>
              <div className="card-subtitle">Actas que requieren atención de funcionarios fiscales</div>
            </div>
            <Link to="/inspecciones" className="btn btn-secondary btn-sm">
              <span>Ir a Inspecciones</span>
              <ExternalLink size={13} />
            </Link>
          </div>

          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {inspeccionesAlerta.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
                No hay observaciones pendientes. Todas las inspecciones están al día.
              </div>
            ) : (
              inspeccionesAlerta.map((insp) => (
                <div
                  key={insp.id_inspeccion}
                  style={{
                    padding: 12,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-alt)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-main)' }}>
                      DUA asociada: {declaraciones.find(d => d.id_declaracion === insp.id_declaracion)?.numero_declaracion || `DUA #${insp.id_declaracion}`}
                    </span>
                    <Badge status={insp.resultado} />
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                    {insp.observaciones}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 2 }}>
                    Fecha de inspección: {insp.fecha}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Capacidad y Ocupación de Bodegas */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-header">
          <div>
            <div className="card-title">
              <Warehouse size={18} style={{ color: 'var(--primary)' }} />
              <span>Ocupación de Bodegas y Depósitos Fiscales</span>
            </div>
            <div className="card-subtitle">Capacidad utilizada según el inventario en custodia</div>
          </div>
          <Link to="/bodegas" className="btn btn-secondary btn-sm">
            <span>Gestionar Bodegas</span>
            <ExternalLink size={13} />
          </Link>
        </div>

        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {bodegas.slice(0, 4).map((b) => {
              // Calcular existencia total en esta bodega
              const stockEnBodega = inventario
                .filter(i => i.id_bodega === b.id_bodega)
                .reduce((acc, curr) => acc + Number(curr.cantidad || 0), 0);
              const porcentaje = Math.min(100, Math.round((stockEnBodega / b.capacidad) * 100));

              return (
                <div
                  key={b.id_bodega}
                  style={{
                    padding: 16,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-main)', marginBottom: 4 }}>
                    {b.nombre}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                    {b.ubicacion}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Ocupación actual:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {stockEnBodega.toLocaleString()} / {b.capacidad.toLocaleString()} ({porcentaje}%)
                    </span>
                  </div>

                  {/* Barra de progreso */}
                  <div
                    style={{
                      height: 8,
                      width: '100%',
                      backgroundColor: 'var(--bg-surface-alt)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${porcentaje}%`,
                        backgroundColor: porcentaje > 80 ? 'var(--status-danger)' : porcentaje > 50 ? '#d97706' : 'var(--primary)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.5s ease-out'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Accesos Rápidos a Módulos del Sistema */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Accesos Rápidos a las Funciones del Sistema</div>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link
              to="/declaraciones"
              className="card"
              style={{
                padding: 16,
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer'
              }}
            >
              <FileText size={22} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>Declaraciones</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Registro & trámites DUA</div>
              </div>
            </Link>

            <Link
              to="/inventario"
              className="card"
              style={{
                padding: 16,
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer'
              }}
            >
              <Boxes size={22} style={{ color: '#d97706' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>Inventario & Stock</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Entradas, salidas y aforo</div>
              </div>
            </Link>

            <Link
              to="/informes"
              className="card"
              style={{
                padding: 16,
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer'
              }}
            >
              <TrendingUp size={22} style={{ color: '#2563eb' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>Consultas SQL</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Reportes del Laboratorio #3</div>
              </div>
            </Link>

            <Link
              to="/asistente"
              className="card"
              style={{
                padding: 16,
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                borderColor: 'var(--primary-border)',
                backgroundColor: 'var(--primary-light)'
              }}
            >
              <ShieldCheck size={22} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--primary)' }}>Asistente IA</div>
                <div style={{ fontSize: 11.5, color: '#991b1b' }}>Consultas en lenguaje natural</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
