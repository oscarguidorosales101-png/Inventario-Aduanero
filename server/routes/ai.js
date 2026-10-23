import { Router } from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;
const router = Router();

// Pool exclusivo de SOLO LECTURA para el agente de IA
const roPool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.AI_RO_USER || 'agente_aduanero_ro',
  password: process.env.AI_RO_PASSWORD || 'AduanaAgent2026_SecureRO',
  database: process.env.DB_NAME || 'aduana',
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 3000,
});

router.post('/chat', async (req, res) => {
  const { question, history } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({ error: 'La pregunta es requerida' });
  }

  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/aduanas-ai';

  // 1. Intentar enviar al Webhook de n8n
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const n8nRes = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: question.trim(),
        history: history || [],
        timestamp: new Date().toISOString()
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (n8nRes.ok) {
      const n8nData = await n8nRes.json();
      return res.json({
        answer: n8nData.output || n8nData.answer || n8nData.text || 'Respuesta recibida de n8n.',
        sqlQuery: n8nData.sqlQuery || null,
        data: n8nData.data || null,
        source: 'n8n Workflow + Gemini'
      });
    }
  } catch {
    // n8n no está en ejecución o el webhook no está activo aún
  }

  // 2. Si n8n no está disponible o está en configuración, consultar directamente con el rol de solo lectura
  try {
    const q = question.toLowerCase();
    let sql = null;
    let explanation = '';

    if (q.includes('cuántas declaraciones') || q.includes('total de declaraciones') || q.includes('declaraciones registradas') || q.includes('declaraciones de importación')) {
      sql = `SELECT regimen, estado, COUNT(*) AS total FROM declaracion_aduanera GROUP BY regimen, estado ORDER BY total DESC;`;
      const { rows } = await roPool.query(sql);
      const total = rows.reduce((acc, curr) => acc + parseInt(curr.total, 10), 0);
      explanation = `Se consultó la base de datos PostgreSQL **aduana** con el usuario de solo lectura. Existen actualmente un total de **${total} declaraciones aduaneras (DUA)** registradas. Desglose:\n` +
        rows.map(r => `- Régimen **${r.regimen}** (${r.estado}): ${r.total} DUA`).join('\n');
      return res.json({ answer: explanation, sqlQuery: sql, data: rows, source: 'PostgreSQL (Rol Solo Lectura: agente_aduanero_ro)' });
    }

    if (q.includes('retenida') || q.includes('retenidas') || q.includes('mercancías retenidas') || q.includes('bodega')) {
      sql = `SELECT b.nombre AS bodega, m.descripcion, ib.cantidad, ib.estado
             FROM inventario_bodega ib
             JOIN bodega b ON ib.id_bodega = b.id_bodega
             JOIN mercancia m ON ib.id_mercancia = m.id_mercancia
             WHERE ib.estado = 'Retenido'
             ORDER BY ib.cantidad DESC;`;
      const { rows } = await roPool.query(sql);
      explanation = `Se ejecutó una consulta real en PostgreSQL. Actualmente existen **${rows.length} lotes de mercancías retenidas** en las bodegas fiscales:\n` +
        rows.map(r => `- **${r.descripcion}**: ${r.cantidad} unidades en ${r.bodega}`).join('\n');
      return res.json({ answer: explanation, sqlQuery: sql, data: rows, source: 'PostgreSQL (Rol Solo Lectura: agente_aduanero_ro)' });
    }

    if (q.includes('país') || q.includes('pais') || q.includes('contenedores recibidos')) {
      sql = `SELECT p.nombre AS pais, COUNT(c.id_contenedor) AS total_contenedores, SUM(c.peso) AS peso_total_kg
             FROM pais p
             JOIN declaracion_aduanera d ON p.id_pais = d.id_pais_origen
             JOIN contenedor c ON d.id_declaracion = c.id_declaracion
             GROUP BY p.nombre
             ORDER BY total_contenedores DESC
             LIMIT 5;`;
      const { rows } = await roPool.query(sql);
      explanation = `Según los registros reales de PostgreSQL, los países con mayor volumen de contenedores recibidos son:\n` +
        rows.map((r, i) => `${i + 1}. **${r.pais}**: ${r.total_contenedores} contenedores (${Number(r.peso_total_kg).toLocaleString()} kg acumulados)`).join('\n');
      return res.json({ answer: explanation, sqlQuery: sql, data: rows, source: 'PostgreSQL (Rol Solo Lectura: agente_aduanero_ro)' });
    }

    if (q.includes('inspección') || q.includes('inspecciones') || q.includes('observaciones')) {
      sql = `SELECT d.numero_declaracion, i.resultado, f.nombre AS funcionario, i.observaciones
             FROM inspeccion i
             JOIN declaracion_aduanera d ON i.id_declaracion = d.id_declaracion
             JOIN funcionario f ON i.id_funcionario = f.id_funcionario
             WHERE i.resultado IN ('Con Observaciones', 'Retenida')
             ORDER BY i.fecha DESC;`;
      const { rows } = await roPool.query(sql);
      explanation = `Se consultaron las actas en PostgreSQL. Se detectaron **${rows.length} inspecciones no conformes**:\n` +
        rows.map(r => `- **${r.numero_declaracion}** (${r.resultado}, Insp. ${r.funcionario}): "${r.observaciones}"`).join('\n');
      return res.json({ answer: explanation, sqlQuery: sql, data: rows, source: 'PostgreSQL (Rol Solo Lectura: agente_aduanero_ro)' });
    }

    // Consulta general sobre el esquema
    sql = `SELECT
            (SELECT COUNT(*) FROM declaracion_aduanera) AS total_duas,
            (SELECT COUNT(*) FROM mercancia) AS total_mercancias,
            (SELECT COUNT(*) FROM bodega) AS total_bodegas,
            (SELECT COUNT(*) FROM contenedor) AS total_contenedores;`;
    const { rows } = await roPool.query(sql);
    const r = rows[0];
    explanation = `He consultado el estado actual de la base de datos **aduana** mediante el rol de solo lectura:\n` +
      `- Declaraciones registradas: **${r.total_duas}**\n` +
      `- Mercancías en catálogo: **${r.total_mercancias}**\n` +
      `- Bodegas fiscales: **${r.total_bodegas}**\n` +
      `- Contenedores registrados: **${r.total_contenedores}**\n\n` +
      `Puedes realizar preguntas específicas como: *"¿Qué mercancías siguen retenidas y en qué bodega están?"* o *"¿Cuál es el país con más contenedores?"*. El webhook de n8n con Gemini también puede ser activado para respuestas generativas avanzadas.`;

    return res.json({
      answer: explanation,
      sqlQuery: sql,
      data: r,
      source: 'PostgreSQL (Rol Solo Lectura: agente_aduanero_ro)'
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Error al consultar la base de datos PostgreSQL.',
      details: err.message
    });
  }
});

export default router;
