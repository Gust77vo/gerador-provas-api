import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/AppError.js';

/**
 * Objetivo: centralizar geração e verificação de tokens JWT.
 * Descrição: utilitário de auth; usado pelo authService e pelo middleware authenticate.
 * Aula 11.
 */
export const signToken = payload => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não configurado');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

export const verifyToken = token => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não configurado');
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new UnauthorizedError('Token inválido ou expirado');
  }
};
