import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Objetivo: demonstrar vi.mock isolando Prisma (sem banco real).
 * Descrição: oráculo unitário do userService; padrão para o aluno replicar em subjectService.
 * Aula 5 — referência de unit test com mock.
 */

vi.mock('../../src/config/database.js', () => ({
  default: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('userService (unit — vi.mock)', () => {
  let userService;
  let prisma;

  beforeEach(async () => {
    vi.resetModules();
    prisma = (await import('../../src/config/database.js')).default;
    userService = await import('../../src/api/v1/services/userService.js');
  });

  it('getAllUsers retorna lista vazia', async () => {
    prisma.user.findMany.mockResolvedValue([]);
    const result = await userService.getAllUsers();
    expect(result).toEqual([]);
    expect(prisma.user.findMany).toHaveBeenCalledOnce();
  });

  it('getUserById lança NotFoundError quando id não existe', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(userService.getUserById(999)).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });

  it('getUserById lança ValidationError para id inválido', async () => {
    await expect(userService.getUserById('abc')).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
    });
  });

  it('createUser lança ConflictError se email existir', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1 });
    await expect(
      userService.createUser({ nome: 'X', email: 'x@x.com', senha: '123456' }),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
  });
});
