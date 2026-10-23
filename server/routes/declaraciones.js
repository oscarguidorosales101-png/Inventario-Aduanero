import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// GET /api/declaraciones
router.get('/', async (req, res, next) => {
  try {
    const { regimen, estado, search } = req.query;
    let sql = `
      SELECT
        d.id_declaracion,
        d.numero_declaracion,
        TO_CHAR(d.fecha, 'YYYY-MM-DD') AS fecha,
        d.regimen,
        d.estado,
        d.id_importador,
        d.id_agente,
        d.id_pais_origen,
        i.nombre_razon_social AS importador_nombre,
        i.nit_ruc AS importador_nit,
        a.nombre AS agente_nombre,
        a.licencia AS agente_licencia,
        p.nombre AS pais_nombre,
        p.codigo_iso AS pais_iso
      FROM declaracion_aduanera d
      JOIN importador i ON d.id_importador = i.id_importador
      JOIN agente_aduanal a ON d.id_agente = a.id_agente
      JOIN pais p ON d.id_pais_origen = p.id_pais
      WHERE 1=1
    `;
    const params = [];

    if (regimen && regimen !== 'ALL') {
      params.push(regimen);
      sql += ` AND d.regimen = $${params.length}`;
    }

    if (estado && estado !== 'ALL') {
      params.push(estado);
      sql += ` AND d.estado = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (d.numero_declaracion ILIKE $${params.length} OR i.nombre_razon_social ILIKE $${params.length} OR p.nombre ILIKE $${params.length})`;
    }

    sql += ` ORDER BY d.fecha DESC, d.id_declaracion DESC;`;

    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/declaraciones/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const duaRes = await query(
      `SELECT d.*, TO_CHAR(d.fecha, 'YYYY-MM-DD') AS fecha,
              i.nombre_razon_social, i.nit_ruc, i.direccion, i.telefono, i.correo,
              a.nombre AS agente_nombre, a.licencia,
              p.nombre AS pais_nombre, p.codigo_iso
       FROM declaracion_aduanera d
       JOIN importador i ON d.id_importador = i.id_importador
       JOIN agente_aduanal a ON d.id_agente = a.id_agente
       JOIN pais p ON d.id_pais_origen = p.id_pais
       WHERE d.id_declaracion = $1;`,
      [id]
    );

    if (duaRes.rows.length === 0) {
      return res.status(404).json({ error: 'Declaración aduanera no encontrada' });
    }

    const dua = duaRes.rows[0];

    // Detalle de mercancías
    const detallesRes = await query(
      `SELECT dd.id_detalle, dd.cantidad, dd.valor_declarado,
              m.descripcion AS mercancia_descripcion, m.unidad_medida, m.valor_unitario,
              cp.codigo_partida, cp.porcentaje_arancel
       FROM detalle_declaracion dd
       JOIN mercancia m ON dd.id_mercancia = m.id_mercancia
       JOIN categoria_partida cp ON m.id_categoria = cp.id_categoria
       WHERE dd.id_declaracion = $1;`,
      [id]
    );

    // Contenedor asociado
    const contRes = await query(
      `SELECT id_contenedor, numero_contenedor, tipo, peso
       FROM contenedor
       WHERE id_declaracion = $1;`,
      [id]
    );

    // Inspección asociada
    const inspRes = await query(
      `SELECT i.id_inspeccion, TO_CHAR(i.fecha, 'YYYY-MM-DD') AS fecha, i.resultado, i.observaciones,
              f.nombre AS funcionario_nombre, f.cargo AS funcionario_cargo
       FROM inspeccion i
       JOIN funcionario f ON i.id_funcionario = f.id_funcionario
       WHERE i.id_declaracion = $1;`,
      [id]
    );

    res.json({
      ...dua,
      detalles: detallesRes.rows,
      contenedor: contRes.rows[0] || null,
      inspeccion: inspRes.rows[0] || null
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/declaraciones
router.post('/', async (req, res, next) => {
  try {
    const { numero_declaracion, fecha, regimen, estado, id_importador, id_agente, id_pais_origen } = req.body;

    if (!numero_declaracion || !fecha || !regimen || !id_importador || !id_agente || !id_pais_origen) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben ser proporcionados' });
    }

    const validRegimenes = ['Importacion', 'Exportacion', 'Transito', 'Deposito'];
    if (!validRegimenes.includes(regimen)) {
      return res.status(400).json({ error: `Régimen no válido. Opciones: ${validRegimenes.join(', ')}` });
    }

    const result = await query(
      `INSERT INTO declaracion_aduanera
       (numero_declaracion, fecha, regimen, estado, id_importador, id_agente, id_pais_origen)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *;`,
      [numero_declaracion, fecha, regimen, estado || 'Retenida', id_importador, id_agente, id_pais_origen]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Ya existe una declaración con este número DUA' });
    }
    next(err);
  }
});

// PATCH /api/declaraciones/:id/estado
router.patch('/:id/estado', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const validEstados = ['Retenida', 'En Inspeccion', 'Liberada', 'Pendiente Pago'];
    if (!validEstados.includes(estado)) {
      return res.status(400).json({ error: `Estado inválido. Opciones: ${validEstados.join(', ')}` });
    }

    const result = await query(
      `UPDATE declaracion_aduanera
       SET estado = $1
       WHERE id_declaracion = $2
       RETURNING *;`,
      [estado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Declaración aduanera no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
