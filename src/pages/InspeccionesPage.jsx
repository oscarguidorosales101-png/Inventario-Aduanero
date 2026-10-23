import React, { useState } from 'react';
import { ClipboardCheck, Search, Plus, UserCheck, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { useCustoms } from '../context/CustomsContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function InspeccionesPage() {
  const { inspecciones, funcionarios, declaraciones, showToast } = useCustoms();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterResultado, setFilterResultado] = useState('ALL');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const [newInsp, setNewInsp] = useState({
    id_declaracion: 1,
    id_funcionario: 5,
    resultado: 'Aprobada',
    observaciones: '',
    fecha: new Date().toISOString().substring(0, 10)
  });

  const filteredInspecciones = inspecciones.filter(i => {
    const func = funcionarios.find(f => f.id_funcionario === i.id_funcionario);
    const dua = declaraciones.find(d => d.id_declaracion === i.id_declaracion);

    const matchesSearch =
      i.observaciones.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (func && func.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dua && dua.numero_declaracion.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRes = filterResultado === 'ALL' || i.resultado === filterResultado;

    return matchesSearch && matchesRes;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    showToast(`Acta de inspección registrada con resultado "${newInsp.resultado}".`);
    setIsNewModalOpen(false);
  };

  return (
    <div className="fade-in">
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={18} />
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por funcionario, observaciones o DUA..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={filterResultado}
            onChange={(e) => setFilterResultado(e.target.value)}
          >
            <option value="ALL">Todos los Resultados</option>
            <option value="Aprobada">Aprobada</option>
            <option value="Con Observaciones">Con Observaciones</option>
            <option value="Retenida">Retenida</option>
          </select>

          <button onClick={() => setIsNewModalOpen(true)} className="btn btn-primary">
            <Plus size={16} />
            <span>Nueva Inspección</span>
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Acta ID</th>
                <th>Fecha de Inspección</th>
                <th>DUA Sujeta a Aforo</th>
                <th>Funcionario Responsable</th>
                <th>Cargo del Funcionario</th>
                <th>Resultado de la Inspección</th>
                <th>Observaciones del Aforo</th>
              </tr>
            </thead>
            <tbody>
              {filteredInspecciones.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <ClipboardCheck size={28} />
                      </div>
                      <h4>No hay actas de inspección</h4>
                      <p>Ajusta el filtro de resultados o registra una nueva inspección aduanera.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInspecciones.map((insp) => {
                  const func = funcionarios.find(f => f.id_funcionario === insp.id_funcionario);
                  const dua = declaraciones.find(d => d.id_declaracion === insp.id_declaracion);

                  return (
                    <tr key={insp.id_inspeccion}>
                      <td>
                        <span className="table-code-badge">ACTA-{String(insp.id_inspeccion).padStart(4, '0')}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                          <Calendar size={13} style={{ color: 'var(--text-subtle)' }} />
                          <span>{insp.fecha}</span>
                        </div>
                      </td>
                      <td>
                        <span className="table-code-badge" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                          {dua ? dua.numero_declaracion : `DUA #${insp.id_declaracion}`}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <UserCheck size={14} style={{ color: 'var(--primary)' }} />
                          <span style={{ fontWeight: 600 }}>{func ? func.nombre : 'No asignado'}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {func ? func.cargo : '-'}
                        </span>
                      </td>
                      <td>
                        <Badge status={insp.resultado} />
                      </td>
                      <td>
                        <span style={{ fontSize: 12.5, color: 'var(--text-main)' }}>
                          {insp.observaciones}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Inspección */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Registrar Acta de Inspección Aduanera"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, width: '100%' }}>
            <button onClick={() => setIsNewModalOpen(false)} className="btn btn-secondary">
              Cancelar
            </button>
            <button onClick={handleCreateSubmit} className="btn btn-primary">
              Guardar Dictamen
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Declaración (DUA) *</label>
              <select
                className="form-select"
                value={newInsp.id_declaracion}
                onChange={(e) => setNewInsp({ ...newInsp, id_declaracion: Number(e.target.value) })}
              >
                {declaraciones.map(d => (
                  <option key={d.id_declaracion} value={d.id_declaracion}>
                    {d.numero_declaracion} ({d.regimen})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Funcionario Inspector *</label>
              <select
                className="form-select"
                value={newInsp.id_funcionario}
                onChange={(e) => setNewInsp({ ...newInsp, id_funcionario: Number(e.target.value) })}
              >
                {funcionarios.map(f => (
                  <option key={f.id_funcionario} value={f.id_funcionario}>
                    {f.nombre} ({f.cargo})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Resultado del Aforo *</label>
              <select
                className="form-select"
                value={newInsp.resultado}
                onChange={(e) => setNewInsp({ ...newInsp, resultado: e.target.value })}
              >
                <option value="Aprobada">Aprobada (Semáforo Verde)</option>
                <option value="Con Observaciones">Con Observaciones (Semáforo Amarillo)</option>
                <option value="Retenida">Retenida (Semáforo Rojo / Decomiso)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de Inspección *</label>
              <input
                type="date"
                className="form-control"
                value={newInsp.fecha}
                onChange={(e) => setNewInsp({ ...newInsp, fecha: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Observaciones y Hallazgos Técnicos *</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Describa el estado de sellos, concordancia física vs documental, muestras tomadas..."
              value={newInsp.observaciones}
              onChange={(e) => setNewInsp({ ...newInsp, observaciones: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
