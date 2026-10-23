import React, { useState } from 'react';
import { Package, Search, Plus, Tag, DollarSign, Calculator } from 'lucide-react';
import { useCustoms } from '../context/CustomsContext';
import Modal from '../components/common/Modal';

export default function MercanciasPage() {
  const { mercancias, categorias, showToast } = useCustoms();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('ALL');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Formulario nuevo producto
  const [formData, setFormData] = useState({
    descripcion: '',
    unidad_medida: 'Unidades',
    valor_unitario: '',
    id_categoria: 1
  });

  const filteredMercancias = mercancias.filter((item) => {
    const matchesSearch = item.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoria === 'ALL' || item.id_categoria === Number(selectedCategoria);
    return matchesSearch && matchesCategory;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.descripcion.trim()) return;

    showToast(`Mercancía "${formData.descripcion}" agregada al catálogo.`);
    setIsNewModalOpen(false);
    setFormData({
      descripcion: '',
      unidad_medida: 'Unidades',
      valor_unitario: '',
      id_categoria: 1
    });
  };

  return (
    <div className="fade-in">
      {/* Filtros y Acciones */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={18} />
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por descripción de mercancía..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
          >
            <option value="ALL">Todas las Partidas Arancelarias</option>
            {categorias.map(c => (
              <option key={c.id_categoria} value={c.id_categoria}>
                {c.codigo_partida} · {c.descripcion.substring(0, 35)}...
              </option>
            ))}
          </select>

          <button onClick={() => setIsNewModalOpen(true)} className="btn btn-primary">
            <Plus size={16} />
            <span>Registrar Mercancía</span>
          </button>
        </div>
      </div>

      {/* Tabla de Mercancías */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código / ID</th>
                <th>Descripción del Producto</th>
                <th>Partida Arancelaria (HS)</th>
                <th>Unidad de Medida</th>
                <th>Tasa Arancel</th>
                <th>Valor Unitario (USD)</th>
                <th>Arancel Estimado</th>
              </tr>
            </thead>
            <tbody>
              {filteredMercancias.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Package size={28} />
                      </div>
                      <h4>No hay mercancías registradas</h4>
                      <p>Ajusta el término de búsqueda o agrega un nuevo producto al catálogo aduanero.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMercancias.map((m) => {
                  const cat = categorias.find(c => c.id_categoria === m.id_categoria);
                  const tasa = cat ? Number(cat.porcentaje_arancel) : 0;
                  const arancelUnitario = (Number(m.valor_unitario) * tasa) / 100;

                  return (
                    <tr key={m.id_mercancia}>
                      <td>
                        <span className="table-code-badge">PROD-{String(m.id_mercancia).padStart(4, '0')}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{m.descripcion}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Tag size={13} style={{ color: 'var(--primary)' }} />
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                            {cat ? cat.codigo_partida : 'Sin partida'}
                          </span>
                        </div>
                        {cat && (
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {cat.descripcion}
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{m.unidad_medida}</span>
                      </td>
                      <td>
                        <span className="badge badge-secondary" style={{ fontWeight: 700 }}>
                          {tasa}%
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        ${Number(m.valor_unitario).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: 'var(--primary)' }}>
                          <Calculator size={13} />
                          <span>${arancelUnitario.toFixed(2)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Mercancía */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Registrar Nueva Mercancía en Catálogo"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, width: '100%' }}>
            <button onClick={() => setIsNewModalOpen(false)} className="btn btn-secondary">
              Cancelar
            </button>
            <button onClick={handleCreateSubmit} className="btn btn-primary">
              Guardar en Catálogo
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <label className="form-label">Descripción Detallada de la Mercancía *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej: Laptops Ultrabook 14 pulgadas..."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Unidad de Medida *</label>
              <select
                className="form-select"
                value={formData.unidad_medida}
                onChange={(e) => setFormData({ ...formData, unidad_medida: e.target.value })}
              >
                <option value="Unidades">Unidades</option>
                <option value="Docenas">Docenas</option>
                <option value="Cajas">Cajas</option>
                <option value="Sacos">Sacos (50kg)</option>
                <option value="Quintales">Quintales</option>
                <option value="Toneladas">Toneladas</option>
                <option value="Pares">Pares</option>
                <option value="Sets">Sets</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Valor Unitario FOB (USD) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                placeholder="0.00"
                value={formData.valor_unitario}
                onChange={(e) => setFormData({ ...formData, valor_unitario: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Partida Arancelaria (Sistema Armonizado) *</label>
            <select
              className="form-select"
              value={formData.id_categoria}
              onChange={(e) => setFormData({ ...formData, id_categoria: Number(e.target.value) })}
            >
              {categorias.map(cat => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.codigo_partida} · {cat.descripcion} (Arancel: {cat.porcentaje_arancel}%)
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
