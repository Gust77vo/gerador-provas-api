import { ValidationError } from '../errors/AppError.js';

/**
 * Objetivo: validar body/params/query com Zod antes do controller.
 * Descrição: middleware de apresentação; usado nas routes.
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req[source]);
      if (!result.success) {
        const details = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        throw new ValidationError('Dados de entrada inválidos', details);
      }
      req[source] = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validate;
