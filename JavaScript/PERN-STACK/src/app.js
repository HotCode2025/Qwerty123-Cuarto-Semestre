import express from 'express';
import morgan from 'morgan';
import tareasRoutes from './router/tareas.routes.js';
import authRoutes from './router/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ORIGIN } from './config.js';
import { pool } from './db.js';

const app = express();

// Configuración de middlewares
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenidos a mi proyecto' });
});
app.get('/api/ping', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});
app.use(`/api`,tareasRoutes);
app.use(`/api`,authRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: err.message
  });
});

export default app;