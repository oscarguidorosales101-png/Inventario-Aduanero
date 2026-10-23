import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// GET /api/categorias
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM categoria_partida ORDER BY id_categoria ASC;');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
