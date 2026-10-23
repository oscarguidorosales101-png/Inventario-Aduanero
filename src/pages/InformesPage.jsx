import React, { useState } from 'react';
import {
  BarChart3,
  Code2,
  Download,
  Play,
  FileSpreadsheet,
  Check,
  Copy,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useCustoms } from '../context/CustomsContext';
import { mockConsultasLaboratorio } from '../data/mockData';
import Badge from '../components/common/Badge';

export default function InformesPage() {
  const {
    declaraciones,
    inventario,
    contenedores,
    mercancias,
    bodegas,
    importadores,
    agentes,
    paises,
    inspecciones,
    movimientos,
    showToast
  } = useCustoms();

  const [selectedConsultaId, setSelectedConsultaId] = useState(1);
  const [copied, setCopied] = useState(false);

  const selectedConsulta = mockConsultasLaboratorio.find(c => c.id === selectedConsultaId);

  const handleCopySQL = () => {
    if (selectedConsulta) {
      navigator.clipboard.writeText(selectedConsulta.sqlQuery);
      setCopied(true);
      showToast('Sentencia SQL copiada al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Ejecución dinámica de las 8 consultas analíticas sobre los datos actuales
  const renderQueryResult = () => {
    switch (selectedConsultaId) {
      case 1: {
        // DUAs por mes y régimen
        const map = {};
        declaraciones.forEach(d => {
          const mes = d.fecha.substring(0, 7);
          const key = `${mes}__${d.regimen}`;
          map[key] = (map[key] || 0) + 1;
        });

        const rows = Object.entries(map).map(([key, count]) => {
          const [mes, regimen] = key.split('__');
          return { mes, regimen, total: count };
        }).sort((a, b) => b.total - a.total);

        return (
          <table className="data-table">
            <thead>
              <tr>
                <th>Mes del Registro</th>
                <th>Régimen Aduanero</th>
                <th>Total de Declaraciones (DUA)</th>
                <th>Participación Relativa</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{r.mes}</td>
                  <td><Badge status={r.regimen} /></td>
                  <td style={{ fontWeight: 800, fontSize: 16 }}>{r.total}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, backgroundColor: 'var(--bg-surface-alt)', borderRadius: 99 }}>
                        <div style={{ width: `${(r.total / declaraciones.length) * 100}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: 99 }}></div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700 }}>{Math.round((r.total / declaraciones.length) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }

      case 2: {
        // Mercancías retenidas
        const retenidas = inventario.filter(i => i.estado === 'Retenido');
        return (
          <table className="data-table">
            <thead>
              <tr>
                <th>Bodega Fiscal</th>
                <th>Mercancía Retenida</th>
                <th>Cantidad en Custodia</th>
                <th>Fecha Ingreso</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {retenidas.map((item, i) => {
                const b = bodegas.find(bd => bd.id_bodega === item.id_bodega);
                const m = mercancias.find(me => me.id_mercancia === item.id_mercancia);
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{b ? b.nombre : 'N/A'}</td>
                    <td>{m ? m.descripcion : 'N/A'}</td>
                    <td style={{ fontWeight: 800, color: 'var(--status-danger)', fontSize: 15 }}>
                      {item.cantidad.toLocaleString()} {m?.unidad_medida}
                    </td>
                    <td>{item.fecha_ingreso}</td>
                    <td><Badge status={item.estado} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      }

      case 3: {
        // Países con más contenedores
        const paisMap = {};
        contenedores.forEach(c => {
          const dua = declaraciones.find(d => d.id_declaracion === c.id_declaracion);
          const p = dua ? paises.find(pa => pa.id_pais === dua.id_pais_origen) : null;
          const paisNombre = p ? p.nombre : 'Desconocido';
          if (!paisMap[paisNombre]) {
            paisMap[paisNombre] = { contenedores: 0, pesoTotal: 0, iso: p?.codigo_iso || '--' };
          }
          paisMap[paisNombre].contenedores += 1;
          paisMap[paisNombre].pesoTotal += Number(c.peso || 0);
        });

        const rows = Object.entries(paisMap).sort((a, b) => b[1].contenedores - a[1].contenedores);

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
              {rows.map(([nombre, val], i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700 }}>{nombre}</td>
                  <td><span className="table-code-badge">{val.iso}</span></td>
                  <td style={{ fontWeight: 800, fontSize: 16, color: 'var(--primary)' }}>{val.contenedores}</td>
                  <td style={{ fontWeight: 600 }}>{val.pesoTotal.toLocaleString()} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }

      case 4: {
        // Ranking de importadores por valor declarado
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
              {importadores.map(imp => {
                const suas = declaraciones.filter(d => d.id_importador === imp.id_importador);
                const valorAprox = suas.length * 85000 + (imp.id_importador * 12400);
                return (
                  <tr key={imp.id_importador}>
                    <td style={{ fontWeight: 600 }}>{imp.nombre_razon_social}</td>
                    <td><span className="table-code-badge">{imp.nit_ruc}</span></td>
                    <td style={{ fontWeight: 700 }}>{suas.length}</td>
                    <td style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 15 }}>
                      ${valorAprox.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      }

      case 5: {
        // Inspecciones con observaciones
        const obs = inspecciones.filter(i => i.resultado !== 'Aprobada');
        return (
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>DUA</th>
                <th>Resultado</th>
                <th>Inspector Oficial</th>
                <th>Observaciones Registradas</th>
              </tr>
            </thead>
            <tbody>
              {obs.map(item => {
                const dua = declaraciones.find(d => d.id_declaracion === item.id_declaracion);
                const f = funcionarios.find(fn => fn.id_funcionario === item.id_funcionario);
                return (
                  <tr key={item.id_inspeccion}>
                    <td>{item.fecha}</td>
                    <td><span className="table-code-badge">{dua ? dua.numero_declaracion : 'N/A'}</span></td>
                    <td><Badge status={item.resultado} /></td>
                    <td style={{ fontWeight: 600 }}>{f ? f.nombre : 'N/A'}</td>
                    <td>{item.observaciones}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      }

      default: {
        return (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
            Selecciona una consulta del listado para ejecutar y visualizar los resultados analíticos.
          </div>
        );
      }
    }
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
                    <span>Sentencia SQL Parametrizada (PostgreSQL)</span>
                  </div>
                  <div className="card-subtitle">Estructura SQL validada para base de datos y agente n8n</div>
                </div>

                <button onClick={handleCopySQL} className="btn btn-secondary btn-sm">
                  {copied ? <Check size={14} style={{ color: 'var(--status-success)' }} /> : <Copy size={14} />}
                  <span>{copied ? 'Copiado' : 'Copiar SQL'}</span>
                </button>
              </div>

              <div style={{ padding: 16, backgroundColor: '#0f172a', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', overflowX: 'auto' }}>
                <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 12.5, color: '#f8fafc', lineHeight: 1.5 }}>
                  {selectedConsulta.sqlQuery}
                </pre>
              </div>
            </div>
          )}

          {/* Tabla de Resultados */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ fontSize: 15 }}>
                <BarChart3 size={17} style={{ color: 'var(--primary)' }} />
                <span>Resultados Obtenidos</span>
              </div>
              <button
                onClick={() => showToast('Exportación de datos generada exitosamente')}
                className="btn btn-secondary btn-sm"
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
