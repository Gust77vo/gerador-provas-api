import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

/**
 * Objetivo: validar CRUD Users (referência completa para o aluno espelhar em Subject).
 * Descrição: integração; requer DATABASE_URL. Aula 4–5.
 */
const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)('Users API — referência CRUD completo', () => {
  let userId;
  const email = `users-int-${Date.now()}@teste.com`;

  afterAll(async () => {
    if (userId) {
      await request(app).delete(`/api/v1/users/${userId}`);
    }
  });

  it('POST /api/v1/users cria usuário', async () => {
    const res = await request(app).post('/api/v1/users').send({
      nome: 'Prof. Integração',
      email,
      senha: 'senha123',
      papel: 'PROFESSOR',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({ nome: 'Prof. Integração', email });
    expect(res.body.data).not.toHaveProperty('senhaHash');
    expect(res.body.data).not.toHaveProperty('senha');
    userId = res.body.data.id;
  });

  it('GET /api/v1/users lista usuários', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
    res.body.data.forEach(u => {
      expect(u).not.toHaveProperty('senhaHash');
    });
  });

  it('GET /api/v1/users/:id retorna o usuário', async () => {
    const res = await request(app).get(`/api/v1/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(userId);
    expect(res.body.data).not.toHaveProperty('senhaHash');
  });

  it('GET /api/v1/users/:id retorna 404 para id inexistente', async () => {
    const res = await request(app).get('/api/v1/users/999999');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('GET /api/v1/users/:id retorna 400 para id inválido', async () => {
    const res = await request(app).get('/api/v1/users/abc');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/users retorna 409 para email duplicado', async () => {
    const res = await request(app).post('/api/v1/users').send({
      nome: 'Duplicado',
      email,
      senha: 'senha123',
    });
    expect(res.status).toBe(409);
  });

  it('POST /api/v1/users retorna 400 para body inválido', async () => {
    const res = await request(app).post('/api/v1/users').send({ nome: 'X' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('PUT /api/v1/users/:id atualiza nome', async () => {
    const res = await request(app)
      .put(`/api/v1/users/${userId}`)
      .send({ nome: 'Prof. Atualizado' });
    expect(res.status).toBe(200);
    expect(res.body.data.nome).toBe('Prof. Atualizado');
    expect(res.body.data).not.toHaveProperty('senhaHash');
  });

  it('DELETE /api/v1/users/:id remove o usuário', async () => {
    const res = await request(app).delete(`/api/v1/users/${userId}`);
    expect([200, 204]).toContain(res.status);
    userId = null;
  });

  it('GET após DELETE retorna 404', async () => {
    const res = await request(app).get(`/api/v1/users/${userId ?? 999999}`);
    expect(res.status).toBe(404);
  });
});
