import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

/**
 * Objetivo: garantir que Subjects v1 continua JSON puro após evoluções na v2.
 * Descrição: contrato; protege aluno contra breaking changes involuntários. Aula 8.
 */
const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)('Contract — Subjects v1 JSON puro', () => {
  let professorId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({
        nome: 'Prof Contract Subject',
        email: `contract-subject-${Date.now()}@teste.com`,
        senha: 'senha123',
      });
    expect(res.status).toBe(201);
    professorId = res.body.data.id;
  });

  it('POST /api/v1/subjects aceita JSON com professorId', async () => {
    const res = await request(app)
      .post('/api/v1/subjects')
      .set('Content-Type', 'application/json')
      .send({ nome: 'Contrato Matéria', professorId });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.nome).toBe('Contrato Matéria');
  });

  it('GET /api/v1/subjects retorna lista sem senhaHash', async () => {
    const res = await request(app).get('/api/v1/subjects');
    expect(res.status).toBe(200);
    res.body.data.forEach(s => {
      expect(s).not.toHaveProperty('senhaHash');
      if (s.professor) {
        expect(s.professor).not.toHaveProperty('senhaHash');
      }
    });
  });
});
