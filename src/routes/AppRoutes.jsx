import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import Toast from '../components/common/Toast';
import { useCustoms } from '../context/CustomsContext';

// Páginas
import DashboardPage from '../pages/DashboardPage';
import DeclaracionesPage from '../pages/DeclaracionesPage';
import MercanciasPage from '../pages/MercanciasPage';
import InventarioPage from '../pages/InventarioPage';
import BodegasPage from '../pages/BodegasPage';
import ContenedoresPage from '../pages/ContenedoresPage';
import InspeccionesPage from '../pages/InspeccionesPage';
import EntidadesPage from '../pages/EntidadesPage';
import InformesPage from '../pages/InformesPage';
import AsistenteIAPage from '../pages/AsistenteIAPage';
import ConfiguracionPage from '../pages/ConfiguracionPage';

export default function AppRoutes() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useCustoms();

  return (
    <div className="app-layout">
      {/* Barra lateral */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Contenedor Principal */}
      <div className="main-wrapper">
        <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

        <main className="page-container">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/declaraciones" element={<DeclaracionesPage />} />
            <Route path="/mercancias" element={<MercanciasPage />} />
            <Route path="/inventario" element={<InventarioPage />} />
            <Route path="/bodegas" element={<BodegasPage />} />
            <Route path="/contenedores" element={<ContenedoresPage />} />
            <Route path="/inspecciones" element={<InspeccionesPage />} />
            <Route path="/entidades" element={<EntidadesPage />} />
            <Route path="/informes" element={<InformesPage />} />
            <Route path="/asistente" element={<AsistenteIAPage />} />
            <Route path="/configuracion" element={<ConfiguracionPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Toast Feedback */}
      <Toast toast={toast} />
    </div>
  );
}
