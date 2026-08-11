import { beforeAll, afterAll } from 'vitest';
import prisma from '../src/config/database.js';

/**
 * Objetivo: conectar Prisma uma vez por suite (quando há DATABASE_URL).
 * Descrição: setup global dos testes; unitários com vi.mock não dependem do DB.
 */
const hasDb = Boolean(process.env.DATABASE_URL);

beforeAll(async () => {
  if (!hasDb) {
    console.warn('⚠️  DATABASE_URL ausente — testes de integração/contrato que usam DB podem falhar');
    return;
  }
  await prisma.$connect();
});

afterAll(async () => {
  if (hasDb) {
    await prisma.$disconnect();
  }
});
