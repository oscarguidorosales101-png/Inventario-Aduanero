import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, connectionStatus } from '../services/api';

const CustomsContext = createContext(null);

export function CustomsProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [toast, setToast] = useState(null);

  // Colecciones de datos
  const [declaraciones, setDeclaraciones] = useState([]);
  const [mercancias, setMercancias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [contenedores, setContenedores] = useState([]);
  const [inspecciones, setInspecciones] = useState([]);
  const [importadores, setImportadores] = useState([]);
  const [agentes, setAgentes] = useState([]);
  const [paises, setPaises] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);

  // Notificación tipo toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        decsRes,
        mercsRes,
        catsRes,
        bodsRes,
        invsRes,
        movsRes,
        contsRes,
        inspsRes,
        impsRes,
        agtsRes,
        paissRes,
        funcsRes
      ] = await Promise.all([
        apiService.getDeclaraciones(),
        apiService.getMercancias(),
        apiService.getCategorias(),
        apiService.getBodegas(),
        apiService.getInventario(),
        apiService.getMovimientos(),
        apiService.getContenedores(),
        apiService.getInspecciones(),
        apiService.getImportadores(),
        apiService.getAgentes(),
        apiService.getPaises(),
        apiService.getFuncionarios()
      ]);

      setDeclaraciones(decsRes.data || []);
      setMercancias(mercsRes.data || []);
      setCategorias(catsRes.data || []);
      setBodegas(bodsRes.data || []);
      setInventario(invsRes.data || []);
      setMovimientos(movsRes.data || []);
      setContenedores(contsRes.data || []);
      setInspecciones(inspsRes.data || []);
      setImportadores(impsRes.data || []);
      setAgentes(agtsRes.data || []);
      setPaises(paissRes.data || []);
      setFuncionarios(funcsRes.data || []);

      const health = await apiService.checkHealth();
      setIsLiveBackend(health.status === 'online');
    } catch (err) {
      console.error('Error cargando datos aduaneros:', err);
      showToast('Error conectando a los servicios de la base de datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Operaciones de negocio conectadas al Backend REST y PostgreSQL
  const addDeclaracion = async (newDua) => {
    try {
      const res = await apiService.createDeclaracion(newDua);
      if (res.data) {
        setDeclaraciones(prev => [res.data, ...prev]);
        showToast(`Declaración ${newDua.numero_declaracion} guardada en PostgreSQL.`);
      } else {
        // En caso de modo desconectado local
        const id = declaraciones.length > 0 ? Math.max(...declaraciones.map(d => d.id_declaracion)) + 1 : 1;
        setDeclaraciones(prev => [{ ...newDua, id_declaracion: id }, ...prev]);
        showToast(`Declaración registrada localmente.`);
      }
    } catch (err) {
      showToast(`Error guardando declaración: ${err.message}`, 'error');
    }
  };

  const updateDeclaracionEstado = async (id, nuevoEstado) => {
    try {
      const res = await apiService.updateDeclaracionEstado(id, nuevoEstado);
      if (res.data) {
        setDeclaraciones(prev => prev.map(d => d.id_declaracion === id ? { ...d, estado: nuevoEstado } : d));
        showToast(`Estado actualizado a "${nuevoEstado}" en PostgreSQL.`);
      } else {
        setDeclaraciones(prev => prev.map(d => d.id_declaracion === id ? { ...d, estado: nuevoEstado } : d));
        showToast(`Estado actualizado localmente a "${nuevoEstado}".`);
      }
    } catch (err) {
      showToast(`Error actualizando estado: ${err.message}`, 'error');
    }
  };

  const addMovimientoInventario = async (mov) => {
    try {
      const res = await apiService.createMovimiento(mov);
      if (res.data) {
        setMovimientos(prev => [res.data, ...prev]);
        // Refrescar inventario para reflejar el cambio transaccional de PostgreSQL
        const invRes = await apiService.getInventario();
        if (invRes.data) setInventario(invRes.data);
        showToast(`Movimiento de ${mov.tipo} registrado en PostgreSQL con ajuste de stock.`);
      } else {
        // Fallback local
        const id = movimientos.length > 0 ? Math.max(...movimientos.map(m => m.id_movimiento)) + 1 : 1;
        const fechaActual = new Date().toISOString().replace('T', ' ').substring(0, 19);
        setMovimientos(prev => [{ ...mov, id_movimiento: id, fecha: fechaActual }, ...prev]);
        showToast(`Movimiento registrado localmente.`);
      }
    } catch (err) {
      showToast(`Error registrando movimiento: ${err.message}`, 'error');
    }
  };

  return (
    <CustomsContext.Provider
      value={{
        loading,
        isLiveBackend,
        toast,
        showToast,
        refreshData: loadAllData,
        // Colecciones
        declaraciones,
        mercancias,
        categorias,
        bodegas,
        inventario,
        movimientos,
        contenedores,
        inspecciones,
        importadores,
        agentes,
        paises,
        funcionarios,
        // Acciones
        addDeclaracion,
        updateDeclaracionEstado,
        addMovimientoInventario
      }}
    >
      {children}
    </CustomsContext.Provider>
  );
}

export function useCustoms() {
  const context = useContext(CustomsContext);
  if (!context) {
    throw new Error('useCustoms debe usarse dentro de un CustomsProvider');
  }
  return context;
}
