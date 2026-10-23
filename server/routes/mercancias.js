import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// GET /api/mercancias
router.get('/', async (req, res, next) => {
  try {
    const { categoria_id } = req.query;
    let sql = `
      SELECT
        m.id_mercancia,
        m.descripcion,
        m.unidad_medida,
        COALESCE(m.valor_fob, m.valor_unitario) AS valor_fob,
        COALESCE(m.valor_fob, m.valor_unitario) AS valor_unitario,
        m.id_categoria,
        cp.codigo_partida,
        cp.descripcion AS categoria_descripcion,
        COALESCE(cp.tasa_arancelaria, cp.porcentaje_arancel) AS tasa_arancelaria,
        COALESCE(cp.tasa_arancelaria, cp.porcentaje_arancel) AS porcentaje_arancel
      FROM mercancia m
      JOIN categoria_partida cp ON m.id_categoria = cp.id_categoria
    `;
    const params = [];

    if (categoria_id && categoria_id !== 'ALL') {
      params.push(categoria_id);
      sql += ` WHERE m.id_categoria = $1`;
    }

    sql += ` ORDER BY m.id_mercancia ASC;`;

    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/mercancias
router.post('/', async (req, res, next) => {
  try {
    const { descripcion, unidad_medida, id_categoria } = req.body;
    const valor = req.body.valor_fob || req.body.valor_unitario;

    if (!descripcion || !unidad_medida || !valor || !id_categoria) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const result = await query(
      `INSERT INTO mercancia (descripcion, unidad_medida, valor_unitario, valor_fob, id_categoria)
       VALUES ($1, $2, $3, $3, $4)
       RETURNING *;`,
      [descripcion, unidad_medida, valor, id_categoria]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
