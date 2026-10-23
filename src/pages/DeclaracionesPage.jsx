import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Filter,
  Eye,
  CheckCircle,
  AlertTriangle,
  Package,
  Container,
  Building2,
  Calendar,
  Globe
} from 'lucide-react';
import { useCustoms } from '../context/CustomsContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function DeclaracionesPage() {
  const {
    declaraciones,
    importadores,
    agentes,
    paises,
    mercancias,
    detalles,
    contenedores,
    inspecciones,
    addDeclaracion,
    updateDeclaracionEstado
  } = useCustoms();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegimen, setFilterRegimen] = useState('ALL');
  const [filterEstado, setFilterEstado] = useState('ALL');

  // Modales
  const [selectedDua, setSelectedDua] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Formulario nueva DUA
  const [formData, setFormData] = useState({
    numero_declaracion: `DUA-2026-${String(declaraciones.length + 1).padStart(4, '0')}`,
    fecha: new Date().toISOString().substring(0, 10),
    regimen: 'Importacion',
    estado: 'Retenida',
    id_importador: 1,
    id_agente: 1,
    id_pais_origen: 1
  });

  const [formErrors, setFormErrors] = useState({});

  // Filtrado
  const filteredDeclaraciones = declaraciones.filter((dua) => {
    const importador = importadores.find(i => i.id_importador === dua.id_importador);
    const pais = paises.find(p => p.id_pais === dua.id_pais_origen);

    const matchesSearch =
      dua.numero_declaracion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (importador && importador.nombre_razon_social.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pais && pais.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRegimen = filterRegimen === 'ALL' || dua.regimen === filterRegimen;
    const matchesEstado = filterEstado === 'ALL' || dua.estado === filterEstado;

    return matchesSearch && matchesRegimen && matchesEstado;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.numero_declaracion.trim()) errors.numero_declaracion = 'El número DUA es obligatorio';
    if (!formData.fecha) errors.fecha = 'La fecha es obligatoria';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    addDeclaracion({
      ...formData,
      id_importador: Number(formData.id_importador),
      id_agente: Number(formData.id_agente),
      id_pais_origen: Number(formData.id_pais_origen)
    });

    setIsNewModalOpen(false);
    setFormErrors({});
  };

  // Datos relacionados de la DUA seleccionada
  const selectedImportador = selectedDua ? importadores.find(i => i.id_importador === selectedDua.id_importador) : null;
  const selectedAgente = selectedDua ? agentes.find(a => a.id_agente === selectedDua.id_agente) : null;
  const selectedPais = selectedDua ? paises.find(p => p.id_pais === selectedDua.id_pais_origen) : null;
  const selectedDetalles = selectedDua ? detalles.filter(d => d.id_declaracion === selectedDua.id_declaracion) : [];
  const selectedContenedor = selectedDua ? contenedores.find(c => c.id_declaracion === selectedDua.id_declaracion) : null;
  const selectedInspeccion = selectedDua ? inspecciones.find(i => i.id_declaracion === selectedDua.id_declaracion) : null;

  return (
    <div className="fade-in">
      {/* Barra de Filtros y Búsqueda */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={18} />
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por DUA, importador o país..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={filterRegimen}
            onChange={(e) => setFilterRegimen(e.target.value)}
          >
            <option value="ALL">Todos los Regímenes</option>
            <option value="Importacion">Importación</option>
            <option value="Exportacion">Exportación</option>
            <option value="Transito">Tránsito</option>
            <option value="Deposito">Depósito</option>
          </select>

          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <option value="ALL">Todos los Estados</option>
            <option value="Retenida">Retenida</option>
            <option value="En Inspeccion">En Inspección</option>
            <option value="Liberada">Liberada</option>
            <option value="Pendiente Pago">Pendiente Pago</option>
          </select>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Nueva DUA</span>
          </button>
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Número DUA</th>
                <th>Fecha</th>
                <th>Importador / Razón Social</th>
                <th>País Origen</th>
                <th>Régimen</th>
                <th>Agente Aduanal</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeclaraciones.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <FileText size={28} />
                      </div>
                      <h4>No se encontraron declaraciones</h4>
                      <p>Intenta ajustar los filtros de búsqueda o registra una nueva declaración.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDeclaraciones.map((dua) => {
                  const imp = importadores.find(i => i.id_importador === dua.id_importador);
                  const p = paises.find(pa => pa.id_pais === dua.id_pais_origen);
                  const ag = agentes.find(a => a.id_agente === dua.id_agente);

                  return (
                    <tr key={dua.id_declaracion} className="clickable-row" onClick={() => setSelectedDua(dua)}>
                      <td>
                        <span className="table-code-badge" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                          {dua.numero_declaracion}
                        </span>
                      </td>
                      <td>{dua.fecha}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{imp ? imp.nombre_razon_social : 'No asignado'}</div>
                        {imp && <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>NIT: {imp.nit_ruc}</div>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Globe size={14} style={{ color: 'var(--text-subtle)' }} />
                          <span>{p ? p.nombre : 'N/A'}</span>
                          {p && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>({p.codigo_iso})</span>}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 500 }}>{dua.regimen}</span>
                      </td>
                      <td>{ag ? ag.nombre : 'N/A'}</td>
                      <td>
                        <Badge status={dua.estado} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDua(dua);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px 10px' }}
                          title="Ver detalle"
                        >
                          <Eye size={14} />
                          <span>Detalle</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETALLE DE DECLARACIÓN */}
      <Modal
        isOpen={Boolean(selectedDua)}
        onClose={() => setSelectedDua(null)}
        title={`Detalle de Declaración: ${selectedDua?.numero_declaracion || ''}`}
        maxWidth="720px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {selectedDua && selectedDua.estado !== 'Liberada' && (
                <button
                  onClick={() => {
                    updateDeclaracionEstado(selectedDua.id_declaracion, 'Liberada');
                    setSelectedDua({ ...selectedDua, estado: 'Liberada' });
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <CheckCircle size={15} />
                  <span>Autorizar Levante (Liberar)</span>
                </button>
              )}
              {selectedDua && selectedDua.estado !== 'Retenida' && (
                <button
                  onClick={() => {
                    updateDeclaracionEstado(selectedDua.id_declaracion, 'Retenida');
                    setSelectedDua({ ...selectedDua, estado: 'Retenida' });
                  }}
                  className="btn btn-danger btn-sm"
                >
                  <AlertTriangle size={15} />
                  <span>Marcar Retenida</span>
                </button>
              )}
            </div>
            <button onClick={() => setSelectedDua(null)} className="btn btn-secondary btn-sm">
              Cerrar
            </button>
          </div>
        }
      >
        {selectedDua && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Encabezado con Estado y Régimen */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Régimen Aduanero
                </span>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
                  {selectedDua.regimen}
                </div>
              </div>
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Fecha de Registro
                </span>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedDua.fecha}</div>
              </div>
              <div>
                <Badge status={selectedDua.estado} />
              </div>
            </div>

            {/* Fila Importador, Agente y País */}
            <div className="grid-3">
              <div style={{ padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600 }}>
                  <Building2 size={14} />
                  <span>Importador</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, marginTop: 4 }}>
                  {selectedImportador ? selectedImportador.nombre_razon_social : 'No definido'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  NIT: {selectedImportador?.nit_ruc || 'N/A'}
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600 }}>
                  <Building2 size={14} />
                  <span>Agente Aduanal</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, marginTop: 4 }}>
                  {selectedAgente ? selectedAgente.nombre : 'No definido'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Licencia: {selectedAgente?.licencia || 'N/A'}
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600 }}>
                  <Globe size={14} />
                  <span>País de Origen</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, marginTop: 4 }}>
                  {selectedPais ? selectedPais.nombre : 'No definido'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Código ISO: {selectedPais?.codigo_iso || 'N/A'}
                </div>
              </div>
            </div>

            {/* Mercancías Asociadas (Detalle N:M) */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Package size={16} style={{ color: 'var(--primary)' }} />
                <span>Mercancías y Valores Declarados</span>
              </h4>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mercancía / Producto</th>
                      <th>Cantidad</th>
                      <th>Valor Declarado (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDetalles.length === 0 ? (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                          No hay líneas de mercancía asociadas a esta DUA.
                        </td>
                      </tr>
                    ) : (
                      selectedDetalles.map(det => {
                        const m = mercancias.find(item => item.id_mercancia === det.id_mercancia);
                        return (
                          <tr key={det.id_detalle}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{m ? m.descripcion : `Mercancía #${det.id_mercancia}`}</div>
                              {m && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Unidad: {m.unidad_medida}</div>}
                            </td>
                            <td>{det.cantidad.toLocaleString()}</td>
                            <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                              ${Number(det.valor_declarado).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contenedor e Inspección Vinculados */}
            <div className="grid-2">
              <div style={{ padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13, color: 'var(--text-main)', marginBottom: 6 }}>
                  <Container size={16} style={{ color: '#2563eb' }} />
                  <span>Contenedor Asignado</span>
                </div>
                {selectedContenedor ? (
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 13 }}>
                      {selectedContenedor.numero_contenedor}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {selectedContenedor.tipo} · {selectedContenedor.peso.toLocaleString()} kg
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sin contenedor registrado</div>
                )}
              </div>

              <div style={{ padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13, color: 'var(--text-main)', marginBottom: 6 }}>
                  <CheckCircle size={16} style={{ color: 'var(--primary)' }} />
                  <span>Dictamen de Inspección</span>
                </div>
                {selectedInspeccion ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Badge status={selectedInspeccion.resultado} />
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({selectedInspeccion.fecha})</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-main)', marginTop: 4 }}>
                      {selectedInspeccion.observaciones}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Pendiente de inspección física</div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL REGISTRAR NUEVA DECLARACIÓN */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Registrar Declaración Aduanera (DUA)"
        maxWidth="600px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, width: '100%' }}>
            <button onClick={() => setIsNewModalOpen(false)} className="btn btn-secondary">
              Cancelar
            </button>
            <button onClick={handleCreateSubmit} className="btn btn-primary">
              Guardar Declaración
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Número de Declaración *</label>
              <input
                type="text"
                className="form-control"
                value={formData.numero_declaracion}
                onChange={(e) => setFormData({ ...formData, numero_declaracion: e.target.value })}
                placeholder="DUA-2026-XXXX"
              />
              {formErrors.numero_declaracion && (
                <div style={{ color: 'var(--status-danger)', fontSize: 11, marginTop: 4 }}>
                  {formErrors.numero_declaracion}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de Registro *</label>
              <input
                type="date"
                className="form-control"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Régimen Aduanero *</label>
              <select
                className="form-select"
                value={formData.regimen}
                onChange={(e) => setFormData({ ...formData, regimen: e.target.value })}
              >
                <option value="Importacion">Importación</option>
                <option value="Exportacion">Exportación</option>
                <option value="Transito">Tránsito</option>
                <option value="Deposito">Depósito</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Estado Inicial *</label>
              <select
                className="form-select"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              >
                <option value="Retenida">Retenida</option>
                <option value="En Inspeccion">En Inspección</option>
                <option value="Pendiente Pago">Pendiente Pago</option>
                <option value="Liberada">Liberada</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Importador Registrado *</label>
            <select
              className="form-select"
              value={formData.id_importador}
              onChange={(e) => setFormData({ ...formData, id_importador: e.target.value })}
            >
              {importadores.map(imp => (
                <option key={imp.id_importador} value={imp.id_importador}>
                  {imp.nombre_razon_social} (NIT: {imp.nit_ruc})
                </option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Agente Aduanal *</label>
              <select
                className="form-select"
                value={formData.id_agente}
                onChange={(e) => setFormData({ ...formData, id_agente: e.target.value })}
              >
                {agentes.map(ag => (
                  <option key={ag.id_agente} value={ag.id_agente}>
                    {ag.nombre} ({ag.licencia})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">País de Origen *</label>
              <select
                className="form-select"
                value={formData.id_pais_origen}
                onChange={(e) => setFormData({ ...formData, id_pais_origen: e.target.value })}
              >
                {paises.map(p => (
                  <option key={p.id_pais} value={p.id_pais}>
                    {p.nombre} ({p.codigo_iso})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
