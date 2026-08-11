import prisma from '../../../config/database.js';
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from '../../../errors/AppError.js';

/**
 * Objetivo: concentrar regras de negócio de usuários.
 * Descrição: business layer; chamado pelo userController. Referência para SubjectService.
 */
const userSelect = {
  id: true,
  nome: true,
  email: true,
  papel: true,
  foto: true,
  createdAt: true,
  updatedAt: true,
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: userSelect,
    orderBy: { createdAt: 'desc' },
  });
};

export const getUserById = async userId => {
  if (!userId || Number.isNaN(Number(userId)) || Number(userId) <= 0) {
    throw new ValidationError('ID inválido. Deve ser um número positivo');
  }

  const usuario = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: userSelect,
  });

  if (!usuario) {
    throw new NotFoundError(`Usuário com ID ${userId} não encontrado`, 'User');
  }

  return usuario;
};

export const createUser = async userData => {
  const existente = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (existente) {
    throw new ConflictError('Email já cadastrado no sistema', 'email');
  }

  // TODO aula 11: trocar userData.senha por await bcrypt.hash(userData.senha, 10)
  // Por ora armazenamos plaintext APENAS em ambiente de desenvolvimento para
  // permitir avanço nas aulas de CRUD. Nunca faça isso em produção.
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Senha deve ser hasheada antes de chegar aqui (aula 11)');
  }
  return prisma.user.create({
    data: {
      nome: userData.nome,
      email: userData.email,
      senhaHash: userData.senha, // substituir por hash na aula 11
      papel: userData.papel || 'PROFESSOR',
      foto: userData.foto || null,
    },
    select: userSelect,
  });
};

export const updateUser = async (userId, userData) => {
  if (!userId || Number.isNaN(Number(userId)) || Number(userId) <= 0) {
    throw new ValidationError('ID inválido. Deve ser um número positivo');
  }

  const existente = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });
  if (!existente) {
    throw new NotFoundError(`Usuário com ID ${userId} não encontrado`, 'User');
  }

  if (userData.email && userData.email !== existente.email) {
    const emailEmUso = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (emailEmUso) {
      throw new ConflictError('Email já está em uso', 'email');
    }
  }

  const data = {};
  if (userData.nome) data.nome = userData.nome;
  if (userData.email) data.email = userData.email;
  if (userData.senha) data.senhaHash = userData.senha;
  if (userData.papel) data.papel = userData.papel;
  if (userData.foto !== undefined) data.foto = userData.foto;

  return prisma.user.update({
    where: { id: Number(userId) },
    data,
    select: userSelect,
  });
};

export const deleteUser = async userId => {
  if (!userId || Number.isNaN(Number(userId)) || Number(userId) <= 0) {
    throw new ValidationError('ID inválido. Deve ser um número positivo');
  }

  const existente = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: { id: true, nome: true, email: true },
  });
  if (!existente) {
    throw new NotFoundError(`Usuário com ID ${userId} não encontrado`, 'User');
  }

  await prisma.user.delete({ where: { id: Number(userId) } });
  return existente;
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
