import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import prisma from './config/database.js';
import v1Routes from './api/v1/routes/index.js';
import v2Routes from './api/v2/routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

/**
 * Objetivo: montar a aplicação Express sem bind de porta.
 * Descrição: usado por server.js e pelos testes Supertest.
 */
const app = express();

// Segurança — aula 11
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

app.use(express.json());

// Swagger UI — aula 10
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

app.get('/health', async (req, res) => {
  let database = { status: 'OK', message: 'Conexão OK' };
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    database = { status: 'ERROR', message: 'Falha na conexão' };
  }

  const ok = database.status === 'OK';
  res.status(ok ? 200 : 503).json({
    status: ok ? 'OK' : 'DEGRADED',
    message: 'API do Gerador de Provas',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    availableVersions: ['v1', 'v2'],
    services: { api: 'OK', database },
  });
});

app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Rota ${req.method} ${req.originalUrl} não encontrada`,
      hint: 'Versões: /api/v1, /api/v2',
    },
    timestamp: new Date().toISOString(),
    path: req.path,
  });
});

app.use(errorHandler);

export default app;
