import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// GET /api/inspecciones
router.get('/', async (req, res, next) => {
  try {
    const { resultado } = req.query;
    let sql = `
      SELECT
        i.id_inspeccion,
        TO_CHAR(i.fecha, 'YYYY-MM-DD') AS fecha,
        i.resultado,
        i.observaciones,
        i.id_declaracion,
        i.id_funcionario,
        d.numero_declaracion,
        f.nombre AS funcionario_nombre,
        f.cargo AS funcionario_cargo
      FROM inspeccion i
      JOIN declaracion_aduanera d ON i.id_declaracion = d.id_declaracion
      JOIN funcionario f ON i.id_funcionario = f.id_funcionario
      WHERE 1=1
    `;
    const params = [];

    if (resultado && resultado !== 'ALL') {
      params.push(resultado);
      sql += ` AND i.resultado = $${params.length}`;
    }

    sql += ` ORDER BY i.fecha DESC, i.id_inspeccion DESC;`;

    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/inspecciones
router.post('/', async (req, res, next) => {
  try {
    const { fecha, resultado, observaciones, id_declaracion, id_funcionario } = req.body;

    if (!fecha || !resultado || !observaciones || !id_declaracion || !id_funcionario) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const validResultados = ['Aprobada', 'Con Observaciones', 'Retenida'];
    if (!validResultados.includes(resultado)) {
      return res.status(400).json({ error: `Resultado no válido. Opciones: ${validResultados.join(', ')}` });
    }

    const result = await query(
      `INSERT INTO inspeccion (fecha, resultado, observaciones, id_declaracion, id_funcionario)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *;`,
      [fecha, resultado, observaciones, id_declaracion, id_funcionario]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
