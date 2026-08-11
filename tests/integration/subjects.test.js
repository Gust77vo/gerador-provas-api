import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

/**
 * Oráculo do exercício Subject (aulas 4–5).
 * Falha com 501 enquanto subjectService for stub.
 * Requer DATABASE_URL e User existente (professorId).
 */
const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)('Subjects API — exercício do aluno', () => {
  let professorId;
  let subjectId;
  let createdUserId;

  beforeAll(async () => {
    const user = await request(app)
      .post('/api/v1/users')
      .send({
        nome: 'Prof Subject Test',
        email: `subject-prof-${Date.now()}@teste.com`,
        senha: 'senha123',
      });
    expect(user.status).toBe(201);
    professorId = user.body.data.id;
    createdUserId = user.body.data.id;
  });

  afterAll(async () => {
    if (createdUserId) {
      await request(app).delete(`/api/v1/users/${createdUserId}`);
    }
  });

  it('POST /api/v1/subjects cria matéria', async () => {
    const res = await request(app).post('/api/v1/subjects').send({
      nome: 'Banco de Dados',
      descricao: 'Modelagem e SQL',
      professorId,
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      nome: 'Banco de Dados',
      professorId,
    });
    subjectId = res.body.data.id;
  });

  it('GET /api/v1/subjects lista matérias', async () => {
    const res = await request(app).get('/api/v1/subjects');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/v1/subjects/:id retorna a matéria', async () => {
    const res = await request(app).get(`/api/v1/subjects/${subjectId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(subjectId);
  });

  it('PUT /api/v1/subjects/:id atualiza', async () => {
    const res = await request(app)
      .put(`/api/v1/subjects/${subjectId}`)
      .send({ nome: 'BD Avançado' });
    expect(res.status).toBe(200);
    expect(res.body.data.nome).toBe('BD Avançado');
  });

  it('DELETE /api/v1/subjects/:id remove', async () => {
    const res = await request(app).delete(`/api/v1/subjects/${subjectId}`);
    expect([200, 204]).toContain(res.status);
  });

  it('GET matéria removida retorna 404', async () => {
    const res = await request(app).get(`/api/v1/subjects/${subjectId}`);
    expect(res.status).toBe(404);
  });
});
