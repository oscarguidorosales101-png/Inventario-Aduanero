import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// GET /api/bodegas
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await query(`
      SELECT
        b.id_bodega,
        b.nombre,
        COALESCE(b.tipo, 'Fiscal') AS tipo,
        b.ubicacion,
        b.capacidad,
        COALESCE(SUM(ib.cantidad), 0) AS stock_total
      FROM bodega b
      LEFT JOIN inventario_bodega ib ON b.id_bodega = ib.id_bodega
      GROUP BY b.id_bodega, b.nombre, b.tipo, b.ubicacion, b.capacidad
      ORDER BY b.id_bodega ASC;
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
