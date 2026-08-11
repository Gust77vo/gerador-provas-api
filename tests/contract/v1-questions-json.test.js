import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

/**
 * Objetivo: garantir que Questions v1 continua JSON puro após evoluções na v2.
 * Descrição: contrato; protege aluno contra breaking changes involuntários. Aula 8–9.
 */
const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)('Contract — Questions v1 JSON puro', () => {
  let subjectId;

  beforeAll(async () => {
    const user = await request(app)
      .post('/api/v1/users')
      .send({
        nome: 'Prof Contract Question',
        email: `contract-question-${Date.now()}@teste.com`,
        senha: 'senha123',
      });
    expect(user.status).toBe(201);

    const subject = await request(app)
      .post('/api/v1/subjects')
      .send({
        nome: 'Contrato Questões',
        professorId: user.body.data.id,
      });
    expect(subject.status).toBe(201);
    subjectId = subject.body.data.id;
  });

  it('POST /api/v1/questions aceita JSON puro (sem multipart)', async () => {
    const res = await request(app)
      .post('/api/v1/questions')
      .set('Content-Type', 'application/json')
      .send({
        enunciado: 'O que é um contrato de API?',
        tipo: 'DISSERTATIVA',
        subjectId,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.enunciado).toContain('contrato');
    expect(res.body.data).not.toHaveProperty('senhaHash');
  });

  it('GET /api/v1/questions retorna lista JSON sem campos sensíveis', async () => {
    const res = await request(app).get('/api/v1/questions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    res.body.data.forEach(q => {
      expect(q).not.toHaveProperty('senhaHash');
      expect(q).toHaveProperty('enunciado');
      expect(q).toHaveProperty('tipo');
    });
  });
});
