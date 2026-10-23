import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';

// Rutas
import healthRoutes from './routes/health.js';
import declaracionesRoutes from './routes/declaraciones.js';
import mercanciasRoutes from './routes/mercancias.js';
import categoriasRoutes from './routes/categorias.js';
import inventarioRoutes from './routes/inventario.js';
import movimientosRoutes from './routes/movimientos.js';
import bodegasRoutes from './routes/bodegas.js';
import contenedoresRoutes from './routes/contenedores.js';
import inspeccionesRoutes from './routes/inspecciones.js';
import entidadesRoutes from './routes/entidades.js';
import informesRoutes from './routes/informes.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS segura
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Permitir solicitudes sin origin (como postman, curl o server-to-server) o si coincide
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por política CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Montaje de rutas
app.use('/api/health', healthRoutes);
app.use('/api/declaraciones', declaracionesRoutes);
app.use('/api/mercancias', mercanciasRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/bodegas', bodegasRoutes);
app.use('/api/contenedores', contenedoresRoutes);
app.use('/api/inspecciones', inspeccionesRoutes);
app.use('/api/entidades', entidadesRoutes);
app.use('/api/informes', informesRoutes);
app.use('/api/ai', aiRoutes);

// Manejador centralizado de errores
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    code: err.code || 'INTERNAL_ERROR'
  });
});

// Inicio del servidor
app.listen(PORT, async () => {
  console.log(`[API Backend] Servidor ejecutándose en http://localhost:${PORT}`);
  const dbStatus = await testConnection();
  if (dbStatus.connected) {
    console.log(`[PostgreSQL] Conectado exitosamente a base de datos '${dbStatus.database}'`);
  } else {
    console.warn(`[PostgreSQL] Advertencia: No se pudo conectar a la base de datos (${dbStatus.error})`);
  }
});

export default app;
