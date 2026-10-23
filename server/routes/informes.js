import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// GET /api/informes/1: Declaraciones por mes y régimen
router.get('/1', async (req, res, next) => {
  try {
    const sql = `
      SELECT TO_CHAR(fecha, 'YYYY-MM') AS mes, regimen, COUNT(*) AS total_declaraciones
      FROM declaracion_aduanera
      GROUP BY TO_CHAR(fecha, 'YYYY-MM'), regimen
      ORDER BY mes DESC, total_declaraciones DESC;
    `;
    const { rows } = await query(sql);
    res.json({ sql, rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/informes/2: Mercancías retenidas en bodegas
router.get('/2', async (req, res, next) => {
  try {
    const sql = `
      SELECT b.nombre AS bodega, m.descripcion AS mercancia, cp.codigo_partida, ib.cantidad,
             TO_CHAR(ib.fecha_ingreso, 'YYYY-MM-DD') AS fecha_ingreso, ib.estado
      FROM inventario_bodega ib
      JOIN bodega b ON ib.id_bodega = b.id_bodega
      JOIN mercancia m ON ib.id_mercancia = m.id_mercancia
      JOIN categoria_partida cp ON m.id_categoria = cp.id_categoria
      WHERE ib.estado = 'Retenido'
      ORDER BY ib.cantidad DESC;
    `;
    const { rows } = await query(sql);
    res.json({ sql, rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/informes/3: Países con mayor volumen de contenedores recibidos
router.get('/3', async (req, res, next) => {
  try {
    const sql = `
      SELECT p.nombre AS pais, p.codigo_iso, COUNT(c.id_contenedor) AS total_contenedores, SUM(c.peso) AS peso_total_kg
      FROM pais p
      JOIN declaracion_aduanera d ON p.id_pais = d.id_pais_origen
      JOIN contenedor c ON d.id_declaracion = c.id_declaracion
      GROUP BY p.nombre, p.codigo_iso
      ORDER BY total_contenedores DESC;
    `;
    const { rows } = await query(sql);
    res.json({ sql, rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/informes/4: Ranking de importadores por valor total declarado
router.get('/4', async (req, res, next) => {
  try {
    const sql = `
      SELECT imp.nombre_razon_social, imp.nit_ruc, COUNT(DISTINCT d.id_declaracion) AS total_duas,
             SUM(dd.valor_declarado) AS valor_total_usd
      FROM importador imp
      JOIN declaracion_aduanera d ON imp.id_importador = d.id_importador
      JOIN detalle_declaracion dd ON d.id_declaracion = dd.id_declaracion
      GROUP BY imp.id_importador, imp.nombre_razon_social, imp.nit_ruc
      ORDER BY valor_total_usd DESC;
    `;
    const { rows } = await query(sql);
    res.json({ sql, rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/informes/5: Inspecciones con observaciones o rechazos
router.get('/5', async (req, res, next) => {
  try {
    const sql = `
      SELECT TO_CHAR(i.fecha, 'YYYY-MM-DD') AS fecha, d.numero_declaracion, i.resultado,
             f.nombre AS funcionario_inspector, f.cargo, i.observaciones
      FROM inspeccion i
      JOIN declaracion_aduanera d ON i.id_declaracion = d.id_declaracion
      JOIN funcionario f ON i.id_funcionario = f.id_funcionario
      WHERE i.resultado IN ('Con Observaciones', 'Retenida')
      ORDER BY i.fecha DESC;
    `;
    const { rows } = await query(sql);
    res.json({ sql, rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/informes/6: Stock consolidado por producto en todas las bodegas
router.get('/6', async (req, res, next) => {
  try {
    const sql = `
      SELECT m.descripcion, cp.codigo_partida, m.unidad_medida, COALESCE(SUM(ib.cantidad), 0) AS stock_total,
             COALESCE(SUM(CASE WHEN ib.estado = 'Liberado' THEN ib.cantidad ELSE 0 END), 0) AS stock_liberado,
             COALESCE(SUM(CASE WHEN ib.estado = 'Retenido' THEN ib.cantidad ELSE 0 END), 0) AS stock_retenido
      FROM mercancia m
      JOIN categoria_partida cp ON m.id_categoria = cp.id_categoria
      LEFT JOIN inventario_bodega ib ON m.id_mercancia = ib.id_mercancia
      GROUP BY m.id_mercancia, m.descripcion, cp.codigo_partida, m.unidad_medida
      ORDER BY stock_total DESC;
    `;
    const { rows } = await query(sql);
    res.json({ sql, rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/informes/7: Historial de movimientos de inventario por período y tipo
router.get('/7', async (req, res, next) => {
  try {
    const sql = `
      SELECT TO_CHAR(mi.fecha, 'YYYY-MM-DD HH24:MI:SS') AS fecha, mi.tipo, b.nombre AS bodega,
             m.descripcion AS producto, mi.cantidad, mi.motivo
      FROM movimiento_inventario mi
      JOIN bodega b ON mi.id_bodega = b.id_bodega
      JOIN mercancia m ON mi.id_mercancia = m.id_mercancia
      ORDER BY mi.fecha DESC;
    `;
    const { rows } = await query(sql);
    res.json({ sql, rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/informes/8: Eficiencia de agentes aduanales
router.get('/8', async (req, res, next) => {
  try {
    const sql = `
      SELECT a.nombre AS agente, a.licencia, COUNT(d.id_declaracion) AS total_tramites,
             COALESCE(SUM(CASE WHEN d.estado = 'Liberada' THEN 1 ELSE 0 END), 0) AS duas_liberadas,
             COALESCE(SUM(CASE WHEN d.estado = 'Retenida' THEN 1 ELSE 0 END), 0) AS duas_retenidas
      FROM agente_aduanal a
      LEFT JOIN declaracion_aduanera d ON a.id_agente = d.id_agente
      GROUP BY a.id_agente, a.nombre, a.licencia
      ORDER BY total_tramites DESC;
    `;
    const { rows } = await query(sql);
    res.json({ sql, rows });
  } catch (err) {
    next(err);
  }
});

export default router;
