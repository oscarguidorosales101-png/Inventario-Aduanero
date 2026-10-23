import { Router } from 'express';
import { testConnection } from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
  const dbHealth = await testConnection();

  let n8nStatus = 'offline';
  try {
    const n8nUrl = process.env.N8N_URL || 'http://localhost:5678';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    const n8nRes = await fetch(`${n8nUrl}/healthz`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (n8nRes.ok) n8nStatus = 'online';
  } catch {
    n8nStatus = 'unreachable';
  }

  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    postgres: dbHealth.connected ? 'connected' : 'disconnected',
    database: dbHealth.database || 'aduana',
    n8n: n8nStatus,
    version: '1.0.0'
  });
});

export default router;
