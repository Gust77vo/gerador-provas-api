import express from 'express';
import * as authController from '../controllers/authController.js';
import authenticate from '../../../middlewares/authenticate.js';

/**
 * Objetivo: expor register, login e perfil autenticado.
 * Descrição: rotas públicas (register/login) e protegida (me).
 * Aula 11.
 */
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.me);

export default router;
