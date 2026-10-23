import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// GET /api/entidades/importadores
router.get('/importadores', async (req, res, next) => {
  try {
    const { rows } = await query(`
      SELECT
        id_importador,
        COALESCE(razon_social, nombre_razon_social) AS razon_social,
        COALESCE(razon_social, nombre_razon_social) AS nombre_razon_social,
        COALESCE(identificacion, nit_ruc) AS identificacion,
        COALESCE(identificacion, nit_ruc) AS nit_ruc,
        id_pais,
        direccion,
        telefono,
        correo
      FROM importador
      ORDER BY 2 ASC;
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/entidades/agentes
router.get('/agentes', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM agente_aduanal ORDER BY nombre ASC;');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/entidades/paises
router.get('/paises', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM pais ORDER BY nombre ASC;');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/entidades/funcionarios
router.get('/funcionarios', async (req, res, next) => {
  try {
    const { rows } = await query(`
      SELECT f.id_funcionario, f.nombre, f.cargo, f.id_supervisor,
             s.nombre AS supervisor_nombre, s.cargo AS supervisor_cargo
      FROM funcionario f
      LEFT JOIN funcionario s ON f.id_supervisor = s.id_funcionario
      ORDER BY f.id_funcionario ASC;
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
