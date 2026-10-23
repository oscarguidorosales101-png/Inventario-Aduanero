import React, { useState } from 'react';
import { Container, Search, Scale, FileText, Globe } from 'lucide-react';
import { useCustoms } from '../context/CustomsContext';
import Badge from '../components/common/Badge';

export default function ContenedoresPage() {
  const { contenedores, declaraciones, importadores, paises } = useCustoms();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('ALL');

  const filteredContenedores = contenedores.filter(c => {
    const dua = declaraciones.find(d => d.id_declaracion === c.id_declaracion);
    const matchesSearch =
      c.numero_contenedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dua && dua.numero_declaracion.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTipo = filterTipo === 'ALL' || c.tipo.toLowerCase().includes(filterTipo.toLowerCase());
    return matchesSearch && matchesTipo;
  });

  return (
    <div className="fade-in">
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={18} />
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por número de contenedor o DUA..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
        >
          <option value="ALL">Todos los Tipos de Contenedor</option>
          <option value="20ft">Contenedores 20ft</option>
          <option value="40ft">Contenedores 40ft</option>
          <option value="High Cube">High Cube</option>
          <option value="Reefer">Refrigerados (Reefer)</option>
          <option value="Open Top">Open Top</option>
        </select>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Número de Contenedor</th>
                <th>Tipo de Unidad</th>
                <th>Peso Bruto</th>
                <th>Declaración (DUA) Vinculada</th>
                <th>Importador Destinatario</th>
                <th>País Procedencia</th>
                <th>Estado DUA</th>
              </tr>
            </thead>
            <tbody>
              {filteredContenedores.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Container size={28} />
                      </div>
                      <h4>No se encontraron contenedores</h4>
                      <p>Ajusta los términos de búsqueda o filtros de tipo.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContenedores.map(c => {
                  const dua = declaraciones.find(d => d.id_declaracion === c.id_declaracion);
                  const imp = dua ? importadores.find(i => i.id_importador === dua.id_importador) : null;
                  const pais = dua ? paises.find(p => p.id_pais === dua.id_pais_origen) : null;

                  return (
                    <tr key={c.id_contenedor}>
                      <td>
                        <span className="table-code-badge" style={{ fontWeight: 700, fontSize: 13 }}>
                          {c.numero_contenedor}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Container size={15} style={{ color: '#2563eb' }} />
                          <span style={{ fontWeight: 600 }}>{c.tipo}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Scale size={14} style={{ color: 'var(--text-subtle)' }} />
                          <span style={{ fontWeight: 700 }}>{Number(c.peso).toLocaleString()} kg</span>
                        </div>
                      </td>
                      <td>
                        <span className="table-code-badge" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                          {dua ? dua.numero_declaracion : `DUA #${c.id_declaracion}`}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>
                          {imp ? imp.nombre_razon_social : 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
                          <Globe size={13} style={{ color: 'var(--text-subtle)' }} />
                          <span>{pais ? pais.nombre : 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        {dua ? <Badge status={dua.estado} /> : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
