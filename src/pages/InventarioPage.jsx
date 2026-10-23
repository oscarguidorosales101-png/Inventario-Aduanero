import React, { useState } from 'react';
import {
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  Search,
  Plus,
  Warehouse,
  Package,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useCustoms } from '../context/CustomsContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function InventarioPage() {
  const {
    inventario,
    movimientos,
    bodegas,
    mercancias,
    categorias,
    addMovimientoInventario
  } = useCustoms();

  const [activeTab, setActiveTab] = useState('stock'); // 'stock' | 'movimientos'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBodega, setFilterBodega] = useState('ALL');
  const [filterEstado, setFilterEstado] = useState('ALL');

  // Modal para nuevo movimiento
  const [isMovModalOpen, setIsMovModalOpen] = useState(false);
  const [movForm, setMovForm] = useState({
    tipo: 'Entrada',
    cantidad: 10,
    id_mercancia: 1,
    id_bodega: 1,
    motivo: ''
  });

  // Filtrado de existencias actuales
  const filteredStock = inventario.filter((item) => {
    const mercancia = mercancias.find(m => m.id_mercancia === item.id_mercancia);
    const bodega = bodegas.find(b => b.id_bodega === item.id_bodega);

    const matchesSearch =
      (mercancia && mercancia.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (bodega && bodega.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBodega = filterBodega === 'ALL' || item.id_bodega === Number(filterBodega);
    const matchesEstado = filterEstado === 'ALL' || item.estado === filterEstado;

    return matchesSearch && matchesBodega && matchesEstado;
  });

  // Filtrado de movimientos
  const filteredMovimientos = movimientos.filter((m) => {
    const mercancia = mercancias.find(item => item.id_mercancia === m.id_mercancia);
    const bodega = bodegas.find(b => b.id_bodega === m.id_bodega);

    const matchesSearch =
      (mercancia && mercancia.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.motivo && m.motivo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (bodega && bodega.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBodega = filterBodega === 'ALL' || m.id_bodega === Number(filterBodega);

    return matchesSearch && matchesBodega;
  });

  const handleMovSubmit = (e) => {
    e.preventDefault();
    if (!movForm.cantidad || movForm.cantidad <= 0) return;

    addMovimientoInventario({
      tipo: movForm.tipo,
      cantidad: Number(movForm.cantidad),
      id_mercancia: Number(movForm.id_mercancia),
      id_bodega: Number(movForm.id_bodega),
      motivo: movForm.motivo || `Movimiento de ${movForm.tipo} registrado en sistema`
    });

    setIsMovModalOpen(false);
    setMovForm({
      tipo: 'Entrada',
      cantidad: 10,
      id_mercancia: 1,
      id_bodega: 1,
      motivo: ''
    });
  };

  return (
    <div className="fade-in">
      {/* Pestañas de separación estricta: Existencias vs Movimientos */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20
        }}
      >
        <div style={{ display: 'flex', gap: 8, backgroundColor: 'var(--bg-surface)', padding: 4, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setActiveTab('stock')}
            className={`btn btn-sm ${activeTab === 'stock' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <Boxes size={15} />
            <span>Existencias Actuales (Stock)</span>
            <span className="badge badge-secondary" style={{ marginLeft: 6, fontSize: 10 }}>
              {inventario.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('movimientos')}
            className={`btn btn-sm ${activeTab === 'movimientos' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <ArrowRightLeft size={15} />
            <span>Historial de Movimientos</span>
            <span className="badge badge-secondary" style={{ marginLeft: 6, fontSize: 10 }}>
              {movimientos.length}
            </span>
          </button>
        </div>

        <button onClick={() => setIsMovModalOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Registrar Movimiento</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={18} />
          <input
            type="text"
            className="form-control"
            placeholder={activeTab === 'stock' ? 'Buscar mercancía o bodega en stock...' : 'Buscar por mercancía o motivo de movimiento...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={filterBodega}
            onChange={(e) => setFilterBodega(e.target.value)}
          >
            <option value="ALL">Todas las Bodegas Fiscales</option>
            {bodegas.map(b => (
              <option key={b.id_bodega} value={b.id_bodega}>
                {b.nombre}
              </option>
            ))}
          </select>

          {activeTab === 'stock' && (
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="ALL">Todos los Estados de Custodia</option>
              <option value="Retenido">Retenido</option>
              <option value="Liberado">Liberado</option>
              <option value="En Cuarentena">En Cuarentena</option>
            </select>
          )}
        </div>
      </div>

      {/* CONTENIDO TAB 1: EXISTENCIAS ACTUALES */}
      {activeTab === 'stock' && (
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bodega / Depósito</th>
                  <th>Mercancía en Custodia</th>
                  <th>Partida Arancelaria</th>
                  <th>Cantidad Actual</th>
                  <th>Fecha de Ingreso</th>
                  <th>Estado de Custodia</th>
                </tr>
              </thead>
              <tbody>
                {filteredStock.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <div className="empty-state-icon">
                          <Boxes size={28} />
                        </div>
                        <h4>No hay existencias con estos criterios</h4>
                        <p>Ajusta los filtros de almacén o registra una nueva entrada de inventario.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStock.map((item) => {
                    const bodega = bodegas.find(b => b.id_bodega === item.id_bodega);
                    const mercancia = mercancias.find(m => m.id_mercancia === item.id_mercancia);
                    const categoria = mercancia ? categorias.find(c => c.id_categoria === mercancia.id_categoria) : null;

                    return (
                      <tr key={item.id_inventario}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Warehouse size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                            <div>
                              <div style={{ fontWeight: 600 }}>{bodega ? bodega.nombre : 'N/A'}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{bodega ? bodega.ubicacion : ''}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                            {mercancia ? mercancia.descripcion : 'N/A'}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            Unidad: {mercancia ? mercancia.unidad_medida : ''}
                          </div>
                        </td>
                        <td>
                          <span className="table-code-badge">{categoria ? categoria.codigo_partida : 'N/A'}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>
                            {Number(item.cantidad).toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
                            <Calendar size={13} style={{ color: 'var(--text-subtle)' }} />
                            <span>{item.fecha_ingreso}</span>
                          </div>
                        </td>
                        <td>
                          <Badge status={item.estado} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTENIDO TAB 2: HISTORIAL DE MOVIMIENTOS */}
      {activeTab === 'movimientos' && (
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha y Hora</th>
                  <th>Tipo de Movimiento</th>
                  <th>Mercancía</th>
                  <th>Bodega Destino / Origen</th>
                  <th>Cantidad</th>
                  <th>Motivo / Referencia Operativa</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovimientos.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <div className="empty-state-icon">
                          <ArrowRightLeft size={28} />
                        </div>
                        <h4>No hay movimientos registrados</h4>
                        <p>Los movimientos de entrada, salida o traslado aparecerán aquí.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMovimientos.map((m) => {
                    const mercancia = mercancias.find(item => item.id_mercancia === m.id_mercancia);
                    const bodega = bodegas.find(b => b.id_bodega === m.id_bodega);

                    const isEntrada = m.tipo === 'Entrada';
                    const isSalida = m.tipo === 'Salida';

                    return (
                      <tr key={m.id_movimiento}>
                        <td style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{m.fecha}</span>
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: isEntrada ? 'var(--status-success-bg)' : isSalida ? 'var(--status-danger-bg)' : 'var(--status-info-bg)',
                              color: isEntrada ? 'var(--status-success)' : isSalida ? 'var(--status-danger)' : 'var(--status-info)',
                              borderColor: isEntrada ? 'var(--status-success-border)' : isSalida ? 'var(--status-danger-border)' : 'var(--status-info-border)'
                            }}
                          >
                            {isEntrada ? <ArrowDownLeft size={13} /> : isSalida ? <ArrowUpRight size={13} /> : <ArrowRightLeft size={13} />}
                            <span>{m.tipo}</span>
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{mercancia ? mercancia.descripcion : 'N/A'}</div>
                        </td>
                        <td>{bodega ? bodega.nombre : 'N/A'}</td>
                        <td>
                          <span style={{ fontWeight: 700, fontSize: 15, color: isEntrada ? 'var(--status-success)' : isSalida ? 'var(--status-danger)' : 'var(--text-main)' }}>
                            {isEntrada ? '+' : isSalida ? '-' : ''}{m.cantidad.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{m.motivo}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR MOVIMIENTO */}
      <Modal
        isOpen={isMovModalOpen}
        onClose={() => setIsMovModalOpen(false)}
        title="Registrar Movimiento de Inventario"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, width: '100%' }}>
            <button onClick={() => setIsMovModalOpen(false)} className="btn btn-secondary">
              Cancelar
            </button>
            <button onClick={handleMovSubmit} className="btn btn-primary">
              Confirmar Movimiento
            </button>
          </div>
        }
      >
        <form onSubmit={handleMovSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Tipo de Operación *</label>
              <select
                className="form-select"
                value={movForm.tipo}
                onChange={(e) => setMovForm({ ...movForm, tipo: e.target.value })}
              >
                <option value="Entrada">Entrada (Descarga / Recepción Fiscal)</option>
                <option value="Salida">Salida (Despacho / Levante / Destrucción)</option>
                <option value="Traslado">Traslado entre Bodegas</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Cantidad a Mover *</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={movForm.cantidad}
                onChange={(e) => setMovForm({ ...movForm, cantidad: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mercancía *</label>
            <select
              className="form-select"
              value={movForm.id_mercancia}
              onChange={(e) => setMovForm({ ...movForm, id_mercancia: Number(e.target.value) })}
            >
              {mercancias.map(m => (
                <option key={m.id_mercancia} value={m.id_mercancia}>
                  {m.descripcion} ({m.unidad_medida})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Bodega / Depósito *</label>
            <select
              className="form-select"
              value={movForm.id_bodega}
              onChange={(e) => setMovForm({ ...movForm, id_bodega: Number(e.target.value) })}
            >
              {bodegas.map(b => (
                <option key={b.id_bodega} value={b.id_bodega}>
                  {b.nombre} — {b.ubicacion}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Motivo o Documento de Referencia *</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Ej: Descarga autorizada DUA-2026-0005, traslado para inspección técnica..."
              value={movForm.motivo}
              onChange={(e) => setMovForm({ ...movForm, motivo: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
