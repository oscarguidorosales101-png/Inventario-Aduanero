import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// GET /api/inventario
router.get('/', async (req, res, next) => {
  try {
    const { bodega_id, estado } = req.query;
    let sql = `
      SELECT
        ib.id_inventario,
        ib.id_bodega,
        ib.id_mercancia,
        ib.cantidad,
        TO_CHAR(ib.fecha_ingreso, 'YYYY-MM-DD') AS fecha_ingreso,
        ib.estado,
        b.nombre AS bodega_nombre,
        b.ubicacion AS bodega_ubicacion,
        m.descripcion AS mercancia_descripcion,
        m.unidad_medida,
        cp.codigo_partida
      FROM inventario_bodega ib
      JOIN bodega b ON ib.id_bodega = b.id_bodega
      JOIN mercancia m ON ib.id_mercancia = m.id_mercancia
      JOIN categoria_partida cp ON m.id_categoria = cp.id_categoria
      WHERE 1=1
    `;
    const params = [];

    if (bodega_id && bodega_id !== 'ALL') {
      params.push(bodega_id);
      sql += ` AND ib.id_bodega = $${params.length}`;
    }

    if (estado && estado !== 'ALL') {
      params.push(estado);
      sql += ` AND ib.estado = $${params.length}`;
    }

    sql += ` ORDER BY ib.id_bodega, ib.cantidad DESC;`;

    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
