import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// GET /api/contenedores
router.get('/', async (req, res, next) => {
  try {
    const { tipo, search } = req.query;
    let sql = `
      SELECT
        c.id_contenedor,
        c.numero_contenedor,
        c.tipo,
        c.peso,
        c.id_declaracion,
        d.numero_declaracion,
        d.estado AS declaracion_estado,
        i.nombre_razon_social AS importador_nombre,
        p.nombre AS pais_origen
      FROM contenedor c
      JOIN declaracion_aduanera d ON c.id_declaracion = d.id_declaracion
      JOIN importador i ON d.id_importador = i.id_importador
      JOIN pais p ON d.id_pais_origen = p.id_pais
      WHERE 1=1
    `;
    const params = [];

    if (tipo && tipo !== 'ALL') {
      params.push(`%${tipo}%`);
      sql += ` AND c.tipo ILIKE $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (c.numero_contenedor ILIKE $${params.length} OR d.numero_declaracion ILIKE $${params.length})`;
    }

    sql += ` ORDER BY c.id_contenedor ASC;`;

    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
