import prisma from '../../../config/database.js';
import { hashPassword, verifyPassword } from '../../../config/password.js';
import { signToken } from '../../../config/jwt.js';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from '../../../errors/AppError.js';

/**
 * Objetivo: registrar professor e fazer login com JWT.
 * Descrição: business layer de auth v2; chamado pelo authController.
 * Aula 11 — demo do professor; aluno protege Subject/Question.
 */
export const register = async userData => {
  const existente = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (existente) {
    throw new ConflictError('Email já cadastrado no sistema', 'email');
  }

  const senhaHash = await hashPassword(userData.senha);

  const user = await prisma.user.create({
    data: {
      nome: userData.nome,
      email: userData.email,
      senhaHash,
      papel: userData.papel || 'PROFESSOR',
    },
    select: {
      id: true,
      nome: true,
      email: true,
      papel: true,
      createdAt: true,
    },
  });

  const token = signToken({ sub: user.id, papel: user.papel });
  return { user, token };
};

export const login = async ({ email, senha }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Usa mesma mensagem para email e senha — evita enumeração de usuários
    throw new UnauthorizedError('Email ou senha inválidos');
  }

  const senhaValida = await verifyPassword(senha, user.senhaHash);
  if (!senhaValida) {
    throw new UnauthorizedError('Email ou senha inválidos');
  }

  const token = signToken({ sub: user.id, papel: user.papel });

  const { senhaHash: _, ...userSemSenha } = user;
  return { user: userSemSenha, token };
};

export const getProfile = async userId => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, nome: true, email: true, papel: true, foto: true, createdAt: true },
  });
  if (!user) throw new NotFoundError('Usuário não encontrado', 'User');
  return user;
};

export default { register, login, getProfile };
