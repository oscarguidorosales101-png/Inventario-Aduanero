import React, { useState } from 'react';
import { Warehouse, MapPin, Boxes, Search, Plus, Shield } from 'lucide-react';
import { useCustoms } from '../context/CustomsContext';
import Badge from '../components/common/Badge';

export default function BodegasPage() {
  const { bodegas, inventario, mercancias } = useCustoms();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBodegas = bodegas.filter(b =>
    b.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={18} />
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o ubicación de bodega..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        {filteredBodegas.map((b) => {
          const itemsEnBodega = inventario.filter(i => i.id_bodega === b.id_bodega);
          const totalStock = itemsEnBodega.reduce((acc, curr) => acc + Number(curr.cantidad || 0), 0);
          const porcentaje = Math.min(100, Math.round((totalStock / b.capacidad) * 100));

          return (
            <div key={b.id_bodega} className="card">
              <div className="card-header" style={{ paddingBottom: 16 }}>
                <div>
                  <div className="card-title">
                    <Warehouse size={18} style={{ color: 'var(--primary)' }} />
                    <span>{b.nombre}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    <MapPin size={13} style={{ color: 'var(--text-subtle)' }} />
                    <span>{b.ubicacion}</span>
                  </div>
                </div>
                <span className="badge badge-secondary" style={{ fontFamily: 'var(--font-mono)' }}>
                  BOD-{String(b.id_bodega).padStart(3, '0')}
                </span>
              </div>

              <div className="card-body">
                {/* Métricas de Capacidad */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Capacidad de Almacenaje:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                    {totalStock.toLocaleString()} / {b.capacidad.toLocaleString()} ({porcentaje}%)
                  </span>
                </div>

                <div
                  style={{
                    height: 10,
                    width: '100%',
                    backgroundColor: 'var(--bg-surface-alt)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    marginBottom: 20
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${porcentaje}%`,
                      backgroundColor: porcentaje > 85 ? 'var(--status-danger)' : porcentaje > 50 ? '#d97706' : 'var(--primary)',
                      borderRadius: 'var(--radius-full)'
                    }}
                  ></div>
                </div>

                {/* Lista de Mercancías en esta Bodega */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
                    Lotes en Custodia ({itemsEnBodega.length})
                  </div>

                  {itemsEnBodega.length === 0 ? (
                    <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                      Sin mercancías registradas en este momento.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {itemsEnBodega.slice(0, 3).map(item => {
                        const m = mercancias.find(mer => mer.id_mercancia === item.id_mercancia);
                        return (
                          <div
                            key={item.id_inventario}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: 12.5,
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--bg-surface-alt)'
                            }}
                          >
                            <span style={{ fontWeight: 600, color: 'var(--text-main)', maxWidth: '65%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {m ? m.descripcion : `Mercancía #${item.id_mercancia}`}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontWeight: 700 }}>{item.cantidad.toLocaleString()}</span>
                              <Badge status={item.estado} />
                            </div>
                          </div>
                        );
                      })}
                      {itemsEnBodega.length > 3 && (
                        <div style={{ fontSize: 11.5, color: 'var(--primary)', textAlign: 'center', marginTop: 4 }}>
                          + {itemsEnBodega.length - 3} lotes adicionales
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
