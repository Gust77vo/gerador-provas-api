import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)('Questions API — exercício do aluno', () => {
  let subjectId;
  let questionId;
  let createdUserId;

  beforeAll(async () => {
    const user = await request(app)
      .post('/api/v1/users')
      .send({
        nome: 'Prof Question Test',
        email: `question-prof-${Date.now()}@teste.com`,
        senha: 'senha123',
      });
    expect(user.status).toBe(201);
    createdUserId = user.body.data.id;

    // Subject precisa estar implementado (aula 4–5)
    const subject = await request(app).post('/api/v1/subjects').send({
      nome: 'Algoritmos',
      professorId: createdUserId,
    });
    expect(subject.status).toBe(201);
    subjectId = subject.body.data.id;
  });

  afterAll(async () => {
    if (createdUserId) {
      await request(app).delete(`/api/v1/users/${createdUserId}`);
    }
  });

  it('POST /api/v1/questions cria questão', async () => {
    const res = await request(app).post('/api/v1/questions').send({
      enunciado: 'O que é uma API REST?',
      tipo: 'DISSERTATIVA',
      subjectId,
    });
    expect(res.status).toBe(201);
    expect(res.body.data.enunciado).toContain('API REST');
    questionId = res.body.data.id;
  });

  it('GET /api/v1/questions lista', async () => {
    const res = await request(app).get('/api/v1/questions');
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/v1/questions/:id retorna a questão', async () => {
    const res = await request(app).get(`/api/v1/questions/${questionId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(questionId);
  });

  it('GET /api/v1/questions/:id retorna 404 para id inexistente', async () => {
    const res = await request(app).get('/api/v1/questions/999999');
    expect(res.status).toBe(404);
  });

  it('PUT /api/v1/questions/:id atualiza', async () => {
    const res = await request(app)
      .put(`/api/v1/questions/${questionId}`)
      .send({ enunciado: 'Defina API RESTful com exemplos.' });
    expect(res.status).toBe(200);
  });

  it('DELETE /api/v1/questions/:id remove', async () => {
    const res = await request(app).delete(`/api/v1/questions/${questionId}`);
    expect([200, 204]).toContain(res.status);
  });
});
