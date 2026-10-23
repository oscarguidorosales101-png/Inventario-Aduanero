import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Code2,
  Download,
  Play,
  FileSpreadsheet,
  Check,
  Copy,
  Layers,
  ArrowRight,
  Database,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useCustoms } from '../context/CustomsContext';
import { mockConsultasLaboratorio } from '../data/mockData';
import { apiService } from '../services/api';
import Badge from '../components/common/Badge';

export default function InformesPage() {
  const {
    declaraciones,
    inventario,
    contenedores,
    mercancias,
    bodegas,
    importadores,
    paises,
    inspecciones,
    funcionarios,
    showToast,
    isLiveBackend
  } = useCustoms();

  const [selectedConsultaId, setSelectedConsultaId] = useState(1);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liveResult, setLiveResult] = useState(null);
  const [queryError, setQueryError] = useState(null);

  const selectedConsulta = mockConsultasLaboratorio.find(c => c.id === selectedConsultaId);

  // Cargar datos reales desde PostgreSQL al seleccionar consulta o cambiar modo
  useEffect(() => {
    let isMounted = true;
    async function fetchReportData() {
      setLoading(true);
      setQueryError(null);
      try {
        const data = await apiService.getInforme(selectedConsultaId);
        if (isMounted) {
          if (data && data.rows) {
            setLiveResult(data);
          } else {
            setLiveResult(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setQueryError(err.message || 'Error al ejecutar consulta en PostgreSQL');
          setLiveResult(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchReportData();
    return () => {
      isMounted = false;
    };
  }, [selectedConsultaId, isLiveBackend]);

  const currentSQL = liveResult?.sql || selectedConsulta?.sqlQuery || '';

  const handleCopySQL = () => {
    if (currentSQL) {
      navigator.clipboard.writeText(currentSQL);
      setCopied(true);
      showToast('Sentencia SQL copiada al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportCSV = () => {
    const rows = liveResult?.rows;
    if (!rows || rows.length === 0) {
      showToast('No hay datos disponibles para exportar');
      return;
    }
    const headers = Object.keys(rows[0]).join(',');
    const csvContent = [
      headers,
      ...rows.map(r => Object.values(r).map(val => `"${val !== null ? val : ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `informe_aduanero_consulta_${selectedConsultaId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Informe #${selectedConsultaId} exportado en CSV`);
  };

  // Renderizar los resultados de PostgreSQL o el fallback local
  const renderQueryResult = () => {
    if (loading) {
      return (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader2 className="spin" size={28} style={{ color: 'var(--primary)', marginBottom: 12, margin: '0 auto' }} />
          <p style={{ fontWeight: 600, fontSize: 14 }}>Ejecutando consulta en PostgreSQL...</p>
        </div>
      );
    }

    if (queryError) {
      return (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--status-danger)' }}>
          <AlertCircle size={32} style={{ marginBottom: 8, margin: '0 auto' }} />
          <p style={{ fontWeight: 700 }}>No fue posible obtener los datos de la base de datos</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{queryError}</p>
        </div>
      );
    }

    // Si tenemos filas reales de PostgreSQL, las mostramos
    if (liveResult && Array.isArray(liveResult.rows) && liveResult.rows.length > 0) {
      const rows = liveResult.rows;

      switch (selectedConsultaId) {
        case 1:
          return (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mes del Registro</th>
                  <th>Régimen Aduanero</th>
                  <th>Total de Declaraciones (DUA)</th>
                  <th>Proporción Visual</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{r.mes}</td>
                    <td><Badge status={r.regimen} /></td>
                    <td style={{ fontWeight: 800, fontSize: 16 }}>{r.total_declaraciones}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, backgroundColor: 'var(--bg-surface-alt)', borderRadius: 99 }}>
                          <div style={{ width: `${Math.min(100, (Number(r.total_declaraciones) / 16) * 100)}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: 99 }}></div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700 }}>{r.total_declaraciones} DUAs</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          );

        case 2:
          return (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bodega Fiscal</th>
                  <th>Mercancía Retenida</th>
                  <th>Partida Arancelaria</th>
                  <th>Cantidad en Custodia</th>
                  <th>Fecha Ingreso</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{r.bodega}</td>
                    <td>{r.mercancia}</td>
                    <td><span className="table-code-badge">{r.codigo_partida}</span></td>
                    <td style={{ fontWeight: 800, color: 'var(--status-danger)', fontSize: 15 }}>
                      {Number(r.cantidad).toLocaleString()}
                    </td>
                    <td>{r.fecha_ingreso}</td>
                    <td><Badge status={r.estado} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          );

        case 3:
          return (
            <table className="data-table">
              <thead>
                <tr>
                  <th>País de Procedencia</th>
                  <th>Código ISO</th>
                  <th>Total Contenedores</th>
                  <th>Peso Acumulado (kg)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{r.pais}</td>
                    <td><span className="table-code-badge">{r.codigo_iso}</span></td>
                    <td style={{ fontWeight: 800, fontSize: 16, color: 'var(--primary)' }}>{r.total_contenedores}</td>
                    <td style={{ fontWeight: 600 }}>{Number(r.peso_total_kg).toLocaleString(undefined, { minimumFractionDigits: 2 })} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );

        case 4:
          return (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Importador / Razón Social</th>
                  <th>NIT / RUC</th>
                  <th>DUAs Gestionadas</th>
                  <th>Valor Total Declarado (USD)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{r.nombre_razon_social}</td>
                    <td><span className="table-code-badge">{r.nit_ruc}</span></td>
                    <td style={{ fontWeight: 700 }}>{r.total_duas}</td>
                    <td style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 15 }}>
                      ${Number(r.valor_total_usd).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          );

        case 5:
          return (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>DUA Asociada</th>
                  <th>Resultado</th>
                  <th>Funcionario Inspector</th>
                  <th>Observaciones Registradas</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.fecha}</td>
                    <td><span className="table-code-badge">{r.numero_declaracion}</span></td>
                    <td><Badge status={r.resultado} /></td>
                    <td style={{ fontWeight: 600 }}>
                      <div>{r.funcionario_inspector}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.cargo}</div>
                    </td>
                    <td style={{ maxWidth: 300 }}>{r.observaciones}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );

        case 6:
          return (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mercancía</th>
                  <th>Partida</th>
                  <th>Unidad</th>
                  <th>Stock Total</th>
                  <th>Liberado</th>
                  <th>Retenido</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{r.descripcion}</td>
                    <td><span className="table-code-badge">{r.codigo_partida}</span></td>
                    <td>{r.unidad_medida}</td>
                    <td style={{ fontWeight: 800, fontSize: 15 }}>{Number(r.stock_total).toLocaleString()}</td>
                    <td style={{ color: 'var(--status-success)', fontWeight: 700 }}>{Number(r.stock_liberado).toLocaleString()}</td>
                    <td style={{ color: 'var(--status-danger)', fontWeight: 700 }}>{Number(r.stock_retenido).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );

        case 7:
          return (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha y Hora</th>
                  <th>Tipo</th>
                  <th>Bodega Fiscal</th>
                  <th>Mercancía / Producto</th>
                  <th>Cantidad</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.fecha}</td>
                    <td><Badge status={r.tipo} /></td>
                    <td style={{ fontWeight: 600 }}>{r.bodega}</td>
                    <td>{r.producto}</td>
                    <td style={{ fontWeight: 800 }}>{Number(r.cantidad).toLocaleString()}</td>
                    <td>{r.motivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );

        case 8:
          return (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Agente Aduanal</th>
                  <th>Licencia</th>
                  <th>Total Trámites</th>
                  <th>DUAs Liberadas</th>
                  <th>DUAs Retenidas</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{r.agente}</td>
                    <td><span className="table-code-badge">{r.licencia}</span></td>
                    <td style={{ fontWeight: 800, fontSize: 15 }}>{r.total_tramites}</td>
                    <td style={{ color: 'var(--status-success)', fontWeight: 700 }}>{r.duas_liberadas}</td>
                    <td style={{ color: 'var(--status-danger)', fontWeight: 700 }}>{r.duas_retenidas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );

        default:
          return (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
              Selecciona una consulta del listado para visualizar los resultados.
            </div>
          );
      }
    }

    // Fallback de demostración si la API no estuviera disponible
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>No se encontraron registros devueltos por la consulta.</p>
      </div>
    );
  };

  return (
    <div className="fade-in">
      <div className="grid-2" style={{ alignItems: 'flex-start', gap: 24 }}>
        {/* Selector de Consultas del Laboratorio #3 */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Layers size={18} style={{ color: 'var(--primary)' }} />
              <span>Consultas SQL del Laboratorio #3</span>
            </div>
            <div className="card-subtitle">
              8 requerimientos de consulta con JOIN, GROUP BY, WHERE y agregaciones
            </div>
          </div>

          <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {mockConsultasLaboratorio.map(c => {
              const isSelected = c.id === selectedConsultaId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedConsultaId(c.id)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isSelected ? 'var(--primary-border)' : 'var(--border-subtle)'}`,
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                      Consulta #{c.id}: {c.titulo}
                    </span>
                    {isSelected && <ArrowRight size={15} style={{ color: 'var(--primary)' }} />}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {c.descripcion}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel de Visualización de la Consulta & SQL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {selectedConsulta && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title" style={{ fontSize: 15 }}>
                    <Code2 size={17} style={{ color: 'var(--primary)' }} />
                    <span>Sentencia SQL Ejecutada en PostgreSQL</span>
                  </div>
                  <div className="card-subtitle">
                    {liveResult?.sql ? 'Consulta SQL enviada en tiempo real al motor de base de datos' : 'Estructura SQL definida para el laboratorio'}
                  </div>
                </div>

                <button onClick={handleCopySQL} className="btn btn-secondary btn-sm">
                  {copied ? <Check size={14} style={{ color: 'var(--status-success)' }} /> : <Copy size={14} />}
                  <span>{copied ? 'Copiado' : 'Copiar SQL'}</span>
                </button>
              </div>

              <div style={{ padding: 16, backgroundColor: '#0f172a', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', overflowX: 'auto' }}>
                <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 12.5, color: '#f8fafc', lineHeight: 1.5 }}>
                  {currentSQL.trim()}
                </pre>
              </div>
            </div>
          )}

          {/* Tabla de Resultados */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="card-title" style={{ fontSize: 15 }}>
                  <BarChart3 size={17} style={{ color: 'var(--primary)' }} />
                  <span>Resultados Obtenidos</span>
                </div>
                {liveResult && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '3px 8px',
                    borderRadius: 99,
                    fontSize: 11,
                    fontWeight: 700,
                    backgroundColor: 'rgba(22, 163, 74, 0.1)',
                    color: 'var(--status-success)'
                  }}>
                    <Database size={11} /> PostgreSQL ({liveResult.rows?.length || 0} registros)
                  </span>
                )}
              </div>
              <button
                onClick={handleExportCSV}
                className="btn btn-secondary btn-sm"
                disabled={loading || !liveResult?.rows?.length}
              >
                <Download size={14} />
                <span>Exportar CSV</span>
              </button>
            </div>

            <div className="table-responsive" style={{ border: 'none' }}>
              {renderQueryResult()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
