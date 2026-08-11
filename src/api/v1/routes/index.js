import express from 'express';
import userRoutes from './userRoutes.js';
import subjectRoutes from './subjectRoutes.js';
import questionRoutes from './questionRoutes.js';

/**
 * Objetivo: agregar rotas da v1 sob /api/v1.
 * Descrição: entrypoint de versionamento URI Path.
 */
const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

router.use('/users', userRoutes);
router.use('/subjects', subjectRoutes);
router.use('/questions', questionRoutes);

export default router;
