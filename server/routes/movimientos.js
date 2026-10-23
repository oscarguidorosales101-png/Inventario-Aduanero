import { Router } from 'express';
import pool, { query } from '../config/db.js';

const router = Router();

// GET /api/movimientos
router.get('/', async (req, res, next) => {
  try {
    const { bodega_id, tipo } = req.query;
    let sql = `
      SELECT
        mi.id_movimiento,
        mi.tipo,
        TO_CHAR(mi.fecha, 'YYYY-MM-DD HH24:MI:SS') AS fecha,
        mi.cantidad,
        mi.id_mercancia,
        mi.id_bodega,
        mi.motivo,
        b.nombre AS bodega_nombre,
        m.descripcion AS mercancia_descripcion,
        m.unidad_medida
      FROM movimiento_inventario mi
      JOIN bodega b ON mi.id_bodega = b.id_bodega
      JOIN mercancia m ON mi.id_mercancia = m.id_mercancia
      WHERE 1=1
    `;
    const params = [];

    if (bodega_id && bodega_id !== 'ALL') {
      params.push(bodega_id);
      sql += ` AND mi.id_bodega = $${params.length}`;
    }

    if (tipo && tipo !== 'ALL') {
      params.push(tipo);
      sql += ` AND mi.tipo = $${params.length}`;
    }

    sql += ` ORDER BY mi.fecha DESC, mi.id_movimiento DESC;`;

    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/movimientos (Transaccional)
router.post('/', async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { tipo, cantidad, id_mercancia, id_bodega, motivo } = req.body;

    if (!tipo || !cantidad || !id_mercancia || !id_bodega) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const validTipos = ['Entrada', 'Salida', 'Traslado'];
    if (!validTipos.includes(tipo)) {
      return res.status(400).json({ error: `Tipo no válido. Opciones: ${validTipos.join(', ')}` });
    }

    await client.query('BEGIN');

    // Determinar id_inventario
    let id_inv = req.body.id_inventario;
    if (!id_inv) {
      const invCheck = await client.query('SELECT id_inventario FROM inventario_bodega WHERE id_bodega = $1 AND id_mercancia = $2', [id_bodega, id_mercancia]);
      if (invCheck.rows.length > 0) id_inv = invCheck.rows[0].id_inventario;
    }

    // 1. Insertar movimiento
    const movRes = await client.query(
      `INSERT INTO movimiento_inventario (id_inventario, tipo, cantidad, id_mercancia, id_bodega, fecha, motivo)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6)
       RETURNING *;`,
      [id_inv || 1, tipo, cantidad, id_mercancia, id_bodega, motivo || `Movimiento de ${tipo}`]
    );

    // 2. Ajustar existencias en inventario_bodega
    const stockRes = await client.query(
      `SELECT * FROM inventario_bodega WHERE id_bodega = $1 AND id_mercancia = $2 FOR UPDATE;`,
      [id_bodega, id_mercancia]
    );

    if (stockRes.rows.length > 0) {
      const item = stockRes.rows[0];
      let nuevaCantidad = item.cantidad;
      if (tipo === 'Salida') {
        nuevaCantidad = Math.max(0, item.cantidad - Number(cantidad));
      } else if (tipo === 'Entrada') {
        nuevaCantidad = item.cantidad + Number(cantidad);
      }
      await client.query(
        `UPDATE inventario_bodega SET cantidad = $1 WHERE id_inventario = $2;`,
        [nuevaCantidad, item.id_inventario]
      );
    } else if (tipo === 'Entrada') {
      await client.query(
        `INSERT INTO inventario_bodega (id_bodega, id_mercancia, cantidad, fecha_ingreso, estado)
         VALUES ($1, $2, $3, CURRENT_DATE, 'Retenido');`,
        [id_bodega, id_mercancia, cantidad]
      );
    }

    await client.query('COMMIT');
    res.status(201).json(movRes.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

export default router;
