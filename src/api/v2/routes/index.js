import express from 'express';
import userRoutes from './userRoutes.js';
import subjectRoutes from './subjectRoutes.js';
import authRoutes from './authRoutes.js';

/**
 * Objetivo: agregar rotas da v2 sob /api/v2.
 * Descrição: entrypoint v2; v1 permanece inalterada.
 * Aula 8 — Subject v2 stub registrado; implemente o service.
 */
const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    changes: ['primeiroNome + sobrenome', 'telefone', 'paginação em GET /users'],
  });
});

router.use('/users', userRoutes);
router.use('/subjects', subjectRoutes);
router.use('/auth', authRoutes);

export default router;
