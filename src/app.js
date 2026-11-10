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

// ADICIONADO: schema e operação de /health; as respostas 200 e 503 têm o mesmo formato.
/**
 * @swagger
 * components:
 *   schemas:
 *     HealthResponse:
 *       type: object
 *       required: [status, message, version, availableVersions, services]
 *       properties:
 *         status:
 *           type: string
 *           enum: [OK, DEGRADED]
 *           example: OK
 *         message:
 *           type: string
 *           example: API do Gerador de Provas
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Presente somente quando o banco respondeu (200).
 *         version:
 *           type: string
 *           example: "1.0.0"
 *         availableVersions:
 *           type: array
 *           items:
 *             type: string
 *           example: [v1, v2]
 *         services:
 *           type: object
 *           properties:
 *             api:
 *               type: string
 *               example: OK
 *             database:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [OK, ERROR]
 *                   example: OK
 * /health:
 *   get:
 *     summary: Verifica a saúde da API e do banco
 *     description: Executa SELECT 1 no banco. Responde 503 quando a API está no ar, mas o banco não respondeu.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API e banco disponíveis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       503:
 *         description: API em execução com banco indisponível (status DEGRADED)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
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

// ADICIONADO: o mesmo objeto alimenta o JSON e a interface; nada é duplicado.
app.get("/api-docs.json", (_req, res) => {
  res.status(200).json(swaggerSpec);
});
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API Gerador de Provas - Documentação",
  }),
);

app.use(errorHandler);

export default app;
