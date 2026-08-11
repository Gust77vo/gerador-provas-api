import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

/**
 * Objetivo: validar que v2 Users funciona com campos novos.
 * Descrição: contrato v2 — primeiroNome + sobrenome; paginação.
 */
const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)('Users v2 — breaking changes (aula 8)', () => {
  let userId;

  afterAll(async () => {
    if (userId) {
      await request(app).delete(`/api/v2/users/${userId}`);
    }
  });

  it('POST /api/v2/users aceita primeiroNome + sobrenome', async () => {
    const res = await request(app)
      .post('/api/v2/users')
      .send({
        primeiroNome: 'João',
        sobrenome: 'Silva',
        email: `v2-user-${Date.now()}@teste.com`,
        senha: 'senha123',
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      primeiroNome: 'João',
      sobrenome: 'Silva',
    });
    expect(res.body.data).not.toHaveProperty('senhaHash');
    userId = res.body.data.id;
  });

  it('POST /api/v2/users rejeita campo "nome" antigo sem primeiroNome', async () => {
    const res = await request(app)
      .post('/api/v2/users')
      .send({
        nome: 'João Silva',
        email: `v2-nome-${Date.now()}@teste.com`,
        senha: 'senha123',
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('GET /api/v2/users suporta paginação', async () => {
    const res = await request(app).get('/api/v2/users?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page', 1);
    expect(res.body).toHaveProperty('limit', 5);
  });
});
