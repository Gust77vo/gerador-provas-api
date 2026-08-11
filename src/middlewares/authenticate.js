import { verifyToken } from '../config/jwt.js';
import { UnauthorizedError } from '../errors/AppError.js';

/**
 * Objetivo: verificar token JWT e popular req.user.
 * Descrição: middleware de autenticação; aplicado em rotas protegidas.
 * Aula 11 — professor demonstra em PUT/DELETE Users; aluno aplica em Subject/Question.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token de autenticação ausente ou mal formado'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = payload; // { sub: userId, papel: 'PROFESSOR' | 'ADMIN' }
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
