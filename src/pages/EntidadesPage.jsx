import React, { useState } from 'react';
import { Building2, UserCheck, Globe, Users, Search, Phone, Mail, MapPin, Award } from 'lucide-react';
import { useCustoms } from '../context/CustomsContext';

export default function EntidadesPage() {
  const { importadores, agentes, paises, funcionarios } = useCustoms();
  const [activeTab, setActiveTab] = useState('importadores');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredImportadores = importadores.filter(i =>
    i.nombre_razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.nit_ruc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAgentes = agentes.filter(a =>
    a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.licencia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPaises = paises.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigo_iso.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFuncionarios = funcionarios.filter(f =>
    f.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in">
      {/* Pestañas de Entidades */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => { setActiveTab('importadores'); setSearchTerm(''); }}
          className={`btn btn-sm ${activeTab === 'importadores' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Building2 size={15} />
          <span>Importadores ({importadores.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('agentes'); setSearchTerm(''); }}
          className={`btn btn-sm ${activeTab === 'agentes' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Award size={15} />
          <span>Agentes Aduanales ({agentes.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('paises'); setSearchTerm(''); }}
          className={`btn btn-sm ${activeTab === 'paises' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Globe size={15} />
          <span>Países ({paises.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('funcionarios'); setSearchTerm(''); }}
          className={`btn btn-sm ${activeTab === 'funcionarios' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <UserCheck size={15} />
          <span>Funcionarios Aduaneros ({funcionarios.length})</span>
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={18} />
          <input
            type="text"
            className="form-control"
            placeholder={`Buscar en ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TAB 1: IMPORTADORES */}
      {activeTab === 'importadores' && (
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>NIT / RUC</th>
                  <th>Nombre o Razón Social</th>
                  <th>Dirección Fiscal</th>
                  <th>Teléfono</th>
                  <th>Correo de Notificaciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredImportadores.map(imp => (
                  <tr key={imp.id_importador}>
                    <td>
                      <span className="table-code-badge" style={{ fontWeight: 700 }}>
                        {imp.nit_ruc}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {imp.nombre_razon_social}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-muted)' }}>
                        <MapPin size={13} style={{ color: 'var(--text-subtle)' }} />
                        <span>{imp.direccion}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
                        <Phone size={13} style={{ color: 'var(--text-subtle)' }} />
                        <span>{imp.telefono}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--primary)' }}>
                        <Mail size={13} />
                        <span>{imp.correo}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AGENTES ADUANALES */}
      {activeTab === 'agentes' && (
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Licencia Aduanera</th>
                  <th>Nombre del Agente Autorizado</th>
                  <th>Teléfono de Contacto</th>
                  <th>Estado del Padrón</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgentes.map(ag => (
                  <tr key={ag.id_agente}>
                    <td>
                      <span className="table-code-badge" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                        {ag.licencia}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{ag.nombre}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                        <Phone size={14} style={{ color: 'var(--text-subtle)' }} />
                        <span>{ag.telefono}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-liberada">Activo / Autorizado</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PAÍSES */}
      {activeTab === 'paises' && (
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código ISO</th>
                  <th>Nombre del País</th>
                  <th>Región Geográfica</th>
                </tr>
              </thead>
              <tbody>
                {filteredPaises.map(p => (
                  <tr key={p.id_pais}>
                    <td>
                      <span className="table-code-badge" style={{ fontWeight: 700, fontSize: 13 }}>
                        {p.codigo_iso}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                        <Globe size={15} style={{ color: 'var(--primary)' }} />
                        <span>{p.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                        {['US', 'CA', 'MX'].includes(p.codigo_iso) ? 'América del Norte' :
                         ['CR', 'CO', 'BR', 'CL'].includes(p.codigo_iso) ? 'América Latina' :
                         ['CN', 'JP', 'KR', 'VN', 'IN', 'TW'].includes(p.codigo_iso) ? 'Asia Pacífico' : 'Europa'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: FUNCIONARIOS */}
      {activeTab === 'funcionarios' && (
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Funcionario</th>
                  <th>Nombre y Apellidos</th>
                  <th>Cargo Oficial</th>
                  <th>Supervisor Jerárquico</th>
                </tr>
              </thead>
              <tbody>
                {filteredFuncionarios.map(f => {
                  const supervisor = funcionarios.find(sup => sup.id_funcionario === f.id_supervisor);
                  return (
                    <tr key={f.id_funcionario}>
                      <td>
                        <span className="table-code-badge">FUNC-{String(f.id_funcionario).padStart(3, '0')}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                          <UserCheck size={16} style={{ color: 'var(--primary)' }} />
                          <span>{f.nombre}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 500, fontSize: 13 }}>{f.cargo}</span>
                      </td>
                      <td>
                        {supervisor ? (
                          <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{supervisor.nombre}</span> ({supervisor.cargo})
                          </div>
                        ) : (
                          <span className="badge badge-secondary" style={{ fontSize: 11 }}>
                            Nivel Superior
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
