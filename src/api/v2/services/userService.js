import prisma from '../../../config/database.js';
import { uploadFile, deleteFile } from './uploadService.js';
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from '../../../errors/AppError.js';

/**
 * Objetivo: concentrar regras de negócio de usuários na v2.
 * Descrição: business layer v2 — breaking change + upload opcional (aula 9).
 * Aula 8 — referência de versionamento; aula 11 — hash real no 26repo-resp.
 */
const userSelectV2 = {
  id: true,
  primeiroNome: true,
  sobrenome: true,
  telefone: true,
  email: true,
  papel: true,
  foto: true,
  createdAt: true,
  updatedAt: true,
};

export const getAllUsersV2 = async ({ page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.user.findMany({
      select: userSelectV2,
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.user.count(),
  ]);
  return { data, total, page: Number(page), limit: Number(limit) };
};

export const getUserByIdV2 = async userId => {
  if (!userId || Number.isNaN(Number(userId)) || Number(userId) <= 0) {
    throw new ValidationError('ID inválido. Deve ser um número positivo');
  }

  const usuario = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: userSelectV2,
  });

  if (!usuario) {
    throw new NotFoundError(`Usuário com ID ${userId} não encontrado`, 'User');
  }

  return usuario;
};

export const createUserV2 = async (userData, file) => {
  const existente = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (existente) {
    throw new ConflictError('Email já cadastrado no sistema', 'email');
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Senha deve ser hasheada antes de chegar aqui (aula 11)');
  }

  let foto = userData.foto || null;
  if (file) {
    foto = await uploadFile(file.buffer, file.originalname);
  }

  return prisma.user.create({
    data: {
      nome: `${userData.primeiroNome} ${userData.sobrenome}`,
      primeiroNome: userData.primeiroNome,
      sobrenome: userData.sobrenome,
      telefone: userData.telefone ?? null,
      email: userData.email,
      senhaHash: userData.senha, // substituir por hash na aula 11
      papel: userData.papel || 'PROFESSOR',
      foto,
    },
    select: userSelectV2,
  });
};

export const updateUserV2 = async (userId, userData, file) => {
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
  if (userData.primeiroNome !== undefined) {
    data.primeiroNome = userData.primeiroNome;
    const sobrenome = userData.sobrenome ?? existente.sobrenome ?? '';
    data.nome = `${userData.primeiroNome} ${sobrenome}`;
  }
  if (userData.sobrenome !== undefined) {
    data.sobrenome = userData.sobrenome;
    const primeiroNome = userData.primeiroNome ?? existente.primeiroNome ?? '';
    data.nome = `${primeiroNome} ${userData.sobrenome}`;
  }
  if (userData.telefone !== undefined) data.telefone = userData.telefone;
  if (userData.email) data.email = userData.email;
  if (userData.senha) data.senhaHash = userData.senha;
  if (userData.papel) data.papel = userData.papel;

  if (file) {
    if (existente.foto) await deleteFile(existente.foto);
    data.foto = await uploadFile(file.buffer, file.originalname);
  } else if (userData.foto !== undefined) {
    data.foto = userData.foto;
  }

  return prisma.user.update({
    where: { id: Number(userId) },
    data,
    select: userSelectV2,
  });
};

export const deleteUserV2 = async userId => {
  if (!userId || Number.isNaN(Number(userId)) || Number(userId) <= 0) {
    throw new ValidationError('ID inválido. Deve ser um número positivo');
  }

  const existente = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      id: true,
      primeiroNome: true,
      sobrenome: true,
      email: true,
      foto: true,
    },
  });
  if (!existente) {
    throw new NotFoundError(`Usuário com ID ${userId} não encontrado`, 'User');
  }

  if (existente.foto) await deleteFile(existente.foto);

  await prisma.user.delete({ where: { id: Number(userId) } });
  return existente;
};

export default {
  getAllUsersV2,
  getUserByIdV2,
  createUserV2,
  updateUserV2,
  deleteUserV2,
};
