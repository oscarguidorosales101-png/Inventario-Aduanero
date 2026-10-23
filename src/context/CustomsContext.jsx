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
  const [detalles, setDetalles] = useState([]);

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
        funcsRes,
        detsRes
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
        apiService.getFuncionarios(),
        apiService.getDetallesDeclaracion()
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
      setDetalles(detsRes.data || []);

      setIsLiveBackend(connectionStatus.isLiveBackend);
    } catch (err) {
      console.error('Error cargando datos aduaneros:', err);
      showToast('Error cargando datos del sistema', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Operaciones de negocio en el frontend
  const addDeclaracion = (newDua) => {
    const id = declaraciones.length > 0 ? Math.max(...declaraciones.map(d => d.id_declaracion)) + 1 : 1;
    const duaCompleta = { ...newDua, id_declaracion: id };
    setDeclaraciones([duaCompleta, ...declaraciones]);
    showToast(`Declaración ${duaCompleta.numero_declaracion} registrada correctamente`);
  };

  const updateDeclaracionEstado = (id, nuevoEstado) => {
    setDeclaraciones(prev => prev.map(d => d.id_declaracion === id ? { ...d, estado: nuevoEstado } : d));
    showToast(`Estado de declaración actualizado a "${nuevoEstado}"`);
  };

  const addMovimientoInventario = (mov) => {
    const id = movimientos.length > 0 ? Math.max(...movimientos.map(m => m.id_movimiento)) + 1 : 1;
    const fechaActual = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const nuevoMov = { ...mov, id_movimiento: id, fecha: fechaActual };
    setMovimientos([nuevoMov, ...movimientos]);

    // Actualizar existencias en inventario_bodega
    setInventario(prev => {
      const idx = prev.findIndex(item => item.id_bodega === Number(mov.id_bodega) && item.id_mercancia === Number(mov.id_mercancia));
      if (idx !== -1) {
        const itemActual = prev[idx];
        const delta = mov.tipo === 'Salida' ? -Number(mov.cantidad) : Number(mov.cantidad);
        const nuevaCant = Math.max(0, itemActual.cantidad + delta);
        const updated = [...prev];
        updated[idx] = { ...itemActual, cantidad: nuevaCant };
        return updated;
      } else if (mov.tipo === 'Entrada') {
        return [...prev, {
          id_inventario: prev.length + 1,
          id_bodega: Number(mov.id_bodega),
          id_mercancia: Number(mov.id_mercancia),
          cantidad: Number(mov.cantidad),
          fecha_ingreso: fechaActual.substring(0, 10),
          estado: 'Retenido'
        }];
      }
      return prev;
    });

    showToast(`Movimiento de ${mov.tipo} registrado con éxito`);
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
        detalles,
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
