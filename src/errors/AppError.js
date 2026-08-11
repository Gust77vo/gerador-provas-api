/**
 * Objetivo: tipar erros HTTP da API de forma previsível.
 * Descrição: camada de domínio de erros; consumida por services e errorHandler.
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Dados de entrada inválidos', details = []) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado', resource = '') {
    super(message, 404, 'NOT_FOUND', [{ resource }]);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflito de dados', field = '') {
    super(message, 409, 'CONFLICT', [{ field }]);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Autenticação necessária') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Acesso negado') {
    super(message, 403, 'FORBIDDEN');
  }
}

/** Usado nos stubs até o aluno implementar. */
class NotImplementedError extends AppError {
  constructor(message = 'Exercício ainda não implementado') {
    super(message, 501, 'NOT_IMPLEMENTED');
  }
}

export {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  NotImplementedError,
};
