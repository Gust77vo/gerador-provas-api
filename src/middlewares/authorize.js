import { ForbiddenError } from '../errors/AppError.js';

/**
 * Objetivo: verificar se o usuário autenticado tem o papel necessário.
 * Descrição: middleware de autorização (RBAC); vem depois de authenticate.
 * Aula 11 — professor demonstra; aluno aplica regra "só edita o próprio".
 *
 * @param {...string} papeis - Papéis permitidos, ex: authorize('ADMIN')
 */
const authorize = (...papeis) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ForbiddenError('Sem usuário autenticado'));
    }
    if (!papeis.includes(req.user.papel)) {
      return next(
        new ForbiddenError(
          `Acesso negado. Requer papel: ${papeis.join(' ou ')}`,
        ),
      );
    }
    next();
  };
};

export const isAdmin = authorize('ADMIN');
export const isProfessorOrAdmin = authorize('PROFESSOR', 'ADMIN');

export default authorize;
