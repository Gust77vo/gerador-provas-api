import { AppError } from '../errors/AppError.js';

/**
 * Objetivo: padronizar respostas de erro `{ success, error, … }`.
 * Descrição: middleware global; último na cadeia do Express.
 */
const errorHandler = (error, req, res, _next) => {
  if (error instanceof AppError && error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }

  if (error.code && String(error.code).startsWith('P')) {
    const map = {
      P2002: { status: 409, code: 'CONFLICT', message: 'Registro duplicado.' },
      P2025: { status: 404, code: 'NOT_FOUND', message: 'Registro não encontrado.' },
      P2003: { status: 400, code: 'INVALID_REFERENCE', message: 'Referência inválida.' },
    };
    const mapped = map[error.code] || {
      status: 500,
      code: 'DATABASE_ERROR',
      message: 'Erro no banco de dados.',
    };
    return res.status(mapped.status).json({
      success: false,
      error: { code: mapped.code, message: mapped.message },
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Erro interno do servidor',
    },
    timestamp: new Date().toISOString(),
    path: req.path,
  });
};

export default errorHandler;
